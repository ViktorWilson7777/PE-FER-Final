"use client";

import Link from "next/link";
import { BookOpen } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { useShelfLife } from "@/context/shelflife-context";
import { cn } from "@/lib/utils";

export function Header() {
  const { user, logout } = useShelfLife();

  return (
    <header className="sticky top-0 z-30 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-2 px-4 py-3">
        <Link
          href="/"
          className="flex items-center gap-2 text-lg font-bold tracking-tight text-foreground transition-opacity hover:opacity-85"
        >
          <span className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <BookOpen className="size-4" />
          </span>
          <span>ShelfLife</span>
        </Link>

        <nav className="flex flex-wrap items-center gap-2">
          {user ? (
            <>
              <span
                data-testid="user-email"
                className="max-w-[160px] truncate text-xs text-muted-foreground sm:max-w-xs sm:text-sm"
                title={user.email ?? ""}
              >
                {user.email}
              </span>
              <Link
                href="/books"
                data-testid="link-books"
                className={cn(buttonVariants({ variant: "ghost", size: "sm" }))}
              >
                Books
              </Link>
              <Button
                type="button"
                variant="outline"
                size="sm"
                data-testid="btn-logout"
                onClick={() => void logout()}
              >
                Logout
              </Button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                data-testid="btn-login"
                className={cn(
                  buttonVariants({ variant: "outline", size: "sm" })
                )}
              >
                Login
              </Link>
              <Link
                href="/register"
                data-testid="btn-register"
                className={cn(
                  buttonVariants({ variant: "default", size: "sm" })
                )}
              >
                Register
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}

