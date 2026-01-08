import { NextResponse } from "next/server"
import { createSupabaseServerClient } from "@/lib/supabase/server"

type SaveTargetBody = {
  platform?: "instagram" | string
  kind?: "media" | "hashtag" | "user" | string
  query?: string | null
  ig_media_id?: string | null
  ig_shortcode?: string | null
  ig_username?: string | null
  caption?: string | null
  thumbnail_url?: string | null
  permalink?: string | null
  metrics?: Record<string, unknown> | null
}

export async function GET() {
  const supabase = await createSupabaseServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const { data, error } = await supabase
    .from("saved_targets")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(200)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({ targets: data ?? [] }, { status: 200 })
}

export async function POST(req: Request) {
  const supabase = await createSupabaseServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  let body: SaveTargetBody
  try {
    body = (await req.json()) as SaveTargetBody
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 })
  }

  const payload = {
    user_id: user.id,
    platform: (body.platform ?? "instagram").toLowerCase(),
    kind: body.kind ?? "media",
    query: body.query ?? null,
    ig_media_id: body.ig_media_id ?? null,
    ig_shortcode: body.ig_shortcode ?? null,
    ig_username: body.ig_username ?? null,
    caption: body.caption ?? null,
    thumbnail_url: body.thumbnail_url ?? null,
    permalink: body.permalink ?? null,
    metrics: body.metrics ?? {},
  }

  const { data, error } = await supabase.from("saved_targets").insert(payload).select("*").single()
  if (error) {
    return NextResponse.json(
      {
        error: error.message,
        hint: "If this says the table doesn't exist, run supabase/SETUP_SQL.sql in your Supabase SQL editor.",
      },
      { status: 500 }
    )
  }

  return NextResponse.json({ target: data }, { status: 200 })
}





