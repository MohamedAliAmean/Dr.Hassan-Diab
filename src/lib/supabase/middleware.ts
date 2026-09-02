import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import type { Profile } from "@/types/database";

const ROLE_COOKIE = "hd_role";
const ROLE_MAX_AGE = 60 * 60; // 1 hour

function isProtectedPath(pathname: string) {
  return (
    pathname.startsWith("/admin") ||
    pathname.startsWith("/portal") ||
    pathname === "/login"
  );
}

export async function updateSession(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Public / API routes: zero network auth calls (critical for fast navigation)
  if (!isProtectedPath(pathname)) {
    return NextResponse.next({ request });
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) {
    return NextResponse.next({ request });
  }

  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(url, key, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) =>
          request.cookies.set(name, value)
        );
        supabaseResponse = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) =>
          supabaseResponse.cookies.set(name, value, options)
        );
      },
    },
  });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (pathname.startsWith("/admin") || pathname.startsWith("/portal")) {
    if (!user) {
      const redirectUrl = request.nextUrl.clone();
      redirectUrl.pathname = "/login";
      redirectUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(redirectUrl);
    }

    let role = request.cookies.get(ROLE_COOKIE)?.value as
      | Profile["role"]
      | undefined;

    if (role !== "admin" && role !== "client") {
      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();

      role = (profile as Pick<Profile, "role"> | null)?.role;
      if (role === "admin" || role === "client") {
        supabaseResponse.cookies.set(ROLE_COOKIE, role, {
          path: "/",
          maxAge: ROLE_MAX_AGE,
          sameSite: "lax",
        });
      }
    }

    if (pathname.startsWith("/admin") && role !== "admin") {
      const redirectUrl = request.nextUrl.clone();
      redirectUrl.pathname = "/portal";
      return NextResponse.redirect(redirectUrl);
    }
  }

  if (pathname === "/login" && user) {
    let role = request.cookies.get(ROLE_COOKIE)?.value as
      | Profile["role"]
      | undefined;

    if (role !== "admin" && role !== "client") {
      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();
      role = (profile as Pick<Profile, "role"> | null)?.role;
    }

    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = role === "admin" ? "/admin" : "/portal";
    const response = NextResponse.redirect(redirectUrl);
    if (role === "admin" || role === "client") {
      response.cookies.set(ROLE_COOKIE, role, {
        path: "/",
        maxAge: ROLE_MAX_AGE,
        sameSite: "lax",
      });
    }
    return response;
  }

  return supabaseResponse;
}
