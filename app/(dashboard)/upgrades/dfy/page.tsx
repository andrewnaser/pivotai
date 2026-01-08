"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Crown, FileText, Sparkles, Copy, TrendingUp, Zap } from "lucide-react"
import Link from "next/link"
import { CopyButton } from "@/components/copy-button"

const DFY_COMMENTS = [
  "This is exactly what I needed! 🔥 Anyone else trying this?",
  "Been looking for something like this forever! Where can I learn more?",
  "This actually works! I've been testing it for a week and seeing real results 💯",
  "No way this is real... but I'm definitely checking this out 👀",
  "Finally someone who actually shows the process instead of just talking about it!",
]

const DFY_VIRAL_POSTS = [
  {
    niche: "Make Money Online",
    caption: "How I made $10K in 30 days with Instagram...",
    engagement: "500K+ views",
    reason: "Proven money-making topic with high engagement",
  },
  {
    niche: "Fitness",
    caption: "This 5-minute workout changed everything...",
    engagement: "2M+ views",
    reason: "Simple, actionable, and inspiring",
  },
  {
    niche: "Dating",
    caption: "What men really want (women need to see this)...",
    engagement: "1M+ views",
    reason: "Controversial angle drives comments",
  },
]

export default function DFYUpgradePage() {
  return (
    <div className="space-y-6 animate-slide-up">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center space-y-3"
      >
        <Badge className="bg-gradient-to-r from-yellow-500 to-amber-500 text-white border-0 text-lg px-6 py-2">
          <Crown className="mr-2 h-5 w-5" />
          DFY UPGRADE
        </Badge>
        <h1 className="text-4xl font-bold gradient-text-cyber">
          👑 Done-For-You Content Library
        </h1>
        <p className="text-xl text-gray-300">
          <span className="text-yellow-400 font-bold">500+ ready-to-use</span> comments & viral post templates
        </p>
      </motion.div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        {[
          { label: "DFY Comments", value: "500+", icon: FileText },
          { label: "Viral Templates", value: "200+", icon: TrendingUp },
          { label: "Weekly Updates", value: "NEW", icon: Sparkles },
          { label: "Success Rate", value: "95%", icon: Zap },
        ].map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 + index * 0.1 }}
          >
            <Card className="glass-strong border-2 border-yellow-500/30 bg-yellow-500/5">
              <CardContent className="p-6 text-center">
                <stat.icon className="h-8 w-8 text-yellow-400 mx-auto mb-3" />
                <div className="text-3xl font-bold gradient-text-profit mb-1">{stat.value}</div>
                <div className="text-sm text-gray-400">{stat.label}</div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* DFY Comment Library */}
      <Card className="glass-strong border-2 border-yellow-500/30">
        <CardHeader>
          <CardTitle className="text-2xl flex items-center gap-2">
            <Copy className="h-6 w-6 text-yellow-400" />
            Pre-Written Comment Library
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-gray-300">
            Just copy and paste! These comments are proven to drive traffic and engagement:
          </p>
          <div className="space-y-3">
            {DFY_COMMENTS.map((comment, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 + index * 0.1 }}
                className="bg-white/5 rounded-lg p-4 border border-white/10 flex items-start justify-between gap-4"
              >
                <p className="text-white flex-1">{comment}</p>
                <CopyButton text={comment} />
              </motion.div>
            ))}
          </div>
          <div className="text-center mt-4">
            <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">
              +495 more comments available
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Viral Post Templates */}
      <Card className="glass-strong border-2 border-amber-500/30 bg-amber-500/5">
        <CardHeader>
          <CardTitle className="text-2xl flex items-center gap-2">
            <TrendingUp className="h-6 w-6 text-amber-400" />
            Proven Viral Post Templates
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-300 mb-4">
            These exact post formats have generated millions of views. Just adapt to your niche:
          </p>
          <div className="space-y-4">
            {DFY_VIRAL_POSTS.map((post, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + index * 0.1 }}
                className="bg-white/5 rounded-lg p-5 border border-white/10"
              >
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div className="flex-1">
                    <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30 mb-2">
                      {post.niche}
                    </Badge>
                    <p className="text-white font-medium text-lg mb-1">{post.caption}</p>
                    <p className="text-green-400 text-sm font-bold">{post.engagement}</p>
                  </div>
                </div>
                <div className="bg-white/5 rounded-lg p-3 border border-white/5">
                  <p className="text-xs text-gray-400 mb-1">Why it works:</p>
                  <p className="text-sm text-white">{post.reason}</p>
                </div>
              </motion.div>
            ))}
          </div>
          <div className="text-center mt-4">
            <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/30">
              +197 more viral templates available
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Money-Making Blueprints */}
      <Card className="glass-strong border-2 border-yellow-500/30">
        <CardHeader>
          <CardTitle className="text-2xl flex items-center gap-2">
            <Crown className="h-6 w-6 text-yellow-400" />
            Money-Making Blueprints
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            {[
              {
                title: "$0 to $1K Blueprint",
                description: "Step-by-step guide to your first $1,000",
                time: "7-14 days",
              },
              {
                title: "$1K to $5K Blueprint",
                description: "Scale your earnings with proven strategies",
                time: "30 days",
              },
              {
                title: "Passive Income Blueprint",
                description: "Build automated revenue streams",
                time: "90 days",
              },
              {
                title: "Agency Blueprint",
                description: "Offer Pivot AI services to clients",
                time: "60 days",
              },
            ].map((blueprint, index) => (
              <motion.div
                key={blueprint.title}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + index * 0.1 }}
                className="bg-white/5 rounded-lg p-4 border border-white/10"
              >
                <h3 className="font-bold text-white mb-2">{blueprint.title}</h3>
                <p className="text-sm text-gray-400 mb-2">{blueprint.description}</p>
                <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                  Timeline: {blueprint.time}
                </Badge>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Weekly Updates */}
      <Card className="glass-strong border-2 border-green-500/30 bg-green-500/5">
        <CardHeader>
          <CardTitle className="text-2xl flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-green-400" />
            Weekly Content Updates
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-300 mb-4">
            Fresh content added every week based on trending topics and what's working NOW:
          </p>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="bg-white/5 rounded-lg p-4 border border-white/10 text-center">
              <div className="text-2xl font-bold text-green-400 mb-2">Every Monday</div>
              <div className="text-sm text-gray-400">New viral templates</div>
            </div>
            <div className="bg-white/5 rounded-lg p-4 border border-white/10 text-center">
              <div className="text-2xl font-bold text-green-400 mb-2">Every Wednesday</div>
              <div className="text-sm text-gray-400">New DFY comments</div>
            </div>
            <div className="bg-white/5 rounded-lg p-4 border border-white/10 text-center">
              <div className="text-2xl font-bold text-green-400 mb-2">Every Friday</div>
              <div className="text-sm text-gray-400">Strategy updates</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card className="glass-strong border-2 border-white/20">
        <CardHeader>
          <CardTitle>Start Using DFY Content</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            <Link href="/premium/automated-profits">
              <Button className="w-full bg-gradient-to-r from-yellow-500 to-amber-500 text-white font-bold py-6">
                <FileText className="mr-2 h-5 w-5" />
                Browse DFY Vault
              </Button>
            </Link>
            <Link href="/scanner">
              <Button className="w-full bg-gradient-to-r from-yellow-500 to-amber-500 text-white font-bold py-6">
                <TrendingUp className="mr-2 h-5 w-5" />
                Find Posts to Comment On
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>

      {/* Pro Tip */}
      <Card className="glass-strong border-2 border-yellow-500/30 bg-yellow-500/5">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <div className="rounded-lg bg-yellow-500/20 p-3 shrink-0">
              <Zap className="h-6 w-6 text-yellow-400" />
            </div>
            <div>
              <h3 className="font-bold text-white text-lg mb-2">💡 Pro Tip</h3>
              <p className="text-gray-300">
                The DFY library is perfect when you're starting out or when you need inspiration. 
                Mix DFY comments with custom ones for the best results. Test what works in your niche!
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

