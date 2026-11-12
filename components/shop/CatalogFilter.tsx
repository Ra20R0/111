"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import type { Category } from "@/lib/shop";

export function CatalogFilter({
  categories,
  activeSlug,
  query,
}: {
  categories: Category[];
  activeSlug: string;
  query: string;
}) {
  const router = useRouter();
  const [search, setSearch] = useState(query);

  const pick = (slug: string) => {
    const params = new URLSearchParams();
    if (slug) params.set("category", slug);
    if (search.trim()) params.set("q", search.trim());
    router.push(`/catalog${params.toString() ? `?${params}` : ""}`);
  };

  const submitSearch = (e: React.FormEvent) => {
    e.preventDefault();
    pick(activeSlug);
  };

  return (
    <div className="mb-6 flex flex-col gap-4">
      <form onSubmit={submitSearch} className="flex gap-2">
        <input
          type="search"
          placeholder="Найти: сёмга, креветка, икра…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-md"
        />
        <button type="submit" className="btn btn-primary shrink-0">
          Искать
        </button>
      </form>

      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => pick("")}
          className={`badge !px-4 !py-2 !text-[13px] ${
            activeSlug === "" ? "btn-primary" : "btn-outline"
          }`}
          style={
            activeSlug === ""
              ? { background: "var(--brand)", color: "#fff" }
              : { border: "1.5px solid var(--line)", color: "var(--ink)" }
          }
        >
          Все товары
        </button>
        {categories.map((c) => (
          <button
            key={c.id}
            onClick={() => pick(c.slug)}
            className="badge !cursor-pointer !px-4 !py-2 !text-[13px]"
            style={
              activeSlug === c.slug
                ? { background: "var(--brand)", color: "#fff" }
                : { border: "1.5px solid var(--line)", color: "var(--ink)" }
            }
          >
            {c.name}
          </button>
        ))}
      </div>
    </div>
  );
}
