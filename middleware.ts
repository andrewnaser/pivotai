import { NextResponse, type NextRequest } from "next/server"
import { createServerClient } from "@supabase/ssr"

function getSupabaseEnv() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (!url || !anonKey) return null
  return { url, anonKey }
}

export async function middleware(request: NextRequest) {
  const env = getSupabaseEnv()
  if (!env) return NextResponse.next()

  const response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  const supabase = createServerClient(env.url, env.anonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll()
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value, options }) => {
          response.cookies.set(name, value, options)
        })
      },
    },
  })

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const pathname = request.nextUrl.pathname
  const isHome = pathname === "/"

  const isProtected =
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/bio-links") ||
    pathname.startsWith("/scanner") ||
    pathname.startsWith("/comments") ||
    pathname.startsWith("/saved-targets") ||
    pathname.startsWith("/training") ||
    pathname.startsWith("/premium") ||
    pathname.startsWith("/campaigns") ||
    pathname.startsWith("/queue")

  if (!user && isProtected) {
    const url = request.nextUrl.clone()
    url.pathname = "/"
    url.searchParams.set("next", pathname)
    return NextResponse.redirect(url)
  }

  if (user && isHome) {
    const url = request.nextUrl.clone()
    url.pathname = "/dashboard"
    return NextResponse.redirect(url)
  }

  return response
}

export const config = {
  matcher: [
    "/",
    "/dashboard/:path*",
    "/bio-links/:path*",
    "/scanner/:path*",
    "/comments/:path*",
    "/saved-targets/:path*",
    "/training/:path*",
    "/premium/:path*",
    "/campaigns/:path*",
    "/queue/:path*",
  ],
}


