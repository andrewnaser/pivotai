"use client"

import { motion } from "framer-motion"
import { Bookmark, ExternalLink, Trash2, Copy, TrendingUp, Clock, Target } from "lucide-react"
import { useEffect, useMemo, useState } from "react"
import { formatNumber } from "@/lib/utils"

type SavedTargetRow = {
  id: string
  platform: string
  kind: string
  query: string | null
  ig_username: string | null
  caption: string | null
  thumbnail_url: string | null
  permalink: string | null
  metrics: Record<string, unknown> | null
  created_at: string
}

function relTime(iso: string) {
  const ms = Date.parse(iso)
  if (!Number.isFinite(ms)) return "Saved"
  const delta = Date.now() - ms
  const mins = Math.round(delta / 6e4)
  if (mins < 2) return "Just now"
  if (mins < 60) return `${mins} min ago`
  const hours = Math.round(mins / 60)
  if (hours < 24) return `${hours} hours ago`
  const days = Math.round(hours / 24)
  return `${days} days ago`
}

export default function SavedTargetsPage() {
  const [targets, setTargets] = useState<SavedTargetRow[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError(null)
    fetch("/api/targets", { method: "GET" })
      .then(async (res) => {
        const json = (await res.json()) as { targets?: SavedTargetRow[]; error?: string }
        if (!res.ok) throw new Error(json?.error || `Request failed (${res.status})`)
        if (!Array.isArray(json.targets)) throw new Error("Invalid response")
        if (!cancelled) setTargets(json.targets)
      })
      .catch((e) => !cancelled && setError(e instanceof Error ? e.message : "Failed to load saved targets"))
      .finally(() => !cancelled && setLoading(false))

    return () => {
      cancelled = true
    }
  }, [])

  const deleteTarget = async (id: string) => {
    try {
      const res = await fetch(`/api/targets/${id}`, { method: "DELETE" })
      const json = (await res.json()) as { ok?: boolean; error?: string }
      if (!res.ok) throw new Error(json?.error || `Delete failed (${res.status})`)
      setTargets((prev) => prev.filter((t) => t.id !== id))
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to delete target")
    }
  }

  const totalReach = useMemo(() => {
    return targets.reduce((sum, t) => {
      const views = Number((t.metrics as any)?.views ?? 0)
      return sum + (Number.isFinite(views) ? views : 0)
    }, 0)
  }, [targets])

  return (
    <div className="min-h-screen p-8 space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="space-y-2"
      >
        <div className="flex items-center gap-3">
          <motion.div
            className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-lg"
            whileHover={{ scale: 1.05, rotate: 5 }}
          >
            <Bookmark className="h-6 w-6" />
          </motion.div>
          <div>
            <h1 className="text-3xl font-bold gradient-text-cyber">💾 My Saved Posts</h1>
            <p className="text-sm text-gray-400">Your saved viral posts ready to comment on</p>
          </div>
        </div>
      </motion.div>

      {/* Stats Row */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.6 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
      >
        <div className="glass-card rounded-xl p-6 border border-blue-500/30">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400 font-medium">Total Saved</p>
              <p className="text-3xl font-bold money-text mt-1">{targets.length}</p>
            </div>
            <Target className="h-10 w-10 text-blue-400" />
          </div>
        </div>

        <div className="glass-card rounded-xl p-6 border border-purple-500/30">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400 font-medium">Total Reach</p>
              <p className="text-3xl font-bold gradient-text-cyber mt-1">{formatNumber(totalReach)}</p>
            </div>
            <TrendingUp className="h-10 w-10 text-purple-400" />
          </div>
        </div>

        <div className="glass-card rounded-xl p-6 border border-green-500/30">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400 font-medium">Comments Ready</p>
              <p className="text-3xl font-bold money-text mt-1">45</p>
            </div>
            <Copy className="h-10 w-10 text-green-400" />
          </div>
        </div>
      </motion.div>

      {/* Saved Targets List */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.6 }}
        className="space-y-4"
      >
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-white">Your Saved Posts</h2>
          <p className="text-sm text-gray-400">
            💡 Click &quot;Get Comments&quot; to generate comments for any post
          </p>
        </div>

        {targets.length === 0 ? (
          <div className="glass-card rounded-xl p-12 text-center border border-white/10">
            <Bookmark className="h-16 w-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-400 mb-2">
              {loading ? "Loading your saved posts..." : "No Saved Posts Yet"}
            </h3>
            <p className="text-gray-500 mb-6">
              {error
                ? error
                : loading
                  ? "Getting your posts from the database..."
                  : 'Go to "Step 2: Find Viral Posts" and save some popular posts to comment on!'}
            </p>
            <motion.a
              href="/scanner"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold shadow-lg"
            >
              Go Find Posts Now
            </motion.a>
          </div>
        ) : (
          <div className="space-y-4">
            {targets.map((target, index) => (
              <motion.div
                key={target.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 * index, duration: 0.4 }}
                className="glass-card rounded-xl p-6 border border-white/10 hover:border-blue-500/50 transition-all duration-300 group"
              >
                <div className="flex gap-6">
                  {/* Thumbnail */}
                  <div className="shrink-0">
                    <div className="h-24 w-24 rounded-lg bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center text-5xl border border-white/10 overflow-hidden">
                      {target.thumbnail_url ? (
                        <img
                          src={target.thumbnail_url}
                          alt="Preview"
                          className="h-full w-full object-cover"
                          loading="lazy"
                          referrerPolicy="no-referrer"
                        />
                      ) : (
                        "🎯"
                      )}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1 space-y-3">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="px-2 py-1 text-xs font-bold rounded-md bg-blue-500/20 text-blue-400 border border-blue-500/30">
                            {target.platform}
                          </span>
                          <span className="px-2 py-1 text-xs font-medium rounded-md bg-purple-500/20 text-purple-400">
                            {target.query ?? "Saved"}
                          </span>
                        </div>
                        <h3 className="text-lg font-bold text-white mb-1 group-hover:gradient-text-cyber transition-all">
                          {(target.caption ?? "Saved target").slice(0, 120)}
                        </h3>
                        <div className="flex items-center gap-4 text-sm text-gray-400">
                          <span className="flex items-center gap-1">
                            <TrendingUp className="h-4 w-4" />
                            {formatNumber(Number((target.metrics as any)?.views ?? 0))} views •{" "}
                            {formatNumber(Number((target.metrics as any)?.likes ?? 0))} likes
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            {relTime(target.created_at)}
                          </span>
                          <span className="flex items-center gap-1">
                            <Copy className="h-4 w-4 text-green-400" />
                            {formatNumber(Number((target.metrics as any)?.viralScore ?? 0))} score
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-3">
                      <motion.a
                        href={`/comments?caption=${encodeURIComponent(target.caption ?? "")}${
                          target.ig_username ? `&author=${encodeURIComponent("@" + target.ig_username)}` : ""
                        }${target.permalink ? `&url=${encodeURIComponent(target.permalink)}` : ""}&savedTargetId=${encodeURIComponent(
                          target.id
                        )}`}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="px-4 py-2 rounded-lg bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold text-sm shadow-lg flex items-center gap-2"
                      >
                        <Copy className="h-4 w-4" />
                        Get Comments
                      </motion.a>

                      <motion.a
                        href={target.permalink ?? "#"}
                        target="_blank"
                        rel="noopener noreferrer"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-white font-medium text-sm border border-white/10 flex items-center gap-2 disabled:opacity-50"
                      >
                        <ExternalLink className="h-4 w-4" />
                        View Post
                      </motion.a>

                      <motion.button
                        onClick={() => deleteTarget(target.id)}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="ml-auto px-4 py-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 font-medium text-sm border border-red-500/30 flex items-center gap-2"
                      >
                        <Trash2 className="h-4 w-4" />
                        Delete
                      </motion.button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>

      {/* Help Box */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.6 }}
        className="glass-card rounded-xl p-6 border border-yellow-500/30 bg-yellow-500/5"
      >
        <h3 className="font-bold text-yellow-400 mb-2 flex items-center gap-2">
          💡 How to Use Your Saved Posts
        </h3>
        <ul className="text-sm text-gray-300 space-y-1">
          <li>• <strong>Save posts</strong> from the Step 2: Find Viral Posts page</li>
          <li>• <strong>Click &quot;Get Comments&quot;</strong> to generate comments for each post</li>
          <li>• <strong>Copy & paste</strong> those comments on the viral posts</li>
          <li>• <strong>Watch the money</strong> roll in as people click your bio link! 💰</li>
        </ul>
      </motion.div>
    </div>
  )
}

