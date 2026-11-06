"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useShelfLife } from "@/context/shelflife-context";

export function BookSummary() {
  const { summary } = useShelfLife();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Summary</CardTitle>
        <CardDescription>
          Live shelf statistics for the books currently shown.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-lg border bg-muted/40 p-3">
            <div className="text-xs text-muted-foreground">Books</div>
            <div
              data-testid="book-count"
              className="mt-1 text-xl font-bold tracking-tight tabular-nums"
            >
              {summary.bookCount}
            </div>
          </div>
          <div className="rounded-lg border bg-muted/40 p-3">
            <div className="text-xs text-muted-foreground">Total Pages</div>
            <div
              data-testid="total-pages"
              className="mt-1 text-xl font-bold tracking-tight tabular-nums"
            >
              {summary.totalPages}
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <div className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
            By Status
          </div>
          <div data-testid="status-breakdown" className="space-y-1.5">
            {summary.breakdown.map((item) => (
              <div
                key={item.status}
                data-testid="breakdown-row"
                className="flex items-center justify-between rounded-md border px-3 py-2 text-sm"
              >
                <span data-testid="breakdown-name" className="font-medium">
                  {item.status}
                </span>
                <span
                  data-testid="breakdown-count"
                  className="font-semibold tabular-nums"
                >
                  {item.count}
                </span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

