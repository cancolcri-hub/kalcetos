-- =====================================================================
-- RESET COMPLETO del schema kalcetos.
-- Ejecutar este SQL en una sola pasada en el SQL Editor de Supabase.
-- Borra el schema actual (con tablas erróneas) y lo recrea con la versión
-- correcta que el código de tienda-kalcetos espera.
--
-- NO toca public.* ni la clínica.
-- =====================================================================

drop schema if exists kalcetos cascade;
create schema kalcetos;

-- ---------- ENUMS ----------
create type kalcetos.product_status as enum ('draft', 'active', 'archived');
create type kalcetos.order_status   as enum ('pending', 'paid', 'fulfilled', 'cancelled', 'refunded');

-- ---------- PRODUCTS ----------
create table kalcetos.products (
  id                       uuid primary key default gen_random_uuid(),
  slug                     text not null unique,
  name                     text not null,
  segment                  text not null,
  brand                    text,
  description_short        text,
  description_long         text,
  meta_title               text,
  meta_description         text,
  base_price_cents         integer not null check (base_price_cents >= 0),
  compare_at_price_cents   integer check (compare_at_price_cents is null or compare_at_price_cents >= base_price_cents),
  status                   kalcetos.product_status not null default 'draft',
  created_at               timestamptz not null default now(),
  updated_at               timestamptz not null default now()
);
create index products_segment_active_idx on kalcetos.products (segment) where status = 'active';
create index products_slug_idx           on kalcetos.products (slug);

-- ---------- PRODUCT VARIANTS ----------
create table kalcetos.product_variants (
  id              uuid primary key default gen_random_uuid(),
  product_id      uuid not null references kalcetos.products(id) on delete cascade,
  sku             text not null unique,
  size            text,
  color           text,
  stock           integer not null default 0 check (stock >= 0),
  price_cents     integer check (price_cents is null or price_cents >= 0),
  created_at      timestamptz not null default now()
);
create index product_variants_product_idx on kalcetos.product_variants (product_id);

-- ---------- PRODUCT IMAGES ----------
create table kalcetos.product_images (
  id              uuid primary key default gen_random_uuid(),
  product_id      uuid not null references kalcetos.products(id) on delete cascade,
  storage_path    text not null,
  alt_text        text not null,
  position        integer not null default 0,
  is_primary      boolean not null default false
);
create index product_images_product_idx       on kalcetos.product_images (product_id);
create unique index product_images_primary_idx on kalcetos.product_images (product_id) where is_primary = true;

-- ---------- CUSTOMERS ----------
create table kalcetos.customers (
  id              uuid primary key default gen_random_uuid(),
  email           text not null unique,
  name            text,
  phone           text,
  address_line1   text,
  address_line2   text,
  city            text,
  postal_code     text,
  country         text not null default 'ES',
  created_at      timestamptz not null default now()
);

-- ---------- ORDERS ----------
create table kalcetos.orders (
  id                  uuid primary key default gen_random_uuid(),
  customer_id         uuid references kalcetos.customers(id) on delete set null,
  stripe_session_id   text not null unique,
  status              kalcetos.order_status not null default 'pending',
  subtotal_cents      integer not null default 0,
  shipping_cents      integer not null default 0,
  tax_cents           integer not null default 0,
  total_cents         integer not null default 0,
  currency            text not null default 'EUR',
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now()
);
create index orders_customer_idx on kalcetos.orders (customer_id);
create index orders_status_idx   on kalcetos.orders (status);

-- ---------- ORDER ITEMS ----------
create table kalcetos.order_items (
  id                  uuid primary key default gen_random_uuid(),
  order_id            uuid not null references kalcetos.orders(id) on delete cascade,
  variant_id          uuid not null references kalcetos.product_variants(id),
  quantity            integer not null check (quantity > 0),
  unit_price_cents    integer not null check (unit_price_cents >= 0),
  line_total_cents    integer not null check (line_total_cents >= 0)
);
create index order_items_order_idx on kalcetos.order_items (order_id);

-- ---------- TRIGGER updated_at ----------
create or replace function kalcetos.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger products_updated_at
  before update on kalcetos.products
  for each row execute function kalcetos.set_updated_at();

create trigger orders_updated_at
  before update on kalcetos.orders
  for each row execute function kalcetos.set_updated_at();

-- ---------- RLS ----------
alter table kalcetos.products         enable row level security;
alter table kalcetos.product_variants enable row level security;
alter table kalcetos.product_images   enable row level security;
alter table kalcetos.customers        enable row level security;
alter table kalcetos.orders           enable row level security;
alter table kalcetos.order_items      enable row level security;

create policy "products active are public"
  on kalcetos.products for select
  to anon, authenticated
  using (status = 'active');

create policy "variants of active products are public"
  on kalcetos.product_variants for select
  to anon, authenticated
  using (exists (select 1 from kalcetos.products p where p.id = product_id and p.status = 'active'));

create policy "images of active products are public"
  on kalcetos.product_images for select
  to anon, authenticated
  using (exists (select 1 from kalcetos.products p where p.id = product_id and p.status = 'active'));

-- ---------- GRANTS ----------
grant usage on schema kalcetos to anon, authenticated, service_role;

grant all on all tables    in schema kalcetos to service_role;
grant all on all sequences in schema kalcetos to service_role;
grant all on all functions in schema kalcetos to service_role;

grant select on all tables    in schema kalcetos to anon, authenticated;
grant select on all sequences in schema kalcetos to anon, authenticated;

alter default privileges in schema kalcetos grant all    on tables    to service_role;
alter default privileges in schema kalcetos grant all    on sequences to service_role;
alter default privileges in schema kalcetos grant select on tables    to anon, authenticated;
alter default privileges in schema kalcetos grant select on sequences to anon, authenticated;
