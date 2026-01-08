"use client"

import { useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { AnimatedLogo } from "@/components/animated-logo"
import { CheckCircle2, Sparkles, Zap, Rocket, Crown } from "lucide-react"

const UPGRADE_INFO = {
  infinite: {
    name: "Infinite Upgrade",
    icon: Sparkles,
    color: "from-purple-500 to-pink-500",
    features: [
      "Unlimited comment generation",
      "Unlimited saved targets",
      "No daily limits",
      "Priority support",
    ],
  },
  automation: {
    name: "Automation Upgrade",
    icon: Zap,
    color: "from-cyan-500 to-blue-500",
    features: [
      "Auto-scheduling system",
      "Batch comment generation",
      "Auto-save viral posts",
      "Smart timing recommendations",
    ],
  },
  "10x": {
    name: "10X Upgrade",
    icon: Rocket,
    color: "from-green-500 to-emerald-500",
    features: [
      "Advanced AI models",
      "10x faster processing",
      "Priority API access",
      "Advanced analytics dashboard",
    ],
  },
  dfy: {
    name: "DFY (Done For You) Upgrade",
    icon: Crown,
    color: "from-yellow-500 to-amber-500",
    features: [
      "500+ pre-written comments",
      "200+ viral post templates",
      "Weekly content updates",
      "Proven money-making blueprints",
    ],
  },
}

// Generate static params for build time
export async function generateStaticParams() {
  return [
    { upgrade: 'infinite' },
    { upgrade: 'automation' },
    { upgrade: '10x' },
    { upgrade: 'dfy' },
  ]
}

// Enable dynamic params for any other upgrade types
export const dynamicParams = true

export default function UnlockUpgradePage() {
  const params = useParams()
  const router = useRouter()
  const upgrade = params.upgrade as string
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const upgradeInfo = UPGRADE_INFO[upgrade as keyof typeof UPGRADE_INFO]

  if (!upgradeInfo) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center p-6">
        <Card className="glass-strong border-2 border-red-500/30">
          <CardContent className="p-6 text-center">
            <p className="text-red-400 text-lg">Invalid upgrade link</p>
            <p className="text-gray-400 text-sm mt-2">Please check your link and try again</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      const res = await fetch("/api/upgrades/unlock", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, upgradeType: upgrade }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || "Failed to unlock upgrade")
      }

      setSuccess(true)
      setTimeout(() => {
        router.push("/dashboard")
      }, 3000)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong")
    } finally {
      setLoading(false)
    }
  }

  const Icon = upgradeInfo.icon

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-6 relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 z-0">
        <motion.div
          className={`absolute left-[20%] top-[20%] h-96 w-96 rounded-full bg-gradient-to-r ${upgradeInfo.color} opacity-20 blur-3xl`}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className={`absolute right-[20%] bottom-[20%] h-96 w-96 rounded-full bg-gradient-to-r ${upgradeInfo.color} opacity-20 blur-3xl`}
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.2, 0.3, 0.2],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>

      <div className="relative z-10 w-full max-w-2xl">
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex items-center justify-center gap-3 mb-8"
        >
          <AnimatedLogo variant="login" />
          <h1 className="text-3xl font-bold gradient-text-cyber">PIVOT AI</h1>
        </motion.div>

        {success ? (
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <Card className={`glass-strong border-2 bg-gradient-to-br ${upgradeInfo.color} bg-opacity-10 border-green-500/50`}>
              <CardContent className="p-12 text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                >
                  <CheckCircle2 className="h-24 w-24 text-green-400 mx-auto mb-6" />
                </motion.div>
                <h2 className="text-3xl font-bold text-white mb-4">
                  🎉 Upgrade Unlocked!
                </h2>
                <p className="text-xl text-gray-300 mb-2">
                  <strong>{upgradeInfo.name}</strong> is now active!
                </p>
                <p className="text-gray-400 mb-6">
                  Redirecting you to your dashboard...
                </p>
                <div className="flex items-center justify-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-green-400 animate-pulse" />
                  <div className="h-2 w-2 rounded-full bg-green-400 animate-pulse delay-75" />
                  <div className="h-2 w-2 rounded-full bg-green-400 animate-pulse delay-150" />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Card className="glass-strong border-2 border-white/20 animate-cyber-glow">
              <CardHeader className="text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.4, type: "spring" }}
                  className={`mx-auto mb-4 rounded-full bg-gradient-to-br ${upgradeInfo.color} p-4 w-20 h-20 flex items-center justify-center`}
                >
                  <Icon className="h-10 w-10 text-white" />
                </motion.div>
                <CardTitle className="text-3xl gradient-text-cyber mb-2">
                  Unlock {upgradeInfo.name}
                </CardTitle>
                <CardDescription className="text-lg text-gray-300">
                  Enter your account email to activate this premium upgrade
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-6">
                {/* Features */}
                <div className={`rounded-lg border-2 bg-gradient-to-br ${upgradeInfo.color} bg-opacity-5 border-white/10 p-6`}>
                  <h3 className="text-lg font-bold text-white mb-4">What You'll Get:</h3>
                  <div className="space-y-3">
                    {upgradeInfo.features.map((feature, index) => (
                      <motion.div
                        key={feature}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.5 + index * 0.1 }}
                        className="flex items-start gap-3"
                      >
                        <CheckCircle2 className={`h-5 w-5 text-green-400 shrink-0 mt-0.5`} />
                        <span className="text-gray-200">{feature}</span>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <label htmlFor="email" className="text-sm font-medium text-gray-300">
                      Your Account Email
                    </label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="text-lg py-6 bg-white/5 border-white/20 text-white placeholder:text-gray-500"
                    />
                    <p className="text-xs text-gray-400">
                      Use the email you signed up with
                    </p>
                  </div>

                  {error && (
                    <div className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
                      {error}
                    </div>
                  )}

                  <Button
                    type="submit"
                    disabled={loading || !email}
                    className={`w-full bg-gradient-to-r ${upgradeInfo.color} text-white font-bold text-xl py-8 hover:scale-105 transition-transform disabled:opacity-50`}
                    size="lg"
                  >
                    <Icon className="mr-2 h-6 w-6" />
                    {loading ? "Unlocking..." : `Unlock ${upgradeInfo.name}`}
                  </Button>
                </form>

                <p className="text-center text-sm text-gray-400">
                  Don't have an account?{" "}
                  <a href="/" className="text-cyan-400 hover:text-cyan-300 font-medium">
                    Sign up here
                  </a>
                </p>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>
    </div>
  )
}

