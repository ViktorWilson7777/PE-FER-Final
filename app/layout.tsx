import type { Metadata } from "next";
import "./globals.css";
import { ShelfLifeProvider } from "@/context/shelflife-context";
import { Header } from "@/components/header";

export const metadata: Metadata = {
  title: "ShelfLife — Personal Reading Tracker",
  description:
    "Keep a list of the books you want to read, are reading, or have finished, and see how much you have on your shelf.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="flex min-h-full flex-col bg-background text-foreground">
        <ShelfLifeProvider>
          <Header />
          <main className="flex-1">{children}</main>
        </ShelfLifeProvider>
      </body>
    </html>
  );
}
