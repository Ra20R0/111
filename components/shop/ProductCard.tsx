"use client";

import Image from "next/image";
import { useState } from "react";
import { formatPrice, discountPercent, type Product } from "@/lib/shop";
import { useCart } from "./CartContext";

export function ProductCard({ product }: { product: Product }) {
  const { add } = useCart();
  const [added, setAdded] = useState(false);

  const discount = product.old_price ? discountPercent(product.price, product.old_price) : null;

  const handleAdd = () => {
    add(product, 1);
    setAdded(true);
    setTimeout(() => setAdded(false), 1200);
  };

  return (
    <div className="card flex flex-col">
      <div className="relative aspect-[4/3] overflow-hidden" style={{ background: "var(--bg)" }}>
        {product.image_url ? (
          <Image
            src={product.image_url}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 33vw, 25vw"
            className="object-cover transition-transform duration-300 hover:scale-105"
          />
        ) : null}
        <div className="absolute left-3 top-3 flex gap-2">
          {discount !== null && <span className="badge badge-discount">−{discount}%</span>}
          {product.is_new && <span className="badge badge-new">Новинка</span>}
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-2 p-4">
        <h3 className="font-bold leading-snug">{product.name}</h3>
        {product.weight_label && (
          <div className="text-[13px]" style={{ color: "var(--muted)" }}>
            {product.weight_label}
          </div>
        )}
        <div className="mt-auto flex items-end justify-between gap-2 pt-2">
          <div>
            {product.old_price && (
              <div className="text-[13px] line-through" style={{ color: "var(--muted)" }}>
                {formatPrice(product.old_price)}
              </div>
            )}
            <div className="text-lg font-extrabold" style={{ color: "var(--brand)" }}>
              {formatPrice(product.price)}
              <span className="text-sm font-semibold" style={{ color: "var(--muted)" }}>
                {" "}
                / {product.unit}
              </span>
            </div>
          </div>
          <button
            className={`btn ${added ? "btn-primary" : "btn-accent"} !px-4`}
            onClick={handleAdd}
            aria-label={`Добавить ${product.name} в корзину`}
          >
            {added ? "✓ В корзине" : "В корзину"}
          </button>
        </div>
      </div>
    </div>
  );
}
