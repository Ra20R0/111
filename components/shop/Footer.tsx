import Link from "next/link";

export function Footer({ phone, address, hours }: { phone: string; address: string; hours: string }) {
  return (
    <footer className="mt-16 border-t" style={{ background: "var(--ink)", color: "#fff", borderColor: "transparent" }}>
      <div className="container grid gap-8 py-10 md:grid-cols-3">
        <div>
          <div className="mb-3 text-xl font-extrabold">
            Рыбный<span style={{ color: "var(--gold)" }}> день</span>
          </div>
          <p className="text-sm opacity-80">
            Свежая рыба, икра и морепродукты с доставкой. Гарантия качества или вернём деньги.
          </p>
        </div>
        <div className="text-sm">
          <div className="mb-3 font-bold">Магазин</div>
          <ul className="space-y-2 opacity-90">
            <li>
              <Link href="/catalog" className="hover:underline">
                Каталог
              </Link>
            </li>
            <li>
              <Link href="/delivery" className="hover:underline">
                Доставка и оплата
              </Link>
            </li>
            <li>
              <Link href="/contacts" className="hover:underline">
                Контакты
              </Link>
            </li>
            <li>
              <Link href="/cart" className="hover:underline">
                Корзина
              </Link>
            </li>
          </ul>
        </div>
        <div className="text-sm">
          <div className="mb-3 font-bold">Связаться</div>
          <ul className="space-y-2 opacity-90">
            <li>
              <a href={`tel:${phone.replace(/[^+\d]/g, "")}`} className="text-base font-bold hover:underline">
                {phone}
              </a>
            </li>
            <li>{hours}</li>
            <li>{address}</li>
          </ul>
        </div>
      </div>
      <div className="container border-t py-4 text-center text-xs opacity-70" style={{ borderColor: "rgb(255 255 255 / 0.15)" }}>
        © {new Date().getFullYear()} Рыбный день. Цены на сайте носят справочный характер.
      </div>
    </footer>
  );
}
