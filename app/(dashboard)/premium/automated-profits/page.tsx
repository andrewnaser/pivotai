"use client"

import { useState, useMemo } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { CopyButton } from "@/components/copy-button"
import {
  Crown,
  Target,
  MessageSquare,
  TrendingUp,
  Sparkles,
  Eye,
  Heart,
  Share2,
  Search,
  Flame,
  Zap,
  CheckCircle2,
  ExternalLink,
} from "lucide-react"
import { formatNumber } from "@/lib/utils"
import { DFY_VAULT_FULL, NICHES, getTargetsByNiche, getDFYStats, type DFYTarget } from "@/lib/dfy-vault"

export default function AutomatedProfitsPage() {
  const [selectedNiche, setSelectedNiche] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [expandedTarget, setExpandedTarget] = useState<number | null>(null)
  
  const stats = getDFYStats()
  
  const filteredTargets = useMemo(() => {
    let targets = getTargetsByNiche(selectedNiche)
    
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      targets = targets.filter(t => 
        t.caption.toLowerCase().includes(query) ||
        t.author.toLowerCase().includes(query) ||
        t.tags.some(tag => tag.includes(query))
      )
    }
    
    return targets
  }, [selectedNiche, searchQuery])

  return (
    <div className="space-y-6 animate-slide-up max-w-7xl mx-auto">
      {/* Premium Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-4"
      >
        <div className="inline-flex items-center gap-3 bg-gradient-to-r from-yellow-500/20 to-amber-500/20 border-2 border-yellow-500/50 rounded-full px-6 py-3">
          <Crown className="h-8 w-8 text-yellow-500" />
          <span className="text-xl font-bold gradient-text-profit">PREMIUM: AUTOMATED PROFITS</span>
          <Crown className="h-8 w-8 text-yellow-500" />
        </div>
        <h1 className="text-4xl font-bold text-white">
          Done-For-You Viral Target Library
        </h1>
        <p className="text-xl text-gray-300">
          {stats.totalTargets} Pre-Researched Posts • {stats.totalComments} Ready-to-Copy Comments • ZERO Work Required
        </p>
      </motion.div>

      {/* Insane Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="glass-strong border-2 border-green-500/50 bg-green-500/10">
            <CardContent className="p-6 text-center">
              <Target className="mx-auto mb-2 h-10 w-10 text-green-500" />
              <div className="text-4xl font-bold text-green-400 mb-1">{stats.totalTargets}</div>
              <p className="text-sm text-gray-300 font-bold">Viral Posts Ready</p>
              <p className="text-xs text-gray-500 mt-1">Worth ${formatNumber(stats.totalViews * 0.001)} in traffic!</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="glass-strong border-2 border-purple-500/50 bg-purple-500/10">
            <CardContent className="p-6 text-center">
              <MessageSquare className="mx-auto mb-2 h-10 w-10 text-purple-500" />
              <div className="text-4xl font-bold text-purple-400 mb-1">{stats.totalComments}</div>
              <p className="text-sm text-gray-300 font-bold">Comments Pre-Written</p>
              <p className="text-xs text-gray-500 mt-1">Save {Math.round(stats.totalComments * 2)} minutes of work!</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="glass-strong border-2 border-cyan-500/50 bg-cyan-500/10">
            <CardContent className="p-6 text-center">
              <Eye className="mx-auto mb-2 h-10 w-10 text-cyan-500" />
              <div className="text-4xl font-bold text-cyan-400 mb-1">{formatNumber(stats.totalViews)}</div>
              <p className="text-sm text-gray-300 font-bold">Total Views</p>
              <p className="text-xs text-gray-500 mt-1">MASSIVE traffic potential!</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="glass-strong border-2 border-yellow-500/50 bg-yellow-500/10">
            <CardContent className="p-6 text-center">
              <Sparkles className="mx-auto mb-2 h-10 w-10 text-yellow-500" />
              <div className="text-4xl font-bold text-yellow-400 mb-1">{stats.niches}</div>
              <p className="text-sm text-gray-300 font-bold">Hot Niches</p>
              <p className="text-xs text-gray-500 mt-1">Updated weekly!</p>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Value Proposition */}
      <Card className="glass-strong border-2 border-green-500/50 bg-gradient-to-r from-green-500/10 to-emerald-500/10">
        <CardContent className="p-6">
          <div className="grid md:grid-cols-3 gap-6 text-center">
            <div>
              <div className="text-3xl font-bold text-green-400 mb-2">$0</div>
              <p className="text-white font-bold mb-1">Research Cost</p>
              <p className="text-sm text-gray-400">We did ALL the work for you</p>
            </div>
            <div>
              <div className="text-3xl font-bold text-green-400 mb-2">0 Hours</div>
              <p className="text-white font-bold mb-1">Time Required</p>
              <p className="text-sm text-gray-400">Just copy & paste</p>
            </div>
            <div>
              <div className="text-3xl font-bold text-green-400 mb-2">100%</div>
              <p className="text-white font-bold mb-1">Done For You</p>
              <p className="text-sm text-gray-400">Start making money TODAY</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Filters */}
      <Card className="glass-strong border-2 border-white/20">
        <CardContent className="p-6 space-y-4">
          {/* Niche Filter */}
          <div className="space-y-3">
            <label className="text-lg font-bold text-white flex items-center gap-2">
              <Flame className="h-5 w-5 text-orange-500" />
              Filter by Niche
            </label>
            <div className="flex flex-wrap gap-2">
              <Button
                variant={selectedNiche === null ? "default" : "secondary"}
                size="sm"
                onClick={() => setSelectedNiche(null)}
                className={selectedNiche === null ? "bg-gradient-to-r from-purple-500 to-pink-500" : ""}
              >
                All Niches ({stats.totalTargets})
              </Button>
              {NICHES.map((niche) => (
                <Button
                  key={niche.id}
                  variant={selectedNiche === niche.id ? "default" : "secondary"}
                  size="sm"
                  onClick={() => setSelectedNiche(niche.id)}
                  className={selectedNiche === niche.id ? "bg-gradient-to-r from-purple-500 to-pink-500" : ""}
                >
                  {niche.emoji} {niche.name} ({niche.count})
                </Button>
              ))}
            </div>
          </div>

          {/* Search */}
          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-300">Search Posts</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                placeholder="Search by keyword, author, or hashtag..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-white/5 border-white/20 text-white text-base py-6"
              />
            </div>
          </div>

          {/* Results Count */}
          <div className="flex items-center justify-between pt-2">
            <p className="text-sm text-gray-400">
              Showing <span className="text-white font-bold">{filteredTargets.length}</span> viral posts
            </p>
            {filteredTargets.length > 0 && (
              <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                <CheckCircle2 className="h-3 w-3 mr-1" />
                Ready to copy
              </Badge>
            )}
          </div>
        </CardContent>
      </Card>

      {/* DFY Targets */}
      <div className="space-y-4">
        {filteredTargets.length === 0 ? (
          <Card className="glass-strong border-2 border-white/10">
            <CardContent className="p-12 text-center">
              <Target className="h-16 w-16 text-gray-600 mx-auto mb-4" />
              <p className="text-xl font-bold text-gray-400 mb-2">No posts found</p>
              <p className="text-gray-500">Try a different niche or search term</p>
            </CardContent>
          </Card>
        ) : (
          filteredTargets.map((target, index) => (
            <motion.div
              key={target.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card className="glass-strong border-2 border-purple-500/30 hover:border-purple-500/60 transition-all">
                <CardContent className="p-6">
                  <div className="space-y-4">
                    {/* Header */}
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-3 flex-wrap">
                          <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30 font-bold">
                            {NICHES.find(n => n.id === target.niche)?.emoji} {NICHES.find(n => n.id === target.niche)?.name}
                          </Badge>
                          <Badge className="bg-green-500/20 text-green-400 border-green-500/30 font-bold">
                            <Flame className="h-3 w-3 mr-1" />
                            Viral Score: {target.viralScore}
                          </Badge>
                          <Badge variant="secondary" className="text-gray-300">
                            {target.freshness}
                          </Badge>
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2 leading-tight">
                          {target.caption}
                        </h3>
                        <p className="text-sm text-gray-400">Posted by {target.author}</p>
                      </div>
                    </div>

                    {/* Stats */}
                    <div className="flex flex-wrap gap-6 p-4 bg-white/5 rounded-lg border border-white/10">
                      <div className="flex items-center gap-2">
                        <Eye className="h-5 w-5 text-cyan-400" />
                        <div>
                          <div className="text-lg font-bold text-white">{formatNumber(target.views)}</div>
                          <div className="text-xs text-gray-500">views</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Heart className="h-5 w-5 text-pink-400" />
                        <div>
                          <div className="text-lg font-bold text-white">{formatNumber(target.likes)}</div>
                          <div className="text-xs text-gray-500">likes</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <MessageSquare className="h-5 w-5 text-blue-400" />
                        <div>
                          <div className="text-lg font-bold text-white">{formatNumber(target.comments)}</div>
                          <div className="text-xs text-gray-500">comments</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Share2 className="h-5 w-5 text-green-400" />
                        <div>
                          <div className="text-lg font-bold text-white">{formatNumber(target.shares)}</div>
                          <div className="text-xs text-gray-500">shares</div>
                        </div>
                      </div>
                    </div>

                    {/* Why It Works */}
                    <div className="bg-gradient-to-r from-yellow-500/10 to-amber-500/10 border border-yellow-500/30 rounded-lg p-4">
                      <div className="flex items-start gap-3">
                        <Zap className="h-5 w-5 text-yellow-500 shrink-0 mt-0.5" />
                        <div>
                          <p className="text-sm font-bold text-yellow-400 mb-1">💡 Why This Post Works:</p>
                          <p className="text-sm text-gray-300">{target.whyItWorks}</p>
                        </div>
                      </div>
                    </div>

                    {/* Ready Comments */}
                    {expandedTarget === target.id && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="space-y-3"
                      >
                        <div className="flex items-center gap-2">
                          <MessageSquare className="h-5 w-5 text-green-500" />
                          <p className="text-lg font-bold text-white">
                            ✅ {target.readyComments.length} Ready-to-Copy Comments:
                          </p>
                        </div>
                        {target.readyComments.map((comment, idx) => (
                          <div
                            key={idx}
                            className="flex items-start gap-3 rounded-lg border-2 border-green-500/30 bg-green-500/5 p-4"
                          >
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <Badge className="bg-green-500/20 text-green-400 border-green-500/30 text-xs">
                                  Comment #{idx + 1}
                                </Badge>
                              </div>
                              <p className="text-base text-white leading-relaxed">{comment}</p>
                            </div>
                            <CopyButton text={comment} />
                          </div>
                        ))}
                      </motion.div>
                    )}

                    {/* Actions */}
                    <div className="flex flex-wrap gap-2">
                      <Button
                        onClick={() => setExpandedTarget(expandedTarget === target.id ? null : target.id)}
                        className="bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold"
                      >
                        {expandedTarget === target.id ? "Hide" : "Show"} {target.readyComments.length} Comments
                      </Button>
                      {target.permalink && (
                        <Button
                          variant="secondary"
                          onClick={() => window.open(target.permalink!, "_blank")}
                          className="bg-white/10 hover:bg-white/20"
                        >
                          <ExternalLink className="h-4 w-4 mr-2" />
                          View Original Post
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))
        )}
      </div>

      {/* Bottom CTA */}
      <Card className="glass-strong border-2 border-yellow-500/50 bg-gradient-to-r from-yellow-500/10 to-amber-500/10">
        <CardContent className="p-8 text-center">
          <Crown className="h-16 w-16 text-yellow-500 mx-auto mb-4" />
          <h2 className="text-3xl font-bold text-white mb-3">
            This Library Saves You 100+ Hours of Work
          </h2>
          <p className="text-xl text-gray-300 mb-6">
            We found the posts. We wrote the comments. You just copy & paste. Start making money TODAY! 💰
          </p>
          <div className="inline-flex items-center gap-2 bg-green-500/20 border border-green-500/30 rounded-lg px-6 py-3">
            <CheckCircle2 className="h-6 w-6 text-green-400" />
            <span className="text-green-400 font-bold text-lg">
              Updated weekly with fresh viral content
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
