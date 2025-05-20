"use client"

import { useWebSocket } from "@/lib/websocket/websocket-context"
import { Wifi, WifiOff } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

export function WebSocketStatus() {
  const { status, connect } = useWebSocket()
  
  const getStatusColor = () => {
    switch (status) {
      case "open":
        return "text-green-500"
      case "connecting":
        return "text-yellow-500 animate-pulse"
      case "closed":
      case "closing":
        return "text-red-500"
      default:
        return "text-gray-500"
    }
  }
  
  const getStatusText = () => {
    switch (status) {
      case "open":
        return "Connected"
      case "connecting":
        return "Connecting..."
      case "closed":
        return "Disconnected (click to reconnect)"
      case "closing":
        return "Disconnecting..."
      default:
        return "Not connected"
    }
  }
  
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <button 
            onClick={() => status === "closed" && connect()}
            className={`flex items-center justify-center h-8 w-8 rounded-full ${getStatusColor()}`}
          >
            {status === "open" ? (
              <Wifi className="h-4 w-4" />
            ) : (
              <WifiOff className="h-4 w-4" />
            )}
          </button>
        </TooltipTrigger>
        <TooltipContent>
          <p>WebSocket: {getStatusText()}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
} 