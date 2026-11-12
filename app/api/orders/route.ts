import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@supabase/supabase-js";

type IncomingItem = {
  product_id?: unknown;
  name?: unknown;
  price?: unknown;
  unit?: unknown;
  quantity?: unknown;
};

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => null);
    if (!body || typeof body !== "object") {
      return NextResponse.json({ error: "Некорректный запрос" }, { status: 400 });
    }

    const { customer_name, phone, address, comment, delivery, total, items } = body as Record<string, unknown>;

    if (typeof customer_name !== "string" || customer_name.trim().length < 2) {
      return NextResponse.json({ error: "Укажите имя" }, { status: 400 });
    }
    if (typeof phone !== "string" || phone.replace(/\D/g, "").length < 10) {
      return NextResponse.json({ error: "Укажите телефон" }, { status: 400 });
    }
    if (typeof address !== "string" || address.trim().length < 3) {
      return NextResponse.json({ error: "Укажите адрес" }, { status: 400 });
    }
    if (delivery !== "delivery" && delivery !== "pickup") {
      return NextResponse.json({ error: "Выберите способ получения" }, { status: 400 });
    }
    if (typeof total !== "number" || total <= 0) {
      return NextResponse.json({ error: "Некорректная сумма заказа" }, { status: 400 });
    }
    if (!Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: "Корзина пуста" }, { status: 400 });
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    );

    const { data: order, error: orderError } = await supabase
      .from("orders")
      .insert({
        customer_name: customer_name.trim().slice(0, 120),
        phone: phone.trim().slice(0, 30),
        address: address.trim().slice(0, 300),
        comment: typeof comment === "string" ? comment.trim().slice(0, 500) : "",
        delivery,
        total,
      })
      .select("id")
      .single();
    if (orderError || !order) {
      return NextResponse.json({ error: "Не удалось сохранить заказ" }, { status: 500 });
    }

    const rows = (items as IncomingItem[]).map((item) => {
      const qty = Number(item.quantity);
      return {
        order_id: order.id,
        product_id: typeof item.product_id === "string" ? item.product_id : null,
        name: String(item.name ?? "").slice(0, 200),
        price: Number(item.price),
        unit: String(item.unit ?? "кг"),
        quantity: Math.round(qty * 1000) / 1000,
      };
    });

    const { error: itemsError } = await supabase.from("order_items").insert(rows);
    if (itemsError) {
      return NextResponse.json({ error: "Не удалось сохранить состав заказа" }, { status: 500 });
    }

    return NextResponse.json({ ok: true, order_id: order.id });
  } catch {
    return NextResponse.json({ error: "Внутренняя ошибка, попробуйте ещё раз" }, { status: 500 });
  }
}
