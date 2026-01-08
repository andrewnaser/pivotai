"use client"

import { Suspense, useEffect, useMemo, useState } from "react"
import { useSearchParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CopyButton } from "@/components/copy-button"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { ProgressIndicator } from "@/components/progress-indicator"
import { copyToClipboard } from "@/lib/utils"
import {
  MessageSquare,
  Sparkles,
  RefreshCw,
  Zap,
  CheckCircle2,
  ExternalLink,
} from "lucide-react"

interface Comment {
  id: number
  text: string
  tone: string
  intent: string
  variations: number
}

const tones = [
  { id: "curious", name: "Curious", icon: "🤔", description: "Build intrigue" },
  { id: "relatable", name: "Relatable", icon: "🙋", description: "Connect personally" },
  { id: "authority", name: "Authority", icon: "👔", description: "Expert positioning" },
  { id: "question", name: "Question", icon: "❓", description: "Engage conversation" },
  { id: "shock", name: "Shock", icon: "😱", description: "Pattern interrupt" },
]

const intents = [
  { id: "profile", name: "Pull to Profile", description: "Direct to bio link" },
  { id: "bio", name: "Check Bio", description: "Explicit bio mention" },
  { id: "conversation", name: "Start Conversation", description: "Build engagement" },
]

function CommentsInner() {
  const searchParams = useSearchParams()
  const [selectedTone, setSelectedTone] = useState<string | null>("curious") // Default to curious
  const [selectedIntent, setSelectedIntent] = useState<string | null>("profile") // Default to profile
  const [comments, setComments] = useState<Comment[]>([])
  const [generating, setGenerating] = useState(false)
  const [replyChainMode, setReplyChainMode] = useState(false)
  const [postCaption, setPostCaption] = useState("")
  const [targetUrl, setTargetUrl] = useState<string | null>(null)
  const [targetAuthor, setTargetAuthor] = useState<string | null>(null)
  const [savedTargetId, setSavedTargetId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const caption = searchParams.get("caption")
    const url = searchParams.get("url")
    const author = searchParams.get("author")
    const sid = searchParams.get("savedTargetId")
    if (caption && !postCaption) setPostCaption(caption)
    if (url) setTargetUrl(url)
    if (author) setTargetAuthor(author)
    if (sid) setSavedTargetId(sid)
    // only run on initial mount / param change
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams])

  const toneLabel = useMemo(() => {
    const t = tones.find((x) => x.id === selectedTone)
    return t?.name ?? "Unknown"
  }, [selectedTone])

  const intentLabel = useMemo(() => {
    const i = intents.find((x) => x.id === selectedIntent)
    return i?.name ?? "Unknown"
  }, [selectedIntent])

  const generateComments = async (count = 5) => {
    if (!selectedTone || !selectedIntent || !postCaption.trim()) return
    setGenerating(true)
    setError(null)
    try {
      const res = await fetch("/api/llm/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          postCaption,
          tone: toneLabel,
          intent: intentLabel,
          count,
          replyChainMode,
          savedTargetId,
          targetUsername: targetAuthor?.replace(/^@/, "") ?? undefined,
        }),
      })

      const json = (await res.json()) as {
        comments?: Array<{ text: string; tone: string; intent: string }>
        error?: string
        warning?: string
      }

      if (!res.ok) throw new Error(json.error ?? "Failed to generate comments")

      const next = (json.comments ?? []).map((c, idx) => ({
        id: Date.now() + idx,
        text: c.text,
        tone: c.tone,
        intent: c.intent,
        variations: 5,
      }))

      setComments(next)

      if (json.warning) {
        // Usually means tables not created yet in Supabase; still usable.
        setError(json.warning)
      }
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed to generate comments")
    } finally {
      setGenerating(false)
    }
  }

  const regenerateComment = async (id: number) => {
    if (!selectedTone || !selectedIntent || !postCaption.trim()) return
    try {
      const res = await fetch("/api/llm/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          postCaption,
          tone: toneLabel,
          intent: intentLabel,
          count: 1,
          replyChainMode,
        }),
      })
      const json = (await res.json()) as {
        comments?: Array<{ text: string; tone: string; intent: string }>
        error?: string
      }
      if (!res.ok) throw new Error(json.error ?? "Failed to regenerate")

      const newText = json.comments?.[0]?.text
      if (!newText) return
      setComments((prev) => prev.map((c) => (c.id === id ? { ...c, text: newText } : c)))
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed to regenerate")
    }
  }

  const generateVariations = async () => {
    await generateComments(10)
  }

  return (
    <div className="space-y-6 animate-slide-up">
      {/* Progress Indicator */}
      <ProgressIndicator currentStep={3} />

      {/* Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 bg-yellow-500/20 border border-yellow-500/30 rounded-full px-4 py-2 mb-2">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-yellow-500 to-amber-500 flex items-center justify-center text-white font-bold">
            3
          </div>
          <span className="text-yellow-400 font-bold">STEP 3 OF 3</span>
        </div>
        <h1 className="text-3xl font-bold text-white">Copy Comments</h1>
        <p className="text-gray-300 text-lg">
          We write the comments for you - just copy and paste them!
        </p>
      </div>

      {/* Generation Controls */}
      <Card className="glass-strong border-2 border-white/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-2xl text-white">
            <Sparkles className="h-6 w-6 text-yellow-500" />
            Generate Your Comments (Super Easy!)
          </CardTitle>
          <CardDescription className="text-gray-300 text-base">
            We'll write perfect comments for you - just fill this out and click Generate
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {(targetUrl || targetAuthor) && (
            <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-border bg-muted/20 p-4">
              <div className="text-sm text-muted-foreground">
                {targetAuthor ? (
                  <span>
                    Target: <span className="text-foreground">{targetAuthor}</span>
                  </span>
                ) : (
                  <span>Target loaded from Goldmine Finder</span>
                )}
              </div>
              {targetUrl && (
                <Button variant="ghost" size="sm" onClick={() => window.open(targetUrl, "_blank", "noopener,noreferrer")}>
                  <ExternalLink className="h-4 w-4" />
                  Open post
                </Button>
              )}
            </div>
          )}
          {/* Platform (fixed) */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Platform</label>
            <Badge variant="secondary">Instagram</Badge>
          </div>

          {/* Post caption/context */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-yellow-500 flex items-center justify-center text-white text-sm font-bold">
                1
              </div>
              <label className="text-lg font-bold text-white">
                What's the post about? (Paste caption here)
              </label>
            </div>
            <Textarea
              value={postCaption}
              onChange={(e) => setPostCaption(e.target.value)}
              placeholder="Paste the Instagram caption here..."
              className="min-h-[100px] text-base bg-white/5 border-white/20 text-white"
            />
            <p className="text-sm text-gray-400 flex items-center gap-2">
              💡 Tip: Just copy the post's caption and paste it here - we'll write comments that match!
            </p>
          </div>

          {/* Bot Tone Selection */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-yellow-500 flex items-center justify-center text-white text-sm font-bold">
                2
              </div>
              <label className="text-lg font-bold text-white">Pick a comment style (we recommend Curious)</label>
            </div>
            <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-5">
              {tones.map((tone) => (
                <button
                  key={tone.id}
                  onClick={() => setSelectedTone(tone.id)}
                  className={`rounded-lg border-2 p-3 text-left transition-all ${
                    selectedTone === tone.id
                      ? "border-yellow-500 bg-yellow-500/20 shadow-lg shadow-yellow-500/20"
                      : "border-white/20 hover:border-yellow-500/50 hover:bg-white/5"
                  }`}
                >
                  <div className="mb-1 text-2xl">{tone.icon}</div>
                  <div className="mb-1 text-sm font-semibold text-white flex items-center gap-1">
                    {tone.name}
                    {tone.id === "curious" && (
                      <span className="text-[10px] bg-green-500 text-white px-1.5 py-0.5 rounded-full font-bold">
                        BEST
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-gray-400">{tone.description}</div>
                </button>
              ))}
            </div>
            <p className="text-sm text-gray-400">
              💡 New? Start with "Curious" - it works best for getting people to check your profile!
            </p>
          </div>

          {/* CTA Intent Selection */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-yellow-500 flex items-center justify-center text-white text-sm font-bold">
                3
              </div>
              <label className="text-lg font-bold text-white">What should the comment do?</label>
            </div>
            <div className="grid gap-2 sm:grid-cols-3">
              {intents.map((intent) => (
                <button
                  key={intent.id}
                  onClick={() => setSelectedIntent(intent.id)}
                  className={`rounded-lg border-2 p-4 text-left transition-all ${
                    selectedIntent === intent.id
                      ? "border-yellow-500 bg-yellow-500/20 shadow-lg shadow-yellow-500/20"
                      : "border-white/20 hover:border-yellow-500/50 hover:bg-white/5"
                  }`}
                >
                  <div className="mb-1 text-base font-semibold text-white flex items-center gap-1">
                    {intent.name}
                    {intent.id === "profile" && (
                      <span className="text-[10px] bg-green-500 text-white px-1.5 py-0.5 rounded-full font-bold">
                        BEST
                      </span>
                    )}
                  </div>
                  <div className="text-sm text-gray-400">{intent.description}</div>
                </button>
              ))}
            </div>
            <p className="text-sm text-gray-400">
              💡 "Pull to Profile" works best - it makes people curious to check your bio!
            </p>
          </div>

          <Button
            onClick={() => generateComments(5)}
            disabled={!selectedTone || !selectedIntent || !postCaption.trim() || generating}
            className="w-full bg-gradient-to-r from-yellow-500 to-amber-500 text-white font-bold text-xl py-8 hover:scale-105 transition-transform disabled:opacity-50"
            size="lg"
          >
            <Zap className="mr-2 h-6 w-6" />
            {generating ? "Writing Your Comments..." : "✨ Generate My Comments!"}
          </Button>

          {error && (
            <div className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
              {error}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Loading State */}
      {generating && (
        <Card className="glass-strong border-2 border-white/20">
          <CardContent className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-4 border-yellow-500 border-t-transparent" />
              <p className="text-white font-bold text-lg">Writing perfect comments for you...</p>
              <p className="text-gray-400 text-sm mt-2">This takes about 5 seconds</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Generated Comments */}
      {comments.length > 0 && !generating && (
        <>
          <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-green-400 mb-1">
                  ✅ Your Comments Are Ready!
                </h2>
                <p className="text-sm text-gray-300">
                  {comments.length} comments ready to copy - just click the "Copy" button and paste them on Instagram
                </p>
              </div>
              <Badge className="bg-green-500/20 text-green-400 border-green-500/30 text-base px-3 py-1">
                <CheckCircle2 className="mr-2 h-4 w-4" />
                Ready!
              </Badge>
            </div>
          </div>

          <div className="space-y-3">
            {comments.map((comment, idx) => (
              <Card key={comment.id} className="glass-strong border-2 border-green-500/30 bg-green-500/5">
                <CardContent className="p-5">
                  <div className="mb-3 flex flex-wrap items-start justify-between gap-2">
                    <div className="flex gap-2">
                      <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">
                        Comment #{idx + 1}
                      </Badge>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => regenerateComment(comment.id)}
                      className="text-gray-400 hover:text-white"
                    >
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Make Different
                    </Button>
                  </div>

                  <p className="mb-4 rounded-lg bg-white/5 border border-white/10 p-4 text-white text-base leading-relaxed">
                    {comment.text}
                  </p>

                  <div className="flex flex-wrap gap-2">
                    <Button 
                      onClick={async () => {
                        await copyToClipboard(comment.text)
                      }}
                      variant="default" 
                      size="default"
                      className="bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold text-base px-6 py-3"
                    >
                      <span className="mr-2">📋</span>
                      Copy This Comment
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Urgency tip */}
          <Card className="glass-strong border-2 border-red-500/30 bg-red-500/5">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="rounded-lg bg-red-500/20 p-3 shrink-0">
                  <Zap className="h-6 w-6 text-red-400" />
                </div>
                <div className="flex-1">
                  <h3 className="mb-2 font-bold text-red-400 text-lg">⏰ Important: Post These FAST!</h3>
                  <p className="text-sm text-gray-300 mb-3">
                    Viral posts get the most views in the first 2 hours. The faster you comment, the more people will see your comment and click your profile!
                  </p>
                  <div className="bg-white/5 rounded-lg p-3 space-y-1 text-sm text-gray-300">
                    <p>✅ <strong className="text-white">Step 1:</strong> Click "Copy This Comment" above</p>
                    <p>✅ <strong className="text-white">Step 2:</strong> Open Instagram and find the post</p>
                    <p>✅ <strong className="text-white">Step 3:</strong> Paste your comment and post it!</p>
                    <p>✅ <strong className="text-white">Step 4:</strong> Watch the clicks come in 💰</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Generate more */}
          <Card className="glass-strong border-2 border-purple-500/30 bg-purple-500/5">
            <CardContent className="p-6 text-center">
              <h3 className="text-lg font-bold text-white mb-2">
                Need More Comments?
              </h3>
              <p className="text-gray-300 mb-4 text-sm">
                Generate different variations to avoid looking spammy
              </p>
              <Button
                onClick={generateVariations}
                className="bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold"
              >
                <Sparkles className="mr-2 h-5 w-5" />
                Generate 10 More Comments
              </Button>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  )
}

export default function CommentsPage() {
  return (
    <Suspense>
      <CommentsInner />
    </Suspense>
  )
}

