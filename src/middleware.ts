import { type NextRequest, NextResponse } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";
import { defaultLocale, isLocale } from "@/lib/i18n";

function pathnameNeedsLocale(pathname: string) {
  if (
    pathname.startsWith("/admin") ||
    pathname.startsWith("/portal") ||
    pathname.startsWith("/login") ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/_next")
  ) {
    return false;
  }
  return true;
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathnameNeedsLocale(pathname)) {
    const segment = pathname.split("/").filter(Boolean)[0];
    const hasLocale = segment && isLocale(segment);

    if (!hasLocale) {
      const cookieLocale = request.cookies.get("locale")?.value;
      const header = request.headers.get("accept-language") || "";
      const prefersArabic = header.toLowerCase().includes("ar");
      const locale =
        cookieLocale && isLocale(cookieLocale)
          ? cookieLocale
          : prefersArabic
            ? "ar"
            : defaultLocale;

      const url = request.nextUrl.clone();
      url.pathname =
        pathname === "/" ? `/${locale}` : `/${locale}${pathname}`;
      const response = NextResponse.redirect(url);
      response.cookies.set("locale", locale, { path: "/" });
      return response;
    }

    // Public locale pages: no Supabase round-trip (was 300–1600ms)
    const response = NextResponse.next();
    response.cookies.set("locale", segment!, { path: "/" });
    return response;
  }

  return updateSession(request);
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|avif|mp4|webm)$).*)",
  ],
};
