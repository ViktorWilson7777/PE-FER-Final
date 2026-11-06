export const BOOK_STATUSES = ["To Read", "Reading", "Finished"] as const;

export type BookStatus = (typeof BOOK_STATUSES)[number];

const STATUS_ORDER: Record<BookStatus, number> = {
  "To Read": 0,
  Reading: 1,
  Finished: 2,
};

export interface Book {
  id: string;
  user_id: string;
  title: string;
  author: string;
  pages: number;
  status: BookStatus;
  created_at: string;
}

export interface LoginFormValues {
  email: string;
  password: string;
}

export interface LoginFormErrors {
  email?: string;
  password?: string;
}

export interface RegisterFormValues {
  email: string;
  password: string;
  confirmPassword: string;
}

export interface RegisterFormErrors {
  email?: string;
  password?: string;
  confirmPassword?: string;
}

export interface BookFormValues {
  title: string;
  author: string;
  pages: string;
  pagesBadInput?: boolean;
  status: string;
}

export interface BookFormErrors {
  title?: string;
  author?: string;
  pages?: string;
  status?: string;
}

export interface StatusBreakdownItem {
  status: BookStatus;
  count: number;
}

export interface BookSummaryData {
  bookCount: number;
  totalPages: number;
  breakdown: StatusBreakdownItem[];
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function formatPages(pages: number | string): string {
  const num = Number(pages);
  return `${Number.isFinite(num) ? Math.trunc(num) : 0} pages`;
}

export function getNextStatus(status: BookStatus): BookStatus | null {
  if (status === "To Read") return "Reading";
  if (status === "Reading") return "Finished";
  return null;
}

export function validateLoginForm(values: LoginFormValues): LoginFormErrors {
  const errors: LoginFormErrors = {};
  const trimmedEmail = values.email.trim();

  if (trimmedEmail === "") {
    errors.email = "Email is required";
  } else if (!EMAIL_REGEX.test(trimmedEmail)) {
    errors.email = "Please enter a valid email address";
  }

  if (values.password === "") {
    errors.password = "Password is required";
  }

  return errors;
}

export function validateRegisterForm(
  values: RegisterFormValues
): RegisterFormErrors {
  const errors: RegisterFormErrors = {};
  const trimmedEmail = values.email.trim();

  if (trimmedEmail === "") {
    errors.email = "Email is required";
  } else if (!EMAIL_REGEX.test(trimmedEmail)) {
    errors.email = "Please enter a valid email address";
  }

  if (values.password === "") {
    errors.password = "Password is required";
  } else if (values.password.length < 6) {
    errors.password = "Password must be at least 6 characters";
  }

  if (values.confirmPassword === "") {
    errors.confirmPassword = "Confirm password is required";
  } else if (values.confirmPassword !== values.password) {
    errors.confirmPassword = "Passwords do not match";
  }

  return errors;
}

export function validateBookForm(values: BookFormValues): BookFormErrors {
  const errors: BookFormErrors = {};

  if (values.title.trim() === "") {
    errors.title = "Title is required";
  } else if (values.title.length > 80) {
    errors.title = "Title must be at most 80 characters";
  }

  if (values.author.trim() === "") {
    errors.author = "Author is required";
  } else if (values.author.length > 60) {
    errors.author = "Author must be at most 60 characters";
  }

  if (!values.pagesBadInput && values.pages.trim() === "") {
    errors.pages = "Pages is required";
  } else {
    const trimmedPages = values.pages.trim();
    const parsedPages = Number(trimmedPages);
    if (
      values.pagesBadInput ||
      !/^-?\d+$/.test(trimmedPages) ||
      !Number.isInteger(parsedPages) ||
      parsedPages < 1 ||
      parsedPages > 5000
    ) {
      errors.pages = "Pages must be a whole number between 1 and 5000";
    }
  }

  if (!BOOK_STATUSES.includes(values.status as BookStatus)) {
    errors.status = "Please choose a status";
  }

  return errors;
}

export function sortBooks(list: Book[]): Book[] {
  return [...list].sort((a, b) => {
    const aTime = new Date(a.created_at).getTime();
    const bTime = new Date(b.created_at).getTime();
    if (!Number.isNaN(aTime) && !Number.isNaN(bTime) && bTime !== aTime) {
      return bTime - aTime;
    }
    return (b.created_at || "").localeCompare(a.created_at || "");
  });
}

export function filterBooks(
  list: Book[],
  statusFilter: string,
  searchQuery: string
): Book[] {
  const normalizedSearch = searchQuery.trim().toLowerCase();
  return list.filter((book) => {
    const matchesStatus =
      statusFilter === "" || book.status === statusFilter;
    const matchesSearch =
      normalizedSearch === "" ||
      book.title.toLowerCase().includes(normalizedSearch) ||
      book.author.toLowerCase().includes(normalizedSearch);
    return matchesStatus && matchesSearch;
  });
}

export function computeSummary(filteredBooks: Book[]): BookSummaryData {
  let totalPages = 0;
  const countsByStatus = new Map<BookStatus, number>();

  for (const book of filteredBooks) {
    totalPages += Number(book.pages) || 0;
    countsByStatus.set(
      book.status,
      (countsByStatus.get(book.status) ?? 0) + 1
    );
  }

  const breakdown: StatusBreakdownItem[] = Array.from(countsByStatus.entries())
    .map(([status, count]) => ({ status, count }))
    .sort((a, b) => {
      if (b.count !== a.count) {
        return b.count - a.count;
      }
      return STATUS_ORDER[a.status] - STATUS_ORDER[b.status];
    });

  return {
    bookCount: filteredBooks.length,
    totalPages,
    breakdown,
  };
}

