import { NextResponse } from "next/server"
import { createSupabaseServerClient } from "@/lib/supabase/server"

type BulkSaveBody = {
  targets: Array<{
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
  }>
}

export async function POST(req: Request) {
  const supabase = await createSupabaseServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  let body: BulkSaveBody
  try {
    body = (await req.json()) as BulkSaveBody
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 })
  }

  if (!Array.isArray(body.targets) || body.targets.length === 0) {
    return NextResponse.json({ error: "Missing required field: targets[]" }, { status: 400 })
  }

  const rows = body.targets.slice(0, 100).map((t) => ({
    user_id: user.id,
    platform: (t.platform ?? "instagram").toLowerCase(),
    kind: t.kind ?? "media",
    query: t.query ?? null,
    ig_media_id: t.ig_media_id ?? null,
    ig_shortcode: t.ig_shortcode ?? null,
    ig_username: t.ig_username ?? null,
    caption: t.caption ?? null,
    thumbnail_url: t.thumbnail_url ?? null,
    permalink: t.permalink ?? null,
    metrics: t.metrics ?? {},
  }))

  const { data, error } = await supabase.from("saved_targets").insert(rows).select("*")
  if (error) {
    return NextResponse.json(
      {
        error: error.message,
        hint: "If this says the table doesn't exist, run supabase/SETUP_SQL.sql in your Supabase SQL editor.",
      },
      { status: 500 }
    )
  }

  return NextResponse.json({ inserted: data?.length ?? 0, targets: data ?? [] }, { status: 200 })
}






