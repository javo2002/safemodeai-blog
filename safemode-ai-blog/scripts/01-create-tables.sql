-- Enable UUID generation
create extension if not exists "uuid-ossp";

-- Create Posts Table
create table public.posts (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  content text,
  category text not null,
  featured boolean default false,
  image text, -- URL or path to image
  published boolean default false,
  sources text[], -- Array of strings for sources
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Create Subscribers Table
create table public.subscribers (
  id uuid primary key default uuid_generate_v4(),
  email text not null unique,
  subscribed_at timestamptz default now()
);

-- Optional: Function to update `updated_at` timestamp automatically
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- Optional: Trigger to update `updated_at` on posts table
create trigger on_posts_updated
  before update on public.posts
  for each row
  execute procedure public.handle_updated_at();

-- Add Row Level Security (RLS) policies
-- These are basic examples; you'll want to refine them based on your auth setup.
-- For now, allow public read access to published posts.
alter table public.posts enable row level security;

create policy "Public can read published posts"
  on public.posts for select
  using ( published = true );

create policy "Admins can manage all posts"
  on public.posts for all
  using ( auth.role() = 'service_role' ) -- Or check against a custom admin role if using Supabase Auth
  with check ( auth.role() = 'service_role' );


-- Allow public insert for subscribers (e.g., for newsletter signup)
alter table public.subscribers enable row level security;

create policy "Public can subscribe"
  on public.subscribers for insert
  with check (true);

create policy "Admins can read subscribers"
  on public.subscribers for select
  using ( auth.role() = 'service_role' ); -- Or check against a custom admin role

-- Note: For client-side mutations by admins (without Supabase Auth roles),
-- you might need more permissive RLS policies or use `service_role` key via Server Actions.
-- For this iteration, we'll assume client-side admin operations will work if RLS is set up
-- to allow users with an 'anon' key to perform these actions, or you use server components/actions.
-- The policies above are a starting point. For client-side admin writes with anon key,
-- you'd need policies like: `create policy "Allow anon to insert posts" on public.posts for insert with check (true);`
-- (This is not secure for public facing apps without further checks).
-- For simplicity, the code will use the anon key, assuming RLS is configured to allow admin actions
-- or you'll later move mutations to Server Actions using the service_role key.
