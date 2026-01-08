"use client"

import { motion } from "framer-motion"
import { Bell, LogOut, Settings, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { AnimatedLogo } from "@/components/animated-logo"
import { createSupabaseBrowserClient } from "@/lib/supabase/browser"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

export function TopNav() {
  const router = useRouter()
  const [email, setEmail] = useState<string | null>(null)

  useEffect(() => {
    const supabase = createSupabaseBrowserClient()
    supabase.auth.getUser().then(({ data }) => {
      setEmail(data.user?.email ?? null)
    })
  }, [])

  const handleLogout = async () => {
    const supabase = createSupabaseBrowserClient()
    await supabase.auth.signOut()
    router.replace("/")
  }

  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="flex h-16 items-center justify-between border-b border-border/50 bg-card/50 backdrop-blur-xl px-6 relative overflow-hidden"
    >
      {/* Animated background gradient */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-primary/5 animate-shimmer opacity-50" />
      
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2, duration: 0.6 }}
        className="relative z-10"
      >
        <h2 className="text-lg font-semibold gradient-text">Pivot AI Control Center</h2>
        <p className="text-xs text-muted-foreground">
          AI-powered engagement system
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.3, duration: 0.6 }}
        className="flex items-center gap-2 relative z-10"
      >
        <AnimatedLogo variant="icon" className="mr-2" />

        {email && (
          <div className="hidden sm:block mr-2 text-xs text-muted-foreground">
            Logged in: <span className="text-white/80">{email}</span>
          </div>
        )}
        
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-5 w-5" />
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute right-1 top-1 h-2 w-2 rounded-full bg-destructive"
            >
              <motion.span
                animate={{ scale: [1, 1.5, 1], opacity: [1, 0, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute inset-0 rounded-full bg-destructive"
              />
            </motion.span>
          </Button>
        </motion.div>

        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button variant="ghost" size="icon">
            <Settings className="h-5 w-5" />
          </Button>
        </motion.div>

        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button variant="ghost" size="icon" className="relative">
            <div className="absolute inset-0 rounded-full bg-primary/20 blur-lg animate-glow-pulse" />
            <User className="h-5 w-5 relative z-10" />
          </Button>
        </motion.div>

        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button variant="ghost" size="icon" onClick={handleLogout} title="Log out">
            <LogOut className="h-5 w-5" />
          </Button>
        </motion.div>
      </motion.div>
    </motion.header>
  )
}
