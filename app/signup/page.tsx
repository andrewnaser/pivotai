"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { AnimatedLogo } from "@/components/animated-logo"
import { UserPlus, Mail, Lock, ArrowRight, CheckCircle2 } from "lucide-react"
import Link from "next/link"
import { createBrowserClient } from "@/lib/supabase/browser"

export default function SignupPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    // Validation
    if (password !== confirmPassword) {
      setError("Passwords do not match")
      setLoading(false)
      return
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters")
      setLoading(false)
      return
    }

    try {
      const supabase = createBrowserClient()

      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/dashboard`,
        },
      })

      if (signUpError) throw signUpError

      if (data?.user) {
        // Create profile
        const { error: profileError } = await supabase.from("profiles").insert({
          id: data.user.id,
          email: data.user.email,
          created_at: new Date().toISOString(),
        })

        if (profileError) {
          console.error("Profile creation error:", profileError)
        }

        setSuccess(true)
        
        // Redirect after 2 seconds
        setTimeout(() => {
          router.push("/dashboard")
        }, 2000)
      }
    } catch (err: any) {
      setError(err.message || "Failed to create account")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-6 relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 z-0">
        <motion.div
          className="absolute left-[10%] top-[20%] h-96 w-96 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 opacity-20 blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.2, 0.3, 0.2],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute right-[10%] bottom-[20%] h-96 w-96 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 opacity-20 blur-3xl"
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.2, 0.3, 0.2],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1,
          }}
        />
      </div>

      <div className="relative z-10 w-full max-w-md">
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
            <Card className="glass-strong border-2 border-green-500/50">
              <CardContent className="p-12 text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                >
                  <CheckCircle2 className="h-24 w-24 text-green-400 mx-auto mb-6" />
                </motion.div>
                <h2 className="text-3xl font-bold text-white mb-4">
                  🎉 Account Created!
                </h2>
                <p className="text-xl text-gray-300 mb-2">
                  Welcome to <strong>Pivot AI</strong>
                </p>
                <p className="text-gray-400">
                  Redirecting to your dashboard...
                </p>
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
                  className="mx-auto mb-4 rounded-full bg-gradient-to-br from-cyan-500 to-blue-500 p-4 w-20 h-20 flex items-center justify-center"
                >
                  <UserPlus className="h-10 w-10 text-white" />
                </motion.div>
                <CardTitle className="text-3xl gradient-text-cyber mb-2">
                  Create Your Account
                </CardTitle>
                <CardDescription className="text-lg text-gray-300">
                  Start hijacking attention and making money today
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-6">
                {/* Features Preview */}
                <div className="rounded-lg border-2 border-white/10 bg-gradient-to-br from-cyan-500/5 to-blue-500/5 p-4">
                  <h3 className="text-sm font-bold text-white mb-3">What you'll get:</h3>
                  <div className="space-y-2">
                    {[
                      "AI-powered comment generation",
                      "Viral post scanner",
                      "Automated engagement system",
                      "Custom bio links",
                    ].map((feature, index) => (
                      <div key={feature} className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-cyan-400 shrink-0" />
                        <span className="text-sm text-gray-300">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Signup Form */}
                <form onSubmit={handleSignup} className="space-y-4">
                  <div className="space-y-2">
                    <label htmlFor="email" className="text-sm font-medium text-gray-300 flex items-center gap-2">
                      <Mail className="h-4 w-4" />
                      Email
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
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="password" className="text-sm font-medium text-gray-300 flex items-center gap-2">
                      <Lock className="h-4 w-4" />
                      Password
                    </label>
                    <Input
                      id="password"
                      type="password"
                      placeholder="Min. 6 characters"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="text-lg py-6 bg-white/5 border-white/20 text-white placeholder:text-gray-500"
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="confirmPassword" className="text-sm font-medium text-gray-300 flex items-center gap-2">
                      <Lock className="h-4 w-4" />
                      Confirm Password
                    </label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      placeholder="Re-enter password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                      className="text-lg py-6 bg-white/5 border-white/20 text-white placeholder:text-gray-500"
                    />
                  </div>

                  {error && (
                    <div className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
                      {error}
                    </div>
                  )}

                  <Button
                    type="submit"
                    disabled={loading || !email || !password || !confirmPassword}
                    className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-bold text-xl py-8 hover:scale-105 transition-transform disabled:opacity-50"
                    size="lg"
                  >
                    {loading ? (
                      "Creating Account..."
                    ) : (
                      <>
                        Create Account
                        <ArrowRight className="ml-2 h-6 w-6" />
                      </>
                    )}
                  </Button>
                </form>

                {/* Login Link */}
                <div className="text-center pt-4 border-t border-white/10">
                  <p className="text-sm text-gray-400">
                    Already have an account?{" "}
                    <Link href="/" className="text-cyan-400 hover:text-cyan-300 font-medium underline">
                      Log in here
                    </Link>
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.6 }}
          className="mt-8 text-center text-sm text-gray-500"
        >
          <p>By signing up, you agree to our Terms of Service</p>
        </motion.div>
      </div>
    </div>
  )
}

