"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Button } from "@/components/ui/button"
import { MessageCircle, Volume2 } from "lucide-react"

interface ConversationEntry {
  id: string
  text: string
  timestamp: Date
  type: "user" | "robot"
  suggestions?: string[]
}

interface ConversationPanelProps {
  history: ConversationEntry[]
  onSuggestionClick?: (suggestion: string) => void
}

export function ConversationPanel({ history, onSuggestionClick }: ConversationPanelProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  const speakText = (text: string) => {
    if ("speechSynthesis" in window) {
      speechSynthesis.cancel() // Stop any ongoing speech
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.lang = "bn-BD"
      utterance.rate = 0.8
      speechSynthesis.speak(utterance)
    }
  }

  const latestRobotEntry = history.filter((entry) => entry.type === "robot").slice(-1)[0]

  return (
    <Card className="mt-6">
      <CardHeader className="cursor-pointer" onClick={() => setIsExpanded(!isExpanded)}>
        <CardTitle className="text-xl flex items-center justify-between">
          <span className="flex items-center gap-2">
            <MessageCircle className="w-5 h-5" />
            কথোপকথনের ইতিহাস
          </span>
          <span className="text-sm font-normal">{isExpanded ? "সংকুচিত করুন" : "বিস্তৃত করুন"}</span>
        </CardTitle>
      </CardHeader>

      {isExpanded && (
        <CardContent>
          <ScrollArea className="h-64 w-full">
            {history.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground mb-4">এখনো কোনো কথোপকথন হয়নি। একটি কার্ড চাপুন!</p>
                <Button
                  onClick={() => speakText("হ্যালো! আমি তোমার বন্ধু রোবট। একটি কার্ড চেপে আমার সাথে কথা বলো।")}
                  variant="outline"
                  className="flex items-center gap-2"
                >
                  <Volume2 className="w-4 h-4" />
                  রোবটের সাথে কথা বলুন
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                {history.map((entry) => (
                  <div key={entry.id} className="space-y-2">
                    <div
                      className={`flex items-start space-x-3 p-3 rounded-lg ${
                        entry.type === "robot" ? "bg-primary/10 border-l-4 border-primary" : "bg-muted"
                      }`}
                    >
                      <div className="text-2xl">{entry.type === "robot" ? "🤖" : "👶"}</div>
                      <div className="flex-1">
                        <p className="text-foreground">{entry.text}</p>
                        <div className="flex items-center gap-2 mt-2">
                          <p className="text-xs text-muted-foreground">{entry.timestamp.toLocaleTimeString("bn-BD")}</p>
                          {entry.type === "robot" && (
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => speakText(entry.text)}
                              className="h-6 px-2"
                            >
                              <Volume2 className="w-3 h-3" />
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Show suggestions for the latest robot message */}
                    {entry.type === "robot" && entry.suggestions && entry === latestRobotEntry && (
                      <div className="ml-12 space-y-2">
                        <p className="text-sm text-muted-foreground">সুপারিশ:</p>
                        <div className="flex flex-wrap gap-2">
                          {entry.suggestions.map((suggestion, index) => (
                            <Button
                              key={index}
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                speakText(suggestion)
                                onSuggestionClick?.(suggestion)
                              }}
                              className="text-xs"
                            >
                              {suggestion}
                            </Button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>
        </CardContent>
      )}
    </Card>
  )
}
