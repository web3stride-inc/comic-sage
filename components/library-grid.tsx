"use client"

import { useState } from "react"
import Image from "next/image"
import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Heart } from "lucide-react"
import { useRouter } from "next/navigation"
import { Comic } from "@/types/comic.types"

interface LibraryGridProps {
  comics: Comic[]
  isLoading: boolean
}

export function LibraryGrid({ comics, isLoading }: LibraryGridProps) {
  const router = useRouter()
  const [favorites, setFavorites] = useState<Record<string, boolean>>(
    comics.reduce(
      (acc, comic) => {
        acc[comic.id] = false
        return acc
      },
      {} as Record<string, boolean>,
    ),
  )

  const toggleFavorite = (id: string) => {
    setFavorites((prev) => ({
      ...prev,
      [id]: !prev[id],
    }))
  }

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {Array.from({ length: 6 }).map((_, index) => (
          <Card key={index} className="overflow-hidden">
            <Skeleton className="h-48 w-full" />
            <CardContent className="p-4">
              <Skeleton className="h-6 w-3/4 mb-2" />
              <Skeleton className="h-4 w-1/2" />
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (comics.length === 0) {
    return (
      <div className="bg-white dark:bg-stone-800 rounded-xl shadow p-8 text-center">
        <p className="text-lg mb-4">No comics found</p>
        <p className="text-stone-500 dark:text-stone-400">Try changing your filter or create a new comic</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {comics && comics.length > 0 && comics.map((comic, index) => (
        <motion.div
          key={comic.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.05 }}
        >
          <Card className="overflow-hidden group hover:shadow-lg transition-shadow cursor-pointer" onClick={() => router.push(`/generate?topic=${comic.topic}&id=${comic.id}&difficulty=${comic.difficulty}&tone=${comic.tone}`)}>
            <div className="relative aspect-[3/4]">
            {comic.images && comic.images.length > 0 && (
              <Image
                src={`${process.env.NEXT_PUBLIC_API_URL}${comic.images[0]}`}
                alt={comic.topic}
                fill
                className="object-cover transition-transform group-hover:scale-105"
              />
              )}
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  toggleFavorite(comic.id)
                }}
                className="absolute top-2 right-2 p-2 bg-white/80 dark:bg-stone-900/80 rounded-full"
              >
                <Heart className={`h-5 w-5 ${favorites[comic.id] ? "fill-red-500 text-red-500" : "text-stone-400"}`} />
              </button>
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-stone-900/80 to-transparent p-4">
                <p className="text-white font-medium">{comic.topic}</p>
              </div>
            </div>
            <CardContent className="p-4">
              <div className="flex justify-between items-center">
                <span className="text-xs text-stone-500 dark:text-stone-400">
                  {new Date(comic.createdAt).toLocaleDateString()}
                </span>
                <span className="text-xs px-2 py-1 bg-stone-100 dark:bg-stone-700 rounded-full">{comic.tags.length > 0 ? comic.tags.map((tag) => tag.name).join(', ') : ''}</span>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  )
}
