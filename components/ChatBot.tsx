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
  const [sending, setSending] = useState(false)

  const recognitionRef = useRef<SpeechRecognitionLike | null>(null)
  const inputRef = useRef<string>("")
  const endRef = useRef<HTMLDivElement | null>(null)

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
      let finalText = ""
      let interimText = ""
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const res = event.results[i]
        if (res.isFinal) finalText += res[0].transcript
        else interimText += res[0].transcript
      }
      const phrase = (finalText || interimText || "").trim()
      setInputValue(phrase)
      inputRef.current = phrase
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

  async function handleSendMessage(textOverride?: string) {
    const text = (textOverride ?? inputValue).trim()
    if (!text || sending) return

    const userMessage: Message = {
      id: Date.now().toString(),
      text,
      sender: "user",
      timestamp: new Date(),
      language: selectedLanguage,
    }

    setMessages((prev) => [...prev, userMessage])
    setInputValue("")

    try {
      setSending(true)
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [{ role: "user", content: text }],
          language: selectedLanguage,
        }),
      })

      if (!res.ok) {
        throw new Error(`Request failed: ${res.status}`)
      }
      const data = await res.json()
      if (data?.error) {
        throw new Error(data.error)
      }
      const content = data?.message ?? (selectedLanguage === "hi" ? "क्षमा करें, कोई उत्तर उपलब्ध नहीं है।" : "Sorry, no response.")
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: content,
        sender: "bot",
        timestamp: new Date(),
        language: selectedLanguage,
      }
      setMessages((prev) => [...prev, botMessage])
    } catch (e: any) {
      const serverMsg = String(e?.message || "")
      let errMsg = selectedLanguage === "hi" ? "त्रुटि: कृपया बाद में पुनः प्रयास करें।" : "Error: please try again later."
      if (/GROQ_API_KEY/i.test(serverMsg)) {
        errMsg =
          selectedLanguage === "hi"
            ? "सर्वर पर Groq API कुंजी सेट नहीं है। कृपया .env.local में GROQ_API_KEY जोड़ें और सर्वर पुनः प्रारंभ करें।"
            : "Groq API key is missing on the server. Add GROQ_API_KEY to .env.local and restart the dev server."
      }
      // Very small domain fallback for common NDVI question
      const lower = text.toLowerCase()
      if (/\bndvi\b/.test(lower)) {
        errMsg =
          selectedLanguage === "hi"
            ? "NDVI (Normalized Difference Vegetation Index) लाल और निकट-इन्फ्रारेड प्रकाश के अंतर से वनस्पति की हरियाली/स्वास्थ्य मापता है। मान 0 के करीब कम हरियाली और 1 के करीब घनी/स्वस्थ वनस्पति का संकेत देता है।"
            : "NDVI (Normalized Difference Vegetation Index) measures plant greenness/health from the difference of red and near‑infrared reflectance. Values near 0 mean sparse vegetation; values closer to 1 indicate dense, healthy vegetation."
      }
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 2).toString(),
          text: errMsg,
          sender: "bot",
          timestamp: new Date(),
          language: selectedLanguage,
        },
      ])
    } finally {
      setSending(false)
    }
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
      const msg =
        selectedLanguage === "hi"
          ? "आपका ब्राउज़र स्पीच रिकग्निशन का समर्थन नहीं करता"
          : "Your browser does not support speech recognition"
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 10).toString(),
          text: msg,
          sender: "bot",
          timestamp: new Date(),
          language: selectedLanguage,
        },
      ])
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
        inputRef.current = ""
        recog.lang = selectedLanguage === "hi" ? "hi-IN" : "en-US"
        recog.start()
        setIsRecording(true)
      } catch {
        setIsRecording(false)
      }
    }
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
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

  // Auto-scroll to bottom when messages update
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

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
                  <div ref={endRef} />
                </div>
              </ScrollArea>

              {/* Input Area */}
              <div className="flex gap-2">
                <Input
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={handleKeyDown}
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
                <Button onClick={() => handleSendMessage()} size="icon" disabled={sending}>
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
