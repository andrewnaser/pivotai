"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { CheckCircle2, Sparkles, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

interface SuccessCelebrationProps {
  show: boolean
  title: string
  message: string
  nextStepText?: string
  nextStepHref?: string
  onClose: () => void
}

export function SuccessCelebration({
  show,
  title,
  message,
  nextStepText,
  nextStepHref,
  onClose,
}: SuccessCelebrationProps) {
  const [confetti, setConfetti] = useState<Array<{ id: number; x: number; delay: number; duration: number }>>([])

  useEffect(() => {
    if (show) {
      // Generate confetti
      const items = Array.from({ length: 50 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        delay: Math.random() * 0.5,
        duration: 2 + Math.random() * 2,
      }))
      setConfetti(items)
    }
  }, [show])

  return (
    <AnimatePresence>
      {show && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            onClick={onClose}
          />

          {/* Confetti */}
          <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
            {confetti.map((item) => (
              <motion.div
                key={item.id}
                className="absolute top-0 text-4xl"
                style={{ left: `${item.x}%` }}
                initial={{ y: -100, opacity: 1, rotate: 0 }}
                animate={{
                  y: window.innerHeight + 100,
                  opacity: [1, 1, 0],
                  rotate: 360 * 3,
                }}
                transition={{
                  duration: item.duration,
                  delay: item.delay,
                  ease: "linear",
                }}
              >
                {["🎉", "💰", "✨", "⭐", "💎", "🚀"][Math.floor(Math.random() * 6)]}
              </motion.div>
            ))}
          </div>

          {/* Success Card */}
          <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ scale: 0.5, opacity: 0, y: 50 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.5, opacity: 0, y: 50 }}
              transition={{ type: "spring", duration: 0.5 }}
              className="w-full max-w-lg"
            >
              <Card className="glass-strong border-4 border-green-500/50 bg-gradient-to-br from-green-500/20 to-emerald-500/20 shadow-2xl shadow-green-500/20">
                <CardContent className="p-8 text-center space-y-6">
                  {/* Success Icon */}
                  <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ delay: 0.2, type: "spring", duration: 0.6 }}
                    className="flex justify-center"
                  >
                    <div className="relative">
                      <motion.div
                        animate={{
                          scale: [1, 1.2, 1],
                          opacity: [0.5, 0.8, 0.5],
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          ease: "easeInOut",
                        }}
                        className="absolute inset-0 rounded-full bg-green-500/30 blur-xl"
                      />
                      <div className="relative bg-gradient-to-br from-green-500 to-emerald-600 rounded-full p-6 shadow-lg">
                        <CheckCircle2 className="h-16 w-16 text-white" />
                      </div>
                    </div>
                  </motion.div>

                  {/* Title */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    <h2 className="text-3xl font-bold text-white mb-2 flex items-center justify-center gap-2">
                      <Sparkles className="h-8 w-8 text-yellow-400" />
                      {title}
                      <Sparkles className="h-8 w-8 text-yellow-400" />
                    </h2>
                    <p className="text-gray-300 text-lg">{message}</p>
                  </motion.div>

                  {/* Actions */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="flex flex-col gap-3"
                  >
                    {nextStepText && nextStepHref && (
                      <Button
                        onClick={() => {
                          window.location.href = nextStepHref
                        }}
                        className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold text-lg py-6 hover:scale-105 transition-transform"
                        size="lg"
                      >
                        {nextStepText}
                        <ArrowRight className="ml-2 h-5 w-5" />
                      </Button>
                    )}
                    <Button
                      onClick={onClose}
                      variant="ghost"
                      className="text-gray-400 hover:text-white"
                    >
                      Close
                    </Button>
                  </motion.div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  )
}




