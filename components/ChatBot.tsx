"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger } from "@/components/ui/select"
import { MessageCircle, Send, X, Minimize2, Mic, MicOff, Languages, Volume2, VolumeX } from "lucide-react"

interface Message {
  id: string
  text: string
  sender: "user" | "bot"
  timestamp: Date
  language?: "en" | "hi"
}

type Language = "en" | "hi"
type SpeechRecognitionLike = any

export default function ChatBot() {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedLanguage, setSelectedLanguage] = useState<Language>("en")
  const [isRecording, setIsRecording] = useState(false)
  const [isVoiceEnabled, setIsVoiceEnabled] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: "Hello! I'm your crop health assistant. I can help you analyze NDVI data, interpret vegetation indices, and provide insights about your field conditions. How can I assist you today?",
      sender: "bot",
      timestamp: new Date(),
      language: "en",
    },
  ])
  const [inputValue, setInputValue] = useState("")

  const recognitionRef = useRef<SpeechRecognitionLike | null>(null)
  const inputRef = useRef<string>("")

  // Keep a ref of inputValue for onend auto-send
  useEffect(() => {
    inputRef.current = inputValue
  }, [inputValue])

  // Initialize SpeechRecognition ONCE
  useEffect(() => {
    if (typeof window === "undefined") return
    const SR: any = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
    if (!SR) return

    const recog = new SR()
    recog.continuous = false
    recog.interimResults = true // allow live updates
    recog.maxAlternatives = 1
    recog.lang = selectedLanguage === "hi" ? "hi-IN" : "en-US"

    recog.onresult = (event: any) => {
      // Use the last result; if interim, this updates the input field live
      const res = event.results[event.results.length - 1]
      const transcript = res[0]?.transcript ?? ""
      setInputValue((prev) => {
        // Replace with the latest interim or final transcript
        return transcript
      })
    }

    recog.onerror = () => {
      setIsRecording(false)
    }

    recog.onend = () => {
      // Auto-send the captured speech if present
      setIsRecording(false)
      const text = inputRef.current?.trim()
      if (text) {
        handleSendMessage(text)
      }
    }

    recognitionRef.current = recog
    return () => {
      try {
        recog.stop()
      } catch {}
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []) // once

  // Update language dynamically
  useEffect(() => {
    if (recognitionRef.current) {
      recognitionRef.current.lang = selectedLanguage === "hi" ? "hi-IN" : "en-US"
    }
  }, [selectedLanguage])

  // Speak the last bot message if voice enabled
  useEffect(() => {
    if (!isVoiceEnabled || typeof window === "undefined" || !("speechSynthesis" in window)) return
    const last = messages[messages.length - 1]
    if (!last || last.sender !== "bot") return

    try {
      window.speechSynthesis.cancel()
      const utter = new SpeechSynthesisUtterance(last.text)
      utter.lang = selectedLanguage === "hi" ? "hi-IN" : "en-US"
      const voices = window.speechSynthesis.getVoices()
      const voice =
        voices.find((v) => v.lang === utter.lang) || voices.find((v) => v.lang.startsWith(utter.lang.split("-")[0]))
      if (voice) utter.voice = voice
      window.speechSynthesis.speak(utter)
    } catch {
      // no-op
    }
  }, [messages, isVoiceEnabled, selectedLanguage])

  useEffect(() => {
    return () => {
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        window.speechSynthesis.cancel()
      }
    }
  }, [])

  useEffect(() => {
    if (!isVoiceEnabled && typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel()
    }
  }, [isVoiceEnabled])

  function handleSendMessage(textOverride?: string) {
    const text = (textOverride ?? inputValue).trim()
    if (!text) return

    const userMessage: Message = {
      id: Date.now().toString(),
      text,
      sender: "user",
      timestamp: new Date(),
      language: selectedLanguage,
    }

    setMessages((prev) => [...prev, userMessage])
    setInputValue("")

    setTimeout(() => {
      const botResponses = {
        en: "Thank you for your question. I'm analyzing your crop data and will provide insights based on the current NDVI values and field conditions. This is a placeholder response - you can integrate with your preferred AI service here.",
        hi: "आपके प्रश्न के लिए धन्यवाद। मैं आपके फसल डेटा का विश्लेषण कर रहा हूं और वर्तमान NDVI मानों और खेत की स्थितियों के आधार पर जानकारी प्रदान करूंगा। यह एक प्लेसहोल्डर प्रतिक्रिया है - आप यहां अपनी पसंदीदा AI सेवा के साथ एकीकृत कर सकते हैं।",
      }

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: botResponses[selectedLanguage],
        sender: "bot",
        timestamp: new Date(),
        language: selectedLanguage,
      }
      setMessages((prev) => [...prev, botMessage])
    }, 1000)
  }

  async function requestMicPermissionOnce() {
    try {
      if (typeof navigator !== "undefined" && navigator.mediaDevices?.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
        // Immediately stop tracks; we only needed the permission prompt
        stream.getTracks().forEach((t) => t.stop())
      }
    } catch {
      // If denied, recognition may still work depending on browser; ignore here
    }
  }

  const toggleRecording = async () => {
    const recog = recognitionRef.current
    if (!recog) {
      alert(
        selectedLanguage === "hi"
          ? "आपका ब्राउज़र स्पीच रिकग्निशन का समर्थन नहीं करता"
          : "Your browser does not support speech recognition",
      )
      return
    }

    if (isRecording) {
      try {
        recog.stop()
      } catch {}
      setIsRecording(false)
    } else {
      await requestMicPermissionOnce()
      try {
        setInputValue("") // reset input for new capture
        recog.start()
        setIsRecording(true)
      } catch {
        setIsRecording(false)
      }
    }
  }

  function handleKeyPress(e: React.KeyboardEvent) {
    if (e.key === "Enter") {
      handleSendMessage()
    }
  }

  useEffect(() => {
    const initialMessages = {
      en: "Hello! I'm your crop health assistant. I can help you analyze NDVI data, interpret vegetation indices, and provide insights about your field conditions. How can I assist you today?",
      hi: "नमस्ते! मैं आपका फसल स्वास्थ्य सहायक हूं। मैं NDVI डेटा का विश्लेषण करने, वनस्पति सूचकांकों की व्याख्या करने और आपकी खेत की स्थितियों के बारे में जानकारी प्रदान करने में आपकी सहायता कर सकता हूं। आज मैं आपकी कैसे सहायता कर सकता हूं?",
    }

    setMessages([
      {
        id: "1",
        text: initialMessages[selectedLanguage],
        sender: "bot",
        timestamp: new Date(),
        language: selectedLanguage,
      },
    ])
  }, [selectedLanguage])

  return (
    <>
      {/* Chat Toggle Button */}
      {!isOpen && (
        <Button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg z-50"
          size="icon"
        >
          <MessageCircle className="h-6 w-6" />
        </Button>
      )}

      {/* Chat Panel */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 w-96 h-[500px] z-50">
          <Card className="h-full flex flex-col shadow-xl">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-lg font-semibold">
                {selectedLanguage === "hi" ? "फसल स्वास्थ्य सहायक" : "Crop Health Assistant"}
              </CardTitle>
              <div className="flex gap-2">
                <Select value={selectedLanguage} onValueChange={(value: any) => setSelectedLanguage(value)}>
                  <SelectTrigger className="w-20 h-8">
                    <Languages className="h-4 w-4" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en">EN</SelectItem>
                    <SelectItem value="hi">हिं</SelectItem>
                  </SelectContent>
                </Select>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsVoiceEnabled((v) => !v)}
                  className="h-8 w-8"
                  aria-label={isVoiceEnabled ? "Disable voice" : "Enable voice"}
                  title={
                    isVoiceEnabled
                      ? selectedLanguage === "hi"
                        ? "आवाज़ बंद करें"
                        : "Disable voice"
                      : selectedLanguage === "hi"
                        ? "आवाज़ चालू करें"
                        : "Enable voice"
                  }
                >
                  {isVoiceEnabled ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                </Button>
                <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)} className="h-8 w-8">
                  <Minimize2 className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)} className="h-8 w-8">
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>

            <CardContent className="flex-1 flex flex-col p-4 pt-0">
              {/* Messages Area */}
              <ScrollArea className="flex-1 pr-4 mb-4">
                <div className="space-y-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`max-w-[80%] rounded-lg px-3 py-2 text-sm ${
                          message.sender === "user"
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted text-muted-foreground"
                        }`}
                      >
                        <p>{message.text}</p>
                        <p className="text-xs opacity-70 mt-1">
                          {message.timestamp.toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>

              {/* Input Area */}
              <div className="flex gap-2">
                <Input
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder={
                    selectedLanguage === "hi"
                      ? "अपने फसल स्वास्थ्य डेटा के बारे में पूछें..."
                      : "Ask about your crop health data..."
                  }
                  className="flex-1"
                />
                <Button
                  onClick={toggleRecording}
                  size="icon"
                  variant={isRecording ? "destructive" : "outline"}
                  className={isRecording ? "animate-pulse" : ""}
                >
                  {isRecording ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                </Button>
                <Button onClick={() => handleSendMessage()} size="icon">
                  <Send className="h-4 w-4" />
                </Button>
              </div>

              {isRecording && (
                <p className="text-xs text-muted-foreground mt-2 text-center">
                  {selectedLanguage === "hi" ? "सुन रहा हूं..." : "Listening..."}
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </>
  )
}
