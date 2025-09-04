"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { PecsCard } from "@/components/pecs-card"
import { VoiceSystem } from "@/components/voice-system"
import { ConversationPanel } from "@/components/conversation-panel"
import { StoryModal } from "@/components/story-modal"
import { conversationEngine } from "@/components/conversation-engine"

const pecsCategories = [
  {
    id: "basic-needs",
    title: "মৌলিক প্রয়োজন", // Basic Needs in Bangla
    cards: [
      { id: "sleep", icon: "😴", text: "ঘুম", phrase: "আমি ঘুমাতে চাই" },
      { id: "eat", icon: "🍽️", text: "খাবার", phrase: "আমি খেতে চাই" },
      { id: "drink", icon: "🥤", text: "পানি", phrase: "আমি পানি খেতে চাই" },
      { id: "bathroom", icon: "🚽", text: "বাথরুম", phrase: "আমি বাথরুমে যেতে চাই" },
    ],
  },
  {
    id: "emotions",
    title: "আবেগ", // Emotions in Bangla
    cards: [
      { id: "happy", icon: "😊", text: "খুশি", phrase: "আমি খুশি" },
      { id: "sad", icon: "😢", text: "দুঃখিত", phrase: "আমি দুঃখিত" },
      { id: "angry", icon: "😠", text: "রাগ", phrase: "আমি রাগান্বিত" },
      { id: "scared", icon: "😨", text: "ভয়", phrase: "আমি ভয় পেয়েছি" },
    ],
  },
  {
    id: "activities",
    title: "কার্যক্রম", // Activities in Bangla
    cards: [
      { id: "play", icon: "🎮", text: "খেলা", phrase: "আমি খেলতে চাই" },
      { id: "study", icon: "📚", text: "পড়াশোনা", phrase: "আমি পড়তে চাই" },
      { id: "story", icon: "📖", text: "গল্প", phrase: "আমি গল্প শুনতে চাই", hasStory: true },
      { id: "help", icon: "🤝", text: "সাহায্য", phrase: "আমার সাহায্য দরকার" },
    ],
  },
  {
    id: "educational",
    title: "শিক্ষামূলক", // Educational in Bangla
    cards: [
      { id: "numbers", icon: "🔢", text: "সংখ্যা", phrase: "আমি সংখ্যা শিখতে চাই", hasStory: true },
      { id: "colors", icon: "🎨", text: "রং", phrase: "আমি রং শিখতে চাই", hasStory: true },
      { id: "animals", icon: "🐱", text: "প্রাণী", phrase: "আমি প্রাণী সম্পর্কে জানতে চাই", hasStory: true },
      { id: "shapes", icon: "🔺", text: "আকার", phrase: "আমি আকার শিখতে চাই", hasStory: true },
    ],
  },
]

interface ConversationEntry {
  id: string
  text: string
  timestamp: Date
  type: "user" | "robot"
  suggestions?: string[]
}

export default function RobotInterface() {
  const [selectedCard, setSelectedCard] = useState<string | null>(null)
  const [activeCategory, setActiveCategory] = useState("basic-needs")
  const [conversationHistory, setConversationHistory] = useState<ConversationEntry[]>([])
  const [showStoryModal, setShowStoryModal] = useState(false)
  const [currentStory, setCurrentStory] = useState<string | null>(null)

  useEffect(() => {
    const greeting = conversationEngine.getGreeting()
    const robotEntry: ConversationEntry = {
      id: "greeting",
      text: greeting,
      timestamp: new Date(),
      type: "robot",
      suggestions: ["হ্যালো!", "আমি ভালো আছি"],
    }
    setConversationHistory([robotEntry])

    setTimeout(() => {
      if ("speechSynthesis" in window) {
        const utterance = new SpeechSynthesisUtterance(greeting)
        utterance.lang = "bn-BD"
        utterance.rate = 0.8
        speechSynthesis.speak(utterance)
      }
    }, 1000)
  }, [])

  const handleCardClick = (card: any) => {
    console.log("[v0] Card clicked:", card)
    setSelectedCard(card.id)

    if (card.hasStory) {
      setCurrentStory(card.id)
      setShowStoryModal(true)
    }

    const userEntry: ConversationEntry = {
      id: `user-${Date.now()}`,
      text: card.phrase,
      timestamp: new Date(),
      type: "user",
    }

    const response = conversationEngine.generateResponse(card.id, activeCategory)
    const robotEntry: ConversationEntry = {
      id: `robot-${Date.now()}`,
      text: response.text,
      timestamp: new Date(),
      type: "robot",
      suggestions: response.suggestions,
    }

    setConversationHistory((prev) => [...prev, userEntry, robotEntry])

    if ("speechSynthesis" in window) {
      const userUtterance = new SpeechSynthesisUtterance(card.phrase)
      userUtterance.lang = "bn-BD"
      userUtterance.rate = 0.8

      userUtterance.onend = () => {
        setTimeout(() => {
          const robotUtterance = new SpeechSynthesisUtterance(response.text)
          robotUtterance.lang = "bn-BD"
          robotUtterance.rate = 0.8

          if (response.followUp) {
            robotUtterance.onend = () => {
              setTimeout(() => {
                const followUpUtterance = new SpeechSynthesisUtterance(response.followUp!)
                followUpUtterance.lang = "bn-BD"
                followUpUtterance.rate = 0.8
                speechSynthesis.speak(followUpUtterance)
              }, 1000)
            }
          }

          speechSynthesis.speak(robotUtterance)
        }, 800)
      }

      speechSynthesis.speak(userUtterance)
    }
  }

  const handleSuggestionClick = (suggestion: string) => {
    const userEntry: ConversationEntry = {
      id: `user-suggestion-${Date.now()}`,
      text: suggestion,
      timestamp: new Date(),
      type: "user",
    }

    const response = conversationEngine.generateResponse("suggestion", activeCategory)
    const robotEntry: ConversationEntry = {
      id: `robot-suggestion-${Date.now()}`,
      text: response.text,
      timestamp: new Date(),
      type: "robot",
      suggestions: response.suggestions,
    }

    setConversationHistory((prev) => [...prev, userEntry, robotEntry])
  }

  const currentCategory = pecsCategories.find((cat) => cat.id === activeCategory)

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">🤖 সহায়ক রোবট</h1>
          <p className="text-lg text-muted-foreground">আমার সাথে কথা বলো এবং শিখো</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Category Selection */}
          <div className="lg:col-span-1">
            <Card className="p-4">
              <h2 className="text-xl font-semibold mb-4 text-card-foreground">বিভাগ নির্বাচন করুন</h2>
              <div className="space-y-2">
                {pecsCategories.map((category) => (
                  <Button
                    key={category.id}
                    variant={activeCategory === category.id ? "default" : "outline"}
                    className="w-full justify-start text-left h-auto py-3"
                    onClick={() => setActiveCategory(category.id)}
                  >
                    <span className="text-lg">{category.title}</span>
                  </Button>
                ))}
              </div>
            </Card>

            {/* Voice System Controls */}
            <VoiceSystem />
          </div>

          {/* PECS Cards Grid */}
          <div className="lg:col-span-2">
            <Card className="p-6">
              <h2 className="text-2xl font-semibold mb-6 text-card-foreground">{currentCategory?.title}</h2>
              <div className="grid grid-cols-2 gap-4">
                {currentCategory?.cards.map((card) => (
                  <PecsCard
                    key={card.id}
                    card={card}
                    isSelected={selectedCard === card.id}
                    onClick={() => handleCardClick(card)}
                  />
                ))}
              </div>
            </Card>
          </div>
        </div>

        {/* Conversation Panel */}
        <ConversationPanel history={conversationHistory} onSuggestionClick={handleSuggestionClick} />

        <StoryModal isOpen={showStoryModal} onClose={() => setShowStoryModal(false)} storyId={currentStory} />
      </div>
    </div>
  )
}
