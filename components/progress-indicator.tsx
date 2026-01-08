"use client"

import { CheckCircle2, Circle } from "lucide-react"
import { motion } from "framer-motion"

interface ProgressStep {
  number: number
  title: string
  completed: boolean
  current: boolean
}

interface ProgressIndicatorProps {
  currentStep: 1 | 2 | 3
}

export function ProgressIndicator({ currentStep }: ProgressIndicatorProps) {
  const steps: ProgressStep[] = [
    {
      number: 1,
      title: "Create Money Link",
      completed: currentStep > 1,
      current: currentStep === 1,
    },
    {
      number: 2,
      title: "Find Viral Posts",
      completed: currentStep > 2,
      current: currentStep === 2,
    },
    {
      number: 3,
      title: "Copy Comments",
      completed: currentStep > 3,
      current: currentStep === 3,
    },
  ]

  const progressPercentage = ((currentStep - 1) / 2) * 100

  return (
    <div className="w-full bg-white/5 rounded-lg p-4 border border-white/10">
      {/* Progress Bar */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-bold text-white">Your Progress</span>
          <span className="text-sm text-green-400 font-bold">Step {currentStep} of 3</span>
        </div>
        <div className="h-2 bg-white/10 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-green-500 to-emerald-600"
            initial={{ width: 0 }}
            animate={{ width: `${progressPercentage}%` }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          />
        </div>
      </div>

      {/* Steps */}
      <div className="flex items-center justify-between">
        {steps.map((step, index) => (
          <div key={step.number} className="flex items-center flex-1">
            <div className="flex flex-col items-center">
              {/* Icon */}
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: index * 0.1 }}
                className={`relative flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                  step.completed
                    ? "bg-gradient-to-br from-green-500 to-emerald-600 border-green-500"
                    : step.current
                      ? "bg-gradient-to-br from-yellow-500 to-amber-600 border-yellow-500"
                      : "bg-white/5 border-white/20"
                }`}
              >
                {step.completed ? (
                  <CheckCircle2 className="h-5 w-5 text-white" />
                ) : (
                  <span className="text-white font-bold">{step.number}</span>
                )}
                {step.current && (
                  <motion.div
                    animate={{
                      scale: [1, 1.3, 1],
                      opacity: [0.5, 0.8, 0.5],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                    className="absolute inset-0 rounded-full bg-yellow-500/30 blur-md"
                  />
                )}
              </motion.div>

              {/* Label */}
              <span
                className={`mt-2 text-xs text-center max-w-[80px] ${
                  step.completed
                    ? "text-green-400 font-bold"
                    : step.current
                      ? "text-yellow-400 font-bold"
                      : "text-gray-500"
                }`}
              >
                {step.title}
              </span>
            </div>

            {/* Connector Line */}
            {index < steps.length - 1 && (
              <div className="flex-1 h-0.5 mx-2 bg-white/10">
                <motion.div
                  className="h-full bg-gradient-to-r from-green-500 to-emerald-600"
                  initial={{ width: 0 }}
                  animate={{ width: step.completed ? "100%" : "0%" }}
                  transition={{ duration: 0.5, delay: index * 0.2 }}
                />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}




