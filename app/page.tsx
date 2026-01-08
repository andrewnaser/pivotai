"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AnimatedLogo } from "@/components/animated-logo"
import { DollarSign, TrendingUp, Zap, ArrowRight, Banknote, Wallet } from "lucide-react"
import { createSupabaseBrowserClient } from "@/lib/supabase/browser"

const features = [
  {
    icon: DollarSign,
    title: "Automated Money Comments",
    description: "AI-generates profit-pulling comments",
    color: "from-green-500 to-emerald-500",
  },
  {
    icon: TrendingUp,
    title: "Viral Money Scanner",
    description: "Find profitable posts instantly",
    color: "from-cyan-500 to-blue-500",
  },
  {
    icon: Wallet,
    title: "Profit Tracking",
    description: "Monitor your earnings 24/7",
    color: "from-yellow-500 to-amber-500",
  },
]

export default function Home() {
  const router = useRouter()
  const [isLogin, setIsLogin] = useState(true)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccess(null)

    if (!email || !password) return

    if (!isLogin && password !== confirmPassword) {
      setError("Passwords do not match.")
      return
    }

    setLoading(true)
    try {
      const supabase = createSupabaseBrowserClient()

      if (isLogin) {
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password,
        })
        if (signInError) throw signInError
        router.replace("/dashboard")
        return
      }

      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
      })
      if (signUpError) throw signUpError

      if (data.session) {
        router.replace("/dashboard")
        return
      }

      setSuccess("Account created. Please log in.")
      setIsLogin(true)
      setPassword("")
      setConfirmPassword("")
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Something went wrong. Try again."
      setError(message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-black">
      {/* Animated background */}
      <div className="absolute inset-0 z-0">
        {/* Multi-color floating orbs */}
        <motion.div
          className="absolute left-[10%] top-[20%] h-96 w-96 rounded-full bg-cyan-500/20 blur-3xl"
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.3, 0.6, 0.3],
            x: [0, 80, 0],
            y: [0, -60, 0],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute right-[15%] top-[30%] h-96 w-96 rounded-full bg-purple-500/20 blur-3xl"
          animate={{
            scale: [1, 1.4, 1],
            opacity: [0.2, 0.5, 0.2],
            x: [0, -70, 0],
            y: [0, 80, 0],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute left-[40%] bottom-[20%] h-96 w-96 rounded-full bg-pink-500/20 blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
            x: [0, 50, 0],
            y: [0, -70, 0],
          }}
          transition={{
            duration: 9,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute right-[30%] bottom-[30%] h-96 w-96 rounded-full bg-green-500/20 blur-3xl"
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.3, 0.6, 0.3],
            x: [0, -60, 0],
            y: [0, 60, 0],
          }}
          transition={{
            duration: 11,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute left-[60%] top-[50%] h-80 w-80 rounded-full bg-yellow-500/15 blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.2, 0.4, 0.2],
            x: [0, 40, 0],
            y: [0, -50, 0],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        {/* Grid pattern with multi-color */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(45,212,191,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(168,85,247,0.05)_1px,transparent_1px)] bg-[size:50px_50px]" />
        
        {/* Money rain effect */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(10)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute text-4xl opacity-20"
              style={{
                left: `${Math.random() * 100}%`,
                top: `-10%`,
              }}
              animate={{
                y: ["0vh", "120vh"],
                rotate: [0, 360],
                opacity: [0, 0.3, 0],
              }}
              transition={{
                duration: 8 + Math.random() * 4,
                repeat: Infinity,
                delay: i * 1.2,
                ease: "linear",
              }}
            >
              💰
            </motion.div>
          ))}
        </div>
      </div>

      <div className="relative z-10 w-full max-w-7xl px-4">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Left side - Branding */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="flex flex-col justify-center space-y-8"
          >
            {/* Logo and title */}
            <div className="space-y-4">
              <motion.div
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.6 }}
                className="flex items-center gap-4"
              >
                <AnimatedLogo variant="login" />
                <div>
                  <h1 className="text-5xl font-bold gradient-text-cyber">PIVOT AI</h1>
                  <p className="text-lg gradient-text-profit font-bold">💰 AI-Powered Money System</p>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.6 }}
                className="space-y-4"
              >
                <h2 className="text-4xl font-bold text-white leading-tight">
                  Turn Viral Posts Into
                  <br />
                  <span className="gradient-text-profit text-5xl">Cash In Your Pocket</span>
                </h2>

                <p className="text-lg text-gray-300 leading-relaxed">
                  The AI-powered system that hijacks attention from viral posts
                  and redirects it straight to <span className="text-green-400 font-bold">your profit links</span>. 
                  <span className="text-yellow-400 font-bold"> Start earning today.</span>
                </p>
              </motion.div>
            </div>

            {/* Features */}
            <div className="grid gap-4 sm:grid-cols-3">
              {features.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 + index * 0.1, duration: 0.6 }}
                >
                  <Card className={`glass-strong card-hover h-full relative overflow-hidden group border-2 border-white/10`}>
                    <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-20 transition-opacity duration-500`} />
                    <CardContent className="flex flex-col items-center p-6 text-center relative z-10">
                      <motion.div
                        whileHover={{ scale: 1.2, rotate: 360 }}
                        transition={{ duration: 0.5 }}
                        className={`mb-3 rounded-full bg-gradient-to-br ${feature.color} p-3`}
                      >
                        <feature.icon className="h-8 w-8 text-white" />
                      </motion.div>
                      <p className="text-sm font-bold text-white">{feature.title}</p>
                      <p className="mt-1 text-xs text-gray-400">{feature.description}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            {/* Money Stats */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1, duration: 0.6 }}
              className="grid grid-cols-3 gap-4"
            >
              <div className="text-center">
                <div className="text-3xl font-bold gradient-text-profit money-text">$847K+</div>
                <div className="text-xs text-gray-400 mt-1">Money Generated</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold gradient-text-cyber">2.4M+</div>
                <div className="text-xs text-gray-400 mt-1">Profit Comments</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-yellow-400">$2,830</div>
                <div className="text-xs text-gray-400 mt-1">Avg Monthly Profit</div>
              </div>
            </motion.div>
          </motion.div>

          {/* Right side - Auth form */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="flex items-center justify-center"
          >
            <Card className="w-full max-w-md glass-strong shadow-2xl animate-cyber-glow border-2 border-white/20">
              <CardHeader className="space-y-1 text-center relative">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.3, duration: 0.5, type: "spring" }}
                >
                  <CardTitle className="text-3xl gradient-text-cyber mb-2">
                    {isLogin ? "💰 Access Pivot AI" : "🚀 Start Making Money"}
                  </CardTitle>
                </motion.div>
                <CardDescription className="text-base text-gray-300">
                  {isLogin
                    ? "Login to your AI-powered profit system"
                    : "Create account and start earning in minutes"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-5">
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4, duration: 0.5 }}
                    className="space-y-2"
                  >
                    <label htmlFor="email" className="text-sm font-medium text-gray-300">
                      Email
                    </label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="transition-all duration-300 focus:scale-[1.01] bg-white/5 border-white/20 text-white placeholder:text-gray-500"
                    />
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5, duration: 0.5 }}
                    className="space-y-2"
                  >
                    <label htmlFor="password" className="text-sm font-medium text-gray-300">
                      Password
                    </label>
                    <Input
                      id="password"
                      type="password"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="transition-all duration-300 focus:scale-[1.01] bg-white/5 border-white/20 text-white"
                    />
                  </motion.div>

                  {!isLogin && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="space-y-2"
                    >
                      <label htmlFor="confirm" className="text-sm font-medium text-gray-300">
                        Confirm Password
                      </label>
                      <Input
                        id="confirm"
                        type="password"
                        placeholder="••••••••"
                        required
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="transition-all duration-300 focus:scale-[1.01] bg-white/5 border-white/20 text-white"
                      />
                    </motion.div>
                  )}

                  {(error || success) && (
                    <div
                      className={`rounded-lg border px-4 py-3 text-sm ${
                        error
                          ? "border-red-500/30 bg-red-500/10 text-red-200"
                          : "border-green-500/30 bg-green-500/10 text-green-200"
                      }`}
                    >
                      {error ?? success}
                    </div>
                  )}

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6, duration: 0.5 }}
                  >
                    <Button
                      type="submit"
                      disabled={loading}
                      className="w-full btn-profit text-white font-bold text-lg py-6 group disabled:opacity-70"
                      size="lg"
                    >
                      <Banknote className="mr-2 h-6 w-6" />
                      <span>
                        {loading
                          ? "Connecting..."
                          : isLogin
                            ? "Start Making Money Now"
                            : "Activate Money Bot"}
                      </span>
                      <motion.div
                        animate={{ x: [0, 5, 0] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                      >
                        <ArrowRight className="ml-2 h-6 w-6" />
                      </motion.div>
                    </Button>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.7, duration: 0.5 }}
                    className="text-center text-sm"
                  >
                    <button
                      type="button"
                      onClick={() => {
                        setIsLogin(!isLogin)
                        setError(null)
                        setSuccess(null)
                        setPassword("")
                        setConfirmPassword("")
                      }}
                      className="text-cyan-400 hover:text-cyan-300 transition-all duration-300 font-medium hover:underline"
                    >
                      {isLogin
                        ? "Don't have an account? Start earning →"
                        : "Already making money? Log in →"}
                    </button>
                  </motion.div>
                </form>

                {/* Money proof */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8, duration: 0.5 }}
                  className="mt-6 border-t border-white/10 pt-6"
                >
                  <div className="success-glow rounded-lg p-3 text-center">
                    <div className="flex items-center justify-center gap-2 text-sm font-bold">
                      <Zap className="h-5 w-5 text-yellow-400" />
                      <span className="gradient-text-profit">10,000+ users earning daily</span>
                      <span className="text-2xl">💎</span>
                    </div>
                  </div>
                </motion.div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
