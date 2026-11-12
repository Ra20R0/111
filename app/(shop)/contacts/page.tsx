const PHONE = "+7 (900) 123-45-67";
const HOURS = "Пн–Вс: с 9:00 до 20:00 без выходных";
const ADDRESS = "г. Москва, Рыбный рынок, 1-й ряд, павильон 12";
const EMAIL = "zakaz@rybnyy-den.ru";

export default function ContactsPage() {
  return (
    <div className="container py-12">
      <div className="mx-auto max-w-3xl">
        <h1 className="mb-8 text-3xl font-extrabold md:text-4xl">Контакты</h1>

        <div className="card mb-6 grid gap-6 p-8 md:grid-cols-2">
          <div className="space-y-4">
            <div>
              <div className="text-sm font-bold" style={{ color: "var(--muted)" }}>Телефон</div>
              <a href={`tel:${PHONE.replace(/[^+\d]/g, "")}`} className="text-2xl font-extrabold" style={{ color: "var(--brand)" }}>
                {PHONE}
              </a>
            </div>
            <div>
              <div className="text-sm font-bold" style={{ color: "var(--muted)" }}>Режим работы</div>
              <div className="font-semibold">{HOURS}</div>
            </div>
          </div>
          <div className="space-y-4">
            <div>
              <div className="text-sm font-bold" style={{ color: "var(--muted)" }}>Адрес</div>
              <div className="font-semibold">{ADDRESS}</div>
            </div>
            <div>
              <div className="text-sm font-bold" style={{ color: "var(--muted)" }}>E-mail</div>
              <a href={`mailto:${EMAIL}`} className="font-semibold" style={{ color: "var(--brand)" }}>
                {EMAIL}
              </a>
            </div>
          </div>
        </div>

        <div className="card p-8 text-center" style={{ color: "var(--muted)" }}>
          Здесь скоро появится карта — как только пришлёте точный адрес магазина, добавлю её.
        </div>
      </div>
    </div>
  );
}
