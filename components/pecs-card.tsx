"use client"

import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { BookOpen } from "lucide-react"

interface PecsCardProps {
  card: {
    id: string
    icon: string
    text: string
    phrase: string
    hasStory?: boolean
  }
  isSelected: boolean
  onClick: () => void
}

export function PecsCard({ card, isSelected, onClick }: PecsCardProps) {
  return (
    <Card
      className={cn(
        "cursor-pointer transition-all duration-200 hover:scale-105 hover:shadow-lg",
        "border-2 min-h-[120px] focus-visible:ring-2 focus-visible:ring-ring relative",
        isSelected ? "border-primary bg-primary/10 shadow-lg scale-105" : "border-border hover:border-primary/50",
      )}
      onClick={onClick}
      tabIndex={0}
      role="button"
      aria-label={`${card.text} - ${card.phrase}`}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault()
          onClick()
        }
      }}
    >
      <CardContent className="flex flex-col items-center justify-center p-4 h-full">
        {card.hasStory && (
          <div className="absolute top-2 right-2 bg-secondary text-secondary-foreground rounded-full p-1">
            <BookOpen className="w-3 h-3" />
          </div>
        )}

        <div className="text-4xl mb-2" role="img" aria-label={card.text}>
          {card.icon}
        </div>
        <div className="text-center">
          <p className="font-semibold text-lg text-card-foreground mb-1">{card.text}</p>
          <p className="text-sm text-muted-foreground">{card.phrase}</p>
        </div>
      </CardContent>
    </Card>
  )
}
