export type Category = {
  id: string;
  name: string;
  slug: string;
  sort_order: number;
};

export type Product = {
  id: string;
  category_id: string | null;
  name: string;
  description: string;
  price: number;
  old_price: number | null;
  unit: string;
  weight_label: string;
  image_url: string;
  is_promo: boolean;
  is_new: boolean;
  available: boolean;
};

export type OrderItemInput = {
  product_id: string | null;
  name: string;
  price: number;
  unit: string;
  quantity: number;
};

export type OrderInput = {
  customer_name: string;
  phone: string;
  address: string;
  comment: string;
  delivery: "delivery" | "pickup";
  total: number;
  items: OrderItemInput[];
};

export function formatPrice(value: number): string {
  return new Intl.NumberFormat("ru-RU", { maximumFractionDigits: 0 }).format(value) + " ₽";
}

export function discountPercent(price: number, oldPrice: number): number {
  return Math.round((1 - price / oldPrice) * 100);
}
