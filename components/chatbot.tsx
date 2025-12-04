"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Send, LogOut, Loader2, Heart, Activity } from "lucide-react"
import ReactMarkdown from "react-markdown"

interface Message {
  id: string
  text: string
  sender: "user" | "ai"
  timestamp: Date
}

export function ChatBot() {
  const { user, logout } = useAuth()
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      text: input,
      sender: "user",
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setLoading(true)

    try {
      const token = localStorage.getItem("token")
      const response = await fetch("http://localhost:3000/api/ai/query", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ query: input }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || data.message || "Erro ao enviar mensagem")
      }

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text:
          data.data?.response ||
          data.message ||
          "Desculpe, não consegui processar sua pergunta.",
        sender: "ai",
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, aiMessage])
    } catch (error) {
      const errorMessage: Message = {
        id: (Date.now() + 2).toString(),
        text:
          error instanceof Error
            ? error.message
            : "Erro ao conectar com a IA",
        sender: "ai",
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-slate-900/20 to-blue-950/10 flex flex-col">
      {/* Header */}
      <div className="border-b border-border/30 bg-card/30 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/20 rounded-lg">
              <Heart className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">Dr Pilot</h1>
              <p className="text-xs text-muted-foreground">
                Conectado como {user?.name}
              </p>
            </div>
          </div>
          <Button
            onClick={logout}
            variant="outline"
            size="sm"
            className="border-border/50 hover:bg-accent/10 text-foreground bg-transparent"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Sair
          </Button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto px-4 py-8 space-y-4">
          {messages.length === 0 ? (
            <div className="text-center py-12">
              <div className="mb-4 flex justify-center">
                <Activity className="w-12 h-12 text-primary/50" />
              </div>
              <h2 className="text-2xl font-bold text-foreground mb-2">
                Bem-vindo ao Dr Pilot
              </h2>
              <p className="text-muted-foreground max-w-md mx-auto">
                Seu assistente de IA para Medicina. 
                Bons estudos!
              </p>
            </div>
          ) : (
            messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${
                  message.sender === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <Card
                  className={`max-w-xs lg:max-w-md px-4 py-3 ${
                    message.sender === "user"
                      ? "bg-primary/80 text-primary-foreground border-primary/50"
                      : "bg-accent/20 text-foreground border-accent/30"
                  }`}
                >
                  <ReactMarkdown className="text-sm leading-relaxed break-words">
                    {message.text}
                  </ReactMarkdown>
                  <p className="text-xs mt-2 opacity-60">
                    {message.timestamp.toLocaleTimeString("pt-BR")}
                  </p>
                </Card>
              </div>
            ))
          )}

          {loading && (
            <div className="flex justify-start">
              <Card className="bg-accent/20 text-foreground border-accent/30 px-4 py-3">
                <div className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin text-primary" />
                  <p className="text-sm"></p>
                </div>
              </Card>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input */}
      <div className="border-t border-border/30 bg-card/30 backdrop-blur-sm sticky bottom-0">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <form onSubmit={handleSendMessage} className="flex gap-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Converse comigo..."
              disabled={loading}
              className="bg-input/50 border-border/50 text-foreground placeholder:text-muted-foreground focus:border-primary"
            />
            <Button
              type="submit"
              disabled={loading || !input.trim()}
              className="bg-primary hover:bg-primary/90 text-primary-foreground px-6"
            >
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-border/30 bg-background/50 backdrop-blur-sm px-4 py-3 text-center">
        <p className="text-xs text-muted-foreground">
          Desenvolvido por{" "}
          <span className="text-primary font-semibold">AndrewPimenta</span>
        </p>
      </div>
    </div>
  )
}
