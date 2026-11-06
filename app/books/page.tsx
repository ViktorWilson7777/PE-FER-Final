"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useShelfLife } from "@/context/shelflife-context";
import { BookForm } from "@/components/books/book-form";
import { BookFilters } from "@/components/books/book-filters";
import { BookSummary } from "@/components/books/book-summary";
import { BookList } from "@/components/books/book-list";

export default function BooksPage() {
  const router = useRouter();
  const { user, authLoading } = useShelfLife();

  useEffect(() => {
    if (!authLoading && !user) {
      router.replace("/login");
    }
  }, [authLoading, user, router]);

  if (authLoading || !user) {
    return null;
  }

  return (
    <div
      data-testid="books-page"
      className="mx-auto max-w-6xl px-4 py-8 sm:py-10"
    >
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
          Books
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Add books to your shelf, filter or search by title and author, and
          track your reading progress.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:items-start">
        <div className="space-y-6 lg:col-span-5">
          <BookForm />
          <BookSummary />
        </div>

        <div className="space-y-6 lg:col-span-7">
          <BookFilters />
          <BookList />
        </div>
      </div>
    </div>
  );
}

