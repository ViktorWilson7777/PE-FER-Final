"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useShelfLife } from "@/context/shelflife-context";
import {
  BOOK_STATUSES,
  validateBookForm,
  type BookFormValues,
  type BookStatus,
} from "@/lib/books-utils";

const INITIAL_VALUES: BookFormValues = {
  title: "",
  author: "",
  pages: "",
  pagesBadInput: false,
  status: "",
};

export function BookForm() {
  const { addBook } = useShelfLife();
  const [values, setValues] = useState<BookFormValues>(INITIAL_VALUES);
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [serverError, setServerError] = useState<string>("");
  const [successMessage, setSuccessMessage] = useState<string>("");

  const errors = submitted ? validateBookForm(values) : {};

  function updateField(patch: Partial<BookFormValues>) {
    setValues((prev) => ({ ...prev, ...patch }));
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setServerError("");
    setSuccessMessage("");
    setSubmitted(true);

    const validationErrors = validateBookForm(values);
    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    setSubmitting(true);
    const result = await addBook({
      title: values.title.trim(),
      author: values.author.trim(),
      pages: Number(values.pages.trim()),
      status: values.status as BookStatus,
    });
    setSubmitting(false);

    if (result.error) {
      setServerError(result.error);
      return;
    }

    setValues(INITIAL_VALUES);
    setSubmitted(false);
    setSuccessMessage("Book added");
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add a Book</CardTitle>
        <CardDescription>
          Save a book to your shelf with its title, author, pages, and reading
          status.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form
          data-testid="book-form"
          noValidate
          onSubmit={(e) => void handleSubmit(e)}
          className="space-y-4"
        >
          <div className="space-y-1.5">
            <Label htmlFor="input-title">Title</Label>
            <Input
              id="input-title"
              type="text"
              placeholder="Book title"
              data-testid="input-title"
              value={values.title}
              onChange={(e) => updateField({ title: e.target.value })}
            />
            {errors.title && (
              <p
                data-testid="error-title"
                className="text-xs font-medium text-destructive"
              >
                {errors.title}
              </p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="input-author">Author</Label>
            <Input
              id="input-author"
              type="text"
              placeholder="Author name"
              data-testid="input-author"
              value={values.author}
              onChange={(e) => updateField({ author: e.target.value })}
            />
            {errors.author && (
              <p
                data-testid="error-author"
                className="text-xs font-medium text-destructive"
              >
                {errors.author}
              </p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="input-pages">Pages</Label>
            <Input
              id="input-pages"
              type="number"
              step="any"
              placeholder="1 - 5000"
              data-testid="input-pages"
              value={values.pages}
              onChange={(e) =>
                updateField({
                  pages: e.target.value,
                  pagesBadInput: e.target.validity?.badInput ?? false,
                })
              }
            />
            {errors.pages && (
              <p
                data-testid="error-pages"
                className="text-xs font-medium text-destructive"
              >
                {errors.pages}
              </p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="select-status">Status</Label>
            <select
              id="select-status"
              data-testid="select-status"
              value={values.status}
              onChange={(e) => updateField({ status: e.target.value })}
              className="h-8 w-full min-w-0 rounded-lg border border-input bg-background px-2.5 py-1 text-base transition-colors outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 md:text-sm"
            >
              <option value="">Choose status</option>
              {BOOK_STATUSES.map((st) => (
                <option key={st} value={st}>
                  {st}
                </option>
              ))}
            </select>
            {errors.status && (
              <p
                data-testid="error-status"
                className="text-xs font-medium text-destructive"
              >
                {errors.status}
              </p>
            )}
          </div>

          {serverError && (
            <p
              data-testid="error-book"
              className="rounded-lg bg-destructive/10 px-3 py-2 text-xs font-medium text-destructive"
            >
              {serverError}
            </p>
          )}

          {successMessage && (
            <p
              data-testid="book-success"
              className="rounded-lg bg-emerald-500/10 px-3 py-2 text-xs font-medium text-emerald-700 dark:text-emerald-400"
            >
              {successMessage}
            </p>
          )}

          <Button
            type="submit"
            data-testid="btn-add-book"
            disabled={submitting}
            className="w-full"
          >
            {submitting ? "Adding..." : "Add Book"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

