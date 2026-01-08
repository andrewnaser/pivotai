"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { AnimatedLogo } from "@/components/animated-logo"
import { CheckCircle2, Zap } from "lucide-react"

export default function UnlockAutomationPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      const res = await fetch("/api/upgrades/unlock", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, upgradeType: "automation" }),
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

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute inset-0 z-0">
        <motion.div
          className="absolute left-[20%] top-[20%] h-96 w-96 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 opacity-20 blur-3xl"
          animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.4, 0.2] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      <div className="relative z-10 w-full max-w-2xl">
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
          <Card className="glass-strong border-2 border-green-500/50">
            <CardContent className="p-12 text-center">
              <CheckCircle2 className="h-24 w-24 text-green-400 mx-auto mb-6" />
              <h2 className="text-3xl font-bold text-white mb-4">🎉 Upgrade Unlocked!</h2>
              <p className="text-xl text-gray-300 mb-2"><strong>Automation Upgrade</strong> is now active!</p>
              <p className="text-gray-400">Redirecting you to your dashboard...</p>
            </CardContent>
          </Card>
        ) : (
          <Card className="glass-strong border-2 border-white/20 animate-cyber-glow">
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 rounded-full bg-gradient-to-br from-cyan-500 to-blue-500 p-4 w-20 h-20 flex items-center justify-center">
                <Zap className="h-10 w-10 text-white" />
              </div>
              <CardTitle className="text-3xl gradient-text-cyber mb-2">Unlock Automation Upgrade</CardTitle>
              <CardDescription className="text-lg text-gray-300">Enter your account email to activate automation</CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">
              <div className="rounded-lg border-2 border-white/10 p-6">
                <h3 className="text-lg font-bold text-white mb-4">What You'll Get:</h3>
                <div className="space-y-3">
                  {["Auto-scheduling system", "Batch comment generation", "Auto-save viral posts", "Smart timing recommendations"].map((feature) => (
                    <div key={feature} className="flex items-start gap-3">
                      <CheckCircle2 className="h-5 w-5 text-green-400 shrink-0 mt-0.5" />
                      <span className="text-gray-200">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium text-gray-300">Your Account Email</label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="text-lg py-6 bg-white/5 border-white/20 text-white placeholder:text-gray-500"
                  />
                </div>

                {error && (
                  <div className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">{error}</div>
                )}

                <Button
                  type="submit"
                  disabled={loading || !email}
                  className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-bold text-xl py-8 hover:scale-105 transition-transform disabled:opacity-50"
                  size="lg"
                >
                  <Zap className="mr-2 h-6 w-6" />
                  {loading ? "Unlocking..." : "Unlock Automation Upgrade"}
                </Button>
              </form>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}

