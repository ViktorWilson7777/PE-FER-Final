"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useShelfLife } from "@/context/shelflife-context";
import { formatPages } from "@/lib/books-utils";

export function BookList() {
  const { filteredBooks, booksLoading, advanceBookStatus, deleteBook } =
    useShelfLife();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Shelf</CardTitle>
        <CardDescription>
          Ordered from most recently added to oldest.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {booksLoading ? (
          <div className="py-8 text-center text-sm text-muted-foreground">
            Loading books...
          </div>
        ) : filteredBooks.length === 0 ? (
          <div
            data-testid="books-empty"
            className="rounded-lg border border-dashed py-10 text-center text-sm text-muted-foreground"
          >
            No books found
          </div>
        ) : (
          <div data-testid="book-list" className="space-y-3">
            {filteredBooks.map((book) => (
              <div
                key={book.id}
                data-testid="book-item"
                className="flex flex-col gap-3 rounded-lg border p-3 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="min-w-0 flex-1 space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      data-testid="book-title"
                      className="break-words text-base font-semibold text-foreground"
                    >
                      {book.title}
                    </span>
                    <Badge variant="secondary" data-testid="book-status">
                      {book.status}
                    </Badge>
                  </div>
                  <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground sm:text-sm">
                    <span data-testid="book-author" className="break-words">
                      {book.author}
                    </span>
                    <span>•</span>
                    <span data-testid="book-pages" className="tabular-nums">
                      {formatPages(book.pages)}
                    </span>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2 sm:justify-end">
                  {book.status !== "Finished" && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      data-testid="btn-advance-status"
                      onClick={() => void advanceBookStatus(book.id)}
                    >
                      {book.status === "To Read"
                        ? "Start Reading"
                        : "Mark Finished"}
                    </Button>
                  )}
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    data-testid="btn-delete-book"
                    onClick={() => void deleteBook(book.id)}
                  >
                    Delete
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

