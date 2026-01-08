const INSTAGRAM_MASTER_HOST = "instagram-master-api-2025.p.rapidapi.com"
const INSTAGRAM_MASTER_BASE_URL = `https://${INSTAGRAM_MASTER_HOST}`

function getRapidApiKey() {
  const direct = process.env.RAPIDAPI_INSTAGRAM_MASTER_KEY
  const fallback = process.env.RAPIDAPI_KEY
  const key = direct ?? fallback
  if (!key) {
    throw new Error(
      "Missing RapidAPI key. Set RAPIDAPI_INSTAGRAM_MASTER_KEY (preferred) or RAPIDAPI_KEY in your environment."
    )
  }
  const source = direct ? "RAPIDAPI_INSTAGRAM_MASTER_KEY" : "RAPIDAPI_KEY"
  const last4 = key.length >= 4 ? key.slice(-4) : "????"
  return { key, source, last4 }
}

export async function callInstagramMasterApi(path: string, params?: Record<string, string | number | boolean | undefined>) {
  const { key, source, last4 } = getRapidApiKey()

  const url = new URL(`${INSTAGRAM_MASTER_BASE_URL}${path.startsWith("/") ? path : `/${path}`}`)
  if (params) {
    Object.entries(params).forEach(([k, v]) => {
      if (v === undefined) return
      url.searchParams.set(k, String(v))
    })
  }

  const res = await fetch(url, {
    method: "GET",
    headers: {
      "x-rapidapi-key": key,
      "x-rapidapi-host": INSTAGRAM_MASTER_HOST,
    },
    // Some RapidAPI endpoints can be slow; avoid premature aborts.
    cache: "no-store",
  })

  const text = await res.text()
  let json: unknown = null
  try {
    json = JSON.parse(text) as unknown
  } catch {
    // ignore
  }

  if (!res.ok) {
    throw new Error(
      `Instagram Master API failed (${res.status}) for ${url.pathname} [key=${source}…${last4}]: ${
        typeof json === "object" && json ? JSON.stringify(json).slice(0, 200) : text.slice(0, 200)
      }`
    )
  }

  return json
}

export type InstagramMasterHashtag = {
  allow_following: boolean
  id: string
  media_count: number
  name: string
  profile_pic_url: string | null
}

export type InstagramMasterSearchHashtagsResponse = {
  data: {
    count: number
    items: InstagramMasterHashtag[]
  }
}

export async function searchHashtags(query: string) {
  const q = query.trim()
  if (!q) throw new Error("searchHashtags requires a non-empty query")

  const json = (await callInstagramMasterApi("/search/hashtags", { query: q })) as InstagramMasterSearchHashtagsResponse
  const items = Array.isArray(json?.data?.items) ? json.data.items : []
  return { count: Number(json?.data?.count ?? items.length) || items.length, items }
}

export async function hashtagMedia(hashtag: string, sortBy: "top" | "recent") {
  const tag = hashtag.trim().replace(/^#/, "").replace(/\s+/g, "")
  if (!tag) throw new Error("hashtagMedia requires a non-empty hashtag")
  return await callInstagramMasterApi("/hashtag/media", { hashtag: tag, sort_by: sortBy })
}

