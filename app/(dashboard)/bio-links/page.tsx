"use client"

import { useEffect, useMemo, useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { CopyButton } from "@/components/copy-button"
import { SuccessCelebration } from "@/components/success-celebration"
import { ProgressIndicator } from "@/components/progress-indicator"
import { createSupabaseBrowserClient } from "@/lib/supabase/browser"
import {
  Link2,
  CheckCircle2,
  HelpCircle,
  ArrowRight,
  Lightbulb,
  ExternalLink,
} from "lucide-react"

interface BioLink {
  id: string
  title: string
  affiliate_url: string
  slug: string
  created_at: string
  clicks: number
}

type PublicBioRow = {
  id: string
  title: string
  affiliate_url: string
  slug: string
  created_at: string
  public_bio_clicks?: Array<{ count: number }>
}

function slugify(input: string) {
  return input
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
}

export default function BioLinksPage() {
  const [bioLinks, setBioLinks] = useState<BioLink[]>([])
  const [affiliateLink, setAffiliateLink] = useState("")
  const [linkName, setLinkName] = useState("")
  const [loading, setLoading] = useState(true)
  const [creating, setCreating] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showSuccess, setShowSuccess] = useState(false)

  const origin = useMemo(() => {
    if (typeof window === "undefined") return ""
    return window.location.origin
  }, [])

  const loadLinks = async () => {
    setError(null)
    setLoading(true)
    try {
      const supabase = createSupabaseBrowserClient()
      const { data: userRes, error: userErr } = await supabase.auth.getUser()
      if (userErr) throw userErr
      if (!userRes.user) throw new Error("Not logged in")

      const { data, error: selectErr } = await supabase
        .from("public_bio_pages")
        .select("id,title,affiliate_url,slug,created_at,public_bio_clicks(count)")
        .eq("user_id", userRes.user.id)
        .order("created_at", { ascending: false })

      if (selectErr) throw selectErr

      const mapped = ((data ?? []) as PublicBioRow[]).map((row) => {
        const clickCount =
          Array.isArray(row.public_bio_clicks) && row.public_bio_clicks[0]?.count != null
            ? Number(row.public_bio_clicks[0].count)
            : 0
        return {
          id: row.id as string,
          title: row.title as string,
          affiliate_url: row.affiliate_url as string,
          slug: row.slug as string,
          created_at: row.created_at as string,
          clicks: clickCount,
        } satisfies BioLink
      })

      setBioLinks(mapped)
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed to load links")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadLinks()
  }, [])

  const handleCreate = async () => {
    if (!affiliateLink || !linkName) return
    setError(null)
    setCreating(true)
    try {
      const supabase = createSupabaseBrowserClient()
      const { data: userRes, error: userErr } = await supabase.auth.getUser()
      if (userErr) throw userErr
      if (!userRes.user) throw new Error("Not logged in")

      const baseSlug = slugify(linkName)
      if (!baseSlug) throw new Error("Pick a name with letters/numbers")

      // Try a few slug variants to avoid collisions.
      const candidates = [baseSlug, `${baseSlug}-2`, `${baseSlug}-3`, `${baseSlug}-4`, `${baseSlug}-5`]
      let inserted: { id: string; title: string; affiliate_url: string; slug: string; created_at: string } | null = null
      let lastErr: string | null = null

      for (const slug of candidates) {
        const { data, error: insErr } = await supabase
          .from("public_bio_pages")
          .insert({
            user_id: userRes.user.id,
            title: linkName,
            affiliate_url: affiliateLink,
            slug,
          })
          .select("id,title,affiliate_url,slug,created_at")
          .single()

        if (!insErr && data) {
          inserted = data
          break
        }
        lastErr = insErr?.message ?? "Insert failed"
      }

      if (!inserted) throw new Error(lastErr ?? "Failed to create")

      setAffiliateLink("")
      setLinkName("")
      await loadLinks()
      setShowSuccess(true) // Show celebration!
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed to create link")
    } finally {
      setCreating(false)
    }
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Success Celebration */}
      <SuccessCelebration
        show={showSuccess}
        title="🎉 Step 1 Complete!"
        message="Your money link is ready! Now let's find viral posts to comment on."
        nextStepText="Go to Step 2: Find Viral Posts"
        nextStepHref="/scanner"
        onClose={() => setShowSuccess(false)}
      />

      {/* Progress Indicator */}
      <ProgressIndicator currentStep={1} />
      {/* Step Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-2"
      >
        <div className="inline-flex items-center gap-2 bg-green-500/20 border border-green-500/30 rounded-full px-4 py-2 mb-2">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center text-white font-bold">
            1
          </div>
          <span className="text-green-400 font-bold">STEP 1 OF 3</span>
        </div>
        <h1 className="text-3xl font-bold text-white">
          Create Your Money Link
        </h1>
        <p className="text-gray-300 text-lg">
          This is the link people will click to make you money
        </p>
      </motion.div>

      {/* What Is This? */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card className="glass-strong border-2 border-cyan-500/30 bg-cyan-500/5">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <HelpCircle className="h-8 w-8 text-cyan-400 shrink-0" />
              <div>
                <h3 className="text-lg font-bold text-white mb-2">
                  💡 What is a &quot;Money Link&quot;?
                </h3>
                <p className="text-gray-300 mb-3">
                  It&apos;s a simple page that sends people to your affiliate offer. When they buy something, you make money!
                </p>
                <div className="bg-black/30 rounded-lg p-3 space-y-2 text-sm">
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-green-400 shrink-0 mt-0.5" />
                    <span className="text-gray-300">You paste YOUR affiliate link below</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-green-400 shrink-0 mt-0.5" />
                    <span className="text-gray-300">We create a clean page for you</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-green-400 shrink-0 mt-0.5" />
                    <span className="text-gray-300">You put this link in your social media bio</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-green-400 shrink-0 mt-0.5" />
                    <span className="text-gray-300">People click it and you earn money! 💰</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Simple Creation Form */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card className="glass-strong border-2 border-white/20">
          <CardHeader>
            <CardTitle className="text-2xl text-white">
              👇 Create Your Money Link (Super Easy!)
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Step 1: Name */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center text-white text-sm font-bold">
                  1
                </div>
                <label className="text-lg font-bold text-white">
                  Give it a simple name (just for you to remember)
                </label>
              </div>
              <Input
                placeholder="Example: My Fitness Offer"
                value={linkName}
                onChange={(e) => setLinkName(e.target.value)}
                className="text-lg py-6 bg-white/5 border-white/20 text-white"
              />
              <p className="text-sm text-gray-400 flex items-center gap-2">
                <Lightbulb className="h-4 w-4 text-yellow-400" />
                Tip: Use something simple like &quot;Weight Loss Link&quot; or &quot;Money Course Link&quot;
              </p>
            </div>

            {/* Step 2: Affiliate Link */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center text-white text-sm font-bold">
                  2
                </div>
                <label className="text-lg font-bold text-white">
                  Paste your affiliate link here
                </label>
              </div>
              <Input
                placeholder="https://your-affiliate-link.com/referral/12345"
                value={affiliateLink}
                onChange={(e) => setAffiliateLink(e.target.value)}
                className="text-lg py-6 bg-white/5 border-white/20 text-white font-mono"
              />
              <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
                <div className="flex items-start gap-2">
                  <HelpCircle className="h-5 w-5 text-yellow-400 shrink-0 mt-0.5" />
                  <div className="text-sm space-y-2">
                    <p className="font-bold text-yellow-400">Where do I get an affiliate link?</p>
                    <p className="text-gray-300">
                      You get this from the product/course you&apos;re promoting. It&apos;s usually a long link with your ID in it.
                      Look for &quot;Affiliate Link&quot;, &quot;Referral Link&quot;, or &quot;Your Link&quot; in your affiliate dashboard.
                    </p>
                    <p className="text-gray-400 text-xs">
                      Example: https://clickbank.net/hop/product?tid=USERNAME or https://warriorplus.com/o2/a/abc123
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Create Button */}
            <Button
              onClick={handleCreate}
              disabled={!affiliateLink || !linkName || creating}
              className="w-full bg-gradient-to-r from-green-500 to-emerald-500 text-white font-bold text-xl py-8 hover:scale-105 transition-transform disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <CheckCircle2 className="h-6 w-6 mr-2" />
              {creating ? "Creating..." : "Create My Money Link"}
              <ArrowRight className="h-6 w-6 ml-2" />
            </Button>

            {error && (
              <div className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
                {error}
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Your Money Links */}
      {!loading && bioLinks.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <CheckCircle2 className="h-6 w-6 text-green-400" />
            Your Money Links
          </h2>
          
          {bioLinks.map((link) => {
            const publicUrl = origin ? `${origin}/b/${link.slug}` : `/b/${link.slug}`
            return (
            <Card key={link.id} className="glass-strong border-2 border-green-500/30 bg-green-500/5">
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-xl font-bold text-white mb-1">{link.title}</h3>
                      <p className="text-sm text-gray-400">Created {new Date(link.created_at).toLocaleString()}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-green-400">{link.clicks}</div>
                      <div className="text-xs text-gray-400">clicks</div>
                    </div>
                  </div>

                  {/* Your Bio Link */}
                  <div className="bg-black/30 rounded-lg p-4 space-y-2">
                    <p className="text-sm font-bold text-green-400">
                      ✅ YOUR MONEY LINK (Copy this!)
                    </p>
                    <div className="flex items-center gap-2">
                      <code className="flex-1 bg-white/5 px-3 py-2 rounded text-sm text-white break-all">
                        {publicUrl}
                      </code>
                      <CopyButton text={publicUrl} />
                    </div>
                    <p className="text-xs text-gray-400">
                      👆 Put this link in your Instagram bio
                    </p>
                  </div>

                  {/* Where it goes */}
                  <div className="bg-white/5 rounded-lg p-4">
                    <p className="text-sm font-bold text-gray-400 mb-2">
                      This link sends people to:
                    </p>
                    <div className="flex items-center gap-2">
                      <code className="flex-1 text-xs text-gray-500 break-all">
                        {link.affiliate_url}
                      </code>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="shrink-0"
                        onClick={() => window.open(link.affiliate_url, "_blank")}
                      >
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            )
          })}

          {/* Next Step */}
          <Card className="glass-strong border-2 border-purple-500/30 bg-purple-500/5">
            <CardContent className="p-6 text-center">
              <CheckCircle2 className="h-12 w-12 text-green-400 mx-auto mb-3" />
              <h3 className="text-xl font-bold text-white mb-2">
                ✅ Step 1 Complete!
              </h3>
              <p className="text-gray-300 mb-4">
                Great job! Now let&apos;s find viral posts to comment on
              </p>
              <Button
                onClick={() => window.location.href = '/scanner'}
                className="bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold text-lg py-6 px-8"
              >
                Go to Step 2: Find Viral Posts
                <ArrowRight className="h-5 w-5 ml-2" />
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Help Section */}
      {!loading && bioLinks.length === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="glass-strong border-2 border-cyan-500/30 bg-cyan-500/5">
            <CardContent className="p-6">
              <div className="flex items-start gap-4 mb-4">
                <Lightbulb className="h-8 w-8 text-cyan-400 shrink-0" />
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-white mb-2">
                    💡 Real Example - See How Easy It Is!
                  </h3>
                  <p className="text-gray-300 mb-3">
                    Here's how Sarah created her money link in under 2 minutes:
                  </p>
                  <div className="bg-black/30 rounded-lg p-4 space-y-3 text-sm">
                    <div>
                      <span className="font-bold text-green-400">Name:</span>
                      <span className="text-gray-300 ml-2">"My Weight Loss Program"</span>
                    </div>
                    <div>
                      <span className="font-bold text-green-400">Affiliate Link:</span>
                      <span className="text-gray-300 ml-2 break-all">
                        https://clickbank.net/hop/loseweight?tid=SARAH
                      </span>
                    </div>
                    <div className="pt-2 border-t border-white/10">
                      <span className="text-yellow-400 font-bold">✨ Result:</span>
                      <span className="text-gray-300 ml-2">Sarah made $847 in her first week!</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Social Proof */}
              <div className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/20 rounded-lg p-4 text-center">
                <p className="text-green-400 font-bold text-sm">
                  ✨ 8,234 money links created today • Average earnings: $1,283/month
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {loading && (
        <Card className="glass-strong border-2 border-white/10">
          <CardContent className="p-6 text-center text-sm text-gray-300">
            Loading your Money Links...
          </CardContent>
        </Card>
      )}
    </div>
  )
}
