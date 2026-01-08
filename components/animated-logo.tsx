"use client"

import Image from "next/image"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

interface AnimatedLogoProps {
  variant?: "sidebar" | "login" | "icon"
  className?: string
}

export function AnimatedLogo({ variant = "sidebar", className }: AnimatedLogoProps) {
  const sizes = {
    sidebar: { width: 32, height: 32 },
    login: { width: 80, height: 80 },
    icon: { width: 24, height: 24 },
  }

  const { width, height } = sizes[variant]

  // Try PNG first, fallback to SVG
  const logoPath = "/branding/pivot-ai-logo.png"
  const logoPathFallback = "/branding/q9-bot-logo.svg" // Keep existing until new logo created

  return (
    <motion.div
      className={cn("relative", className)}
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <motion.div
        className="relative"
        whileHover={{ scale: 1.05 }}
        transition={{ duration: 0.3 }}
      >
        {/* Glow effect */}
        <motion.div
          className="absolute inset-0 rounded-full bg-primary/20 blur-xl"
          animate={{
            opacity: [0.3, 0.6, 0.3],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        
        {/* Logo */}
        <div className="relative">
          <Image
            src={logoPathFallback}
            alt="Pivot AI"
            width={width}
            height={height}
            className="relative z-10 drop-shadow-[0_0_10px_rgba(45,212,191,0.3)]"
            priority
            onError={(e) => {
              // Fallback already handled
              console.log("Logo loaded as SVG")
            }}
          />
        </div>
      </motion.div>
    </motion.div>
  )
}
