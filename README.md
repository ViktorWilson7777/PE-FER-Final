# ShelfLife

Personal reading tracker built with **Next.js (App Router)**, **Tailwind CSS**, **ShadCN UI**, **React Context**, and **Supabase** (Auth + PostgreSQL with Row Level Security).

## Environment Variables

Copy `.env.example` to `.env.local` and set your Supabase credentials (anon/public key only):

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-public-key
```

## Database Setup

Run [`supabase/books.sql`](./supabase/books.sql) in your Supabase SQL Editor, and turn **off** "Confirm email" under **Authentication → Providers → Email**.

## Development & Build

```bash
npm install
npm run dev
npm run build
```
