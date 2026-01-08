"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Sparkles, Infinity, TrendingUp, Zap } from "lucide-react"
import Link from "next/link"

export default function InfiniteUpgradePage() {
  return (
    <div className="space-y-6 animate-slide-up">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center space-y-3"
      >
        <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white border-0 text-lg px-6 py-2">
          <Sparkles className="mr-2 h-5 w-5" />
          INFINITE UPGRADE
        </Badge>
        <h1 className="text-4xl font-bold gradient-text-cyber">
          💎 Welcome to Infinite Mode
        </h1>
        <p className="text-xl text-gray-300">
          You now have <span className="text-purple-400 font-bold">UNLIMITED ACCESS</span> to all core features
        </p>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-4">
        {[
          { label: "Daily Limit", value: "∞", icon: Infinity, color: "purple" },
          { label: "Comment Generation", value: "UNLIMITED", icon: Sparkles, color: "pink" },
          { label: "Saved Targets", value: "UNLIMITED", icon: TrendingUp, color: "purple" },
          { label: "Priority Support", value: "ACTIVE", icon: Zap, color: "pink" },
        ].map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 + index * 0.1 }}
          >
            <Card className={`glass-strong border-2 border-${stat.color}-500/30 bg-${stat.color}-500/5`}>
              <CardContent className="p-6 text-center">
                <stat.icon className={`h-8 w-8 text-${stat.color}-400 mx-auto mb-3`} />
                <div className="text-3xl font-bold gradient-text-profit mb-1">{stat.value}</div>
                <div className="text-sm text-gray-400">{stat.label}</div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Features */}
      <Card className="glass-strong border-2 border-purple-500/30">
        <CardHeader>
          <CardTitle className="text-2xl flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-purple-400" />
            Your Infinite Powers
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            {[
              {
                title: "Unlimited Comments",
                description: "Generate as many AI comments as you need, no daily limits",
              },
              {
                title: "Unlimited Saves",
                description: "Save unlimited viral targets to your library",
              },
              {
                title: "No Restrictions",
                description: "Use all features without any throttling or waiting",
              },
              {
                title: "Priority Support",
                description: "Get help faster with priority customer support",
              },
            ].map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + index * 0.1 }}
                className="bg-white/5 rounded-lg p-4 border border-white/10"
              >
                <h3 className="font-bold text-white mb-2">{feature.title}</h3>
                <p className="text-sm text-gray-400">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card className="glass-strong border-2 border-white/20">
        <CardHeader>
          <CardTitle>Start Using Your Infinite Power</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4">
            <Link href="/scanner">
              <Button className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold py-6">
                <TrendingUp className="mr-2 h-5 w-5" />
                Find Viral Posts
              </Button>
            </Link>
            <Link href="/comments">
              <Button className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold py-6">
                <Sparkles className="mr-2 h-5 w-5" />
                Generate Comments
              </Button>
            </Link>
            <Link href="/saved-targets">
              <Button className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold py-6">
                <Infinity className="mr-2 h-5 w-5" />
                View Saved Targets
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
                With unlimited generation, test multiple comment styles and tones to find what gets the best engagement. 
                Save your top-performing comments for future use!
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

