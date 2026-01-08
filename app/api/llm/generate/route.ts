import { NextResponse } from "next/server"
import { createSupabaseServerClient } from "@/lib/supabase/server"
import { callRapidApiChatGpt } from "@/lib/rapidapi/chatgpt"

type GenerateRequest = {
  postCaption: string
  niche?: string
  targetUsername?: string
  tone: string
  intent: string
  count?: number
  bioLinkHint?: string
  savedTargetId?: string
  replyChainMode?: boolean
}

function buildPrompt(input: GenerateRequest) {
  const count = Math.max(1, Math.min(input.count ?? 5, 15))

  return [
    `You are writing Instagram comments that increase curiosity and drive profile clicks.`,
    `Rules: do NOT mention "DM me". Keep it natural, human, short-to-medium. No hashtags. No links.`,
    `The goal is to get people to visit the profile and click the bio link.`,
    `Tone: ${input.tone}. Intent: ${input.intent}.`,
    input.niche ? `Niche: ${input.niche}.` : null,
    input.targetUsername ? `Original poster username: ${input.targetUsername}.` : null,
    input.bioLinkHint ? `Bio link hint (what the profile offers): ${input.bioLinkHint}.` : null,
    input.replyChainMode
      ? `Reply-chain mode: make comments that could be followed by a short reply if someone asks "how?".`
      : null,
    `Post caption/context:\n${input.postCaption}`,
    "",
    `Return ONLY valid JSON.`,
    `Schema: { "comments": string[] }`,
    `Generate exactly ${count} comments.`,
  ]
    .filter(Boolean)
    .join("\n")
}

function parseComments(result: string): string[] {
  // First, clean up the result (remove markdown code blocks if present)
  let cleaned = result.trim()
  
  // Remove markdown code fences
  cleaned = cleaned.replace(/^```json\s*/i, '').replace(/^```\s*/, '').replace(/```\s*$/, '')
  
  // Preferred: JSON output
  try {
    const parsed = JSON.parse(cleaned) as { comments?: unknown }
    if (Array.isArray(parsed.comments)) {
      return parsed.comments.filter((x): x is string => typeof x === "string").filter(Boolean)
    }
  } catch (e) {
    console.error("JSON parse failed:", e, "Raw result:", result.slice(0, 200))
    // fall back below
  }

  // Fallback: line-splitting
  return result
    .split("\n")
    .map((s) => s.trim())
    .filter(Boolean)
    .filter(line => !line.startsWith('```') && !line.startsWith('{') && !line.startsWith('}'))
    .slice(0, 15)
}

export async function POST(req: Request) {
  let body: GenerateRequest
  try {
    body = (await req.json()) as GenerateRequest
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 })
  }

  if (!body?.postCaption || !body?.tone || !body?.intent) {
    return NextResponse.json(
      { error: "Missing required fields: postCaption, tone, intent" },
      { status: 400 }
    )
  }

  const supabase = await createSupabaseServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const prompt = buildPrompt(body)
  
  let result: string
  try {
    result = await callRapidApiChatGpt([{ role: "user", content: prompt }])
  } catch (e) {
    console.error("ChatGPT API error:", e)
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Failed to generate comments from ChatGPT" },
      { status: 500 }
    )
  }
  
  const texts = parseComments(result)
  
  if (texts.length === 0) {
    return NextResponse.json(
      { error: "ChatGPT returned no valid comments. Raw response: " + result.slice(0, 100) },
      { status: 500 }
    )
  }

  const comments = texts.map((text) => ({
    text,
    tone: body.tone,
    intent: body.intent,
  }))

  // Best-effort persistence (requires running supabase/SETUP_SQL.sql)
  if (comments.length > 0) {
    const { error } = await supabase.from("generated_comments").insert(
      comments.map((c) => ({
        user_id: user.id,
        platform: "instagram",
        tone: c.tone,
        intent: c.intent,
        text: c.text,
        saved_target_id: body.savedTargetId ?? null,
        meta: {
          niche: body.niche ?? null,
          targetUsername: body.targetUsername ?? null,
          replyChainMode: !!body.replyChainMode,
          postCaption: body.postCaption,
        },
      }))
    )

    if (error) {
      // Don’t fail the response; just return a warning.
      return NextResponse.json({ comments, warning: error.message }, { status: 200 })
    }
  }

  return NextResponse.json({ comments }, { status: 200 })
}


