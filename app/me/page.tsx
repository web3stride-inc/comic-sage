"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { TopBar } from "@/components/top-bar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { LibraryGrid } from "@/components/library-grid"
import { FilterChips } from "@/components/filter-chips"
import axios from "axios"
import { Comic } from "@/types/comic.types"

export default function DashboardPage() {
  const [comics, setComics] = useState<Comic[]>([])
  const [activeFilterTag, setActiveFilterTag] = useState("all")
  const [isLoading, setIsLoading] = useState(true)
  const [tags, setTags] = useState<string[]>([])

  const handleFilterChange = (tag: string) => {
    setIsLoading(true)
    
    setActiveFilterTag(tag)
    if (tag === "all") {
      try {
        axios.get(`${process.env.NEXT_PUBLIC_API_URL}/comicai/comics`).then((res) => {
          setComics(res.data.message.comics)
        })
      } catch (error) {
        console.log(error)
      }
    } else {
      try {
        axios.get(`${process.env.NEXT_PUBLIC_API_URL}/comicai/comics?tag=${tag}`).then((res) => {
          setComics(res.data.message.comics)
        })
      } catch (error) {
        console.log(error)
      }
    }
    setIsLoading(false)
  }

  useEffect(() => {
    
    handleFilterChange(activeFilterTag)

    axios.get(`${process.env.NEXT_PUBLIC_API_URL}/comicai/tags`).then((res) => {
      setTags(res.data.message.tags)
    })
  }, [activeFilterTag])

  return (
    <div className="min-h-screen bg-stone-50 dark:bg-stone-900">
      <TopBar />

      <main className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold mb-2">My Comic Library</h1>
            <p className="text-stone-600 dark:text-stone-400">Your personal collection of educational comics</p>
          </div>

          <Button
            onClick={() => (window.location.href = "/")}
            className="bg-yellow-500 hover:bg-yellow-600 text-stone-900"
          >
            Create New Comic
          </Button>
        </div>

        <FilterChips tags={['all', ...tags]} activeFilterTag={activeFilterTag} onFilterChange={handleFilterChange} />

        <Tabs defaultValue="grid" className="mt-6">
          <div className="flex justify-between items-center mb-4">
            <p className="text-sm text-stone-500 dark:text-stone-400">
              {comics.length} comics {activeFilterTag !== "All" ? `in ${activeFilterTag}` : ""}
            </p>

            <TabsList>
              <TabsTrigger value="grid">Grid</TabsTrigger>
              <TabsTrigger value="list">List</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="grid" className="mt-6">
            <LibraryGrid comics={comics} isLoading={isLoading} />
          </TabsContent>

          <TabsContent value="list" className="mt-6">
            <div className="bg-white dark:bg-stone-800 rounded-xl shadow p-4">
              <p className="text-center py-8 text-stone-500 dark:text-stone-400">
                List view would display comics in a more detailed format with additional metadata.
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
