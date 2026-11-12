"use client";

import Link from "next/link";
import { useState } from "react";
import { useCart } from "./CartContext";
import { formatPrice } from "@/lib/shop";

export function Header({ phone, hours }: { phone: string; hours: string }) {
  const { count, total } = useCart();
  const [open, setOpen] = useState(false);

  const links = [
    { href: "/", label: "Главная" },
    { href: "/catalog", label: "Каталог" },
    { href: "/delivery", label: "Доставка и оплата" },
    { href: "/contacts", label: "Контакты" },
  ];

  return (
    <header className="sticky top-0 z-40 border-b bg-white/95 backdrop-blur">
      <div className="hidden border-b md:block" style={{ borderColor: "var(--line)" }}>
        <div className="container flex items-center justify-between py-1.5 text-[13px]" style={{ color: "var(--muted)" }}>
          <span>{hours}</span>
          <a href={`tel:${phone.replace(/[^+\d]/g, "")}`} className="font-bold" style={{ color: "var(--ink)" }}>
            {phone}
          </a>
        </div>
      </div>

      <div className="container flex items-center justify-between gap-4 py-3">
        <Link href="/" className="flex items-center gap-2 text-xl font-extrabold tracking-tight">
          <span
            className="flex h-9 w-9 items-center justify-center rounded-full text-lg"
            style={{ background: "var(--brand)", color: "#fff" }}
          >
            🐟
          </span>
          <span>
            Рыбный<span style={{ color: "var(--brand)" }}> день</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-6 font-semibold md:flex">
          {links.map((l) => (
            <Link key={l.href} href={l.href} className="hover:text-[var(--brand)] transition-colors">
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Link href="/cart" className="btn btn-primary relative !px-4">
            <span aria-hidden>🛒</span>
            <span className="hidden sm:inline">{total > 0 ? formatPrice(total) : "Корзина"}</span>
            {count > 0 && (
              <span
                className="absolute -right-1.5 -top-1.5 flex h-5 min-w-5 items-center justify-center rounded-full px-1 text-[11px] font-extrabold"
                style={{ background: "var(--accent)", color: "#fff" }}
              >
                {Math.round(count * 10) / 10}
              </span>
            )}
          </Link>
          <button
            className="btn btn-outline !px-3 md:hidden"
            aria-label="Меню"
            onClick={() => setOpen((v) => !v)}
          >
            ☰
          </button>
        </div>
      </div>

      {open && (
        <nav className="container flex flex-col gap-1 border-t py-3 md:hidden" style={{ borderColor: "var(--line)" }}>
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="rounded-lg px-3 py-2 font-semibold hover:bg-[var(--bg)]"
              onClick={() => setOpen(false)}
            >
              {l.label}
            </Link>
          ))}
          <a href={`tel:${phone.replace(/[^+\d]/g, "")}`} className="px-3 py-2 font-bold" style={{ color: "var(--brand)" }}>
            {phone}
          </a>
        </nav>
      )}
    </header>
  );
}
