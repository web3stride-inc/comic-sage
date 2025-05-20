"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Sparkles, Zap } from "lucide-react"
import { LoadingPanels } from "@/components/loading-panels"
import { TopBar } from "@/components/top-bar"
import axios, { AxiosError } from "axios"
import { useWebSocket } from "@/lib/websocket/websocket-context"
import { useToast } from "@/hooks/use-toast"

export function LandingPage() {
  const { toast } = useToast()
  const router = useRouter()
  const { sendMessage } = useWebSocket()
  const [topic, setTopic] = useState("")
  const [difficulty, setDifficulty] = useState(50)
  const [tone, setTone] = useState<"humorous" | "serious" | "analogy">("humorous")
  const [isGenerating, setIsGenerating] = useState(false)
  const [isSurprising, setIsSurprising] = useState(false)

  const generateComic = async () => {
    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/comicai/comics`, {
        topic,
        tone,
        difficulty,
      })

      if (response.data.status == 'success') {
        return response.data.message.comic
      } else {
        setIsGenerating(false);
        throw new Error(response.data.message);
      }
    } catch (error) {
      console.error(error)
      if (error instanceof AxiosError && error.response && error.response.status === 429) {
        toast({
          title: "Rate limit exceeded",
          description: "Please upgrade plan.",
        })
      } else {
        toast({
          title: "An error occurred",
          description: "Please try again later.",
        })
      }
    } finally {
      setIsGenerating(false)
    }
  }

  const handleGenerate = async () => {
    if (!topic.trim()) return
    setIsGenerating(true)
    const comicData = await generateComic()
    try {
      axios.post(`${process.env.NEXT_PUBLIC_API_URL}/comicai/create-images`, {
        comicId: comicData.id,
      }).then((res) => {
      })
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
      setIsGenerating(false)
    }
    router.push(`/generate?topic=${encodeURIComponent(topic)}&difficulty=${difficulty}&tone=${tone}&id=${comicData.id}`)
  }

  const handleSurpriseMe = async () => {
    setIsSurprising(true)

    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/comicai/recommend-topic`, {
        difficulty: difficulty,
        tone: tone
      })

      const topic = response.data.message.topic

      setTopic(topic)
    } catch (error) {
      console.error(error)
      if (error instanceof AxiosError && error.response && error.response.status === 429) {
        console.log('aaaaaaaaaaaaaaaaa')
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
      setIsSurprising(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-stone-50 to-stone-100 dark:from-stone-900 dark:to-stone-950">
      <TopBar />

      <main className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-stone-800 dark:text-stone-100">
            <span className="inline-block animate-bounce-slow mr-2">🌟</span>
            Turn any topic into a comic
          </h1>
          <p className="text-lg text-stone-600 dark:text-stone-300 max-w-2xl mx-auto">
            Learn faster and remember longer with visual storytelling that makes complex topics simple and fun!
          </p>
        </div>

        <div className="bg-white dark:bg-stone-800 rounded-3xl shadow-xl p-6 md:p-8 max-w-2xl mx-auto">
          <div className="space-y-6">
            <div>
              <Label htmlFor="topic" className="text-lg font-medium mb-2 block">
                What would you like to learn about?
              </Label>
              <Textarea
                id="topic"
                placeholder="E.g., Photosynthesis, Ancient Rome, Quantum Physics..."
                className="resize-none shadow-inner rounded-2xl p-4 text-lg min-h-[100px] border-2 border-stone-200 dark:border-stone-700 focus:border-yellow-400 dark:focus:border-yellow-500 transition-all"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <Label htmlFor="difficulty" className="text-lg font-medium">
                  Difficulty Level
                </Label>
                <span className="text-sm font-medium px-3 py-1 bg-stone-100 dark:bg-stone-700 rounded-full">
                  {difficulty < 33 ? "Beginner" : difficulty < 66 ? "Intermediate" : "Advanced"}
                </span>
              </div>
              <Slider
                id="difficulty"
                defaultValue={[50]}
                max={100}
                step={1}
                onValueChange={(value) => setDifficulty(value[0])}
                className="py-4 [&>.bg-secondary]:dark:bg-stone-700"
              />
            </div>

            <div>
              <Label className="text-lg font-medium mb-3 block">Tone</Label>
              <RadioGroup defaultValue="humorous" value={tone} onValueChange={(value) => setTone(value as "humorous" | "serious" | "analogy")} className="flex flex-wrap gap-4">
                <div onClick={() => setTone("humorous")} className="flex items-center space-x-2 bg-stone-100 dark:bg-stone-700 p-3 rounded-xl hover:bg-stone-200 dark:hover:bg-stone-600 transition-colors cursor-pointer">
                  <RadioGroupItem value="humorous" id="humorous" />
                  <Label htmlFor="humor" className="cursor-pointer">
                    Humorous
                  </Label>
                </div>
                <div onClick={() => setTone("serious")} className="flex items-center space-x-2 bg-stone-100 dark:bg-stone-700 p-3 rounded-xl hover:bg-stone-200 dark:hover:bg-stone-600 transition-colors cursor-pointer">
                  <RadioGroupItem value="serious" id="serious" />
                  <Label htmlFor="serious" className="cursor-pointer">
                    Serious
                  </Label>
                </div>
                <div onClick={() => setTone("analogy")} className="flex items-center space-x-2 bg-stone-100 dark:bg-stone-700 p-3 rounded-xl hover:bg-stone-200 dark:hover:bg-stone-600 transition-colors cursor-pointer">
                  <RadioGroupItem value="analogy" id="analogy" />
                  <Label htmlFor="analogy" className="cursor-pointer">
                    Analogy-based
                  </Label>
                </div>
              </RadioGroup>
            </div>

            {isGenerating ? (
              <div className="mt-8">
                <LoadingPanels />
              </div>
            ) : (
              <div className="flex flex-col sm:flex-row gap-4 mt-8">
                <Button
                  onClick={handleGenerate}
                  className="flex-1 h-14 text-lg rounded-2xl bg-yellow-500 hover:bg-yellow-600 text-stone-900 shadow-lg hover:shadow-xl transition-all"
                >
                  <Sparkles className="mr-2 h-5 w-5" />
                  Generate Comic
                </Button>
                <Button
                  onClick={handleSurpriseMe}
                  disabled={isSurprising}
                  variant="outline"
                  className="flex-1 h-14 text-lg rounded-2xl border-2 border-stone-300 dark:border-stone-600 hover:border-yellow-500 dark:hover:border-yellow-500 shadow-md hover:shadow-lg transition-all"
                >
                  <Zap className="mr-2 h-5 w-5" />
                  {isSurprising ? "Generating..." : "Surprise Me"}
                </Button>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
