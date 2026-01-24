-- Create products table
create table public.products (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  category text not null check (category = any (array['machines'::text, 'beans'::text, 'accessories'::text, 'ingredients'::text])),
  price decimal(10,2) not null,
  description text,
  image text,
  stock integer default 0,
  roast_level text,
  origin text,
  weight text,
  features text[], -- Array of strings
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create profiles table
create table public.profiles (
  id uuid primary key references auth.users(id),
  email text not null,
  name text,
  is_admin boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create orders table
create table public.orders (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id),
  status text default 'pending' check (status = any (array['pending'::text, 'processing'::text, 'shipped'::text, 'delivered'::text, 'cancelled'::text])),
  total decimal(10,2) not null,
  shipping_address text not null,
  payment_method text not null,
  date timestamp with time zone default timezone('utc'::text, now()) not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create order_items table
create table public.order_items (
  id uuid default gen_random_uuid() primary key,
  order_id uuid not null references public.orders(id),
  product_id uuid references public.products(id),
  quantity integer not null check (quantity > 0),
  price decimal(10,2) not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable Row Level Security (RLS)
alter table public.products enable row level security;
alter table public.profiles enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;

-- Products policies
create policy "Public products are viewable by everyone."
  on public.products for select
  using ( true );

create policy "Admins can insert products."
  on public.products for insert
  with check ( true ); -- WARNING: Open to everyone for demo purposes. Secure this in production!

create policy "Admins can update products."
  on public.products for update
  using ( true ); -- WARNING: Open to everyone for demo purposes. Secure this in production!

create policy "Admins can delete products."
  on public.products for delete
  using ( true ); -- WARNING: Open to everyone for demo purposes. Secure this in production!

-- Profiles policies
create policy "Users can view their own profile."
  on public.profiles for select
  using ( auth.uid() = id );

create policy "Users can update their own profile."
  on public.profiles for update
  using ( auth.uid() = id );

-- Orders policies
create policy "Users can view their own orders."
  on public.orders for select
  using ( auth.uid() = user_id );

create policy "Users can create orders."
  on public.orders for insert
  with check ( auth.uid() = user_id );

-- Order items policies
create policy "Users can view their own order items."
  on public.order_items for select
  using ( exists (
    select 1 from public.orders where orders.id = order_items.order_id and orders.user_id = auth.uid()
  ));

create policy "Users can insert order items for their orders."
  on public.order_items for insert
  with check ( exists (
    select 1 from public.orders where orders.id = order_items.order_id and orders.user_id = auth.uid()
  ));
