"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { TopBar } from "@/components/top-bar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BarChart, LineChart, PieChart, Users, BookOpen, Clock, TrendingUp } from "lucide-react"

export default function AdminPage() {
  const [isLoading, setIsLoading] = useState(true)
  const [stats, setStats] = useState({
    rendersToday: 0,
    avgLatency: 0,
    activeUsers: 0,
    totalComics: 0,
  })

  useEffect(() => {
    // Simulate loading data
    const timer = setTimeout(() => {
      setStats({
        rendersToday: 1247,
        avgLatency: 2.3,
        activeUsers: 328,
        totalComics: 5842,
      })
      setIsLoading(false)
    }, 1500)

    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="min-h-screen bg-stone-50 dark:bg-stone-900">
      <TopBar />

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
          <p className="text-stone-600 dark:text-stone-400">Monitor and manage ComicSage platform</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatsCard
            title="Renders Today"
            value={stats.rendersToday}
            description="+12% from yesterday"
            icon={<BarChart className="h-5 w-5" />}
            isLoading={isLoading}
          />
          <StatsCard
            title="Avg. Latency"
            value={stats.avgLatency}
            unit="s"
            description="0.3s faster than last week"
            icon={<Clock className="h-5 w-5" />}
            isLoading={isLoading}
          />
          <StatsCard
            title="Active Users"
            value={stats.activeUsers}
            description="+28 in the last hour"
            icon={<Users className="h-5 w-5" />}
            isLoading={isLoading}
          />
          <StatsCard
            title="Total Comics"
            value={stats.totalComics}
            description="+124 today"
            icon={<BookOpen className="h-5 w-5" />}
            isLoading={isLoading}
          />
        </div>

        {/* Charts */}
        <Tabs defaultValue="usage" className="space-y-4">
          <TabsList>
            <TabsTrigger value="usage">Usage</TabsTrigger>
            <TabsTrigger value="topics">Popular Topics</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
          </TabsList>

          <TabsContent value="usage" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Daily Comic Generations</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] flex items-center justify-center bg-stone-100 dark:bg-stone-800 rounded-lg">
                  <div className="text-center">
                    <LineChart className="h-10 w-10 mx-auto mb-2 text-stone-400" />
                    <p>Chart visualization would appear here</p>
                    <p className="text-sm text-stone-500 dark:text-stone-400">Showing daily comic generation trends</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="topics" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Top Topics This Week</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] flex items-center justify-center bg-stone-100 dark:bg-stone-800 rounded-lg">
                  <div className="text-center">
                    <PieChart className="h-10 w-10 mx-auto mb-2 text-stone-400" />
                    <p>Chart visualization would appear here</p>
                    <p className="text-sm text-stone-500 dark:text-stone-400">Showing distribution of popular topics</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="performance" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>System Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] flex items-center justify-center bg-stone-100 dark:bg-stone-800 rounded-lg">
                  <div className="text-center">
                    <TrendingUp className="h-10 w-10 mx-auto mb-2 text-stone-400" />
                    <p>Chart visualization would appear here</p>
                    <p className="text-sm text-stone-500 dark:text-stone-400">Showing system performance metrics</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}

interface StatsCardProps {
  title: string
  value: number
  unit?: string
  description: string
  icon: React.ReactNode
  isLoading: boolean
}

function StatsCard({ title, value, unit = "", description, icon, isLoading }: StatsCardProps) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm font-medium text-stone-500 dark:text-stone-400">{title}</span>
          <div className="p-2 bg-stone-100 dark:bg-stone-800 rounded-full">{icon}</div>
        </div>

        {isLoading ? (
          <div className="h-8 w-24 bg-stone-200 dark:bg-stone-700 rounded animate-pulse mb-2"></div>
        ) : (
          <div className="text-3xl font-bold mb-2">
            {value.toLocaleString()}
            {unit}
          </div>
        )}

        {isLoading ? (
          <div className="h-4 w-32 bg-stone-200 dark:bg-stone-700 rounded animate-pulse"></div>
        ) : (
          <p className="text-sm text-stone-500 dark:text-stone-400">{description}</p>
        )}
      </CardContent>
    </Card>
  )
}
