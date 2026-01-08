import { NextResponse } from "next/server"
import { hashtagMedia } from "@/lib/rapidapi/instagram-master"
import { callRapidApiChatGpt } from "@/lib/rapidapi/chatgpt"
import { createSupabaseServerClient } from "@/lib/supabase/server"

type ScannerSearchRequest = {
  niche: string
  filter?: "viral" | "fresh"
  language?: "en" | "es" | "any"
  limit?: number
}

type ScannerTarget = {
  id: number
  platform: "Instagram"
  thumbnailUrl: string | null
  targetUrl: string | null
  igMediaId: string | null
  igShortcode: string | null
  igUsername: string | null
  caption: string
  author: string
  views: number
  likes: number
  comments: number
  shares: number
  viralScore: number
  freshness: string
}

// New: Get related hashtags from ChatGPT
async function getRelatedHashtags(niche: string): Promise<string[]> {
  try {
    const prompt = `Given the niche "${niche}", list 3-5 highly related Instagram hashtags that would help find the most specific, relevant posts. Return ONLY a JSON array of hashtags without the # symbol. Example: ["fitness","workout","gym"]`
    
    const result = await callRapidApiChatGpt([{ role: "user", content: prompt }])
    const parsed = JSON.parse(result)
    
    if (Array.isArray(parsed)) {
      return parsed.map(tag => String(tag).replace(/^#/, '').trim()).filter(Boolean).slice(0, 5)
    }
    return []
  } catch {
    // Fallback: just use the niche itself
    return []
  }
}

function clampInt(n: unknown, min: number, max: number, fallback: number) {
  const parsed = typeof n === "number" ? n : Number(n)
  if (!Number.isFinite(parsed)) return fallback
  return Math.max(min, Math.min(max, Math.floor(parsed)))
}

function scoreTarget(t: Omit<ScannerTarget, "viralScore">) {
  // Simple deterministic score: heavier weight on shares/comments.
  const v = Math.log10(Math.max(1, t.views))
  const l = Math.log10(Math.max(1, t.likes))
  const c = Math.log10(Math.max(1, t.comments))
  const s = Math.log10(Math.max(1, t.shares))
  const raw = v * 10 + l * 18 + c * 35 + s * 37
  return Math.max(1, Math.min(99, Math.round(raw)))
}

function pickFirstArray(obj: unknown): unknown[] | null {
  if (!obj || typeof obj !== "object") return null
  const o = obj as Record<string, unknown>
  for (const key of ["items", "data", "posts", "media", "medias", "results"]) {
    const v = o[key]
    if (Array.isArray(v)) return v
    // common wrapper: { data: { items: [] } }
    if (v && typeof v === "object") {
      const inner = pickFirstArray(v)
      if (inner) return inner
    }
  }
  return null
}

function getString(x: unknown): string | null {
  return typeof x === "string" && x.trim() ? x.trim() : null
}

function getNumber(x: unknown): number | null {
  if (typeof x === "number" && Number.isFinite(x)) return x
  if (typeof x === "string" && x.trim()) {
    const n = Number(x)
    return Number.isFinite(n) ? n : null
  }
  return null
}

function relativeFreshnessFromUnixSeconds(sec: number, fallback: string) {
  const ms = sec * 1000
  if (!Number.isFinite(ms) || ms <= 0) return fallback
  const delta = Date.now() - ms
  const hours = Math.max(0, Math.round(delta / 36e5))
  if (hours < 1) return "Just now"
  if (hours < 24) return `${hours} hours ago`
  const days = Math.max(1, Math.round(hours / 24))
  return `${days} days ago`
}

function pickThumbnailUrl(it: Record<string, unknown>): string | null {
  const direct =
    getString(it.thumbnail_url) ||
    getString(it.thumbnailUrl) ||
    getString(it.display_url) ||
    getString(it.displayUrl) ||
    getString(it.media_url) ||
    getString(it.image_url) ||
    getString(it.imageUrl) ||
    getString(it.cover_url) ||
    getString(it.coverUrl) ||
    getString(it.preview_url) ||
    getString(it.previewUrl) ||
    null
  if (direct) return direct

  const anyIt = it as any
  const cand =
    getString(anyIt?.image_versions2?.candidates?.[0]?.url) ||
    getString(anyIt?.image_versions2?.candidates?.[1]?.url) ||
    getString(anyIt?.thumbnail_resources?.[0]?.src) ||
    getString(anyIt?.thumbnail_resources?.[anyIt?.thumbnail_resources?.length - 1]?.src) ||
    getString(anyIt?.display_resources?.[0]?.src) ||
    getString(anyIt?.display_resources?.[anyIt?.display_resources?.length - 1]?.src) ||
    getString(anyIt?.carousel_media?.[0]?.image_versions2?.candidates?.[0]?.url) ||
    getString(anyIt?.carousel_media?.[0]?.image_versions2?.candidates?.[1]?.url) ||
    getString(anyIt?.cover_media?.cropped_image_version?.url) ||
    getString(anyIt?.cover_media?.image_versions2?.candidates?.[0]?.url) ||
    null

  return cand
}

function pickTargetUrl(it: Record<string, unknown>): string | null {
  const direct = getString(it.permalink) || getString(it.url) || getString(it.link)
  if (direct) return direct

  const anyIt = it as any
  const code =
    getString(it.shortcode) ||
    getString(it.code) ||
    getString(anyIt?.media?.code) ||
    getString(anyIt?.media?.shortcode) ||
    getString(anyIt?.pk) ||
    null

  if (!code) return null

  const productType = String(anyIt?.product_type ?? anyIt?.productType ?? "").toLowerCase()
  const isReel = productType.includes("clip") || productType.includes("reel") || anyIt?.is_reel === true || anyIt?.isReel === true
  const path = isReel ? "reel" : "p"
  return `https://www.instagram.com/${path}/${code}/`
}

function pickIgMediaId(it: Record<string, unknown>): string | null {
  const direct =
    getString(it.media_id) || getString(it.mediaId) || getString(it.id) || getString(it.pk) || getString(it.ig_media_id) || null
  if (direct) return direct
  const n = getNumber(it.id) ?? getNumber(it.pk) ?? null
  return n ? String(n) : null
}

function pickIgShortcode(it: Record<string, unknown>): string | null {
  const anyIt = it as any
  return (
    getString(it.shortcode) ||
    getString(it.code) ||
    getString(anyIt?.media?.shortcode) ||
    getString(anyIt?.media?.code) ||
    null
  )
}

function mapItemToTarget(item: unknown, id: number, fallbackFreshness: string): Omit<ScannerTarget, "viralScore"> | null {
  if (!item || typeof item !== "object") return null
  const it = item as Record<string, unknown>

  // Caption/text
  const caption =
    getString(it.caption) ||
    getString(it.text) ||
    getString(it.title) ||
    getString((it.caption as any)?.text) ||
    getString((it.edge_media_to_caption as any)?.edges?.[0]?.node?.text) ||
    null

  // Author / username
  const userObj = (it.user || it.owner || it.author) as Record<string, unknown> | undefined
  const username =
    getString(it.username) ||
    getString(userObj?.username) ||
    getString(userObj?.handle) ||
    getString(it.user_name) ||
    null

  const author = username ? (username.startsWith("@") ? username : `@${username}`) : "@instagram"

  // Counts
  const views =
    getNumber(it.play_count) ??
    getNumber(it.view_count) ??
    getNumber(it.views) ??
    getNumber(it.video_view_count) ??
    getNumber(it.impressions) ??
    0
  const likes =
    getNumber(it.like_count) ??
    getNumber(it.likes) ??
    getNumber((it.edge_media_preview_like as any)?.count) ??
    0
  const comments =
    getNumber(it.comment_count) ??
    getNumber(it.comments) ??
    getNumber((it.edge_media_to_comment as any)?.count) ??
    0
  const shares = getNumber(it.share_count) ?? getNumber(it.shares) ?? getNumber(it.reshare_count) ?? 0

  // Freshness
  const takenAt =
    getNumber(it.taken_at) ??
    getNumber(it.taken_at_timestamp) ??
    getNumber(it.created_time) ??
    getNumber(it.timestamp) ??
    null
  const freshness = takenAt ? relativeFreshnessFromUnixSeconds(takenAt, fallbackFreshness) : fallbackFreshness

  return {
    id,
    platform: "Instagram",
    thumbnailUrl: pickThumbnailUrl(it),
    targetUrl: pickTargetUrl(it),
    igMediaId: pickIgMediaId(it),
    igShortcode: pickIgShortcode(it),
    igUsername: username,
    caption: caption ?? "Viral Instagram post",
    author,
    views: clampInt(views, 0, 500000000, 0),
    likes: clampInt(likes, 0, 500000000, 0),
    comments: clampInt(comments, 0, 500000000, 0),
    shares: clampInt(shares, 0, 500000000, 0),
    freshness,
  }
}

export async function POST(req: Request) {
  // Require auth (page is protected anyway, keep API consistent)
  const supabase = await createSupabaseServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  let body: ScannerSearchRequest
  try {
    body = (await req.json()) as ScannerSearchRequest
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 })
  }

  const niche = (body?.niche ?? "").trim()
  if (!niche) return NextResponse.json({ error: "Missing required field: niche" }, { status: 400 })

  const filter: "viral" | "fresh" = body.filter === "fresh" ? "fresh" : "viral"
  const limit = clampInt(body.limit, 1, 30, 15)

  // Instagram Master API 2025 (RapidAPI) — with hashtag expansion
  const sortBy: "top" | "recent" = filter === "fresh" ? "recent" : "top"

  // Step 1: Get related hashtags for better specificity
  const relatedTags = await getRelatedHashtags(niche)
  const allHashtags = [niche, ...relatedTags].slice(0, 3) // Use up to 3 hashtags

  let allTargets: Omit<ScannerTarget, "viralScore">[] = []
  
  // Step 2: Search each hashtag and combine results
  for (const hashtag of allHashtags) {
    try {
      const payload = await hashtagMedia(hashtag, sortBy)
      const items = pickFirstArray(payload) ?? []
      const nowIdBase = Date.now() + allTargets.length
      const fallbackFreshness = filter === "fresh" ? "Recently" : "Top"

      const targets = items
        .slice(0, Math.ceil(limit / allHashtags.length))
        .map((it, idx) => mapItemToTarget(it, nowIdBase + idx, fallbackFreshness))
        .filter((x): x is Omit<ScannerTarget, "viralScore"> => !!x)
      
      allTargets.push(...targets)
    } catch (e) {
      console.error(`Failed to fetch hashtag ${hashtag}:`, e)
      // Continue with other hashtags
    }
  }

  // Step 3: Score, dedupe by caption similarity, and sort
  const seen = new Set<string>()
  const uniqueTargets = allTargets
    .filter((t) => {
      const key = t.caption.slice(0, 50).toLowerCase()
      if (seen.has(key)) return false
      seen.add(key)
      return true
    })
    .map((base) => ({ ...base, viralScore: scoreTarget(base) }))
    .sort((a, b) => b.viralScore - a.viralScore)
    .slice(0, limit)

  return NextResponse.json(
    {
      meta: {
        provider: "instagram-master-api-2025",
        endpoint: "/hashtag/media",
        sortBy,
        hashtags: allHashtags,
        searchedHashtags: relatedTags.length > 0 ? relatedTags : ["main search only"],
        returned: uniqueTargets.length,
      },
      targets: uniqueTargets,
    },
    { status: 200 }
  )
}


