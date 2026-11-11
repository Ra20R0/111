import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // PGlite грузит WASM-файлы с диска — не бандлим его
  serverExternalPackages: ["@electric-sql/pglite", "exceljs"],
  // Шрифты для картинок-превью читаются с диска — их надо положить в серверную сборку
  outputFileTracingIncludes: { "/**/*": ["./lib/fonts/**"] },
  experimental: {
    // Загрузка Excel-файлов через server action
    serverActions: { bodySizeLimit: "10mb" },
  },
};

export default nextConfig;
