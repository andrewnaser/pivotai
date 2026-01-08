import { NextResponse } from "next/server"
import { createSupabaseServerClient } from "@/lib/supabase/server"

export async function GET(
  req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params
  const supabase = await createSupabaseServerClient()

  const { data, error } = await supabase
    .from("public_bio_pages")
    .select("id,affiliate_url")
    .eq("slug", slug)
    .maybeSingle()

  if (error || !data) {
    return NextResponse.redirect(new URL("/", req.url))
  }

  const headers = new Headers(req.headers)
  const referrer = headers.get("referer")
  const userAgent = headers.get("user-agent")
  const forwardedFor = headers.get("x-forwarded-for")
  const ip = forwardedFor ? forwardedFor.split(",")[0]?.trim() : null

  // Best-effort click insert (RLS allows public inserts)
  await supabase.from("public_bio_clicks").insert({
    public_bio_page_id: data.id,
    referrer,
    user_agent: userAgent,
    ip,
  })

  return NextResponse.redirect(data.affiliate_url)
}


