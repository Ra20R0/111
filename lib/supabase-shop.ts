import { createClient } from "@supabase/supabase-js";
import type { Category, Product } from "./shop";

export function createSupabaseClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anonKey) throw new Error("Supabase is not configured");
  return createClient(url, anonKey);
}

function toProduct(row: Record<string, unknown>): Product {
  return {
    id: String(row.id),
    category_id: row.category_id === null ? null : String(row.category_id),
    name: String(row.name),
    description: String(row.description ?? ""),
    price: Number(row.price),
    old_price: row.old_price === null || row.old_price === undefined ? null : Number(row.old_price),
    unit: String(row.unit ?? "кг"),
    weight_label: String(row.weight_label ?? ""),
    image_url: String(row.image_url ?? ""),
    is_promo: Boolean(row.is_promo),
    is_new: Boolean(row.is_new),
    available: row.available === undefined ? true : Boolean(row.available),
  };
}

function toCategory(row: Record<string, unknown>): Category {
  return {
    id: String(row.id),
    name: String(row.name),
    slug: String(row.slug),
    sort_order: Number(row.sort_order ?? 0),
  };
}

export async function fetchCategories(): Promise<Category[]> {
  const supabase = createSupabaseClient();
  const { data, error } = await supabase
    .from("categories")
    .select("id, name, slug, sort_order")
    .order("sort_order");
  if (error) throw new Error(error.message);
  return (data ?? []).map(toCategory);
}

export async function fetchProducts(options?: { categoryId?: string }): Promise<Product[]> {
  const supabase = createSupabaseClient();
  let query = supabase
    .from("products")
    .select(
      "id, category_id, name, description, price, old_price, unit, weight_label, image_url, is_promo, is_new, available",
    )
    .order("name");
  if (options?.categoryId) query = query.eq("category_id", options.categoryId);
  const { data, error } = await query;
  if (error) throw new Error(error.message);
  return (data ?? []).map(toProduct);
}
