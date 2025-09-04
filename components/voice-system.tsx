"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Volume2, VolumeX, Mic, MicOff } from "lucide-react"

export function VoiceSystem() {
  const [isVoiceEnabled, setIsVoiceEnabled] = useState(true)
  const [isListening, setIsListening] = useState(false)
  const [speechSupported, setSpeechSupported] = useState(false)

  useEffect(() => {
    // Check if speech synthesis is supported
    setSpeechSupported("speechSynthesis" in window)
  }, [])

  const toggleVoice = () => {
    setIsVoiceEnabled(!isVoiceEnabled)
    if (!isVoiceEnabled) {
      // Test voice with a greeting
      const utterance = new SpeechSynthesisUtterance("আমি তোমার সাহায্যকারী রোবট")
      utterance.lang = "bn-BD"
      utterance.rate = 0.8
      speechSynthesis.speak(utterance)
    }
  }

  const startListening = () => {
    setIsListening(true)
    // Placeholder for speech recognition
    setTimeout(() => {
      setIsListening(false)
      const utterance = new SpeechSynthesisUtterance("আমি তোমার কথা শুনছি")
      utterance.lang = "bn-BD"
      utterance.rate = 0.8
      speechSynthesis.speak(utterance)
    }, 2000)
  }

  return (
    <Card className="mt-4">
      <CardHeader>
        <CardTitle className="text-lg">ভয়েস সিস্টেম</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <Button
          variant={isVoiceEnabled ? "default" : "outline"}
          className="w-full"
          onClick={toggleVoice}
          disabled={!speechSupported}
        >
          {isVoiceEnabled ? <Volume2 className="w-4 h-4 mr-2" /> : <VolumeX className="w-4 h-4 mr-2" />}
          {isVoiceEnabled ? "আওয়াজ চালু" : "আওয়াজ বন্ধ"}
        </Button>

        <Button
          variant="outline"
          className="w-full bg-transparent"
          onClick={startListening}
          disabled={!isVoiceEnabled || isListening}
        >
          {isListening ? <Mic className="w-4 h-4 mr-2 animate-pulse" /> : <MicOff className="w-4 h-4 mr-2" />}
          {isListening ? "শুনছি..." : "কথা বলো"}
        </Button>
      </CardContent>
    </Card>
  )
}
