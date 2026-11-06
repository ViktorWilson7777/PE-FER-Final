"use client";

import React, { useState } from "react";
import Link from "next/link";
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
import { getSignUpSupabase } from "@/lib/supabase";
import {
  validateRegisterForm,
  type RegisterFormValues,
} from "@/lib/books-utils";

export default function RegisterPage() {
  const [values, setValues] = useState<RegisterFormValues>({
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [authError, setAuthError] = useState<string>("");
  const [successMessage, setSuccessMessage] = useState<string>("");

  const errors = submitted ? validateRegisterForm(values) : {};

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setAuthError("");
    setSuccessMessage("");
    setSubmitted(true);

    const validationErrors = validateRegisterForm(values);
    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    setSubmitting(true);
    try {
      const { data, error } = await getSignUpSupabase().auth.signUp({
        email: values.email.trim(),
        password: values.password,
      });

      if (error) {
        setAuthError(error.message);
        setSubmitting(false);
        return;
      }

      if (
        data.user &&
        Array.isArray(data.user.identities) &&
        data.user.identities.length === 0
      ) {
        setAuthError("User already registered");
        setSubmitting(false);
        return;
      }

      setSubmitted(false);
      setSuccessMessage("Registration successful");
      setSubmitting(false);
    } catch (err) {
      setAuthError(err instanceof Error ? err.message : "Registration failed");
      setSubmitting(false);
    }
  }

  return (
    <div className="mx-auto flex max-w-md items-center px-4 py-10 sm:py-16">
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-xl">Register</CardTitle>
          <CardDescription>
            Create a ShelfLife account to start building your reading list.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form
            data-testid="register-form"
            noValidate
            onSubmit={(e) => void handleSubmit(e)}
            className="space-y-4"
          >
            <div className="space-y-1.5">
              <Label htmlFor="register-email">Email</Label>
              <Input
                id="register-email"
                type="email"
                placeholder="you@example.com"
                autoComplete="email"
                data-testid="register-email"
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
              <Label htmlFor="register-password">Password</Label>
              <Input
                id="register-password"
                type="password"
                placeholder="At least 6 characters"
                autoComplete="new-password"
                data-testid="register-password"
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

            <div className="space-y-1.5">
              <Label htmlFor="register-confirm-password">
                Confirm password
              </Label>
              <Input
                id="register-confirm-password"
                type="password"
                placeholder="Re-enter your password"
                autoComplete="new-password"
                data-testid="register-confirm-password"
                value={values.confirmPassword}
                onChange={(e) =>
                  setValues((prev) => ({
                    ...prev,
                    confirmPassword: e.target.value,
                  }))
                }
              />
              {errors.confirmPassword && (
                <p
                  data-testid="error-confirm-password"
                  className="text-xs font-medium text-destructive"
                >
                  {errors.confirmPassword}
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

            {successMessage && (
              <p
                data-testid="form-success"
                className="rounded-lg bg-emerald-500/10 px-3 py-2 text-xs font-medium text-emerald-700 dark:text-emerald-400"
              >
                {successMessage}
              </p>
            )}

            <Button
              type="submit"
              data-testid="register-submit"
              disabled={submitting}
              className="w-full"
            >
              {submitting ? "Creating account..." : "Register"}
            </Button>

            <p className="text-center text-xs text-muted-foreground">
              Already have an account?{" "}
              <Link
                href="/login"
                className="font-medium text-primary underline-offset-4 hover:underline"
              >
                Sign in
              </Link>
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

