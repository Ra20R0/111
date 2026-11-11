import { NextResponse, type NextRequest } from "next/server";
import { ADMIN_COOKIE, readSession, type AdminSession } from "@/lib/session";

/** Middleware требует абсолютный адрес; он выполняется на краю сети и видит настоящий адрес запроса. */
function redirectWithin(req: NextRequest, pathname: string) {
  const url = req.nextUrl.clone();
  url.pathname = pathname;
  url.search = "";
  return NextResponse.redirect(url);
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  if (pathname === "/admin/login") return NextResponse.next();
  const session = await readSession<AdminSession>(req.cookies.get(ADMIN_COOKIE)?.value, "admin");
  if (!session) {
    if (pathname.startsWith("/api/")) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
    return redirectWithin(req, "/admin/login");
  }
  // Курьер видит только доставку
  if (session.role === "courier" && pathname.startsWith("/admin") && !pathname.startsWith("/admin/delivery")) {
    return redirectWithin(req, "/admin/delivery");
  }
  return NextResponse.next();
}

export const config = { matcher: ["/admin/:path*", "/api/admin/:path*"] };
