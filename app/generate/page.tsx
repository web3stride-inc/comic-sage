"use client"

import { useEffect, useState } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Download, RefreshCw } from "lucide-react"
import { ComicViewer } from "@/components/comic-viewer"
import { ChatDock } from "@/components/chat-dock"
import { LoadingPanels } from "@/components/loading-panels"
import axios from "axios"
import { WebSocketStatus } from "@/components/websocket-status"
import { useWebSocket } from "@/lib/websocket/websocket-context"
import { Comic } from "@/types/comic.types"

export default function GeneratePage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [comicData, setComicData] = useState<Comic | null>(null)

  const topic = searchParams.get("topic") || ""
  const comicId = searchParams.get("id") || ""
  const { sendMessage, comicImages } = useWebSocket()

  useEffect(() => {
    if (comicImages && comicId == comicImages.id) {
      setComicData({...comicImages, topic})
      setIsLoading(false)
    }
  }, [comicImages])

  const handleRegenerate = () => {
    setIsLoading(true)
    // Simulate regeneration
    setTimeout(() => {
      setIsLoading(false)
    }, 2000)
  }

  const handleExport = () => {
    alert("Comic exported! (This would save/download the comic in a real implementation)")
  }

  const handleBack = () => {
    router.back()
  }

  useEffect(() => {
    if (comicId) {
      sendMessage(JSON.stringify({
        event: "registerClient",
        data: comicId,
      }))

      axios.get(`${process.env.NEXT_PUBLIC_API_URL}/comicai/comics/${comicId}`).then((res) => {
        if(res.data && res.data.message.comic && res.data.message.comic.images){
          setComicData({...res.data.message.comic, images: res.data.message.comic.images})
          setIsLoading(false)
        }
      })
    }
  }, [comicId])

  return (
    <div className="min-h-screen bg-stone-50 dark:bg-stone-900">
      {/* App Bar */}
      <div className="sticky top-0 z-10 bg-white dark:bg-stone-950 border-b border-stone-200 dark:border-stone-800 shadow-sm">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <Button variant="ghost" size="sm" onClick={handleBack}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>

          <h1 className="text-lg font-medium truncate max-w-[200px] sm:max-w-xs">{topic}</h1>

          <div className="flex items-center space-x-2">
            <WebSocketStatus />
            <Button
              variant="outline"
              size="sm"
              onClick={handleRegenerate}
              disabled={isLoading}
              className="animate-pulse-slow"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Re-roll
            </Button>
            <Button variant="outline" size="sm" onClick={handleExport} disabled={isLoading}>
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Comic Canvas */}
          <div className="flex-1 min-w-0">
            {isLoading ? (
              <div className="flex justify-center items-center h-[60vh]">
                <LoadingPanels />
              </div>
            ) : (
              <ComicViewer comic={comicData} />
            )}
          </div>

          {/* Chat Dock */}
          <div className="lg:w-1/3 lg:min-w-[300px]">
            <ChatDock topic={topic} id={comicId} />
          </div>
        </div>
      </div>
    </div>
  )
}
