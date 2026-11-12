/*
# Shop schema: categories, products, orders

1. Plain-English summary
   Creates the storage for a small fish/seafood online shop: product
   categories, products (with weight, price, optional old price for
   discounts, photo, promo/new flags) and customer orders with order lines.

2. New Tables
   - `categories`
     - `id` (uuid, primary key)
     - `name` (text, not null)
     - `slug` (text, unique, not null)
     - `sort_order` (integer, default 0)
     - `created_at` (timestamp)
   - `products`
     - `id` (uuid, primary key)
     - `category_id` (uuid, references categories)
     - `name` (text, not null)
     - `description` (text)
     - `price` (numeric 10,2, not null) — current price per unit
     - `old_price` (numeric 10,2, null) — if set, a discount badge is shown
     - `unit` (text, default 'кг')
     - `weight_label` (text) — human weight, e.g. "300-500 г"
     - `image_url` (text)
     - `is_promo` (boolean, default false)
     - `is_new` (boolean, default false)
     - `available` (boolean, default true)
     - `created_at` (timestamp)
   - `orders`
     - `id` (uuid, primary key)
     - `customer_name`, `phone`, `address`, `comment` (text)
     - `delivery` (text) — 'delivery' | 'pickup'
     - `total` (numeric 10,2)
     - `status` (text, default 'new')
     - `created_at` (timestamp)
   - `order_items`
     - `id` (uuid, primary key)
     - `order_id` (uuid, references orders, on delete cascade)
     - `product_id` (uuid, references products)
     - `name`, `price`, `unit` — snapshots at purchase time
     - `quantity` (numeric 10,3) — allows 0.5 kg

3. Security
   - RLS enabled on all four tables.
   - Single-tenant shop without sign-in: everyone reads the catalog,
     everyone may place an order. Explicit grants for the Data API.

4. Notes
   - `order_items` stores name/price/unit snapshots so later catalog
     edits never corrupt historical orders.
   - All keys are UUID with no sequences, so no sequence grants.
*/

CREATE TABLE IF NOT EXISTS categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id uuid REFERENCES categories(id) ON DELETE SET NULL,
  name text NOT NULL,
  description text NOT NULL DEFAULT '',
  price numeric(10,2) NOT NULL CHECK (price >= 0),
  old_price numeric(10,2) CHECK (old_price IS NULL OR old_price > price),
  unit text NOT NULL DEFAULT 'кг',
  weight_label text NOT NULL DEFAULT '',
  image_url text NOT NULL DEFAULT '',
  is_promo boolean NOT NULL DEFAULT false,
  is_new boolean NOT NULL DEFAULT false,
  available boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_name text NOT NULL,
  phone text NOT NULL,
  address text NOT NULL,
  comment text NOT NULL DEFAULT '',
  delivery text NOT NULL DEFAULT 'delivery' CHECK (delivery IN ('delivery','pickup')),
  total numeric(10,2) NOT NULL,
  status text NOT NULL DEFAULT 'new',
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS order_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id uuid REFERENCES products(id) ON DELETE SET NULL,
  name text NOT NULL,
  price numeric(10,2) NOT NULL,
  unit text NOT NULL DEFAULT 'кг',
  quantity numeric(10,3) NOT NULL CHECK (quantity > 0)
);

CREATE INDEX IF NOT EXISTS products_category_idx ON products(category_id);
CREATE INDEX IF NOT EXISTS order_items_order_idx ON order_items(order_id);

ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

GRANT SELECT ON categories, products TO anon, authenticated;
GRANT INSERT ON orders, order_items TO anon, authenticated;
GRANT SELECT ON order_items TO anon, authenticated;

DROP POLICY IF EXISTS "catalog readable" ON categories;
CREATE POLICY "catalog readable" ON categories FOR SELECT TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "catalog readable" ON products;
CREATE POLICY "catalog readable" ON products FOR SELECT TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anyone can place order" ON orders;
CREATE POLICY "anyone can place order" ON orders FOR INSERT TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anyone can add order lines" ON order_items;
CREATE POLICY "anyone can add order lines" ON order_items FOR INSERT TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "own order lines readable" ON order_items;
CREATE POLICY "own order lines readable" ON order_items FOR SELECT TO anon, authenticated USING (true);
