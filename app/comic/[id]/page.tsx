"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import Image from "next/image"
import { motion, useScroll, useTransform } from "framer-motion"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Share2 } from "lucide-react"
import { ChatDock } from "@/components/chat-dock"
import { ShareOverlay } from "@/components/share-overlay"

interface Panel {
  id: number
  image: string
  dialogue: string
  character: string
}

interface Comic {
  id: string
  title: string
  panels: Panel[]
}

export default function ComicDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [comic, setComic] = useState<Comic | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [showShareOverlay, setShowShareOverlay] = useState(false)
  const { scrollY } = useScroll()

  // Mock comic data
  useEffect(() => {
    setTimeout(() => {
      setComic({
        id: params.id as string,
        title: "The Amazing Comic #" + params.id,
        panels: Array.from({ length: 6 }, (_, i) => ({
          id: i + 1,
          image: "/placeholder.svg?height=400&width=300",
          dialogue: `This is panel ${i + 1} with some educational content about this topic.`,
          character: i % 2 === 0 ? "Professor Comic" : "Student",
        })),
      })
      setIsLoading(false)
    }, 1500)
  }, [params.id])

  const handleBack = () => {
    router.back()
  }

  const opacity = useTransform(scrollY, [0, 100], [1, 0])
  const scale = useTransform(scrollY, [0, 100], [1, 0.95])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-stone-50 dark:bg-stone-900 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin h-8 w-8 border-4 border-stone-300 dark:border-stone-700 border-t-yellow-500 rounded-full mb-4"></div>
          <p>Loading comic...</p>
        </div>
      </div>
    )
  }

  if (!comic) {
    return (
      <div className="min-h-screen bg-stone-50 dark:bg-stone-900 flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl mb-4">Comic not found</p>
          <Button onClick={handleBack}>Go Back</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-stone-50 dark:bg-stone-900">
      {/* Header */}
      <motion.div
        className="fixed top-0 left-0 right-0 z-10 bg-white/80 dark:bg-stone-950/80 backdrop-blur-sm border-b border-stone-200 dark:border-stone-800"
        style={{ opacity }}
      >
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <Button variant="ghost" size="sm" onClick={handleBack}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>

          <h1 className="text-lg font-medium truncate max-w-[200px] sm:max-w-xs">{comic.title}</h1>

          <Button variant="outline" size="sm" onClick={() => setShowShareOverlay(true)}>
            <Share2 className="h-4 w-4 mr-2" />
            Share
          </Button>
        </div>
      </motion.div>

      {/* Comic Content */}
      <div className="container mx-auto px-4 pt-20 pb-12">
        <motion.div className="max-w-2xl mx-auto mb-12 text-center" style={{ scale }}>
          <h1 className="text-3xl font-bold mb-4">{comic.title}</h1>
          <p className="text-stone-600 dark:text-stone-400">Scroll down to explore the comic</p>
        </motion.div>

        <div className="max-w-3xl mx-auto">
          {comic.panels.map((panel, index) => (
            <motion.div
              key={panel.id}
              className="mb-24"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true, margin: "-100px" }}
            >
              <div className="bg-white dark:bg-stone-800 rounded-xl shadow-lg overflow-hidden">
                <div className="relative aspect-[4/3] bg-stone-100 dark:bg-stone-700">
                  <Image
                    src={panel.image || "/placeholder.svg"}
                    alt={`Comic panel ${panel.id}`}
                    fill
                    className="object-contain"
                  />
                </div>

                <motion.div
                  className="p-6 relative"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  viewport={{ once: true }}
                >
                  <div className="absolute -top-6 left-6 bg-yellow-400 dark:bg-yellow-500 text-stone-900 px-3 py-1 rounded-full text-sm font-medium">
                    {panel.character}
                  </div>
                  <p className="mt-2 text-lg text-stone-800 dark:text-stone-200">{panel.dialogue}</p>
                </motion.div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Ask More Section */}
        <div className="max-w-3xl mx-auto mt-12 bg-white dark:bg-stone-800 rounded-xl shadow-lg p-6">
          <h2 className="text-2xl font-bold mb-6">Want to learn more?</h2>
          <ChatDock topic={comic.title} id={comic.id} />
        </div>
      </div>

      {/* Share Overlay */}
      {showShareOverlay && <ShareOverlay comic={comic} onClose={() => setShowShareOverlay(false)} />}

      {/* Floating Share Button */}
      <div className="fixed bottom-6 right-6">
        <Button
          onClick={() => setShowShareOverlay(true)}
          className="h-14 w-14 rounded-full shadow-lg bg-yellow-500 hover:bg-yellow-600 text-stone-900"
        >
          <Share2 className="h-6 w-6" />
        </Button>
      </div>
    </div>
  )
}
