"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Zap, Calendar, Clock, TrendingUp, Bot, Sparkles } from "lucide-react"
import Link from "next/link"

export default function AutomationUpgradePage() {
  return (
    <div className="space-y-6 animate-slide-up">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center space-y-3"
      >
        <Badge className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white border-0 text-lg px-6 py-2">
          <Zap className="mr-2 h-5 w-5" />
          AUTOMATION UPGRADE
        </Badge>
        <h1 className="text-4xl font-bold gradient-text-cyber">
          ⚡ Automation Mode Activated
        </h1>
        <p className="text-xl text-gray-300">
          Let the <span className="text-cyan-400 font-bold">AI work for you</span> with smart automation
        </p>
      </motion.div>

      {/* Automation Features */}
      <div className="grid gap-4 md:grid-cols-3">
        {[
          {
            icon: Bot,
            title: "Auto-Scheduling",
            description: "Schedule comments to post at optimal times automatically",
            color: "cyan",
          },
          {
            icon: TrendingUp,
            title: "Auto-Save Posts",
            description: "Automatically save viral posts based on your criteria",
            color: "blue",
          },
          {
            icon: Clock,
            title: "Smart Timing",
            description: "AI determines the best times to comment for maximum reach",
            color: "cyan",
          },
        ].map((feature, index) => (
          <motion.div
            key={feature.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 + index * 0.1 }}
          >
            <Card className={`glass-strong border-2 border-${feature.color}-500/30 bg-${feature.color}-500/5 h-full`}>
              <CardContent className="p-6 text-center">
                <feature.icon className={`h-12 w-12 text-${feature.color}-400 mx-auto mb-4`} />
                <h3 className="text-xl font-bold text-white mb-2">{feature.title}</h3>
                <p className="text-sm text-gray-400">{feature.description}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Auto-Schedule System */}
      <Card className="glass-strong border-2 border-cyan-500/30">
        <CardHeader>
          <CardTitle className="text-2xl flex items-center gap-2">
            <Calendar className="h-6 w-6 text-cyan-400" />
            Auto-Scheduling System
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <p className="text-gray-300">
            Set your automation preferences and let Pivot AI handle the rest. The system will automatically:
          </p>

          <div className="grid md:grid-cols-2 gap-4">
            {[
              {
                title: "Find Optimal Times",
                description: "AI analyzes when your target audience is most active",
              },
              {
                title: "Queue Comments",
                description: "Automatically queue comments for the best posting times",
              },
              {
                title: "Monitor Engagement",
                description: "Track which times get the best results",
              },
              {
                title: "Adjust Strategy",
                description: "Learn and adapt to improve performance over time",
              },
            ].map((item, index) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + index * 0.1 }}
                className="bg-white/5 rounded-lg p-4 border border-white/10"
              >
                <div className="flex items-center gap-2 mb-2">
                  <div className="h-2 w-2 rounded-full bg-cyan-400" />
                  <h3 className="font-bold text-white">{item.title}</h3>
                </div>
                <p className="text-sm text-gray-400">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Batch Processing */}
      <Card className="glass-strong border-2 border-blue-500/30 bg-blue-500/5">
        <CardHeader>
          <CardTitle className="text-2xl flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-blue-400" />
            Batch Comment Generation
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-300 mb-4">
            Generate hundreds of comments in one click. Perfect for scaling your engagement across multiple posts.
          </p>
          <div className="bg-white/5 rounded-lg p-4 border border-white/10">
            <div className="flex items-center justify-between mb-2">
              <span className="text-white font-bold">Batch Size</span>
              <span className="text-cyan-400 font-bold">Up to 100 comments/batch</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-white font-bold">Processing Time</span>
              <span className="text-cyan-400 font-bold">~30 seconds</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card className="glass-strong border-2 border-white/20">
        <CardHeader>
          <CardTitle>Get Started with Automation</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            <Link href="/scanner">
              <Button className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-bold py-6">
                <Bot className="mr-2 h-5 w-5" />
                Set Up Auto-Save
              </Button>
            </Link>
            <Link href="/comments">
              <Button className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-bold py-6">
                <Sparkles className="mr-2 h-5 w-5" />
                Batch Generate
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
                Set up automation rules once and let it run. The AI learns from your preferences and gets smarter over time.
                Check back weekly to review performance and adjust settings.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

