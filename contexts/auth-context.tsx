"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { useRouter } from "next/navigation" 

// -----------------------------
// Tipagem do usuário (COMPLETA)
// -----------------------------
interface User {
  id: string
  email: string
  name: string
  role: "user" | "admin" | "beta_tester"
  specialty: string | null
  university: string | null
  year: number | null
  subscription: "free" | "premium" | "enterprise"
  queries_count: number
  queries_limit: number
  is_active: boolean
  last_login: string | null
  created_at: string
  updated_at: string
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
  updateUserProfile: (profile: User) => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// -----------------------------
// URL do backend (Node.js)
// -----------------------------
const BACKEND_URL = (() => {
  // Se NEXT_PUBLIC_API_URL estiver definida, ela manda
  if (process.env.NEXT_PUBLIC_API_URL) {
    return process.env.NEXT_PUBLIC_API_URL;
  }

  // Client-side: decide entre localhost e IP local
  if (typeof window !== "undefined") {
    const isLocalhost =
      window.location.hostname === "localhost" ||
      window.location.hostname === "127.0.0.1";

    return isLocalhost
      ? "http://localhost:3000"
      : "http://192.168.10.108:3000"; // seu backend via Wi-Fi
  }

  // SSR fallback
  return "http://localhost:3000";
})();
// -----------------------------
// AuthProvider
// -----------------------------
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter() // Adicionado router

  // Carregar usuário salvo no localStorage
  useEffect(() => {
    try {
      const savedUser = localStorage.getItem("user")
      const savedToken = localStorage.getItem("token")

      if (savedUser && savedToken) {
        const parsed = JSON.parse(savedUser)
        
        // Verifica se o formato é { user: {...} } ou diretamente o usuário
        const userData = parsed.user ? parsed.user : parsed
        
        console.log("📥 Carregando usuário do localStorage:", userData)
        setUser(userData)
      }
    } catch (err) {
      console.error("❌ Erro ao carregar usuário do localStorage:", err)
    } finally {
      setLoading(false)
    }
  }, [])

  // -----------------------------
  // LOGIN (Atualizado para salvar perfil completo E redirecionar)
  // -----------------------------
  const login = async (email: string, password: string) => {
    setLoading(true)
    try {
      const response = await fetch(`${BACKEND_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Erro ao fazer login")
      }

      // Salva o perfil COMPLETO do usuário
      const userData: User = {
        id: data.data.user.id,
        email: data.data.user.email,
        name: data.data.user.name,
        role: data.data.user.role,
        specialty: data.data.user.specialty || null,
        university: data.data.user.university || null,
        year: data.data.user.year || null,
        subscription: data.data.user.subscription || "free",
        queries_count: data.data.user.queries_count || 0,
        queries_limit: data.data.user.queries_limit || 10,
        is_active: data.data.user.is_active !== undefined ? data.data.user.is_active : true,
        last_login: data.data.user.last_login || null,
        created_at: data.data.user.created_at || new Date().toISOString(),
        updated_at: data.data.user.updated_at || new Date().toISOString()
      }

      localStorage.setItem("token", data.data.token)
      localStorage.setItem("user", JSON.stringify(userData))
      setUser(userData)

      // REDIRECIONAMENTO após login bem-sucedido
      // Baseado no role do usuário
      if (userData.role === "admin") {
        router.push("/admin/dashboard")
      } else if (userData.role === "beta_tester") {
        router.push("/beta/dashboard")
      } else {
        router.push("/chatbot") // Página padrão para usuários comuns
      }
    } catch (error) {
      throw error
    } finally {
      setLoading(false)
    }
  }

  // -----------------------------
  // REGISTER (Atualizado com redirecionamento)
  // -----------------------------
  const register = async (formData: any) => {
    setLoading(true)
    try {
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
        id: data.data.user.id,
        email: data.data.user.email,
        name: data.data.user.name,
        role: data.data.user.role || "user",
        specialty: data.data.user.specialty || null,
        university: data.data.user.university || null,
        year: data.data.user.year || null,
        subscription: data.data.user.subscription || "free",
        queries_count: data.data.user.queries_count || 0,
        queries_limit: data.data.user.queries_limit || 10,
        is_active: data.data.user.is_active !== undefined ? data.data.user.is_active : true,
        last_login: data.data.user.last_login || null,
        created_at: data.data.user.created_at || new Date().toISOString(),
        updated_at: data.data.user.updated_at || new Date().toISOString()
      }

      localStorage.setItem("token", data.data.token)
      localStorage.setItem("user", JSON.stringify(userData))
      setUser(userData)

      // REDIRECIONAMENTO após registro bem-sucedido
      // Baseado no role do usuário
      if (userData.role === "admin") {
        router.push("/admin/dashboard")
      } else if (userData.role === "beta_tester") {
        router.push("/beta/dashboard")
      } else {
        router.push("/dashboard") // Página padrão para usuários comuns
      }
    } catch (error) {
      throw error
    } finally {
      setLoading(false)
    }
  }

  // -----------------------------
  // LOGOUT (Atualizado com redirecionamento)
  // -----------------------------
  const logout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    setUser(null)
    // Redireciona para a página de login após logout
    router.push("/login")
  }

  // -----------------------------
  // ATUALIZAR PERFIL LOCAL
  // -----------------------------
  const updateUserProfile = (profile: User) => {
    localStorage.setItem("user", JSON.stringify(profile))
    setUser(profile)
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, updateUserProfile }}>
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