"use client"

import { useState } from "react"
import Image from "next/image"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { X, Copy, Download, Twitter, Instagram } from "lucide-react"
import { Comic } from "@/types/comic.types"

interface ShareOverlayProps {
  comic: Comic
  onClose: () => void
}

export function ShareOverlay({ comic, onClose }: ShareOverlayProps) {
  const [copied, setCopied] = useState(false)
  const shareUrl = `https://comicsage.edu/comic/${comic.id}`

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleDownload = () => {
    alert("Comic downloaded! (This would download the comic in a real implementation)")
  }

  const handleShareToSocial = (platform: string) => {
    alert(`Sharing to ${platform}! (This would open a share dialog in a real implementation)`)
  }

  return (
    <motion.div
      className="fixed inset-0 bg-stone-900/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="bg-white dark:bg-stone-800 rounded-xl shadow-xl max-w-lg w-full"
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
      >
        <div className="flex justify-between items-center p-4 border-b border-stone-200 dark:border-stone-700">
          <h2 className="text-xl font-bold">Share Comic</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>

        <div className="p-6">
          <div className="mb-6">
            <div className="relative aspect-video bg-stone-100 dark:bg-stone-700 rounded-lg overflow-hidden mb-4">
              <Image src="/placeholder.svg?height=300&width=600" alt={comic.topic} fill className="object-cover" />
              <div className="absolute inset-0 flex items-center justify-center">
                <p className="text-xl font-bold bg-stone-900/60 text-white px-4 py-2 rounded">{comic.topic}</p>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Input value={shareUrl} readOnly className="bg-stone-100 dark:bg-stone-700" />
              <Button
                variant="outline"
                size="icon"
                onClick={handleCopyLink}
                className={copied ? "bg-green-500 text-white" : ""}
              >
                {copied ? <span className="text-xs">Copied!</span> : <Copy className="h-4 w-4" />}
              </Button>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-medium">Share to</h3>

            <div className="flex flex-wrap gap-3">
              <Button variant="outline" className="flex-1" onClick={() => handleShareToSocial("Twitter")}>
                <Twitter className="h-4 w-4 mr-2" />
                Twitter
              </Button>
              <Button variant="outline" className="flex-1" onClick={() => handleShareToSocial("Instagram")}>
                <Instagram className="h-4 w-4 mr-2" />
                Instagram
              </Button>
            </div>

            <div className="pt-4 border-t border-stone-200 dark:border-stone-700">
              <Button className="w-full bg-yellow-500 hover:bg-yellow-600 text-stone-900" onClick={handleDownload}>
                <Download className="h-4 w-4 mr-2" />
                Download Comic
              </Button>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}
