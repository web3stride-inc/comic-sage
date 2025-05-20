"use client"

import { motion } from "framer-motion"

export function LoadingPanels() {
  // Create an array of 3 panels
  const panels = Array.from({ length: 3 }, (_, i) => i)

  return (
    <div className="flex flex-col items-center">
      <p className="text-lg font-medium mb-4 text-stone-700 dark:text-stone-300">Creating your comic...</p>
      <div className="flex gap-4 perspective-[1000px]">
        {panels.map((panel, index) => (
          <motion.div
            key={panel}
            className="w-24 h-32 bg-stone-50 dark:bg-stone-800 rounded-xl shadow-md flex items-center justify-center border-2 border-stone-200 dark:border-stone-700"
            initial={{ rotateY: 0 }}
            animate={{
              rotateY: [0, 90, 180, 270, 360],
              zIndex: [1, 2, 1, 0, 1],
            }}
            transition={{
              duration: 2,
              repeat: Number.POSITIVE_INFINITY,
              delay: index * 0.3,
              ease: "easeInOut",
            }}
          >
            <span className="text-3xl opacity-20">{index + 1}</span>
          </motion.div>
        ))}
      </div>
      <p className="text-sm mt-4 text-stone-500 dark:text-stone-400 animate-pulse">
        Crafting your educational adventure...
      </p>
    </div>
  )
}
