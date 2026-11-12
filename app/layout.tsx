import type { Metadata } from "next";
import { Manrope } from "next/font/google";
import "./globals.css";

const manrope = Manrope({
  subsets: ["latin", "cyrillic"],
  weight: ["400", "600", "700", "800"],
  variable: "--font-manrope",
});

export const metadata: Metadata = {
  title: "Рыбный день — свежая рыба и морепродукты с доставкой",
  description:
    "Свежая рыба, икра и морепродукты с доставкой. Гарантия качества, доставка в день заказа.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru" className={manrope.variable}>
      <body>{children}</body>
    </html>
  );
}
