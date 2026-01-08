"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { ProgressIndicator } from "@/components/progress-indicator"
import {
  Target,
  Search,
  TrendingUp,
  Flame,
  Clock,
  ExternalLink,
  MessageSquare,
  Bookmark,
  Eye,
  Heart,
  Share2,
} from "lucide-react"
import { formatNumber } from "@/lib/utils"

interface ScanResult {
  id: number
  platform: string
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

export default function ScannerPage() {
  const router = useRouter()
  const [results, setResults] = useState<ScanResult[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [meta, setMeta] = useState<{ provider?: string; endpoint?: string; sortBy?: string; hashtag?: string } | null>(
    null
  )
  const [savingIds, setSavingIds] = useState<Set<number>>(() => new Set())
  const [savedIds, setSavedIds] = useState<Set<number>>(() => new Set())
  const [savedCount, setSavedCount] = useState<number>(0)
  const [selectedIds, setSelectedIds] = useState<Set<number>>(() => new Set())
  const [bulkSaving, setBulkSaving] = useState(false)
  const [lastSelectedIndex, setLastSelectedIndex] = useState<number | null>(null)
  const [filters, setFilters] = useState({
    niche: "",
    filter: "viral",
    language: "en",
  })

  useEffect(() => {
    // Best-effort: fetch current saved targets count so the counter feels real,
    // then keep it updated optimistically as user saves from scanner.
    let cancelled = false
    fetch("/api/targets", { method: "GET" })
      .then(async (res) => {
        const json = (await res.json()) as { targets?: Array<unknown>; error?: string }
        if (!res.ok) return
        if (!cancelled && Array.isArray(json.targets)) setSavedCount(json.targets.length)
      })
      .catch(() => {
        // ignore
      })
    return () => {
      cancelled = true
    }
  }, [])

  const handleScan = async () => {
    setLoading(true)
    setError(null)
    setResults([])
    setMeta(null)
    setSelectedIds(new Set())
    setLastSelectedIndex(null)
    try {
      const res = await fetch("/api/scanner/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          niche: filters.niche,
          filter: filters.filter,
          language: filters.language,
          limit: 15,
        }),
      })

      const json = (await res.json()) as {
        targets?: ScanResult[]
        meta?: { provider?: string; endpoint?: string; sortBy?: string; hashtag?: string }
        error?: string
      }
      if (!res.ok) throw new Error(json?.error || `Request failed (${res.status})`)
      if (!Array.isArray(json.targets)) throw new Error("Invalid response shape")

      setResults(json.targets)
      setMeta(json.meta ?? null)
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to scan targets")
    } finally {
      setLoading(false)
    }
  }

  const saveTarget = (id: number) => {
    const t = results.find((x) => x.id === id)
    if (!t) return
    if (savedIds.has(id)) return

    setSavingIds((prev) => new Set(prev).add(id))
    fetch("/api/targets", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        platform: "instagram",
        kind: "media",
        query: filters.niche,
        ig_media_id: t.igMediaId,
        ig_shortcode: t.igShortcode,
        ig_username: (t.igUsername ?? t.author)?.replace(/^@/, "") ?? null,
        caption: t.caption,
        thumbnail_url: t.thumbnailUrl,
        permalink: t.targetUrl,
        metrics: {
          views: t.views,
          likes: t.likes,
          comments: t.comments,
          shares: t.shares,
          viralScore: t.viralScore,
          freshness: t.freshness,
          source: meta ?? null,
        },
      }),
    })
      .then(async (res) => {
        const json = (await res.json()) as { error?: string }
        if (!res.ok) throw new Error(json?.error || `Save failed (${res.status})`)
        setSavedIds((prev) => new Set(prev).add(id))
        setSavedCount((c) => c + 1)
      })
      .catch((e) => setError(e instanceof Error ? e.message : "Failed to save target"))
      .finally(() => {
        setSavingIds((prev) => {
          const next = new Set(prev)
          next.delete(id)
          return next
        })
      })
  }

  const openTarget = (url: string | null) => {
    if (!url) return
    window.open(url, "_blank", "noopener,noreferrer")
  }

  const setSelectedAtIndex = (index: number, checked: boolean, shiftKey: boolean) => {
    setSelectedIds((prev) => {
      const next = new Set(prev)
      const apply = (i: number) => {
        const id = results[i]?.id
        if (!id) return
        if (checked) next.add(id)
        else next.delete(id)
      }

      if (shiftKey && lastSelectedIndex !== null) {
        const a = Math.min(lastSelectedIndex, index)
        const b = Math.max(lastSelectedIndex, index)
        for (let i = a; i <= b; i++) apply(i)
      } else {
        apply(index)
      }

      return next
    })
    setLastSelectedIndex(index)
  }

  const selectAll = () => {
    setSelectedIds(new Set(results.map((r) => r.id)))
  }

  const clearSelected = () => setSelectedIds(new Set())

  const saveSelected = async () => {
    const selected = results.filter((r) => selectedIds.has(r.id) && !savedIds.has(r.id))
    if (selected.length === 0) return
    setBulkSaving(true)
    setError(null)
    try {
      const res = await fetch("/api/targets/bulk", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          targets: selected.map((t) => ({
            platform: "instagram",
            kind: "media",
            query: filters.niche,
            ig_media_id: t.igMediaId,
            ig_shortcode: t.igShortcode,
            ig_username: (t.igUsername ?? t.author)?.replace(/^@/, "") ?? null,
            caption: t.caption,
            thumbnail_url: t.thumbnailUrl,
            permalink: t.targetUrl,
            metrics: {
              views: t.views,
              likes: t.likes,
              comments: t.comments,
              shares: t.shares,
              viralScore: t.viralScore,
              freshness: t.freshness,
              source: meta ?? null,
            },
          })),
        }),
      })
      const json = (await res.json()) as { error?: string }
      if (!res.ok) throw new Error(json?.error || `Bulk save failed (${res.status})`)
      setSavedIds((prev) => {
        const next = new Set(prev)
        selected.forEach((x) => next.add(x.id))
        return next
      })
      setSavedCount((c) => c + selected.length)
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to save selected targets")
    } finally {
      setBulkSaving(false)
    }
  }

  const generateSelected = () => {
    const selected = results.filter((r) => selectedIds.has(r.id))
    if (selected.length === 0) return
    try {
      sessionStorage.setItem("pivot_selected_targets", JSON.stringify(selected))
    } catch {
      // ignore
    }
    router.push("/comments/batch")
  }

  const worthIt = (t: ScanResult) => {
    const views = Math.max(0, t.views || 0)
    const engagement = Math.max(0, (t.likes || 0) + (t.comments || 0) + (t.shares || 0))
    const er = views > 0 ? engagement / views : 0
    const goodViews = views >= 10_000
    const goodEr = er >= 0.02
    const goodScore = (t.viralScore || 0) >= 85
    const ok = (goodViews && goodEr) || goodScore
    return { ok, er }
  }

  const generateFromTarget = (t: ScanResult) => {
    const params = new URLSearchParams()
    params.set("caption", t.caption)
    if (t.author) params.set("author", t.author)
    if (t.targetUrl) params.set("url", t.targetUrl)
    router.push(`/comments?${params.toString()}`)
  }

  return (
    <div className="space-y-6 animate-slide-up">
      {/* Progress Indicator */}
      <ProgressIndicator currentStep={2} />

      {/* Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 bg-purple-500/20 border border-purple-500/30 rounded-full px-4 py-2 mb-2">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold">
            2
          </div>
          <span className="text-purple-400 font-bold">STEP 2 OF 3</span>
        </div>
        <h1 className="text-3xl font-bold text-white">Find Viral Posts</h1>
        <p className="text-gray-300 text-lg">
          We'll find popular posts for you - just tell us what you want
        </p>
      </div>

      {/* Scan Controls */}
      <Card className="glass-strong border-2 border-white/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-2xl text-white">
            <Search className="h-6 w-6 text-purple-500" />
            Find Popular Posts (Super Easy!)
          </CardTitle>
          <CardDescription className="text-gray-300 text-base">Just type what you want and we'll find viral posts for you</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Niche Input */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-purple-500 flex items-center justify-center text-white text-sm font-bold">
                1
              </div>
              <label className="text-lg font-bold text-white">Type what you want to find</label>
            </div>
            <Input
              placeholder="Example: fitness, make money online, dating advice"
              value={filters.niche}
              onChange={(e) => setFilters({ ...filters, niche: e.target.value })}
              className="text-lg py-6 bg-white/5 border-white/20 text-white"
            />
            <p className="text-sm text-gray-400 flex items-center gap-2">
              💡 Tip: Keep it simple like "weight loss" or "crypto tips"
            </p>
          </div>

          {/* Show Posts */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-purple-500 flex items-center justify-center text-white text-sm font-bold">
                2
              </div>
              <label className="text-lg font-bold text-white">What kind of posts do you want?</label>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button
                variant={filters.filter === "viral" ? "default" : "secondary"}
                size="lg"
                onClick={() => setFilters({ ...filters, filter: "viral" })}
                className={filters.filter === "viral" ? "bg-gradient-to-r from-purple-500 to-pink-500" : ""}
              >
                <Flame className="mr-2 h-5 w-5" />
                Popular Posts (Best!)
              </Button>
              <Button
                variant={filters.filter === "fresh" ? "default" : "secondary"}
                size="lg"
                onClick={() => setFilters({ ...filters, filter: "fresh" })}
                className={filters.filter === "fresh" ? "bg-gradient-to-r from-purple-500 to-pink-500" : ""}
              >
                <Clock className="mr-2 h-5 w-5" />
                New Posts
              </Button>
            </div>
            <p className="text-sm text-gray-400">
              💡 Choose "Popular Posts" - they get more views = more money for you!
            </p>
          </div>

          <Button
            onClick={handleScan}
            disabled={!filters.niche || loading}
            className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold text-xl py-8 hover:scale-105 transition-transform"
            size="lg"
          >
            <Search className="mr-2 h-6 w-6" />
            {loading ? "Finding Posts..." : "Find Posts For Me!"}
          </Button>
        </CardContent>
      </Card>

      {/* Results */}
      {loading && (
        <Card className="glass-strong border-2 border-white/20">
          <CardContent className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-4 border-purple-500 border-t-transparent" />
              <p className="text-white font-bold text-lg">Finding popular posts for you...</p>
              <p className="text-gray-400 text-sm mt-2">This takes about 10 seconds</p>
            </div>
          </CardContent>
        </Card>
      )}

      {error && !loading && (
        <Card className="glass-strong border-2 border-red-500/30 bg-red-500/10">
          <CardContent className="py-6">
            <p className="text-base font-bold text-red-300">😕 Oops! Something went wrong</p>
            <p className="mt-2 text-sm text-red-200">{error}</p>
            <p className="mt-2 text-sm text-gray-400">Try again or use different keywords</p>
          </CardContent>
        </Card>
      )}

      {results.length > 0 && !loading && (
        <>
          <div className="flex items-center justify-between bg-green-500/10 border border-green-500/30 rounded-lg p-4">
            <div className="space-y-1">
              <p className="text-lg font-bold text-green-400">
                ✅ Found {results.length} popular posts!
              </p>
              <p className="text-sm text-gray-300">
                ⚡ <strong>Pro Tip:</strong> Check multiple posts, then click "Bulk Generate Comments" to create comments for all of them at once!
              </p>
            </div>
            <Badge className="bg-green-500/20 text-green-400 border-green-500/30 text-base px-3 py-1">
              <TrendingUp className="mr-2 h-4 w-4" />
              High Traffic Posts
            </Badge>
          </div>

          {/* Bulk actions */}
          <Card className="glass-strong sticky top-0 z-30 border-2 border-purple-500/30 bg-black/80 backdrop-blur-xl">
            <CardContent className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="text-base text-white font-bold flex flex-wrap items-center gap-x-4 gap-y-1">
                <span>
                  ✅ You selected: <span className="text-purple-400">{selectedIds.size} posts</span>
                </span>
                <span className="text-sm text-gray-400">
                  (💡 Tip: Check the boxes on posts you like)
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button 
                  variant="secondary" 
                  size="sm" 
                  onClick={selectAll} 
                  disabled={selectedIds.size === results.length}
                  className="bg-white/10 hover:bg-white/20"
                >
                  Select All {results.length}
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={clearSelected} 
                  disabled={selectedIds.size === 0}
                  className="text-gray-300"
                >
                  Clear
                </Button>
                <Button
                  size="sm"
                  onClick={saveSelected}
                  disabled={selectedIds.size === 0 || bulkSaving}
                  className="bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold"
                >
                  <Bookmark className="h-4 w-4 mr-2" />
                  {bulkSaving ? "Saving..." : `Save Selected (${selectedIds.size})`}
                </Button>
                <Button
                  size="sm"
                  onClick={generateSelected}
                  disabled={selectedIds.size === 0}
                  className="bg-gradient-to-r from-yellow-500 to-amber-600 text-white font-bold animate-pulse"
                >
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Bulk Generate Comments ({selectedIds.size})
                </Button>
              </div>
            </CardContent>
          </Card>

          <div className="grid gap-4">
            {results.map((result, index) => {
              const w = worthIt(result)
              const isPopular = result.views >= 10000
              return (
              <Card key={result.id} className="glass-strong hover:border-purple-500/50 transition-colors border-2 border-white/10">
                <CardContent className="p-4 sm:p-5">
                  <div className="flex flex-col gap-4 sm:flex-row">
                    {/* Thumbnail */}
                    <div className="relative h-32 w-full shrink-0 overflow-hidden rounded-lg bg-gradient-to-br from-purple-500/20 to-pink-500/20 sm:h-36 sm:w-56">
                      {result.thumbnailUrl ? (
                        <img
                          src={result.thumbnailUrl}
                          alt="Post preview"
                          className="absolute inset-0 h-full w-full object-cover"
                          loading="lazy"
                          referrerPolicy="no-referrer"
                          onError={(e) => {
                            (e.currentTarget as HTMLImageElement).style.display = "none"
                          }}
                        />
                      ) : null}
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Target className="h-12 w-12 text-white/50" />
                      </div>
                      <Badge className="absolute left-2 top-2 bg-purple-500 text-white border-0">Instagram</Badge>
                      {isPopular && (
                        <Badge className="absolute right-2 top-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white border-0 font-bold">
                          <Flame className="mr-1 h-3 w-3" />
                          HOT POST
                        </Badge>
                      )}
                      <label className="absolute bottom-2 left-2 inline-flex cursor-pointer select-none items-center gap-2 rounded-md border-2 border-white/30 bg-black/60 px-3 py-1.5 text-sm text-white hover:bg-black/80 font-bold">
                        <input
                          type="checkbox"
                          checked={selectedIds.has(result.id)}
                          onChange={(e) =>
                            setSelectedAtIndex(
                              index,
                              e.currentTarget.checked,
                              (e.nativeEvent as unknown as MouseEvent).shiftKey
                            )
                          }
                          className="h-4 w-4"
                        />
                        Select
                      </label>
                    </div>

                    {/* Details */}
                    <div className="flex-1 space-y-3">
                      <div>
                        <div className="mb-2 flex flex-wrap items-center gap-2">
                          {isPopular ? (
                            <Badge className="bg-green-500/20 text-green-400 border-green-500/30 font-bold">
                              ✅ Worth Commenting On
                            </Badge>
                          ) : (
                            <Badge variant="secondary" className="text-gray-400">
                              Low Traffic
                            </Badge>
                          )}
                          <Badge variant="secondary" className="text-gray-300">{result.freshness}</Badge>
                        </div>
                        <p
                          className="mb-2 font-medium leading-snug text-white text-base"
                          style={{
                            display: "-webkit-box",
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: "vertical",
                            overflow: "hidden",
                          }}
                        >
                          {result.caption}
                        </p>
                        <p className="text-sm text-gray-400">Posted by {result.author}</p>
                      </div>

                      {/* Stats */}
                      <div className="flex flex-wrap gap-4 text-sm bg-white/5 rounded-lg p-3">
                        <div className="flex items-center gap-1.5 text-gray-300">
                          <Eye className="h-4 w-4 text-purple-400" />
                          <span className="font-bold">{formatNumber(result.views)}</span>
                          <span className="text-gray-500">views</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-gray-300">
                          <Heart className="h-4 w-4 text-pink-400" />
                          <span className="font-bold">{formatNumber(result.likes)}</span>
                          <span className="text-gray-500">likes</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-gray-300">
                          <MessageSquare className="h-4 w-4 text-blue-400" />
                          <span className="font-bold">{formatNumber(result.comments)}</span>
                          <span className="text-gray-500">comments</span>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex flex-wrap gap-2">
                        <Button 
                          size="sm"
                          onClick={() => generateFromTarget(result)}
                          className="bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold"
                        >
                          <MessageSquare className="mr-2 h-4 w-4" />
                          Get Comments
                        </Button>
                        <Button
                          variant="secondary"
                          size="sm"
                          disabled={savingIds.has(result.id) || savedIds.has(result.id)}
                          onClick={() => saveTarget(result.id)}
                          className="bg-white/10 hover:bg-white/20"
                        >
                          <Bookmark className="mr-2 h-4 w-4" />
                          {savedIds.has(result.id) ? "✅ Saved" : savingIds.has(result.id) ? "Saving..." : "Save Post"}
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          disabled={!result.targetUrl}
                          onClick={() => openTarget(result.targetUrl)}
                          className="text-gray-300"
                        >
                          <ExternalLink className="mr-2 h-4 w-4" />
                          View Post
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              )
            })}
          </div>
        </>
      )}
    </div>
  )
}

