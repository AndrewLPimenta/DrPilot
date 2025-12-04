"use client"

import React, { useState } from "react"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle, Heart } from "lucide-react"
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
    <Card className="border-border/50 bg-card/40 backdrop-blur-sm shadow-lg">
      <CardHeader className="space-y-2">
        <div className="flex items-center gap-2 mb-2">
          <Heart className="w-5 h-5 text-primary" />
          <CardTitle className="text-2xl">Bem-vindo</CardTitle>
        </div>
        <CardDescription>Faça login para acessar o Dr Pilot</CardDescription>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <Alert variant="destructive" className="bg-destructive/10 border-destructive/30">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

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

          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold"
          >
            {loading ? "Fazendo login..." : "Entrar"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
