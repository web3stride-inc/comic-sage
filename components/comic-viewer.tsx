"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import { Comic } from "@/types/comic.types"

interface ComicViewerProps {
  comic: Comic | null
}

export function ComicViewer({ comic }: ComicViewerProps) {
  if (!comic) return null

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-center mb-8">{comic.topic}</h2>

      <div className="space-y-8">
        {comic.images.map((imagePath, index) => (
          <motion.div
            key={imagePath}
            className="bg-white dark:bg-stone-800 rounded-xl shadow-lg overflow-hidden"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.2 }}
          >
            <div className="relative aspect-[4/3] bg-stone-100 dark:bg-stone-700">
              <Image
                src={`${process.env.NEXT_PUBLIC_API_URL}${imagePath}`}
                alt={`Comic panel ${imagePath}`}
                fill
                className="object-contain"
              />
            </div>

            {/* <motion.div
              className="p-4 relative"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: index * 0.2 + 0.1 }}
            >
              <div className="absolute -top-6 left-4 bg-yellow-400 dark:bg-yellow-500 text-stone-900 px-3 py-1 rounded-full text-sm font-medium">
                {panel.character}
              </div>
              <p className="mt-2 text-stone-800 dark:text-stone-200">{panel.dialogue}</p>
            </motion.div> */}
          </motion.div>
        ))}
      </div>
    </div>
  )
}
