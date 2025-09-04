import { type NextRequest, NextResponse } from "next/server"

interface ConversationEntry {
  id: string
  text: string
  timestamp: string
  type: "user" | "robot"
  category?: string
  cardId?: string
  userId?: string
}

interface UserProgress {
  userId: string
  totalInteractions: number
  categoriesUsed: string[]
  favoriteCards: string[]
  lastActive: string
  learningGoals: string[]
}

// In-memory storage (in production, use a proper database)
const conversationHistory: ConversationEntry[] = []
const userProgress: Record<string, UserProgress> = {}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { action, data } = body

    switch (action) {
      case "save_conversation":
        const entry: ConversationEntry = {
          ...data,
          timestamp: new Date().toISOString(),
        }
        conversationHistory.push(entry)

        // Update user progress
        if (data.userId) {
          updateUserProgress(data.userId, data.category, data.cardId)
        }

        return NextResponse.json({ success: true, entry })

      case "get_conversation_history":
        const { userId, limit = 50 } = data
        const userConversations = conversationHistory.filter((entry) => entry.userId === userId).slice(-limit)

        return NextResponse.json({ conversations: userConversations })

      case "get_user_progress":
        const progress = userProgress[data.userId] || createNewUserProgress(data.userId)
        return NextResponse.json({ progress })

      case "update_learning_goals":
        if (userProgress[data.userId]) {
          userProgress[data.userId].learningGoals = data.goals
          userProgress[data.userId].lastActive = new Date().toISOString()
        }
        return NextResponse.json({ success: true })

      default:
        return NextResponse.json({ error: "Invalid action" }, { status: 400 })
    }
  } catch (error) {
    console.error("API Error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const userId = searchParams.get("userId")
  const action = searchParams.get("action")

  if (action === "analytics" && userId) {
    const analytics = generateAnalytics(userId)
    return NextResponse.json({ analytics })
  }

  if (action === "export" && userId) {
    const exportData = {
      conversations: conversationHistory.filter((entry) => entry.userId === userId),
      progress: userProgress[userId],
      exportDate: new Date().toISOString(),
    }
    return NextResponse.json({ exportData })
  }

  return NextResponse.json({ error: "Invalid request" }, { status: 400 })
}

function updateUserProgress(userId: string, category?: string, cardId?: string) {
  if (!userProgress[userId]) {
    userProgress[userId] = createNewUserProgress(userId)
  }

  const progress = userProgress[userId]
  progress.totalInteractions++
  progress.lastActive = new Date().toISOString()

  if (category && !progress.categoriesUsed.includes(category)) {
    progress.categoriesUsed.push(category)
  }

  if (cardId) {
    const existingIndex = progress.favoriteCards.findIndex((card) => card === cardId)
    if (existingIndex === -1) {
      progress.favoriteCards.push(cardId)
    }
    // Keep only top 10 favorite cards
    if (progress.favoriteCards.length > 10) {
      progress.favoriteCards = progress.favoriteCards.slice(-10)
    }
  }
}

function createNewUserProgress(userId: string): UserProgress {
  return {
    userId,
    totalInteractions: 0,
    categoriesUsed: [],
    favoriteCards: [],
    lastActive: new Date().toISOString(),
    learningGoals: [],
  }
}

function generateAnalytics(userId: string) {
  const progress = userProgress[userId]
  const userConversations = conversationHistory.filter((entry) => entry.userId === userId)

  if (!progress) {
    return null
  }

  const categoryStats = progress.categoriesUsed.reduce(
    (acc, category) => {
      const categoryConversations = userConversations.filter((entry) => entry.category === category)
      acc[category] = categoryConversations.length
      return acc
    },
    {} as Record<string, number>,
  )

  const dailyActivity = userConversations.reduce(
    (acc, entry) => {
      const date = entry.timestamp.split("T")[0]
      acc[date] = (acc[date] || 0) + 1
      return acc
    },
    {} as Record<string, number>,
  )

  return {
    totalInteractions: progress.totalInteractions,
    categoriesUsed: progress.categoriesUsed.length,
    favoriteCards: progress.favoriteCards,
    categoryStats,
    dailyActivity,
    learningGoals: progress.learningGoals,
    lastActive: progress.lastActive,
  }
}
