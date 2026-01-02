"use client"

import React, { useState } from "react"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { AlertCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

export function LoginForm() {
  const { login, loading } = useAuth()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    try {
      await login(email, password)
    } catch (err: any) {
      setError(err.message || "Erro ao fazer login")
    }
  }

  return (
    <div className="border-border/50 bg-card/40 backdrop-blur-sm shadow-lg rounded-lg p-6 max-w-md mx-auto">
      <div className="flex flex-col items-center gap-4 mb-6">
        <div
          className="flex size-12 shrink-0 items-center justify-center rounded-full border border-border bg-background/80"
          aria-hidden="true"
        >
          <svg
            className="stroke-zinc-800 dark:stroke-zinc-100"
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 32 32"
            aria-hidden="true"
          >
            <circle cx="16" cy="16" r="12" fill="none" strokeWidth="8" />
          </svg>
        </div>
        
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-semibold tracking-tight">Bem-vindo ao Dr Pilot</h2>
          <p className="text-sm text-muted-foreground">
            Faça login para acessar sua conta
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {error && (
          <Alert variant="destructive" className="bg-destructive/10 border-destructive/30">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="seu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
              required
              className="bg-input/50 border-border/50 text-foreground placeholder:text-muted-foreground focus:border-primary"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Senha</Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
              required
              className="bg-input/50 border-border/50 text-foreground placeholder:text-muted-foreground focus:border-primary"
            />
          </div>
        </div>

        <Button
          type="submit"
          disabled={loading}
          className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold h-11"
        >
          {loading ? "Fazendo login..." : "Entrar"}
        </Button>
      </form>

      <div className="flex items-center gap-3 my-6 before:h-px before:flex-1 before:bg-border after:h-px after:flex-1 after:bg-border">
        <span className="text-xs text-muted-foreground">Ou</span>
      </div>

      <Button variant="outline" className="w-full h-11">
        Continuar com Google
      </Button>

      <p className="text-center text-xs text-muted-foreground mt-6">
        Ao fazer login você concorda com nossos{" "}
        <a className="underline hover:no-underline text-primary" href="#">
          Termos de Uso
        </a>
        .
      </p>
    </div>
  )
}