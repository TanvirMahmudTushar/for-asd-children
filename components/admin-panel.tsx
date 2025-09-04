"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

interface UserAnalytics {
  totalInteractions: number
  categoriesUsed: string[]
  favoriteCards: string[]
  categoryStats: Record<string, number>
  dailyActivity: Record<string, number>
  learningGoals: string[]
  lastActive: string
}

export function AdminPanel() {
  const [analytics, setAnalytics] = useState<UserAnalytics | null>(null)
  const [selectedUserId, setSelectedUserId] = useState("1")
  const [customContent, setCustomContent] = useState({
    type: "story",
    title: "",
    content: "",
  })

  useEffect(() => {
    fetchAnalytics()
  }, [selectedUserId])

  const fetchAnalytics = async () => {
    try {
      const response = await fetch(`/api/conversation?action=analytics&userId=${selectedUserId}`)
      const data = await response.json()
      setAnalytics(data.analytics)
    } catch (error) {
      console.error("Failed to fetch analytics:", error)
    }
  }

  const exportData = async () => {
    try {
      const response = await fetch(`/api/conversation?action=export&userId=${selectedUserId}`)
      const data = await response.json()

      const blob = new Blob([JSON.stringify(data.exportData, null, 2)], { type: "application/json" })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `user-${selectedUserId}-data.json`
      a.click()
      URL.revokeObjectURL(url)
    } catch (error) {
      console.error("Failed to export data:", error)
    }
  }

  const createCustomContent = async () => {
    try {
      const response = await fetch("/api/content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "create_content",
          data: {
            type: customContent.type,
            title: customContent.title,
            content: JSON.parse(customContent.content || "{}"),
            createdBy: "admin",
          },
        }),
      })

      if (response.ok) {
        alert("কাস্টম কন্টেন্ট তৈরি হয়েছে!")
        setCustomContent({ type: "story", title: "", content: "" })
      }
    } catch (error) {
      console.error("Failed to create content:", error)
      alert("কন্টেন্ট তৈরিতে সমস্যা হয়েছে")
    }
  }

  const chartData = analytics
    ? Object.entries(analytics.categoryStats).map(([category, count]) => ({
        category:
          category === "basic-needs"
            ? "মৌলিক প্রয়োজন"
            : category === "emotions"
              ? "আবেগ"
              : category === "activities"
                ? "কার্যক্রম"
                : category === "educational"
                  ? "শিক্ষামূলক"
                  : category,
        interactions: count,
      }))
    : []

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-foreground mb-2">🔧 অ্যাডমিন প্যানেল</h1>
        <p className="text-muted-foreground">ব্যবহারকারীর অগ্রগতি এবং সিস্টেম ব্যবস্থাপনা</p>
      </div>

      <Tabs defaultValue="analytics" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="analytics">বিশ্লেষণ</TabsTrigger>
          <TabsTrigger value="content">কাস্টম কন্টেন্ট</TabsTrigger>
          <TabsTrigger value="settings">সেটিংস</TabsTrigger>
        </TabsList>

        <TabsContent value="analytics" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>ব্যবহারকারী নির্বাচন</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4 items-center">
                <Input
                  placeholder="ব্যবহারকারী ID"
                  value={selectedUserId}
                  onChange={(e) => setSelectedUserId(e.target.value)}
                  className="max-w-xs"
                />
                <Button onClick={fetchAnalytics}>বিশ্লেষণ লোড করুন</Button>
                <Button onClick={exportData} variant="outline">
                  ডেটা এক্সপোর্ট
                </Button>
              </div>
            </CardContent>
          </Card>

          {analytics && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card>
                  <CardContent className="p-6">
                    <div className="text-2xl font-bold text-primary">{analytics.totalInteractions}</div>
                    <p className="text-sm text-muted-foreground">মোট ইন্টারঅ্যাকশন</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6">
                    <div className="text-2xl font-bold text-primary">{analytics.categoriesUsed.length}</div>
                    <p className="text-sm text-muted-foreground">ব্যবহৃত বিভাগ</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6">
                    <div className="text-2xl font-bold text-primary">{analytics.favoriteCards.length}</div>
                    <p className="text-sm text-muted-foreground">প্রিয় কার্ড</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6">
                    <div className="text-2xl font-bold text-primary">{analytics.learningGoals.length}</div>
                    <p className="text-sm text-muted-foreground">শেখার লক্ষ্য</p>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>বিভাগ অনুযায়ী ইন্টারঅ্যাকশন</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="category" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="interactions" fill="#d97706" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>প্রিয় কার্ডসমূহ</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {analytics.favoriteCards.map((card, index) => (
                      <span key={index} className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm">
                        {card}
                      </span>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </TabsContent>

        <TabsContent value="content" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>নতুন কাস্টম কন্টেন্ট তৈরি করুন</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">কন্টেন্ট টাইপ</label>
                <select
                  value={customContent.type}
                  onChange={(e) => setCustomContent({ ...customContent, type: e.target.value })}
                  className="w-full p-2 border rounded-md"
                >
                  <option value="story">গল্প</option>
                  <option value="card">কার্ড</option>
                  <option value="activity">কার্যক্রম</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">শিরোনাম</label>
                <Input
                  value={customContent.title}
                  onChange={(e) => setCustomContent({ ...customContent, title: e.target.value })}
                  placeholder="কন্টেন্টের শিরোনাম লিখুন"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">কন্টেন্ট (JSON ফরম্যাট)</label>
                <Textarea
                  value={customContent.content}
                  onChange={(e) => setCustomContent({ ...customContent, content: e.target.value })}
                  placeholder='{"slides": [{"text": "গল্পের অংশ", "image": "/image.jpg"}]}'
                  rows={6}
                />
              </div>

              <Button onClick={createCustomContent} className="w-full">
                কন্টেন্ট তৈরি করুন
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>সিস্টেম সেটিংস</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <h3 className="font-medium">ভয়েস সেটিংস</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm mb-1">কথার গতি</label>
                    <Input type="range" min="0.5" max="2" step="0.1" defaultValue="0.8" />
                  </div>
                  <div>
                    <label className="block text-sm mb-1">ভলিউম</label>
                    <Input type="range" min="0" max="1" step="0.1" defaultValue="1" />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="font-medium">ইন্টারফেস সেটিংস</h3>
                <div className="space-y-2">
                  <label className="flex items-center space-x-2">
                    <input type="checkbox" defaultChecked />
                    <span>অটো-প্লে গল্প</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input type="checkbox" defaultChecked />
                    <span>কার্ড ক্লিকে সাউন্ড</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input type="checkbox" />
                    <span>ডার্ক মোড</span>
                  </label>
                </div>
              </div>

              <Button className="w-full">সেটিংস সংরক্ষণ করুন</Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
