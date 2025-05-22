"use client"

import type React from "react"

import { useState } from "react"
import { Bot, Mic, Send } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

type Message = {
  id: number
  role: "user" | "assistant"
  content: string
}

export default function DemoSection() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      role: "assistant",
      content:
        "Hello! I'm Vocalyn Assistant. How can I help you today? Feel free to ask me anything or try out a voice conversation.",
    },
  ])
  const [input, setInput] = useState("")
  const [isRecording, setIsRecording] = useState(false)

  const handleSendMessage = () => {
    if (!input.trim()) return

    // Add user message
    const userMessage: Message = {
      id: messages.length + 1,
      role: "user",
      content: input,
    }
    setMessages((prev) => [...prev, userMessage])
    setInput("")

    // Simulate AI response after a short delay
    setTimeout(() => {
      const responses = [
        "I'm just a demo assistant, but the full Vocalyn platform would allow for much more natural and personalized conversations!",
        "In the full version, I would remember our previous conversations and adapt to your preferences over time.",
        "With a subscription, you could create multiple agents with different personalities and voices tailored to your needs.",
        "The real Vocalyn agents have long-term memory and can engage in conversations up to 120 minutes depending on your plan.",
        "Sign up for a free account to create your first AI voice agent and experience the full capabilities!",
      ]

      const randomResponse = responses[Math.floor(Math.random() * responses.length)]

      const assistantMessage: Message = {
        id: messages.length + 2,
        role: "assistant",
        content: randomResponse,
      }

      setMessages((prev) => [...prev, assistantMessage])
    }, 1000)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const toggleRecording = () => {
    setIsRecording(!isRecording)

    if (!isRecording) {
      // Simulate recording for 3 seconds then sending a message
      setTimeout(() => {
        setIsRecording(false)
        setInput("This is a simulated voice message from the demo")
        setTimeout(() => {
          handleSendMessage()
        }, 500)
      }, 3000)
    }
  }

  return (
    <section id="demo" className="py-20 bg-muted/30">
      <div className="container">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">Try Vocalyn Demo</h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Experience a preview of Vocalyn's capabilities. In the full version, you'll be able to create custom agents
            and have voice conversations.
          </p>
        </div>

        <Card className="mx-auto max-w-3xl shadow-lg border-primary/20">
          <CardHeader className="border-b bg-muted/50">
            <div className="flex items-center">
              <Avatar className="h-10 w-10 mr-3">
                <AvatarImage src="/placeholder.svg?height=40&width=40" />
                <AvatarFallback>
                  <Bot className="h-6 w-6" />
                </AvatarFallback>
              </Avatar>
              <div>
                <CardTitle>Vocalyn Assistant</CardTitle>
                <CardDescription>Demo Agent</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="h-[400px] overflow-y-auto p-4 space-y-4">
              {messages.map((message) => (
                <div key={message.id} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`max-w-[80%] rounded-lg p-3 ${
                      message.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted"
                    }`}
                  >
                    {message.content}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
          <CardFooter className="border-t p-3">
            <div className="flex w-full items-center space-x-2">
              <Button
                size="icon"
                variant={isRecording ? "destructive" : "outline"}
                onClick={toggleRecording}
                className="shrink-0"
              >
                <Mic className="h-4 w-4" />
                <span className="sr-only">{isRecording ? "Stop recording" : "Start recording"}</span>
              </Button>
              <Input
                placeholder="Type a message..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                className="flex-1"
              />
              <Button size="icon" onClick={handleSendMessage} disabled={!input.trim()} className="shrink-0">
                <Send className="h-4 w-4" />
                <span className="sr-only">Send</span>
              </Button>
            </div>
          </CardFooter>
        </Card>
      </div>
    </section>
  )
}
