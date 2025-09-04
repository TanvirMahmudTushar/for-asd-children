"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Play, Pause, RotateCcw } from "lucide-react"

interface StoryContent {
  id: string
  title: string
  content: string[]
  images: string[]
  voiceText: string[]
}

const storyDatabase: Record<string, StoryContent> = {
  story: {
    id: "story",
    title: "ছোট্ট খরগোশের গল্প",
    content: [
      "একবার এক ছোট্ট খরগোশ ছিল।",
      "সে খুব দুষ্টু ছিল এবং সবসময় লাফালাফি করত।",
      "একদিন সে একটি গাজর খুঁজে পেল।",
      "সে খুব খুশি হয়ে গাজরটি খেয়ে ফেলল।",
    ],
    images: [
      "/cute-rabbit-in-forest.jpg",
      "/playful-rabbit-jumping.jpg",
      "/rabbit-finding-carrot.jpg",
      "/happy-rabbit-eating-carrot.jpg",
    ],
    voiceText: [
      "একবার এক ছোট্ট খরগোশ ছিল।",
      "সে খুব দুষ্টু ছিল এবং সবসময় লাফালাফি করত।",
      "একদিন সে একটি গাজর খুঁজে পেল।",
      "সে খুব খুশি হয়ে গাজরটি খেয়ে ফেলল।",
    ],
  },
  numbers: {
    id: "numbers",
    title: "সংখ্যা শেখা",
    content: ["এক - একটি আপেল", "দুই - দুইটি কলা", "তিন - তিনটি আম", "চার - চারটি কমলা"],
    images: [
      "/one-red-apple.jpg",
      "/two-yellow-bananas.jpg",
      "/three-mangoes.jpg",
      "/four-oranges.jpg",
    ],
    voiceText: ["এক। একটি আপেল।", "দুই। দুইটি কলা।", "তিন। তিনটি আম।", "চার। চারটি কমলা।"],
  },
  colors: {
    id: "colors",
    title: "রং শেখা",
    content: ["লাল রং - যেমন টমেটো", "নীল রং - যেমন আকাশ", "হলুদ রং - যেমন সূর্য", "সবুজ রং - যেমন গাছের পাতা"],
    images: [
      "/red-tomato.png",
      "/blue-sky.png",
      "/yellow-sun.png",
      "/green-leaves.jpg",
    ],
    voiceText: ["লাল রং। যেমন টমেটো।", "নীল রং। যেমন আকাশ।", "হলুদ রং। যেমন সূর্য।", "সবুজ রং। যেমন গাছের পাতা।"],
  },
  animals: {
    id: "animals",
    title: "প্রাণী পরিচিতি",
    content: ["বিড়াল - মিউ মিউ করে", "কুকুর - ঘেউ ঘেউ করে", "গরু - হাম্বা হাম্বা করে", "পাখি - চিক চিক করে"],
    images: [
      "/cute-cat-meowing.jpg",
      "/friendly-dog-barking.jpg",
      "/cow-in-field.jpg",
      "/colorful-bird-singing.jpg",
    ],
    voiceText: ["বিড়াল। মিউ মিউ করে।", "কুকুর। ঘেউ ঘেউ করে।", "গরু। হাম্বা হাম্বা করে।", "পাখি। চিক চিক করে।"],
  },
  shapes: {
    id: "shapes",
    title: "আকার শেখা",
    content: ["বৃত্ত - গোল আকার", "বর্গ - চার কোণা সমান", "ত্রিভুজ - তিন কোণা", "আয়তক্ষেত্র - লম্বা চার কোণা"],
    images: [
      "/colorful-circle-shape.jpg",
      "/bright-square-shape.jpg",
      "/placeholder.svg?height=200&width=300",
      "/placeholder.svg?height=200&width=300",
    ],
    voiceText: ["বৃত্ত। গোল আকার।", "বর্গ। চার কোণা সমান।", "ত্রিভুজ। তিন কোণা।", "আয়তক্ষেত্র। লম্বা চার কোণা।"],
  },
}

interface StoryModalProps {
  isOpen: boolean
  onClose: () => void
  storyId: string | null
}

export function StoryModal({ isOpen, onClose, storyId }: StoryModalProps) {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [autoPlay, setAutoPlay] = useState(false)

  const story = storyId ? storyDatabase[storyId] : null

  useEffect(() => {
    if (isOpen) {
      setCurrentSlide(0)
      setIsPlaying(false)
      setAutoPlay(false)
    }
  }, [isOpen])

  useEffect(() => {
    let interval: NodeJS.Timeout
    if (autoPlay && story) {
      interval = setInterval(() => {
        setCurrentSlide((prev) => {
          if (prev < story.content.length - 1) {
            return prev + 1
          } else {
            setAutoPlay(false)
            setIsPlaying(false)
            return prev
          }
        })
      }, 4000) // 4 seconds per slide
    }
    return () => clearInterval(interval)
  }, [autoPlay, story])

  const playCurrentSlide = () => {
    if (!story || !("speechSynthesis" in window)) return

    const utterance = new SpeechSynthesisUtterance(story.voiceText[currentSlide])
    utterance.lang = "bn-BD"
    utterance.rate = 0.7
    utterance.onstart = () => setIsPlaying(true)
    utterance.onend = () => setIsPlaying(false)
    speechSynthesis.speak(utterance)
  }

  const startAutoPlay = () => {
    setAutoPlay(true)
    playCurrentSlide()
  }

  const stopAutoPlay = () => {
    setAutoPlay(false)
    setIsPlaying(false)
    speechSynthesis.cancel()
  }

  const resetStory = () => {
    setCurrentSlide(0)
    setAutoPlay(false)
    setIsPlaying(false)
    speechSynthesis.cancel()
  }

  if (!story) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl text-center">{story.title}</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Story Content */}
          <Card>
            <CardContent className="p-6">
              <div className="text-center space-y-4">
                <img
                  src={story.images[currentSlide] || "/placeholder.svg"}
                  alt={story.content[currentSlide]}
                  className="mx-auto rounded-lg shadow-lg max-h-64 w-auto"
                />
                <p className="text-xl font-semibold text-card-foreground">{story.content[currentSlide]}</p>
              </div>
            </CardContent>
          </Card>

          {/* Controls */}
          <div className="flex flex-wrap justify-center gap-3">
            <Button
              onClick={autoPlay ? stopAutoPlay : startAutoPlay}
              className="flex items-center gap-2"
              variant={autoPlay ? "destructive" : "default"}
            >
              {autoPlay ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              {autoPlay ? "থামান" : "চালান"}
            </Button>

            <Button onClick={playCurrentSlide} variant="outline" disabled={isPlaying}>
              <Play className="w-4 h-4 mr-2" />
              আবার শুনুন
            </Button>

            <Button onClick={resetStory} variant="outline">
              <RotateCcw className="w-4 h-4 mr-2" />
              শুরু থেকে
            </Button>
          </div>

          {/* Navigation */}
          <div className="flex justify-between items-center">
            <Button
              onClick={() => setCurrentSlide(Math.max(0, currentSlide - 1))}
              disabled={currentSlide === 0}
              variant="outline"
            >
              পূর্ববর্তী
            </Button>

            <div className="flex space-x-2">
              {story.content.map((_, index) => (
                <div
                  key={index}
                  className={`w-3 h-3 rounded-full cursor-pointer transition-colors ${
                    index === currentSlide ? "bg-primary" : "bg-muted"
                  }`}
                  onClick={() => setCurrentSlide(index)}
                />
              ))}
            </div>

            <Button
              onClick={() => setCurrentSlide(Math.min(story.content.length - 1, currentSlide + 1))}
              disabled={currentSlide === story.content.length - 1}
              variant="outline"
            >
              পরবর্তী
            </Button>
          </div>

          {/* Progress */}
          <div className="text-center text-sm text-muted-foreground">
            {currentSlide + 1} / {story.content.length}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
