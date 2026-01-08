"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Rocket, Zap, TrendingUp, BarChart3, Target, Sparkles } from "lucide-react"
import Link from "next/link"

export default function TenXUpgradePage() {
  return (
    <div className="space-y-6 animate-slide-up">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center space-y-3"
      >
        <Badge className="bg-gradient-to-r from-green-500 to-emerald-500 text-white border-0 text-lg px-6 py-2">
          <Rocket className="mr-2 h-5 w-5" />
          10X UPGRADE
        </Badge>
        <h1 className="text-4xl font-bold gradient-text-cyber">
          🚀 10X Performance Mode
        </h1>
        <p className="text-xl text-gray-300">
          <span className="text-green-400 font-bold">10X faster</span> processing with advanced AI models
        </p>
      </motion.div>

      {/* Performance Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Card className="glass-strong border-2 border-green-500/30 bg-green-500/5">
            <CardContent className="p-6 text-center">
              <Zap className="h-8 w-8 text-green-400 mx-auto mb-3" />
              <div className="text-3xl font-bold gradient-text-profit mb-1">10X</div>
              <div className="text-sm text-gray-400">Processing Speed</div>
            </CardContent>
          </Card>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <Card className="glass-strong border-2 border-emerald-500/30 bg-emerald-500/5">
            <CardContent className="p-6 text-center">
              <Sparkles className="h-8 w-8 text-emerald-400 mx-auto mb-3" />
              <div className="text-3xl font-bold gradient-text-profit mb-1">GPT-4</div>
              <div className="text-sm text-gray-400">AI Model</div>
            </CardContent>
          </Card>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <Card className="glass-strong border-2 border-green-500/30 bg-green-500/5">
            <CardContent className="p-6 text-center">
              <Target className="h-8 w-8 text-green-400 mx-auto mb-3" />
              <div className="text-3xl font-bold gradient-text-profit mb-1">YES</div>
              <div className="text-sm text-gray-400">Priority Access</div>
            </CardContent>
          </Card>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
          <Card className="glass-strong border-2 border-emerald-500/30 bg-emerald-500/5">
            <CardContent className="p-6 text-center">
              <BarChart3 className="h-8 w-8 text-emerald-400 mx-auto mb-3" />
              <div className="text-3xl font-bold gradient-text-profit mb-1">ADVANCED</div>
              <div className="text-sm text-gray-400">Analytics</div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Advanced AI Models */}
      <Card className="glass-strong border-2 border-green-500/30">
        <CardHeader>
          <CardTitle className="text-2xl flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-green-400" />
            Advanced AI Models
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-gray-300">
            With 10X upgrade, you get access to the most advanced AI models for superior comment quality:
          </p>
          <div className="grid md:grid-cols-2 gap-4">
            {[
              {
                model: "GPT-4 Turbo",
                description: "Latest model with enhanced reasoning and creativity",
                speed: "10X faster",
              },
              {
                model: "Context Awareness",
                description: "Better understanding of post content and audience",
                speed: "Higher quality",
              },
              {
                model: "Tone Matching",
                description: "More accurate matching to your brand voice",
                speed: "99% accuracy",
              },
              {
                model: "Multi-Language",
                description: "Support for 50+ languages with native fluency",
                speed: "Global reach",
              },
            ].map((item, index) => (
              <motion.div
                key={item.model}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + index * 0.1 }}
                className="bg-white/5 rounded-lg p-4 border border-white/10"
              >
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-bold text-white">{item.model}</h3>
                  <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                    {item.speed}
                  </Badge>
                </div>
                <p className="text-sm text-gray-400">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Priority API Access */}
      <Card className="glass-strong border-2 border-emerald-500/30 bg-emerald-500/5">
        <CardHeader>
          <CardTitle className="text-2xl flex items-center gap-2">
            <Rocket className="h-6 w-6 text-emerald-400" />
            Priority API Access
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-gray-300">
            Jump to the front of the queue with priority processing:
          </p>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="bg-white/5 rounded-lg p-4 border border-white/10 text-center">
              <div className="text-3xl font-bold text-green-400 mb-2">&lt; 1s</div>
              <div className="text-sm text-gray-400">Average Response Time</div>
            </div>
            <div className="bg-white/5 rounded-lg p-4 border border-white/10 text-center">
              <div className="text-3xl font-bold text-green-400 mb-2">99.9%</div>
              <div className="text-sm text-gray-400">Uptime Guarantee</div>
            </div>
            <div className="bg-white/5 rounded-lg p-4 border border-white/10 text-center">
              <div className="text-3xl font-bold text-green-400 mb-2">0</div>
              <div className="text-sm text-gray-400">Wait Time</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Advanced Analytics */}
      <Card className="glass-strong border-2 border-green-500/30">
        <CardHeader>
          <CardTitle className="text-2xl flex items-center gap-2">
            <BarChart3 className="h-6 w-6 text-green-400" />
            Advanced Analytics Dashboard
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-300 mb-4">
            Track your performance with enterprise-grade analytics:
          </p>
          <div className="space-y-3">
            {[
              "Real-time engagement tracking",
              "Conversion rate optimization",
              "A/B testing for comments",
              "Competitor analysis",
              "ROI calculations",
              "Custom reports & exports",
            ].map((feature, index) => (
              <motion.div
                key={feature}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + index * 0.1 }}
                className="flex items-center gap-3 bg-white/5 rounded-lg p-3 border border-white/10"
              >
                <TrendingUp className="h-5 w-5 text-green-400 shrink-0" />
                <span className="text-white">{feature}</span>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card className="glass-strong border-2 border-white/20">
        <CardHeader>
          <CardTitle>Experience 10X Speed Now</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4">
            <Link href="/scanner">
              <Button className="w-full bg-gradient-to-r from-green-500 to-emerald-500 text-white font-bold py-6">
                <Target className="mr-2 h-5 w-5" />
                Scan Posts 10X Faster
              </Button>
            </Link>
            <Link href="/comments">
              <Button className="w-full bg-gradient-to-r from-green-500 to-emerald-500 text-white font-bold py-6">
                <Sparkles className="mr-2 h-5 w-5" />
                Generate with GPT-4
              </Button>
            </Link>
            <Link href="/stats">
              <Button className="w-full bg-gradient-to-r from-green-500 to-emerald-500 text-white font-bold py-6">
                <BarChart3 className="mr-2 h-5 w-5" />
                View Analytics
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
                Use the advanced analytics to identify your best-performing comments and times. 
                The 10X speed means you can test more variations and optimize faster than anyone else.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

