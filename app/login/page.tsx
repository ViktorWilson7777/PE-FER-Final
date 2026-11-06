"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
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
import { getSupabase } from "@/lib/supabase";
import { validateLoginForm, type LoginFormValues } from "@/lib/books-utils";

export default function LoginPage() {
  const router = useRouter();
  const [values, setValues] = useState<LoginFormValues>({
    email: "",
    password: "",
  });
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [authError, setAuthError] = useState<string>("");

  const errors = submitted ? validateLoginForm(values) : {};

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setAuthError("");
    setSubmitted(true);

    const validationErrors = validateLoginForm(values);
    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    setSubmitting(true);
    try {
      const { error } = await getSupabase().auth.signInWithPassword({
        email: values.email.trim(),
        password: values.password,
      });

      if (error) {
        setAuthError(error.message);
        setSubmitting(false);
        return;
      }

      router.push("/books");
    } catch (err) {
      setAuthError(err instanceof Error ? err.message : "Login failed");
      setSubmitting(false);
    }
  }

  return (
    <div className="mx-auto flex max-w-md items-center px-4 py-10 sm:py-16">
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-xl">Login</CardTitle>
          <CardDescription>
            Sign in to your ShelfLife account to manage your reading list.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form
            data-testid="login-form"
            noValidate
            onSubmit={(e) => void handleSubmit(e)}
            className="space-y-4"
          >
            <div className="space-y-1.5">
              <Label htmlFor="login-email">Email</Label>
              <Input
                id="login-email"
                type="email"
                placeholder="you@example.com"
                autoComplete="email"
                data-testid="login-email"
                value={values.email}
                onChange={(e) =>
                  setValues((prev) => ({ ...prev, email: e.target.value }))
                }
              />
              {errors.email && (
                <p
                  data-testid="error-email"
                  className="text-xs font-medium text-destructive"
                >
                  {errors.email}
                </p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="login-password">Password</Label>
              <Input
                id="login-password"
                type="password"
                placeholder="Enter your password"
                autoComplete="current-password"
                data-testid="login-password"
                value={values.password}
                onChange={(e) =>
                  setValues((prev) => ({ ...prev, password: e.target.value }))
                }
              />
              {errors.password && (
                <p
                  data-testid="error-password"
                  className="text-xs font-medium text-destructive"
                >
                  {errors.password}
                </p>
              )}
            </div>

            {authError && (
              <p
                data-testid="error-auth"
                className="rounded-lg bg-destructive/10 px-3 py-2 text-xs font-medium text-destructive"
              >
                {authError}
              </p>
            )}

            <Button
              type="submit"
              data-testid="login-submit"
              disabled={submitting}
              className="w-full"
            >
              {submitting ? "Signing in..." : "Login"}
            </Button>

            <p className="text-center text-xs text-muted-foreground">
              Don&apos;t have an account?{" "}
              <Link
                href="/register"
                className="font-medium text-primary underline-offset-4 hover:underline"
              >
                Create one
              </Link>
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

