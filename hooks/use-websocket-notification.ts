"use client"

import { useEffect } from "react"
import { useWebSocket } from "@/lib/websocket/websocket-context"
import { useToast } from "@/hooks/use-toast"

interface UseWebSocketNotificationOptions {
  onMessage?: (data: any) => void
  showToasts?: boolean
  filter?: (data: any) => boolean
}

export function useWebSocketNotification(options: UseWebSocketNotificationOptions = {}) {
  const { lastMessage, status } = useWebSocket()
  const { toast } = useToast()
  const { onMessage, showToasts = true, filter } = options

  useEffect(() => {
    if (lastMessage) {
      // Apply filter if provided
      if (filter && !filter(lastMessage)) {
        return
      }

      // Call the onMessage callback if provided
      if (onMessage) {
        onMessage(lastMessage)
      }

      // Show toast notification if enabled
      if (showToasts) {
        // Determine if the message has a title and description
        const title = lastMessage.title || "New notification"
        const description = lastMessage.message || lastMessage.description || 
                           (typeof lastMessage === 'string' ? lastMessage : JSON.stringify(lastMessage))

        toast({
          title,
          description,
          variant: lastMessage.type === "error" ? "destructive" : "default",
        })
      }
    }
  }, [lastMessage, onMessage, showToasts, filter, toast])

  return { status }
} 