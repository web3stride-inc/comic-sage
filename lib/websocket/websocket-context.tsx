"use client"

import { Comic, ComicTag } from "@/types/comic.types"
import React, { createContext, useContext, useEffect, useState, useRef, useCallback } from "react"

type WebSocketStatus = "connecting" | "open" | "closing" | "closed" | "uninstantiated"

interface WebSocketContextType {
  socket: WebSocket | null
  status: WebSocketStatus
  sendMessage: (message: string | object) => void
  lastMessage: any | null
  comicImages: Comic | null
  comicTags: ComicTag[] | null
  connect: () => void
  disconnect: () => void
}


const WebSocketContext = createContext<WebSocketContextType | undefined>(undefined)

export const useWebSocket = () => {
  const context = useContext(WebSocketContext)
  if (!context) {
    throw new Error("useWebSocket must be used within a WebSocketProvider")
  }
  return context
}

interface WebSocketProviderProps {
  url: string
  reconnectInterval?: number
  reconnectAttempts?: number
  children: React.ReactNode
}

export const WebSocketProvider: React.FC<WebSocketProviderProps> = ({
  url,
  reconnectInterval = 5000,
  reconnectAttempts = 5,
  children,
}) => {
  const [status, setStatus] = useState<WebSocketStatus>("uninstantiated")
  const [lastMessage, setLastMessage] = useState<any | null>(null)
  const socketRef = useRef<WebSocket | null>(null)
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const attemptRef = useRef<number>(0)
  const [comicImages, setComicImages] = useState<Comic | null>(null)
  const [comicTags, setComicTags] = useState<ComicTag[] | null>(null)

  const connect = useCallback(() => {
    // Clear any existing reconnect timeout
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current)
      reconnectTimeoutRef.current = null
    }

    // Close existing socket if it exists
    if (socketRef.current) {
      socketRef.current.close()
    }

    try {
      setStatus("connecting")
      const ws = new WebSocket(url)
      socketRef.current = ws

      ws.onopen = () => {
        setStatus("open")
        attemptRef.current = 0 // Reset reconnect attempts on successful connection
        console.log("WebSocket connection established")
      }

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data)
          if (data.event === "createdComicImages") {
            setComicImages(data.data)
          }
          if (data.event === "createdComicTags") {
            setComicTags(data.data)
          }
          setLastMessage(data)
        } catch (error) {
          // If the message isn't JSON, store it as-is
          setLastMessage(event.data)
        }
      }

      ws.onclose = (event) => {
        setStatus("closed")
        console.log(`WebSocket connection closed: ${event.code} ${event.reason}`)
        
        // Attempt to reconnect if not a normal closure and we haven't exceeded attempts
        if (event.code !== 1000 && attemptRef.current < reconnectAttempts) {
          attemptRef.current += 1
          console.log(`Attempting to reconnect (${attemptRef.current}/${reconnectAttempts})...`)
          
          reconnectTimeoutRef.current = setTimeout(() => {
            connect()
          }, reconnectInterval)
        }
      }

      ws.onerror = (error) => {
        console.error("WebSocket error:", error)
      }
    } catch (error) {
      console.error("Failed to connect to WebSocket:", error)
      setStatus("closed")
    }
  }, [url, reconnectInterval, reconnectAttempts])

  const disconnect = useCallback(() => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current)
      reconnectTimeoutRef.current = null
    }

    if (socketRef.current && (socketRef.current.readyState === WebSocket.OPEN || socketRef.current.readyState === WebSocket.CONNECTING)) {
      setStatus("closing")
      socketRef.current.close(1000, "Normal closure")
    }
  }, [])

  const sendMessage = useCallback((message: string | object) => {
    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
      const messageString = typeof message === 'string' ? message : JSON.stringify(message)
      socketRef.current.send(messageString)
      return true
    }
    console.warn("Cannot send message, WebSocket is not connected")
    return false
  }, [])

  // Connect on mount, disconnect on unmount
  useEffect(() => {
    connect()

    return () => {
      disconnect()
    }
  }, [connect, disconnect])

  const value = {
    socket: socketRef.current,
    status,
    sendMessage,
    lastMessage,
    comicImages,
    comicTags,
    connect,
    disconnect,
  }

  return <WebSocketContext.Provider value={value}>{children}</WebSocketContext.Provider>
} 