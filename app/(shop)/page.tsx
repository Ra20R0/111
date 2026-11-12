import Link from "next/link";
import Image from "next/image";
import { fetchCategories, fetchProducts } from "@/lib/supabase-shop";
import { formatPrice } from "@/lib/shop";
import { ProductCard } from "@/components/shop/ProductCard";

export const dynamic = "force-dynamic";

const PHONE = "+7 (900) 123-45-67";
const HOURS = "Пн–Вс: с 9:00 до 20:00 без выходных";
const ADDRESS = "г. Москва, Рыбный рынок, 1-й ряд, павильон 12";

const ADVANTAGES = [
  { icon: "🐟", title: "Свежесть каждое утро", text: "Привозим продукцию с утра — к открытию магазина всё уже на витрине." },
  { icon: "❄️", title: "Доставка в термобоксах", text: "Сохраняем свежесть и температуру от магазина до вашей двери." },
  { icon: "✅", title: "Гарантия качества", text: "Не понравилось? Вернём деньги без лишних вопросов." },
  { icon: "🚚", title: "Доставка в день заказа", text: "Заказали до 14:00 — доставим сегодня же." },
];

export default function HomePage() {
  return <HomeInner />;
}

async function HomeInner() {
  const [categories, products] = await Promise.all([fetchCategories(), fetchProducts()]);
  const promo = products.filter((p) => p.is_promo).slice(0, 4);
  const novelties = products.filter((p) => p.is_new).slice(0, 4);
  const bestsellers = products.filter((p) => !p.is_promo && !p.is_new).slice(0, 8);

  return (
    <>
      <section className="relative overflow-hidden" style={{ background: "var(--brand)" }}>
        <Image
          src="https://images.pexels.com/photos/6149078/pexels-photo-6149078.jpeg?auto=compress&cs=tinysrgb&h=650&w=940"
          alt="Свежая рыба на льду"
          fill
          priority
          className="object-cover opacity-25"
        />
        <div className="container relative grid gap-6 py-16 md:py-24">
          <div className="max-w-2xl text-white">
            <h1 className="text-4xl font-extrabold leading-tight md:text-5xl">
              Свежая рыба и морепродукты с доставкой
            </h1>
            <p className="mt-4 text-lg opacity-90">
              Каждое утро — свежий улов. Доставка по городу в день заказа, гарантия качества или
              вернём деньги.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/catalog" className="btn btn-accent !px-7 !py-3 !text-base">
                Перейти в каталог
              </Link>
              <a href={`tel:${PHONE.replace(/[^+\d]/g, "")}`} className="btn btn-outline !border-white/60 !px-7 !py-3 !text-base !text-white hover:!bg-white/10">
                {PHONE}
              </a>
            </div>
          </div>
          <div className="flex flex-wrap gap-3 text-sm font-semibold text-white">
            <span className="badge" style={{ background: "rgb(255 255 255 / 0.2)", color: "#fff" }}>
              Бесплатная доставка от {formatPrice(3000)}
            </span>
            <span className="badge" style={{ background: "rgb(255 255 255 / 0.2)", color: "#fff" }}>
              Доставка в термобоксах
            </span>
          </div>
        </div>
      </section>

      <section className="container py-12">
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {ADVANTAGES.map((a) => (
            <div key={a.title} className="card p-5">
              <div className="mb-2 text-2xl">{a.icon}</div>
              <div className="font-bold">{a.title}</div>
              <p className="mt-1 text-sm" style={{ color: "var(--muted)" }}>
                {a.text}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="container pb-4">
        <h2 className="mb-5 text-2xl font-extrabold md:text-3xl">Категории</h2>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {categories.map((c) => (
            <Link key={c.id} href={`/catalog?category=${c.slug}`} className="card flex items-center gap-3 p-5 font-bold">
              <span className="flex h-10 w-10 items-center justify-center rounded-full text-lg" style={{ background: "var(--bg)" }}>
                {c.slug === "ryba" ? "🐟" : c.slug === "ikra" ? "🍤" : c.slug === "moreprodukty" ? "🦐" : "🔥"}
              </span>
              {c.name}
            </Link>
          ))}
        </div>
      </section>

      {promo.length > 0 && (
        <section className="container py-8">
          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-2xl font-extrabold md:text-3xl">Акции и скидки</h2>
            <Link href="/catalog" className="font-semibold hover:underline" style={{ color: "var(--brand)" }}>
              Показать всё →
            </Link>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {promo.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}

      <section className="container py-8">
        <h2 className="mb-5 text-2xl font-extrabold md:text-3xl">Популярные товары</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {bestsellers.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>

      {novelties.length > 0 && (
        <section className="container py-8">
          <h2 className="mb-5 text-2xl font-extrabold md:text-3xl">Новинки</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {novelties.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </>
  );
}
