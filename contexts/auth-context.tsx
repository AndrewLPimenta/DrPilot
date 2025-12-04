"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

// -----------------------------
// Tipagem do usuário
// -----------------------------
interface User {
  email: string
  name: string
  role?: string
}

// -----------------------------
// Tipagem do AuthContext
// -----------------------------
interface AuthContextType {
  user: User | null
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  register: (data: any) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// -----------------------------
// URL do backend (Node.js)
// -----------------------------
const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"

// -----------------------------
// AuthProvider
// -----------------------------
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  // Carregar usuário salvo no localStorage
  useEffect(() => {
    try {
      const savedUser = localStorage.getItem("user")
      const savedToken = localStorage.getItem("token")

      if (savedUser && savedToken) {
        setUser(JSON.parse(savedUser))
      }
    } catch (err) {
      console.error("Erro ao carregar usuário do localStorage:", err)
    } finally {
      setLoading(false)
    }
  }, [])

  // -----------------------------
  // LOGIN
  // -----------------------------
  const login = async (email: string, password: string) => {
    const response = await fetch(`${BACKEND_URL}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.error || "Erro ao fazer login")
    }

    const userData: User = {
      email: data.data.user.email,
      name: data.data.user.name,
      role: data.data.user.role,
    }

    localStorage.setItem("token", data.data.token)
    localStorage.setItem("user", JSON.stringify(userData))
    setUser(userData)
  }

  // -----------------------------
  // REGISTER
  // -----------------------------
  const register = async (formData: any) => {
    const response = await fetch(`${BACKEND_URL}/api/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.error || "Erro ao cadastrar")
    }

    const userData: User = {
      email: data.data.user.email,
      name: data.data.user.name,
      role: data.data.user.role,
    }

    localStorage.setItem("token", data.data.token)
    localStorage.setItem("user", JSON.stringify(userData))
    setUser(userData)
  }

  // -----------------------------
  // LOGOUT
  // -----------------------------
  const logout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

// -----------------------------
// HOOK para consumir AuthContext
// -----------------------------
export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error("useAuth deve ser usado dentro de AuthProvider")
  return context
}
