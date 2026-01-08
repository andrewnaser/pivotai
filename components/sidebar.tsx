"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
import { AnimatedLogo } from "@/components/animated-logo"
import { createSupabaseBrowserClient } from "@/lib/supabase/browser"
import {
  LayoutDashboard,
  Link2,
  Search,
  MessageSquare,
  Bookmark,
  HelpCircle,
  Crown,
  Rocket,
  Sparkles,
  Zap,
} from "lucide-react"

const navigation = [
  {
    name: "🏠 Home Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
    color: "from-cyan-500 to-blue-500",
    step: "",
  },
  {
    name: "Step 1: Create Money Link",
    href: "/bio-links",
    icon: Link2,
    color: "from-green-500 to-emerald-500",
    step: "1",
  },
  {
    name: "Step 2: Find Viral Posts",
    href: "/scanner",
    icon: Search,
    color: "from-purple-500 to-pink-500",
    step: "2",
  },
  {
    name: "Step 3: Copy Comments",
    href: "/comments",
    icon: MessageSquare,
    color: "from-yellow-500 to-amber-500",
    step: "3",
  },
  {
    name: "💾 My Saved Posts",
    href: "/saved-targets",
    icon: Bookmark,
    color: "from-blue-500 to-indigo-500",
    step: "",
  },
]

const premiumNav = [
  {
    name: "🔒 Automated Profits",
    href: "/premium/automated-profits",
    icon: Crown,
    color: "from-yellow-400 to-yellow-600",
    isPremium: true,
  },
  {
    name: "🔒 Instant Cash Bot",
    href: "/premium/instant-profits",
    icon: Rocket,
    color: "from-green-400 to-emerald-600",
    isPremium: true,
  },
]

const helpNav = [
  {
    name: "💡 Help & Training",
    href: "/training",
    icon: HelpCircle,
    color: "from-pink-500 to-rose-500",
  },
]

const upgradeConfig = {
  infinite: {
    name: "💎 Infinite Mode",
    icon: Sparkles,
    color: "from-purple-500 to-pink-500",
  },
  automation: {
    name: "⚡ Automation",
    icon: Zap,
    color: "from-cyan-500 to-blue-500",
  },
  "10x": {
    name: "🚀 10X Mode",
    icon: Rocket,
    color: "from-green-500 to-emerald-500",
  },
  dfy: {
    name: "👑 DFY Library",
    icon: Crown,
    color: "from-yellow-500 to-amber-500",
  },
}

export function Sidebar() {
  const pathname = usePathname()
  const [unlockedUpgrades, setUnlockedUpgrades] = useState<string[]>([])

  useEffect(() => {
    const fetchUpgrades = async () => {
      try {
        const supabase = createSupabaseBrowserClient()
        const { data: { user } } = await supabase.auth.getUser()
        
        if (!user) return

        const { data } = await supabase
          .from("user_upgrades")
          .select("upgrade_type")
          .eq("user_id", user.id)

        if (data) {
          setUnlockedUpgrades(data.map((u) => u.upgrade_type))
        }
      } catch (error) {
        console.error("Failed to fetch upgrades:", error)
      }
    }

    fetchUpgrades()
  }, [])

  return (
    <motion.div
      initial={{ x: -300, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="flex h-screen w-72 flex-col border-r border-white/10 bg-black/50 backdrop-blur-xl relative overflow-hidden"
    >
      {/* Animated background gradient */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/20 via-purple-500/20 to-pink-500/20 animate-gradient-slow" />
      </div>

      {/* Logo */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.6 }}
        className="relative flex h-16 items-center gap-3 border-b border-white/10 px-6"
      >
        <AnimatedLogo variant="sidebar" />
        <div>
          <h1 className="text-xl font-bold gradient-text-cyber">PIVOT AI</h1>
          <p className="text-[10px] text-green-400 font-semibold">AI-Powered Engagement System</p>
        </div>
      </motion.div>

      {/* Navigation */}
      <nav className="relative flex-1 space-y-1 overflow-y-auto p-4">
        {/* Main Navigation */}
        <div className="space-y-1">
          {navigation.map((item, index) => {
            const isActive = pathname === item.href
            const isStep = item.step !== ""
            
            return (
              <motion.div
                key={item.name}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 * index, duration: 0.4 }}
              >
                <Link
                  href={item.href}
                  className={cn(
                    "group relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-300 overflow-hidden",
                    isActive
                      ? "text-white scale-[1.02]"
                      : "text-gray-400 hover:text-white hover:scale-[1.01]"
                  )}
                >
                  {/* Active background glow */}
                  {isActive && (
                    <motion.div
                      layoutId="active-bg"
                      className={`absolute inset-0 bg-gradient-to-r ${item.color} opacity-20 blur-xl`}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 0.2 }}
                    />
                  )}
                  
                  {/* Background gradient */}
                  <div className={cn(
                    "absolute inset-0 rounded-lg transition-all duration-300",
                    isActive
                      ? `bg-gradient-to-r ${item.color} opacity-20`
                      : "opacity-0 group-hover:opacity-10 bg-gradient-to-r from-cyan-500 to-purple-500"
                  )} />
                  
                  {/* Shimmer effect on hover */}
                  {!isActive && (
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-700" />
                  )}
                  
                  <div className="relative z-10 flex items-center gap-3 w-full">
                    {/* Step number or icon */}
                    {item.step ? (
                      <motion.div
                        whileHover={{ scale: 1.1, rotate: 5 }}
                        transition={{ duration: 0.3 }}
                        className={cn(
                          "flex h-8 w-8 items-center justify-center rounded-full font-bold text-base shrink-0",
                          isActive 
                            ? `bg-gradient-to-r ${item.color} text-white shadow-lg` 
                            : "bg-white/10 text-gray-400 group-hover:bg-white/20"
                        )}
                      >
                        {item.step}
                      </motion.div>
                    ) : (
                      <motion.div
                        whileHover={{ rotate: 360, scale: 1.2 }}
                        transition={{ duration: 0.5 }}
                        className="relative"
                      >
                        <item.icon className={cn(
                          "h-5 w-5 transition-colors",
                          isActive && "drop-shadow-[0_0_8px_currentColor]"
                        )} />
                      </motion.div>
                    )}
                    
                    <span className={cn(
                      "flex-1 text-left",
                      isStep && "font-bold"
                    )}>
                      {item.name}
                    </span>
                    
                    {/* Active indicator dot */}
                    {isActive && (
                      <motion.div
                        layoutId="active-indicator"
                        className={`h-2 w-2 rounded-full bg-gradient-to-r ${item.color} shrink-0`}
                        initial={{ scale: 0 }}
                        animate={{ 
                          scale: [1, 1.3, 1],
                        }}
                        transition={{ 
                          duration: 2, 
                          repeat: Infinity 
                        }}
                      />
                    )}
                  </div>
                </Link>
              </motion.div>
            )
          })}
        </div>

        {/* Premium Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7, duration: 0.6 }}
          className="mt-6 space-y-1"
        >
          <div className="px-3 py-2">
            <p className="text-xs font-semibold uppercase tracking-wider gradient-text-profit animate-neon-flicker">
              💎 Premium Bot Systems
            </p>
          </div>
          {premiumNav.map((item, index) => {
            const isActive = pathname === item.href
            return (
              <motion.div
                key={item.name}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.8 + 0.1 * index, duration: 0.4 }}
              >
                <Link
                  href={item.href}
                  className={cn(
                    "group relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-300 overflow-hidden border-2",
                    isActive
                      ? `border-transparent bg-gradient-to-r ${item.color} text-white scale-[1.02] shadow-lg`
                      : "border-yellow-500/30 text-yellow-400 hover:scale-[1.01] hover:border-yellow-500/50"
                  )}
                >
                  {!isActive && (
                    <div className={`absolute inset-0 bg-gradient-to-r ${item.color} opacity-0 group-hover:opacity-10 transition-opacity`} />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-700" />
                  
                  <motion.div
                    whileHover={{ rotate: 360, scale: 1.2 }}
                    transition={{ duration: 0.6 }}
                    className="relative z-10"
                  >
                    <item.icon className={cn(
                      "h-5 w-5 drop-shadow-lg",
                      isActive && "text-white"
                    )} />
                  </motion.div>
                  <span className="relative z-10 font-bold flex-1">{item.name}</span>
                  <span className="relative z-10 text-xl">💰</span>
                </Link>
              </motion.div>
            )
          })}
        </motion.div>

        {/* Upgrades Section */}
        {unlockedUpgrades.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9, duration: 0.6 }}
            className="mt-6 space-y-1"
          >
            <div className="px-3 py-2">
              <p className="text-xs font-semibold uppercase tracking-wider text-white/70">
                ✨ Your Upgrades
              </p>
            </div>
            {unlockedUpgrades.map((upgradeType, index) => {
              const config = upgradeConfig[upgradeType as keyof typeof upgradeConfig]
              if (!config) return null
              
              const href = `/upgrades/${upgradeType}`
              const isActive = pathname === href
              
              return (
                <motion.div
                  key={upgradeType}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1.0 + 0.1 * index, duration: 0.4 }}
                >
                  <Link
                    href={href}
                    className={cn(
                      "group relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-300 overflow-hidden",
                      isActive
                        ? "text-white scale-[1.02]"
                        : "text-gray-400 hover:text-white hover:scale-[1.01]"
                    )}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="active-bg-upgrade"
                        className={`absolute inset-0 bg-gradient-to-r ${config.color} opacity-20 blur-xl`}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 0.2 }}
                      />
                    )}
                    
                    <div className={cn(
                      "absolute inset-0 rounded-lg transition-all duration-300",
                      isActive
                        ? `bg-gradient-to-r ${config.color} opacity-20`
                        : "opacity-0 group-hover:opacity-10 bg-gradient-to-r from-cyan-500 to-purple-500"
                    )} />
                    
                    <motion.div
                      whileHover={{ rotate: 360, scale: 1.2 }}
                      transition={{ duration: 0.5 }}
                      className="relative z-10"
                    >
                      <config.icon className={cn(
                        "h-5 w-5 transition-colors",
                        isActive && "drop-shadow-[0_0_8px_currentColor]"
                      )} />
                    </motion.div>
                    <span className="relative z-10 flex-1">{config.name}</span>
                    {isActive && (
                      <motion.div
                        className={`h-2 w-2 rounded-full bg-gradient-to-r ${config.color} shrink-0`}
                        animate={{ 
                          scale: [1, 1.3, 1],
                        }}
                        transition={{ 
                          duration: 2, 
                          repeat: Infinity 
                        }}
                      />
                    )}
                  </Link>
                </motion.div>
              )
            })}
          </motion.div>
        )}

        {/* Help Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.6 }}
          className="mt-6 space-y-1"
        >
          {helpNav.map((item) => {
            const isActive = pathname === item.href
            return (
              <motion.div
                key={item.name}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1.1, duration: 0.4 }}
              >
                <Link
                  href={item.href}
                  className={cn(
                    "group relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-300 overflow-hidden",
                    isActive
                      ? "text-white scale-[1.02]"
                      : "text-gray-400 hover:text-white hover:scale-[1.01]"
                  )}
                >
                  {isActive && (
                    <motion.div
                      layoutId="active-bg-help"
                      className={`absolute inset-0 bg-gradient-to-r ${item.color} opacity-20 blur-xl`}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 0.2 }}
                    />
                  )}
                  
                  <div className={cn(
                    "absolute inset-0 rounded-lg transition-all duration-300",
                    isActive
                      ? `bg-gradient-to-r ${item.color} opacity-20`
                      : "opacity-0 group-hover:opacity-10 bg-gradient-to-r from-cyan-500 to-purple-500"
                  )} />
                  
                  <motion.div
                    whileHover={{ rotate: 360, scale: 1.2 }}
                    transition={{ duration: 0.5 }}
                    className="relative z-10"
                  >
                    <item.icon className={cn(
                      "h-5 w-5 transition-colors",
                      isActive && "drop-shadow-[0_0_8px_currentColor]"
                    )} />
                  </motion.div>
                  <span className="relative z-10 flex-1">{item.name}</span>
                  {isActive && (
                    <motion.div
                      className={`h-2 w-2 rounded-full bg-gradient-to-r ${item.color} shrink-0`}
                      animate={{ 
                        scale: [1, 1.3, 1],
                      }}
                      transition={{ 
                        duration: 2, 
                        repeat: Infinity 
                      }}
                    />
                  )}
                </Link>
              </motion.div>
            )
          })}
        </motion.div>
      </nav>

      {/* Bottom Status - Money System Active */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.2, duration: 0.6 }}
        className="relative border-t border-white/10 p-4"
      >
        <div className="glass-profit rounded-lg p-3 relative overflow-hidden animate-profit-pulse">
          <div className="absolute inset-0 bg-gradient-to-r from-green-500/10 via-yellow-500/10 to-green-500/10 animate-shimmer" />
          <div className="flex items-center gap-2 relative z-10">
            <motion.div
              className="h-2 w-2 rounded-full bg-green-500"
              animate={{
                scale: [1, 1.4, 1],
                boxShadow: [
                  "0 0 0 0 rgba(16, 185, 129, 0.7)",
                  "0 0 10px 5px rgba(16, 185, 129, 0)",
                ],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
              }}
            />
            <div className="flex-1">
              <div className="text-xs font-bold money-text flex items-center gap-1">
                <span>🤖</span>
                <span>All Bots Active</span>
              </div>
              <div className="text-[10px] text-green-300/80">
                Status: <span className="text-yellow-400 font-bold">EARNING MODE</span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}
