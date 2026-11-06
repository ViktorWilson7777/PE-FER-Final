"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import type { User } from "@supabase/supabase-js";
import { getSupabase, hasSupabaseEnv } from "@/lib/supabase";
import {
  computeSummary,
  filterBooks,
  getNextStatus,
  sortBooks,
  type Book,
  type BookStatus,
  type BookSummaryData,
} from "@/lib/books-utils";

interface NewBookInput {
  title: string;
  author: string;
  pages: number;
  status: BookStatus;
}

interface ShelfLifeContextValue {
  user: User | null;
  authLoading: boolean;
  books: Book[];
  filteredBooks: Book[];
  booksLoading: boolean;
  statusFilter: string;
  searchQuery: string;
  summary: BookSummaryData;
  setStatusFilter: (value: string) => void;
  setSearchQuery: (value: string) => void;
  clearFilters: () => void;
  addBook: (input: NewBookInput) => Promise<{ error: string | null }>;
  advanceBookStatus: (id: string) => Promise<{ error: string | null }>;
  deleteBook: (id: string) => Promise<{ error: string | null }>;
  logout: () => Promise<void>;
}

const ShelfLifeContext = createContext<ShelfLifeContextValue | undefined>(
  undefined
);

function normalizeBookRow(row: Record<string, unknown>): Book {
  return {
    id: String(row.id),
    user_id: String(row.user_id),
    title: String(row.title ?? ""),
    author: String(row.author ?? ""),
    pages: Number(row.pages),
    status: (row.status as BookStatus) || "To Read",
    created_at: row.created_at
      ? String(row.created_at)
      : new Date().toISOString(),
  };
}

export function ShelfLifeProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState<boolean>(() =>
    hasSupabaseEnv()
  );
  const [books, setBooks] = useState<Book[]>([]);
  const [loadedForUserId, setLoadedForUserId] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const fetchingUserIdRef = useRef<string | null>(null);

  const userId = user?.id ?? null;

  useEffect(() => {
    if (!hasSupabaseEnv()) {
      return;
    }

    let mounted = true;
    const supabase = getSupabase();

    supabase.auth
      .getSession()
      .then(({ data }) => {
        if (!mounted) return;
        const sessionUser = data.session?.user ?? null;
        setUser(sessionUser);
        if (!sessionUser) {
          setBooks([]);
          setLoadedForUserId(null);
          setStatusFilter("");
          setSearchQuery("");
          fetchingUserIdRef.current = null;
        }
        setAuthLoading(false);
      })
      .catch(() => {
        if (!mounted) return;
        setAuthLoading(false);
      });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!mounted) return;
      const nextUser = session?.user ?? null;
      setUser((prevUser) => {
        if (prevUser?.id !== nextUser?.id) {
          setBooks([]);
          setLoadedForUserId(null);
          setStatusFilter("");
          setSearchQuery("");
          fetchingUserIdRef.current = null;
        }
        return nextUser;
      });
      setAuthLoading(false);
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (!userId || !hasSupabaseEnv()) {
      fetchingUserIdRef.current = null;
      return;
    }

    if (loadedForUserId === userId || fetchingUserIdRef.current === userId) {
      return;
    }

    let cancelled = false;
    fetchingUserIdRef.current = userId;

    getSupabase()
      .from("books")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .then(({ data, error }) => {
        if (cancelled) return;
        if (!error && Array.isArray(data)) {
          const normalized = data.map((row) =>
            normalizeBookRow(row as Record<string, unknown>)
          );
          setBooks(sortBooks(normalized));
        } else {
          setBooks([]);
        }
        setLoadedForUserId(userId);
        if (fetchingUserIdRef.current === userId) {
          fetchingUserIdRef.current = null;
        }
      });

    return () => {
      cancelled = true;
      if (fetchingUserIdRef.current === userId) {
        fetchingUserIdRef.current = null;
      }
    };
  }, [userId, loadedForUserId]);

  const activeBooks = useMemo(() => {
    if (!userId || loadedForUserId !== userId) return [];
    return books;
  }, [userId, loadedForUserId, books]);

  const booksLoading = Boolean(userId && loadedForUserId !== userId);

  const filteredBooks = useMemo(
    () => filterBooks(activeBooks, statusFilter, searchQuery),
    [activeBooks, statusFilter, searchQuery]
  );

  const summary = useMemo(
    () => computeSummary(filteredBooks),
    [filteredBooks]
  );

  const clearFilters = useCallback(() => {
    setStatusFilter("");
    setSearchQuery("");
  }, []);

  const addBook = useCallback(
    async (input: NewBookInput): Promise<{ error: string | null }> => {
      if (!userId) {
        return { error: "You must be logged in to add a book." };
      }

      try {
        const { data, error } = await getSupabase()
          .from("books")
          .insert({
            user_id: userId,
            title: input.title,
            author: input.author,
            pages: input.pages,
            status: input.status,
          })
          .select("*")
          .single();

        if (error || !data) {
          return {
            error: error?.message ?? "Failed to save book.",
          };
        }

        const inserted = normalizeBookRow(data as Record<string, unknown>);
        setBooks((prev) => sortBooks([inserted, ...prev]));
        return { error: null };
      } catch (err) {
        return {
          error: err instanceof Error ? err.message : "Failed to save book.",
        };
      }
    },
    [userId]
  );

  const advanceBookStatus = useCallback(
    async (id: string): Promise<{ error: string | null }> => {
      if (!userId) {
        return { error: "You must be logged in to update a book." };
      }

      const currentBook = activeBooks.find((b) => b.id === id);
      if (!currentBook) {
        return { error: "Book not found." };
      }

      const nextStatus = getNextStatus(currentBook.status);
      if (!nextStatus) {
        return { error: null };
      }

      try {
        const { error } = await getSupabase()
          .from("books")
          .update({ status: nextStatus })
          .eq("id", id);

        if (error) {
          return { error: error.message };
        }

        setBooks((prev) =>
          prev.map((item) =>
            item.id === id ? { ...item, status: nextStatus } : item
          )
        );
        return { error: null };
      } catch (err) {
        return {
          error:
            err instanceof Error ? err.message : "Failed to update status.",
        };
      }
    },
    [userId, activeBooks]
  );

  const deleteBook = useCallback(
    async (id: string): Promise<{ error: string | null }> => {
      if (!userId) {
        return { error: "You must be logged in to delete a book." };
      }

      try {
        const { error } = await getSupabase()
          .from("books")
          .delete()
          .eq("id", id);

        if (error) {
          return { error: error.message };
        }

        setBooks((prev) => prev.filter((item) => item.id !== id));
        return { error: null };
      } catch (err) {
        return {
          error: err instanceof Error ? err.message : "Failed to delete book.",
        };
      }
    },
    [userId]
  );

  const logout = useCallback(async () => {
    fetchingUserIdRef.current = null;
    setUser(null);
    setBooks([]);
    setLoadedForUserId(null);
    setStatusFilter("");
    setSearchQuery("");
    if (hasSupabaseEnv()) {
      await getSupabase().auth.signOut();
    }
  }, []);

  const value = useMemo<ShelfLifeContextValue>(
    () => ({
      user,
      authLoading,
      books: activeBooks,
      filteredBooks,
      booksLoading,
      statusFilter,
      searchQuery,
      summary,
      setStatusFilter,
      setSearchQuery,
      clearFilters,
      addBook,
      advanceBookStatus,
      deleteBook,
      logout,
    }),
    [
      user,
      authLoading,
      activeBooks,
      filteredBooks,
      booksLoading,
      statusFilter,
      searchQuery,
      summary,
      clearFilters,
      addBook,
      advanceBookStatus,
      deleteBook,
      logout,
    ]
  );

  return (
    <ShelfLifeContext.Provider value={value}>
      {children}
    </ShelfLifeContext.Provider>
  );
}

export function useShelfLife(): ShelfLifeContextValue {
  const ctx = useContext(ShelfLifeContext);
  if (!ctx) {
    throw new Error("useShelfLife must be used within a ShelfLifeProvider");
  }
  return ctx;
}

