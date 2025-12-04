"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle, UserPlus } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

export function RegisterForm() {
  const { register } = useAuth()

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    specialty: "",
    year: "",
    university: "",
  })

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  // --- AUTOCOMPLETE STATES ---
  const [universities, setUniversities] = useState<string[]>([])
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const wrapperRef = useRef<HTMLDivElement | null>(null)

  // ---- Carrega universidades do CSV (RAW GitHub) ----
 useEffect(() => {
  async function load() {
    try {
      const res = await fetch(
        "https://gist.githubusercontent.com/alexandremcosta/c9361cc23722a5aa1133/raw/1a49c7cfff76dedea615dee4ea4bc47c2e7be621/universidades.csv"
      );

      if (!res.ok) throw new Error("Falha ao carregar universidades");

      const csvText = await res.text();

      let lines = csvText
        .split("\n")
        .map((l) => l.trim())
        .filter((l) => l.length > 0);

      // 🔥 REMOVER DUPLICADOS
      lines = Array.from(new Set(lines));

      setUniversities(lines);
    } catch (e) {
      console.error("Erro carregando universidades:", e);
    }
  }

  load();
}, []);


  // ---- Fecha dropdown ao clicar fora ----
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setShowSuggestions(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  // ---- Filtra sugestões conforme o usuário digita ----
  useEffect(() => {
    const q = formData.university.trim()

    if (!q) {
      setSuggestions([])
      setShowSuggestions(false)
      return
    }

    const filtered = universities.filter((u) =>
      u.toLowerCase().includes(q.toLowerCase())
    )

    setSuggestions(filtered.slice(0, 12))
    setShowSuggestions(filtered.length > 0)
  }, [formData.university, universities])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  const handleSuggestionClick = (value: string) => {
    setFormData((prev) => ({ ...prev, university: value }))
    setSuggestions([])
    setShowSuggestions(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      const response = await register(formData)

      if (!response?.success) {
        setError(response?.error || "Erro ao cadastrar")
        return
      }
    } catch (err) {
      console.error("Erro no formulário:", err)
      setError("Erro ao cadastrar")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="border-border/50 bg-card/40 backdrop-blur-sm shadow-lg">
      <CardHeader className="space-y-2">
        <div className="flex items-center gap-2 mb-2">
          <UserPlus className="w-5 h-5 text-secondary" />
          <CardTitle className="text-2xl">Criar Conta</CardTitle>
        </div>
        <CardDescription>Cadastre-se para começar a usar o Dr Pilot</CardDescription>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">

          {error && (
            <Alert variant="destructive" className="bg-destructive/10 border-destructive/30">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* NAME */}
          <div className="space-y-2">
            <Label htmlFor="name">Nome Completo</Label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              disabled={loading}
              required
              placeholder="João Silva"
            />
          </div>

          {/* EMAIL */}
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              disabled={loading}
              required
              placeholder="seu@email.com"
            />
          </div>

          {/* PASSWORD */}
          <div className="space-y-2">
            <Label htmlFor="password">Senha</Label>
            <Input
              id="password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              disabled={loading}
              required
              placeholder="••••••••"
            />
          </div>

          {/* SPECIALTY */}
          <div className="space-y-2">
            <Label htmlFor="specialty">Especialidade</Label>
            <Input
              id="specialty"
              name="specialty"
              value={formData.specialty}
              onChange={handleChange}
              disabled={loading}
              required
              placeholder="Ex: Cardiologia"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">

            {/* YEAR */}
            <div className="space-y-2">
              <Label htmlFor="year">Ano</Label>
              <Input
                id="year"
                name="year"
                value={formData.year}
                onChange={handleChange}
                disabled={loading}
                required
                placeholder="2024"
              />
            </div>

            {/* UNIVERSITY + AUTOCOMPLETE */}
            <div className="space-y-2 relative" ref={wrapperRef}>
              <Label htmlFor="university">Universidade</Label>

              <Input
                id="university"
                name="university"
                value={formData.university}
                onChange={handleChange}
                disabled={loading}
                required
                placeholder="USP, Harvard, Unifor..."
                autoComplete="off"
                onFocus={() => {
                  if (suggestions.length > 0) setShowSuggestions(true)
                }}
              />

              {showSuggestions && suggestions.length > 0 && (
                <div className="absolute z-20 left-0 right-0 mt-1 bg-card border border-border/30 rounded-md shadow-lg max-h-48 overflow-y-auto animate-in fade-in-50 slide-in-from-top-1">

                  {suggestions.map((s) => (
                    <div
                      key={s}
                      className="px-3 py-2 hover:bg-accent/20 cursor-pointer text-sm"
                      onMouseDown={(e) => {
                        e.preventDefault()
                        handleSuggestionClick(s)
                      }}
                    >
                      {s}
                    </div>
                  ))}

                </div>
              )}
            </div>
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-secondary hover:bg-secondary/90 text-secondary-foreground font-semibold"
          >
            {loading ? "Cadastrando..." : "Cadastrar"}
          </Button>

        </form>
      </CardContent>
    </Card>
  )
}
