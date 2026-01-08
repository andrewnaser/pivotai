"use client"

import { useEffect, useMemo, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CopyButton } from "@/components/copy-button"
import { formatNumber } from "@/lib/utils"
import { ExternalLink, MessageSquare, RefreshCw, Sparkles, Zap } from "lucide-react"

type SelectedTarget = {
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

type Generated = {
  targetId: number
  comments: string[]
  error?: string
}

const tones = [
  { id: "curious", name: "Curious" },
  { id: "relatable", name: "Relatable" },
  { id: "authority", name: "Authority" },
  { id: "question", name: "Question" },
  { id: "shock", name: "Shock" },
]

const intents = [
  { id: "profile", name: "Pull to Profile" },
  { id: "bio", name: "Check Bio" },
  { id: "conversation", name: "Start Conversation" },
]

function safeParseTargets(raw: string | null): SelectedTarget[] {
  if (!raw) return []
  try {
    const parsed = JSON.parse(raw) as unknown
    return Array.isArray(parsed) ? (parsed as SelectedTarget[]) : []
  } catch {
    return []
  }
}

export default function CommentsBatchPage() {
  const [targets, setTargets] = useState<SelectedTarget[]>([])
  const [selectedTone, setSelectedTone] = useState<string>("curious")
  const [selectedIntent, setSelectedIntent] = useState<string>("profile")
  const [countPerPost, setCountPerPost] = useState<number>(3)
  const [generating, setGenerating] = useState(false)
  const [results, setResults] = useState<Record<number, Generated>>({})
  const [error, setError] = useState<string | null>(null)

  const toneLabel = useMemo(() => tones.find((t) => t.id === selectedTone)?.name ?? "Curious", [selectedTone])
  const intentLabel = useMemo(() => intents.find((i) => i.id === selectedIntent)?.name ?? "Pull to Profile", [selectedIntent])

  useEffect(() => {
    const raw = typeof window !== "undefined" ? window.sessionStorage.getItem("pivot_selected_targets") : null
    const parsed = safeParseTargets(raw)
    setTargets(parsed)
  }, [])

  const openTarget = (url: string | null) => {
    if (!url) return
    window.open(url, "_blank", "noopener,noreferrer")
  }

  const generateAll = async () => {
    if (targets.length === 0) return
    setGenerating(true)
    setError(null)
    setResults({})
    try {
      // Sequential generation to avoid rate limits.
      for (const t of targets) {
        try {
          const res = await fetch("/api/llm/generate", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              postCaption: t.caption,
              tone: toneLabel,
              intent: intentLabel,
              count: Math.max(1, Math.min(countPerPost, 10)),
              targetUsername: (t.igUsername ?? t.author)?.replace(/^@/, "") ?? undefined,
            }),
          })
          const json = (await res.json()) as { comments?: Array<{ text: string }>; error?: string }
          if (!res.ok) throw new Error(json?.error || `Request failed (${res.status})`)
          const texts = (json.comments ?? []).map((c) => c.text).filter(Boolean)
          setResults((prev) => ({ ...prev, [t.id]: { targetId: t.id, comments: texts } }))
        } catch (e) {
          setResults((prev) => ({
            ...prev,
            [t.id]: { targetId: t.id, comments: [], error: e instanceof Error ? e.message : "Failed to generate" },
          }))
        }
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Batch generation failed")
    } finally {
      setGenerating(false)
    }
  }

  if (targets.length === 0) {
    return (
      <div className="space-y-6 animate-slide-up">
        <div>
          <h1 className="text-3xl font-bold">Batch Comments</h1>
          <p className="text-muted-foreground">Select targets in Goldmine Finder first, then come back here.</p>
        </div>
        <Card className="glass">
          <CardContent className="p-6 text-sm text-muted-foreground">
            No selected targets found. Go to <span className="text-foreground">/scanner</span>, select a few posts, then click
            “Generate comments (selected)”.
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6 animate-slide-up">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Batch Comments</h1>
          <p className="text-muted-foreground">Generate comments for {targets.length} selected targets.</p>
        </div>
        <Button onClick={generateAll} disabled={generating}>
          <Zap className="h-4 w-4" />
          {generating ? "Generating..." : "Generate all"}
        </Button>
      </div>

      <Card className="glass">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            Batch Settings
          </CardTitle>
          <CardDescription>One tone/intent applied to all selected posts.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap gap-2">
            {tones.map((t) => (
              <Button
                key={t.id}
                size="sm"
                variant={selectedTone === t.id ? "default" : "secondary"}
                onClick={() => setSelectedTone(t.id)}
              >
                {t.name}
              </Button>
            ))}
          </div>
          <div className="flex flex-wrap gap-2">
            {intents.map((i) => (
              <Button
                key={i.id}
                size="sm"
                variant={selectedIntent === i.id ? "default" : "secondary"}
                onClick={() => setSelectedIntent(i.id)}
              >
                {i.name}
              </Button>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="secondary">Per post: {countPerPost}</Badge>
            <Button variant="ghost" size="sm" onClick={() => setCountPerPost((c) => Math.max(1, c - 1))}>
              -
            </Button>
            <Button variant="ghost" size="sm" onClick={() => setCountPerPost((c) => Math.min(10, c + 1))}>
              +
            </Button>
          </div>
        </CardContent>
      </Card>

      {error && (
        <Card className="glass border-destructive/30">
          <CardContent className="py-6">
            <p className="text-sm font-medium text-destructive">Batch failed</p>
            <p className="mt-1 text-sm text-muted-foreground">{error}</p>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4">
        {targets.map((t) => {
          const r = results[t.id]
          return (
            <Card key={t.id} className="glass">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge variant="secondary">{t.platform}</Badge>
                      <Badge variant="secondary">{formatNumber(t.views)} views</Badge>
                      <Badge variant={t.viralScore >= 90 ? "success" : "default"}>{t.viralScore}</Badge>
                    </div>
                    <CardTitle
                      style={{
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                      }}
                    >
                      {t.caption}
                    </CardTitle>
                    <CardDescription>by {t.author}</CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="sm" disabled={!t.targetUrl} onClick={() => openTarget(t.targetUrl)}>
                      <ExternalLink className="h-4 w-4" />
                      Open
                    </Button>
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={async () => {
                        // regenerate just this one
                        setResults((prev) => ({ ...prev, [t.id]: { targetId: t.id, comments: [] } }))
                        try {
                          const res = await fetch("/api/llm/generate", {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({
                              postCaption: t.caption,
                              tone: toneLabel,
                              intent: intentLabel,
                              count: Math.max(1, Math.min(countPerPost, 10)),
                              targetUsername: (t.igUsername ?? t.author)?.replace(/^@/, "") ?? undefined,
                            }),
                          })
                          const json = (await res.json()) as { comments?: Array<{ text: string }>; error?: string }
                          if (!res.ok) throw new Error(json?.error || `Request failed (${res.status})`)
                          const texts = (json.comments ?? []).map((c) => c.text).filter(Boolean)
                          setResults((prev) => ({ ...prev, [t.id]: { targetId: t.id, comments: texts } }))
                        } catch (e) {
                          setResults((prev) => ({
                            ...prev,
                            [t.id]: {
                              targetId: t.id,
                              comments: [],
                              error: e instanceof Error ? e.message : "Failed to regenerate",
                            },
                          }))
                        }
                      }}
                      disabled={generating}
                    >
                      <RefreshCw className="h-4 w-4" />
                      Regenerate
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-2">
                {!r && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <MessageSquare className="h-4 w-4" />
                    Not generated yet
                  </div>
                )}
                {r?.error && (
                  <div className="text-sm text-destructive">
                    {r.error}
                  </div>
                )}
                {(r?.comments ?? []).map((c, idx) => (
                  <div key={idx} className="flex items-start gap-2 rounded-lg border border-border bg-muted/20 p-3">
                    <MessageSquare className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                    <p className="flex-1 text-sm">{c}</p>
                    <CopyButton text={c} size="icon" />
                  </div>
                ))}
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}





