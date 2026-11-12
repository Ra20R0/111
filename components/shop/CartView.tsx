"use client";

import Image from "next/image";
import { useState } from "react";
import { useCart } from "./CartContext";
import { formatPrice } from "@/lib/shop";

const FREE_FROM = 3000;
const DELIVERY_COST = 350;

export function CartView({ phone }: { phone: string }) {
  const { lines, setQuantity, remove, total, clear } = useCart();
  const [name, setName] = useState("");
  const [phoneInput, setPhoneInput] = useState("");
  const [address, setAddress] = useState("");
  const [comment, setComment] = useState("");
  const [delivery, setDelivery] = useState<"delivery" | "pickup">("delivery");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  const deliveryFee = delivery === "pickup" || total >= FREE_FROM ? 0 : DELIVERY_COST;
  const grandTotal = total + deliveryFee;

  if (done) {
    return (
      <div className="card mx-auto max-w-lg p-10 text-center">
        <div className="mb-4 text-5xl">✅</div>
        <h2 className="text-2xl font-extrabold">Заказ принят!</h2>
        <p className="mt-2" style={{ color: "var(--muted)" }}>
          Мы позвоним вам в течение 15 минут, чтобы подтвердить заказ и уточнить время доставки.
        </p>
      </div>
    );
  }

  if (lines.length === 0) {
    return (
      <div className="card mx-auto max-w-lg p-10 text-center">
        <div className="mb-4 text-5xl">🛒</div>
        <h2 className="text-2xl font-extrabold">Корзина пуста</h2>
        <p className="mt-2 mb-6" style={{ color: "var(--muted)" }}>
          Загляните в каталог — там свежая рыба, икра и морепродукты.
        </p>
        <a href="/catalog" className="btn btn-primary">
          В каталог
        </a>
      </div>
    );
  }

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customer_name: name,
          phone: phoneInput,
          address: delivery === "pickup" ? "Самовывоз" : address,
          comment,
          delivery,
          total: grandTotal,
          items: lines.map((l) => ({
            product_id: l.product.id,
            name: l.product.name,
            price: l.product.price,
            unit: l.product.unit,
            quantity: l.quantity,
          })),
        }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => null);
        throw new Error(body?.error ?? "Не удалось оформить заказ, попробуйте ещё раз");
      }
      clear();
      setDone(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Что-то пошло не так");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
      <div>
        <h1 className="mb-6 text-3xl font-extrabold">Корзина</h1>
        <div className="space-y-3">
          {lines.map(({ product, quantity }) => (
            <div key={product.id} className="card flex items-center gap-4 p-3">
              <div className="relative h-20 w-24 shrink-0 overflow-hidden rounded-lg" style={{ background: "var(--bg)" }}>
                {product.image_url && <Image src={product.image_url} alt={product.name} fill sizes="96px" className="object-cover" />}
              </div>
              <div className="min-w-0 flex-1">
                <div className="truncate font-bold">{product.name}</div>
                <div className="text-sm" style={{ color: "var(--muted)" }}>
                  {product.weight_label && `${product.weight_label} · `}
                  {formatPrice(product.price)} / {product.unit}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button className="btn btn-outline !px-3 !py-1" onClick={() => setQuantity(product.id, Math.round((quantity - 0.5) * 10) / 10)} aria-label="Меньше">
                  −
                </button>
                <span className="w-12 text-center font-bold">{Math.round(quantity * 10) / 10}</span>
                <button className="btn btn-outline !px-3 !py-1" onClick={() => setQuantity(product.id, Math.round((quantity + 0.5) * 10) / 10)} aria-label="Больше">
                  +
                </button>
              </div>
              <div className="w-24 text-right font-extrabold">{formatPrice(product.price * quantity)}</div>
              <button onClick={() => remove(product.id)} className="ml-1 text-lg opacity-40 hover:opacity-100" aria-label="Удалить">
                ✕
              </button>
            </div>
          ))}
        </div>
        <button onClick={clear} className="mt-4 text-sm hover:underline" style={{ color: "var(--muted)" }}>
          Очистить корзину
        </button>
      </div>

      <form onSubmit={submit} className="card h-fit space-y-4 p-6">
        <h2 className="text-xl font-extrabold">Оформление заказа</h2>

        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setDelivery("delivery")}
            className={`btn flex-1 ${delivery === "delivery" ? "btn-primary" : "btn-outline"}`}
          >
            Доставка
          </button>
          <button
            type="button"
            onClick={() => setDelivery("pickup")}
            className={`btn flex-1 ${delivery === "pickup" ? "btn-primary" : "btn-outline"}`}
          >
            Самовывоз
          </button>
        </div>

        <input placeholder="Ваше имя" value={name} onChange={(e) => setName(e.target.value)} required />
        <input
          placeholder="Телефон +7 (___) ___-__-__"
          value={phoneInput}
          onChange={(e) => setPhoneInput(e.target.value)}
          required
          type="tel"
        />
        {delivery === "delivery" && (
          <input placeholder="Адрес доставки" value={address} onChange={(e) => setAddress(e.target.value)} required />
        )}
        <textarea placeholder="Комментарий (необязательно)" value={comment} onChange={(e) => setComment(e.target.value)} rows={2} />

        <div className="space-y-1 border-t pt-4 text-sm" style={{ borderColor: "var(--line)" }}>
          <div className="flex justify-between">
            <span style={{ color: "var(--muted)" }}>Товары</span>
            <span className="font-semibold">{formatPrice(total)}</span>
          </div>
          <div className="flex justify-between">
            <span style={{ color: "var(--muted)" }}>
              {delivery === "pickup" ? "Самовывоз" : total >= FREE_FROM ? "Доставка (бесплатно)" : "Доставка"}
            </span>
            <span className="font-semibold">{deliveryFee === 0 ? "0 ₽" : formatPrice(deliveryFee)}</span>
          </div>
          <div className="flex justify-between pt-2 text-lg font-extrabold">
            <span>Итого</span>
            <span style={{ color: "var(--brand)" }}>{formatPrice(grandTotal)}</span>
          </div>
          {delivery === "delivery" && total < FREE_FROM && (
            <p className="text-xs" style={{ color: "var(--muted)" }}>
              До бесплатной доставки не хватает {formatPrice(FREE_FROM - total)}
            </p>
          )}
        </div>

        {error && (
          <p className="rounded-lg px-3 py-2 text-sm" style={{ background: "#fdecea", color: "#b3261e" }}>
            {error}
          </p>
        )}

        <button type="submit" className="btn btn-accent w-full !py-3" disabled={submitting}>
          {submitting ? "Отправляем…" : "Заказать"}
        </button>
        <p className="text-center text-xs" style={{ color: "var(--muted)" }}>
          Или позвоните нам: {phone}
        </p>
      </form>
    </div>
  );
}
