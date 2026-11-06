-- ShelfLife Database Schema & Row Level Security
-- Subject: FER202 | Practical Exam

create extension if not exists "pgcrypto";

create table if not exists public.books (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  title text not null check (char_length(btrim(title)) > 0 and char_length(title) <= 80),
  author text not null check (char_length(btrim(author)) > 0 and char_length(author) <= 60),
  pages integer not null check (pages >= 1 and pages <= 5000),
  status text not null default 'To Read' check (status in ('To Read', 'Reading', 'Finished')),
  created_at timestamptz not null default now()
);

create index if not exists books_user_created_idx
  on public.books (user_id, created_at desc);

-- Enable Row Level Security (never switch off)
alter table public.books enable row level security;

-- Clean up policies if re-running script
drop policy if exists "Users can read own books" on public.books;
drop policy if exists "Users can insert own books" on public.books;
drop policy if exists "Users can update own books" on public.books;
drop policy if exists "Users can delete own books" on public.books;

-- Allow logged-in users to read ONLY their own books
create policy "Users can read own books"
  on public.books
  for select
  to authenticated
  using (auth.uid() = user_id);

-- Allow logged-in users to insert ONLY rows belonging to themselves
create policy "Users can insert own books"
  on public.books
  for insert
  to authenticated
  with check (auth.uid() = user_id);

-- Allow logged-in users to update (change status) ONLY their own books
create policy "Users can update own books"
  on public.books
  for update
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- Allow logged-in users to delete ONLY their own books
create policy "Users can delete own books"
  on public.books
  for delete
  to authenticated
  using (auth.uid() = user_id);

