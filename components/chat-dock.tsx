"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Send } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import axios, { AxiosError } from "axios"
import { useToast } from "@/hooks/use-toast"

interface Message {
  id: string
  content: string
  sender: "user" | "assistant"
  timestamp: Date
}

interface ChatDockProps {
  topic: string
  id: string
}

export function ChatDock({ topic, id }: ChatDockProps) {
  const { toast } = useToast()
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      content: `I've created a comic about "${topic}". What would you like to know more about?`,
      sender: "assistant",
      timestamp: new Date(),
    },
  ])
  const [input, setInput] = useState("")
  const [isTyping, setIsTyping] = useState(false)

  const handleSendMessage = async () => {
    if (!input.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      content: input,
      sender: "user",
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsTyping(true)

    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/comicai/sensay-chat`, {
        comicId: id,
        message: input,
      })

      setMessages((prev) => [...prev, { content: response.data.message.response, sender: "assistant", timestamp: new Date(), id: Date.now().toString() }])
    } catch (error) {
      console.error(error)
      if (error instanceof AxiosError && error.response && error.response.status === 429) {
        toast({
          title: "Rate limit exceeded",
          description: "Please upgrade plan.",
          variant: "destructive",
        })
      } else {
        toast({
          title: "An error occurred",
          description: "Please try again later.",
        })
      }
    } finally {
      setIsTyping(false)
    }
  }

  return (
    <div className="bg-white dark:bg-stone-800 rounded-xl shadow-lg h-[70vh] flex flex-col border border-stone-200 dark:border-stone-700">
      <div className="p-4 border-b border-stone-200 dark:border-stone-700">
        <h3 className="font-medium">Ask More About This Topic</h3>
        <p className="text-sm text-stone-500 dark:text-stone-400">Deepen your understanding with follow-up questions</p>
      </div>

      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {messages.map((message) => (
            <div key={message.id} className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}>
              <div className="flex items-start max-w-[80%] gap-2">
                {message.sender === "assistant" && (
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="/logo-192.png" />
                    <AvatarFallback>CS</AvatarFallback>
                  </Avatar>
                )}
                <div
                  className={`p-3 rounded-2xl ${message.sender === "user"
                      ? "bg-yellow-500 text-stone-900"
                      : "bg-stone-100 dark:bg-stone-700 text-stone-800 dark:text-stone-200"
                    }`}
                >
                  {message.content}
                </div>
                {message.sender === "user" && (
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="/placeholder.svg?height=32&width=32" />
                    <AvatarFallback>U</AvatarFallback>
                  </Avatar>
                )}
              </div>
            </div>
          ))}
          {isTyping && (
            <div className="flex justify-start">
              <div className="flex items-start max-w-[80%] gap-2">
                <Avatar className="h-8 w-8">
                  <AvatarImage src="/logo-192.png" />
                  <AvatarFallback>CS</AvatarFallback>
                </Avatar>
                <div className="p-3 rounded-2xl bg-stone-100 dark:bg-stone-700">
                  <div className="flex space-x-1">
                    <div
                      className="h-2 w-2 bg-stone-400 dark:bg-stone-500 rounded-full animate-bounce"
                      style={{ animationDelay: "0ms" }}
                    ></div>
                    <div
                      className="h-2 w-2 bg-stone-400 dark:bg-stone-500 rounded-full animate-bounce"
                      style={{ animationDelay: "150ms" }}
                    ></div>
                    <div
                      className="h-2 w-2 bg-stone-400 dark:bg-stone-500 rounded-full animate-bounce"
                      style={{ animationDelay: "300ms" }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </ScrollArea>

      <div className="p-4 border-t border-stone-200 dark:border-stone-700">
        <form
          onSubmit={(e) => {
            e.preventDefault()
            handleSendMessage()
          }}
          className="flex items-center gap-2"
        >
          <Input
            placeholder="Ask a question..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-1"
          />
          <Button type="submit" size="icon" disabled={!input.trim() || isTyping}>
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </div>
    </div>
  )
}
