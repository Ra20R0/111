import { Suspense } from "react";
import { fetchCategories } from "@/lib/supabase-shop";
import { ProductCard } from "@/components/shop/ProductCard";
import { CatalogFilter } from "@/components/shop/CatalogFilter";

export const dynamic = "force-dynamic";

export default async function CatalogPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; q?: string }>;
}) {
  const { category, q } = await searchParams;
  const categories = await fetchCategories();
  const active = categories.find((c) => c.slug === category);

  return (
    <div className="container py-10">
      <h1 className="mb-2 text-3xl font-extrabold md:text-4xl">
        {active ? active.name : "Каталог"}
      </h1>
      <p className="mb-6" style={{ color: "var(--muted)" }}>
        Свежая рыба, икра и морепродукты — цены за кг или за штуку указаны в карточках.
      </p>

      <Suspense fallback={null}>
        <CatalogFilter categories={categories} activeSlug={category ?? ""} query={q ?? ""} />
      </Suspense>

      <ProductGrid activeSlug={active?.slug ?? ""} query={q ?? ""} />
    </div>
  );
}

async function ProductGrid({ activeSlug, query }: { activeSlug: string; query: string }) {
  const categories = await fetchCategories();
  const active = categories.find((c) => c.slug === activeSlug);
  let products = await fetchProducts({ categoryId: active?.id });

  if (query.trim()) {
    const needle = query.trim().toLowerCase();
    products = products.filter((p) => p.name.toLowerCase().includes(needle));
  }

  if (products.length === 0) {
    return (
      <div className="card mt-6 p-10 text-center" style={{ color: "var(--muted)" }}>
        Ничего не нашлось. Попробуйте другой запрос или загляните в другую категорию.
      </div>
    );
  }

  return (
    <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {products.map((p) => (
        <ProductCard key={p.id} product={p} />
      ))}
    </div>
  );
}
