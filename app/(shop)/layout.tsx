import { Header } from "@/components/shop/Header";
import { Footer } from "@/components/shop/Footer";
import { CartProvider } from "@/components/shop/CartContext";

const PHONE = "+7 (900) 123-45-67";
const HOURS = "Пн–Вс: с 9:00 до 20:00 без выходных";
const ADDRESS = "г. Москва, Рыбный рынок, 1-й ряд, павильон 12";

export default function ShopLayout({ children }: { children: React.ReactNode }) {
  return (
    <CartProvider>
      <div className="flex min-h-screen flex-col">
        <Header phone={PHONE} hours={HOURS} />
        <main className="flex-1">{children}</main>
        <Footer phone={PHONE} address={ADDRESS} hours={HOURS} />
      </div>
    </CartProvider>
  );
}
