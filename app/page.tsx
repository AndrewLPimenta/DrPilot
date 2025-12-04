"use client"

import { useState } from "react"
import { useAuth } from "@/contexts/auth-context"
import { LoginForm } from "@/components/login-form"
import { RegisterForm } from "@/components/register-form"
import { ChatBot } from "@/components/chatbot"
import { Activity } from "lucide-react"

export default function Home() {
  const { user, loading } = useAuth()
  const [showRegister, setShowRegister] = useState(false)

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-blue-950/10">
        <div className="text-center">
          <div className="mb-4 flex justify-center">
            <div className="relative w-12 h-12">
              <Activity className="w-12 h-12 text-primary animate-pulse" />
            </div>
          </div>
          <p className="text-muted-foreground">Carregando Dr Pilot...</p>
        </div>
      </div>
    )
  }

  if (user) {
    return <ChatBot />
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-background via-slate-900/30 to-blue-950/20 px-4">
      {/* Logo/Header */}
      <div className="pt-8 pb-4 text-center">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Activity className="w-8 h-8 text-primary" />
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
            Dr Pilot
          </h1>
        </div>
        <p className="text-muted-foreground text-sm">Assistente de IA para saúde</p>
      </div>

      {/* Form Container */}
      <div className="flex-1 flex items-center justify-center py-12">
        <div className="w-full max-w-md">
          {showRegister ? (
            <>
              <RegisterForm />
              <p className="text-center text-muted-foreground mt-6 text-sm">
                Já tem uma conta?{" "}
                <button onClick={() => setShowRegister(false)} className="text-primary font-semibold hover:underline">
                  Faça login
                </button>
              </p>
            </>
          ) : (
            <>
              <LoginForm />
              <p className="text-center text-muted-foreground mt-6 text-sm">
                Não tem uma conta?{" "}
                <button onClick={() => setShowRegister(true)} className="text-primary font-semibold hover:underline">
                  Cadastre-se
                </button>
              </p>
            </>
          )}
        </div>
      </div>

      <footer className="pb-4 text-center border-t border-border/30">
        <p className="text-xs text-muted-foreground">
          Desenvolvido por <span className="text-primary font-semibold">AndrewPimenta</span>
        </p>
      </footer>
    </div>
  )
}
