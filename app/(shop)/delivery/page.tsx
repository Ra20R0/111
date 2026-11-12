const PHONE = "+7 (900) 123-45-67";

export default function DeliveryPage() {
  return (
    <div className="container py-12">
      <div className="mx-auto max-w-3xl">
        <h1 className="mb-8 text-3xl font-extrabold md:text-4xl">Доставка и оплата</h1>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="card p-6">
            <div className="mb-2 text-3xl">🚚</div>
            <h2 className="mb-2 text-xl font-extrabold">Доставка</h2>
            <ul className="space-y-2 text-[15px]" style={{ color: "var(--muted)" }}>
              <li>Заказы принимаем ежедневно с 9:00 до 18:00.</li>
              <li>Заказали до 14:00 — доставим сегодня же.</li>
              <li>Стоимость доставки — 350 ₽, от 3 000 ₽ — бесплатно.</li>
              <li>Привозим в термобоксах — продукты остаются свежими.</li>
            </ul>
          </div>

          <div className="card p-6">
            <div className="mb-2 text-3xl">🛍️</div>
            <h2 className="mb-2 text-xl font-extrabold">Самовывоз</h2>
            <ul className="space-y-2 text-[15px]" style={{ color: "var(--muted)" }}>
              <li>Можно забрать заказ в день оформления.</li>
              <li>Минимальная сумма заказа — 1 000 ₽.</li>
              <li>Соберём и подготовим заказ к вашему приходу.</li>
            </ul>
          </div>

          <div className="card p-6">
            <div className="mb-2 text-3xl">💳</div>
            <h2 className="mb-2 text-xl font-extrabold">Оплата</h2>
            <ul className="space-y-2 text-[15px]" style={{ color: "var(--muted)" }}>
              <li>Наличными курьеру при получении.</li>
              <li>Картой курьеру или онлайн после подтверждения.</li>
              <li>Для организаций — по счёту.</li>
            </ul>
          </div>

          <div className="card p-6">
            <div className="mb-2 text-3xl">✅</div>
            <h2 className="mb-2 text-xl font-extrabold">Гарантия качества</h2>
            <ul className="space-y-2 text-[15px]" style={{ color: "var(--muted)" }}>
              <li>Не понравилось качество — вернём деньги.</li>
              <li>Каждая партия проходит проверку при приёмке.</li>
              <li>Хранение и доставка — при правильной температуре.</li>
            </ul>
          </div>
        </div>

        <p className="mt-8 text-center" style={{ color: "var(--muted)" }}>
          Остались вопросы? Позвоните нам:{" "}
          <a href={`tel:${PHONE.replace(/[^+\d]/g, "")}`} className="font-bold" style={{ color: "var(--brand)" }}>
            {PHONE}
          </a>
        </p>
      </div>
    </div>
  );
}
