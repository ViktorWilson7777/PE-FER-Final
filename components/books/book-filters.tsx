"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useShelfLife } from "@/context/shelflife-context";
import { BOOK_STATUSES } from "@/lib/books-utils";

export function BookFilters() {
  const {
    statusFilter,
    searchQuery,
    setStatusFilter,
    setSearchQuery,
    clearFilters,
  } = useShelfLife();

  return (
    <Card>
      <CardContent className="pt-1">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-[1fr_1fr_auto] sm:items-end">
          <div className="space-y-1.5">
            <Label htmlFor="filter-status">Filter by status</Label>
            <select
              id="filter-status"
              data-testid="filter-status"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="h-8 w-full min-w-0 rounded-lg border border-input bg-background px-2.5 py-1 text-base transition-colors outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 md:text-sm"
            >
              <option value="">All</option>
              {BOOK_STATUSES.map((st) => (
                <option key={st} value={st}>
                  {st}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="search-input">Search title or author</Label>
            <Input
              id="search-input"
              type="text"
              placeholder="Search your shelf..."
              data-testid="search-input"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <Button
            type="button"
            variant="outline"
            data-testid="btn-clear-filters"
            onClick={clearFilters}
            className="w-full sm:w-auto"
          >
            Clear
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

