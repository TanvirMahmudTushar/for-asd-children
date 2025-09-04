import { type NextRequest, NextResponse } from "next/server"

interface CustomContent {
  id: string
  type: "story" | "card" | "activity"
  title: string
  content: any
  createdBy: string
  createdAt: string
  isActive: boolean
}

// In-memory storage for custom content
const customContent: CustomContent[] = [
  {
    id: "custom-1",
    type: "story",
    title: "আমার পরিবার",
    content: {
      slides: [
        { text: "এটি আমার মা", image: "/family-mother.jpg" },
        { text: "এটি আমার বাবা", image: "/family-father.jpg" },
        { text: "আমরা একসাথে খুশি", image: "/happy-family.jpg" },
      ],
      voiceText: ["এটি আমার মা", "এটি আমার বাবা", "আমরা একসাথে খুশি"],
    },
    createdBy: "therapist",
    createdAt: new Date().toISOString(),
    isActive: true,
  },
]

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { action, data } = body

    switch (action) {
      case "create_content":
        const newContent: CustomContent = {
          id: `custom-${Date.now()}`,
          ...data,
          createdAt: new Date().toISOString(),
          isActive: true,
        }
        customContent.push(newContent)
        return NextResponse.json({ success: true, content: newContent })

      case "update_content":
        const index = customContent.findIndex((item) => item.id === data.id)
        if (index !== -1) {
          customContent[index] = { ...customContent[index], ...data }
          return NextResponse.json({ success: true, content: customContent[index] })
        }
        return NextResponse.json({ error: "Content not found" }, { status: 404 })

      case "delete_content":
        const deleteIndex = customContent.findIndex((item) => item.id === data.id)
        if (deleteIndex !== -1) {
          customContent[deleteIndex].isActive = false
          return NextResponse.json({ success: true })
        }
        return NextResponse.json({ error: "Content not found" }, { status: 404 })

      default:
        return NextResponse.json({ error: "Invalid action" }, { status: 400 })
    }
  } catch (error) {
    console.error("Content API Error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const type = searchParams.get("type")
  const createdBy = searchParams.get("createdBy")

  let filteredContent = customContent.filter((item) => item.isActive)

  if (type) {
    filteredContent = filteredContent.filter((item) => item.type === type)
  }

  if (createdBy) {
    filteredContent = filteredContent.filter((item) => item.createdBy === createdBy)
  }

  return NextResponse.json({ content: filteredContent })
}
