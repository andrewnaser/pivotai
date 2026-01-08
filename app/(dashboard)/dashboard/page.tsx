"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import {
  Link2,
  Search,
  MessageSquare,
  ArrowRight,
  CheckCircle2,
  DollarSign,
  PlayCircle,
  Lightbulb,
} from "lucide-react"

const steps = [
  {
    number: "1",
    title: "Create Your Money Link",
    description: "Make a simple page where people click and you earn money",
    icon: Link2,
    color: "from-green-500 to-emerald-500",
    href: "/bio-links",
    time: "2 minutes",
    tips: [
      "Paste your affiliate link",
      "Pick a template (we made it easy)",
      "Click 'Create' - Done!",
    ],
    socialProof: "8,234 links created today",
  },
  {
    number: "2",
    title: "Find Viral Posts to Comment On",
    description: "We find popular posts for you - just pick the ones you like",
    icon: Search,
    color: "from-purple-500 to-pink-500",
    href: "/scanner",
    time: "3 minutes",
    tips: [
      "Type what niche (fitness, money, dating)",
      "Click 'Scan' button",
      "Save the posts you like",
    ],
    socialProof: "1.2M posts found this week",
  },
  {
    number: "3",
    title: "Copy & Paste Money Comments",
    description: "We write the comments for you - just copy and paste them",
    icon: MessageSquare,
    color: "from-yellow-500 to-amber-500",
    href: "/comments",
    time: "1 minute per comment",
    tips: [
      "Click 'Generate Comments'",
      "Click 'Copy' button",
      "Paste on the viral post",
    ],
    socialProof: "2.4M comments generated",
  },
]

const quickTips = [
  {
    icon: "💡",
    title: "New? Start Here",
    text: "Do Step 1 first (Create Money Link). You only do this once!",
  },
  {
    icon: "🎯",
    title: "Best Results",
    text: "Comment on 10-20 viral posts per day. More comments = More money!",
  },
  {
    icon: "💰",
    title: "When Do I Get Paid?",
    text: "When people click your link and buy. Usually takes 1-7 days to see first sales.",
  },
  {
    icon: "⚡",
    title: "How Much Can I Make?",
    text: "Most users make $500-$2,000/month. Top users make $5,000+/month.",
  },
]

export default function DashboardPage() {
  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Social Proof Banner */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-gradient-to-r from-green-500/20 via-yellow-500/20 to-green-500/20 border border-green-500/30 rounded-lg p-4 text-center animate-shimmer"
      >
        <div className="flex items-center justify-center gap-3 flex-wrap">
          <span className="text-2xl">🎉</span>
            <p className="text-white font-bold text-lg">
              <span className="text-green-400">14,847 users</span> are making money with Pivot AI right now!
            </p>
          <span className="text-2xl">💰</span>
        </div>
      </motion.div>

      {/* Welcome Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center space-y-3"
      >
        <h1 className="text-4xl font-bold gradient-text-cyber">
          💰 Welcome to Your Money Machine
        </h1>
        <p className="text-xl text-gray-300">
          Follow these <span className="text-green-400 font-bold">3 simple steps</span> to start making money today
        </p>
        <div className="inline-flex items-center gap-2 bg-green-500/20 border border-green-500/30 rounded-full px-4 py-2">
          <CheckCircle2 className="h-5 w-5 text-green-400" />
          <span className="text-sm text-green-300">No technical skills needed - We do everything for you!</span>
        </div>
      </motion.div>

      {/* Video Tutorial */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.6 }}
      >
        <Card className="glass-strong border-2 border-white/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-2xl">
              <PlayCircle className="h-6 w-6 text-red-500" />
              <span className="gradient-text-profit">Watch This 3-Minute Video First</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="aspect-video bg-black/50 rounded-lg flex items-center justify-center border-2 border-white/10">
              <div className="text-center">
                <PlayCircle className="h-20 w-20 text-white/50 mx-auto mb-4" />
                <p className="text-white/70">Video Tutorial Coming Soon</p>
                <p className="text-sm text-white/50 mt-2">Shows you exactly how to make your first $100</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Simple 3 Steps */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-white text-center mb-6">
          👇 Do These 3 Steps (In Order)
        </h2>
        
        {steps.map((step, index) => (
          <motion.div
            key={step.number}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 + index * 0.1, duration: 0.6 }}
          >
            <Card className="glass-strong border-2 border-white/20 hover:border-white/40 transition-all">
              <CardContent className="p-6">
                <div className="flex items-start gap-6">
                  {/* Step Number */}
                  <div className={`shrink-0 w-16 h-16 rounded-full bg-gradient-to-br ${step.color} flex items-center justify-center text-3xl font-bold text-white shadow-lg`}>
                    {step.number}
                  </div>

                  {/* Content */}
                  <div className="flex-1 space-y-3">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-2xl font-bold text-white">{step.title}</h3>
                        <span className="text-xs bg-white/10 px-2 py-1 rounded-full text-gray-300">
                          ⏱️ {step.time}
                        </span>
                      </div>
                      <p className="text-gray-300 text-lg">{step.description}</p>
                    </div>

                    {/* Simple Tips */}
                    <div className="bg-white/5 rounded-lg p-4 space-y-2">
                      <p className="text-sm font-bold text-green-400 mb-2">✅ What to do:</p>
                      {step.tips.map((tip, i) => (
                        <div key={i} className="flex items-start gap-2 text-sm text-gray-300">
                          <span className="text-green-400">•</span>
                          <span>{tip}</span>
                        </div>
                      ))}
                    </div>

                    {/* Social Proof */}
                    <div className="bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border border-cyan-500/20 rounded-lg p-3 text-center">
                      <p className="text-sm text-cyan-400 font-bold">
                        ✨ {step.socialProof}
                      </p>
                    </div>

                    {/* Action Button */}
                    <Link href={step.href}>
                      <Button className={`w-full bg-gradient-to-r ${step.color} text-white font-bold text-lg py-6 hover:scale-105 transition-transform`}>
                        <step.icon className="h-5 w-5 mr-2" />
                        Start Step {step.number}
                        <ArrowRight className="h-5 w-5 ml-2" />
                      </Button>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Quick Tips */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7, duration: 0.6 }}
      >
        <Card className="glass-strong border-2 border-yellow-500/30 bg-yellow-500/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lightbulb className="h-6 w-6 text-yellow-400" />
              <span className="gradient-text-profit">💡 Important Tips (Read These!)</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              {quickTips.map((tip, index) => (
                <div key={index} className="bg-white/5 rounded-lg p-4 border border-white/10">
                  <div className="flex items-start gap-3">
                    <span className="text-3xl">{tip.icon}</span>
                    <div>
                      <h4 className="font-bold text-white mb-1">{tip.title}</h4>
                      <p className="text-sm text-gray-300">{tip.text}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Need Help Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 0.6 }}
      >
        <Card className="glass-strong border-2 border-cyan-500/30 bg-cyan-500/5">
          <CardContent className="p-6 text-center">
            <h3 className="text-xl font-bold text-white mb-2">
              😕 Confused? Need Help?
            </h3>
            <p className="text-gray-300 mb-4">
              We have step-by-step tutorials and examples to help you
            </p>
            <Link href="/training">
              <Button variant="secondary" size="lg" className="bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-500/30">
                <Lightbulb className="h-5 w-5 mr-2" />
                Go to Help & Tutorials
              </Button>
            </Link>
          </CardContent>
        </Card>
      </motion.div>

      {/* Motivation */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 0.6 }}
        className="text-center py-8"
      >
        <div className="inline-flex items-center gap-2 text-lg">
          <DollarSign className="h-6 w-6 text-green-400" />
          <span className="text-gray-300">
            You&apos;re <span className="text-green-400 font-bold">3 simple steps</span> away from making money!
          </span>
          <span className="text-2xl">🚀</span>
        </div>
      </motion.div>
    </div>
  )
}
