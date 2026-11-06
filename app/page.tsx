import { BookPlus, CheckCircle2, Search } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const FEATURES = [
  {
    title: "Add books",
    description:
      "Save any book with its title, author, page count, and current reading status in seconds.",
    icon: BookPlus,
  },
  {
    title: "Track your progress",
    description:
      "Advance books smoothly from To Read to Reading and Finished while seeing your live page totals.",
    icon: CheckCircle2,
  },
  {
    title: "Search your shelf",
    description:
      "Filter by reading status or search by title and author instantaneously without reloading the page.",
    icon: Search,
  },
];

export default function HomePage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:py-16">
      <section className="mx-auto max-w-2xl text-center">
        <h1
          data-testid="home-title"
          className="text-4xl font-extrabold tracking-tight sm:text-5xl"
        >
          ShelfLife
        </h1>
        <p className="mt-4 text-base text-muted-foreground sm:text-lg">
          Keep a personal list of the books you want to read, are currently
          reading, or have finished, and see exactly how much you have on your
          shelf.
        </p>
      </section>

      <section className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3">
        {FEATURES.map((feature) => {
          const Icon = feature.icon;
          return (
            <Card key={feature.title} className="h-full">
              <CardHeader>
                <div className="mb-2 flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Icon className="size-5" />
                </div>
                <CardTitle>{feature.title}</CardTitle>
                <CardDescription>{feature.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground">
                  Protected with personal account security so your reading list
                  is always private to you.
                </p>
              </CardContent>
            </Card>
          );
        })}
      </section>
    </div>
  );
}
