// Script to generate DFY Vault data using Q9 Bot APIs
// Run this script to populate the vault with real Instagram data + AI comments

import { hashtagMedia } from "../lib/rapidapi/instagram-master"
import { callRapidApiChatGpt } from "../lib/rapidapi/chatgpt"

const NICHES_TO_SCAN = [
  { id: "fitness", keywords: ["fitness", "workout", "weightloss", "transformation", "gym"] },
  { id: "mmo", keywords: ["makemoneyonline", "sidehustle", "passiveincome", "entrepreneur", "digitalmarketing"] },
  { id: "dating", keywords: ["datingadvice", "relationships", "attraction", "dating", "love"] },
  { id: "crypto", keywords: ["crypto", "bitcoin", "altcoin", "trading", "investing"] },
  { id: "motivation", keywords: ["motivation", "success", "mindset", "goalsetting", "hustle"] },
  { id: "business", keywords: ["business", "startup", "entrepreneurship", "ecommerce", "marketing"] },
]

const TARGET_PER_NICHE = 50 // Total: 300 targets
const COMMENTS_PER_TARGET = 5

interface GeneratedTarget {
  niche: string
  caption: string
  author: string
  views: number
  likes: number
  comments: number
  shares: number
  viralScore: number
  permalink: string | null
  thumbnailUrl: string | null
  whyItWorks: string
  readyComments: string[]
  tags: string[]
}

async function generateComments(caption: string, niche: string): Promise<string[]> {
  const prompt = `You are writing Instagram comments that drive profile visits and bio link clicks.

Rules:
- Write ${COMMENTS_PER_TARGET} unique, natural comments
- Show curiosity, relate to the post, ask questions
- Make people check the profile for answers
- NO hashtags, NO "DM me", sound human
- Each comment should be 1-2 sentences
- Vary the tone and approach

Post: "${caption}"
Niche: ${niche}

Return ONLY valid JSON: { "comments": ["comment1", "comment2", ...] }`

  try {
    const result = await callRapidApiChatGpt([{ role: "user", content: prompt }])
    const cleaned = result.trim().replace(/^```json\s*/i, '').replace(/^```\s*/, '').replace(/```\s*$/, '')
    const parsed = JSON.parse(cleaned)
    return Array.isArray(parsed.comments) ? parsed.comments.slice(0, COMMENTS_PER_TARGET) : []
  } catch (e) {
    console.error("Failed to generate comments:", e)
    return []
  }
}

async function generateWhyItWorks(caption: string): Promise<string> {
  const prompt = `Analyze why this Instagram post is viral/engaging. Give a 1-2 sentence explanation of the psychological triggers, hooks, or tactics used.

Post: "${caption}"

Return ONLY the explanation, no JSON, no extra formatting.`

  try {
    const result = await callRapidApiChatGpt([{ role: "user", content: prompt }])
    return result.trim().slice(0, 200)
  } catch (e) {
    return "High engagement potential due to curiosity gap and relatable topic."
  }
}

function extractTags(caption: string): string[] {
  const words = caption.toLowerCase().split(/\s+/)
  const relevant = words.filter(w => w.length > 4 && !/[^a-z]/.test(w))
  return relevant.slice(0, 3)
}

function calculateViralScore(target: Partial<GeneratedTarget>): number {
  const v = Math.log10(Math.max(1, target.views || 0))
  const l = Math.log10(Math.max(1, target.likes || 0))
  const c = Math.log10(Math.max(1, target.comments || 0))
  const s = Math.log10(Math.max(1, target.shares || 0))
  const raw = v * 10 + l * 18 + c * 35 + s * 37
  return Math.max(1, Math.min(99, Math.round(raw)))
}

async function scanNiche(nicheId: string, keywords: string[]): Promise<GeneratedTarget[]> {
  console.log(`\n🔍 Scanning niche: ${nicheId}`)
  const targets: GeneratedTarget[] = []

  for (const keyword of keywords) {
    if (targets.length >= TARGET_PER_NICHE) break

    try {
      console.log(`  📡 Fetching posts for #${keyword}...`)
      const payload = await hashtagMedia(keyword, "top")
      
      // Extract items
      const items = (payload as any)?.data?.items || (payload as any)?.items || []
      console.log(`  ✅ Found ${items.length} posts`)

      for (const item of items.slice(0, 10)) {
        if (targets.length >= TARGET_PER_NICHE) break

        const caption = item?.caption?.text || item?.caption || item?.text || "Viral post"
        const username = item?.user?.username || item?.username || "instagram"
        const views = item?.play_count || item?.view_count || item?.views || 0
        const likes = item?.like_count || item?.likes || 0
        const comments = item?.comment_count || item?.comments || 0
        const shares = item?.share_count || item?.shares || 0

        if (!caption || caption.length < 10) continue

        console.log(`  💬 Generating comments for: ${caption.slice(0, 50)}...`)
        
        const [generatedComments, whyItWorks] = await Promise.all([
          generateComments(caption, nicheId),
          generateWhyItWorks(caption),
        ])

        if (generatedComments.length === 0) continue

        const target: GeneratedTarget = {
          niche: nicheId,
          caption,
          author: username.startsWith('@') ? username : `@${username}`,
          views,
          likes,
          comments,
          shares,
          viralScore: 0,
          permalink: item?.permalink || null,
          thumbnailUrl: item?.thumbnail_url || item?.display_url || null,
          whyItWorks,
          readyComments: generatedComments,
          tags: extractTags(caption),
        }

        target.viralScore = calculateViralScore(target)
        targets.push(target)

        console.log(`  ✨ Added target ${targets.length}/${TARGET_PER_NICHE}`)
        
        // Rate limiting
        await new Promise(resolve => setTimeout(resolve, 2000))
      }
    } catch (e) {
      console.error(`  ❌ Error scanning ${keyword}:`, e)
    }
  }

  return targets
}

async function generateVault() {
  console.log("🚀 Starting DFY Vault Generation...")
  console.log(`Target: ${NICHES_TO_SCAN.length} niches × ${TARGET_PER_NICHE} targets = ${NICHES_TO_SCAN.length * TARGET_PER_NICHE} total\n`)

  const allTargets: GeneratedTarget[] = []

  for (const niche of NICHES_TO_SCAN) {
    const targets = await scanNiche(niche.id, niche.keywords)
    allTargets.push(...targets)
    console.log(`✅ ${niche.id}: ${targets.length} targets generated\n`)
  }

  // Convert to TypeScript code
  const output = `// Auto-generated DFY Vault
// Generated on: ${new Date().toISOString()}
// Total targets: ${allTargets.length}

export const GENERATED_DFY_VAULT = ${JSON.stringify(allTargets, null, 2)}
`

  console.log("\n✨ Generation complete!")
  console.log(`📊 Stats:`)
  console.log(`  - Total targets: ${allTargets.length}`)
  console.log(`  - Total comments: ${allTargets.reduce((sum, t) => sum + t.readyComments.length, 0)}`)
  console.log(`  - Avg comments per target: ${(allTargets.reduce((sum, t) => sum + t.readyComments.length, 0) / allTargets.length).toFixed(1)}`)
  console.log(`\n💾 Save this to: lib/dfy-vault-generated.ts`)
  console.log(output)
}

// Run it
generateVault().catch(console.error)

export {}




