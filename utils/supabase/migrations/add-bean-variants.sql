-- Bean variants: grind type (whole bean vs ground powder) and per-weight pricing.
-- Only products in the "beans" category use these columns; everything else
-- keeps selling at the flat `price`.
--
-- Run this in the Supabase SQL editor.

-- weight_options: [{ "label": "250g", "price": 8.50 }, { "label": "1kg", "price": 30.00 }]
-- Order matters — the first entry is what the storefront pre-selects.
alter table public.products
  add column if not exists weight_options jsonb not null default '[]'::jsonb;

-- grind_options: subset of {'whole','ground'}; empty means no grind choice offered.
alter table public.products
  add column if not exists grind_options text[] not null default '{}'::text[];

alter table public.products
  drop constraint if exists products_grind_options_valid;

alter table public.products
  add constraint products_grind_options_valid
  check (grind_options <@ array['whole'::text, 'ground'::text]);

comment on column public.products.weight_options is
  'Beans only. JSON array of { label, price } — admin-defined weights, each with its own price. Empty falls back to the flat price.';
comment on column public.products.grind_options is
  'Beans only. Which grind types the customer may pick: whole and/or ground.';

-- Record what the customer actually chose, so an order line stays readable
-- after the product''s options change. e.g. "250g · Ground Coffee".
alter table public.order_items
  add column if not exists variant_label text;

comment on column public.order_items.variant_label is
  'Snapshot of the selected bean variant at purchase time. Null for products without options.';
