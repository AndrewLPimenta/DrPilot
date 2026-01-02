"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/contexts/auth-context"

export interface UserProfile {
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

export function useUserProfile() {
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { user, logout, updateUserProfile } = useAuth()

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

  // Primeiro, tenta usar os dados do auth.context
  useEffect(() => {
    console.log("🚀 useUserProfile - user do auth.context:", user)
    
    if (user) {
      console.log("🚀 useUserProfile - definindo profile do auth.context")
      setProfile(user as UserProfile)
      setLoading(false)
    } else {
      console.log("🚀 useUserProfile - user é null, limpando profile")
      setProfile(null)
      setLoading(false)
    }
  }, [user])

  // Buscar perfil da API
  const fetchProfile = async () => {
    try {
      setLoading(true)
      setError(null)
      const token = localStorage.getItem("token")
      
      if (!token) {
        throw new Error("Usuário não autenticado")
      }

      console.log("🔍 Buscando perfil da API...")
      const response = await fetch(`${BACKEND_URL}/api/auth/profile`, {
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      })

      console.log("📥 Resposta da API:", response.status, response.statusText)
      const data = await response.json()
      console.log("📦 Dados recebidos:", data)

      if (!response.ok) {
        if (response.status === 401) {
          logout()
          throw new Error("Sessão expirada. Faça login novamente.")
        }
        throw new Error(data.error || data.message || `Erro ${response.status}`)
      }

      // Extrai o perfil da resposta
      let userProfile: UserProfile
      if (data.success && data.data) {
        userProfile = data.data as UserProfile
      } else if (data.user) {
        userProfile = data.user as UserProfile
      } else {
        userProfile = data as UserProfile
      }

      console.log("✅ Perfil carregado:", userProfile)
      setProfile(userProfile)
      updateUserProfile(userProfile) // Atualiza no auth.context também
      
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "Erro ao buscar perfil"
      setError(errorMsg)
      console.error("❌ Erro no fetchProfile:", err)
    } finally {
      setLoading(false)
    }
  }

  // Atualizar perfil
  const updateProfile = async (updates: {
    name?: string
    specialty?: string | null
    university?: string | null
    year?: number | null
  }) => {
    try {
      setError(null)
      const token = localStorage.getItem("token")
      
      if (!token) {
        throw new Error("Usuário não autenticado")
      }

      console.log("✏️ Atualizando perfil com:", updates)
      const response = await fetch(`${BACKEND_URL}/api/auth/profile`, {
        method: "PUT",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updates),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || data.message || `Erro ${response.status}`)
      }

      // Atualiza o perfil localmente
      let updatedProfile: UserProfile
      if (data.success && data.data) {
        updatedProfile = data.data as UserProfile
      } else if (data.user) {
        updatedProfile = data.user as UserProfile
      } else {
        updatedProfile = data as UserProfile
      }

      console.log("✅ Perfil atualizado:", updatedProfile)
      setProfile(updatedProfile)
      updateUserProfile(updatedProfile)
      return data
      
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "Erro ao atualizar perfil"
      setError(errorMsg)
      console.error("❌ Erro ao atualizar perfil:", err)
      throw err
    }
  }

  // Alterar senha - FUNÇÃO QUE ESTAVA FALTANDO
  const updatePassword = async (currentPassword: string, newPassword: string) => {
    try {
      setError(null)
      const token = localStorage.getItem("token")
      
      if (!token) {
        throw new Error("Usuário não autenticado")
      }

      console.log("🔐 Alterando senha...")
      const response = await fetch(`${BACKEND_URL}/api/auth/change-password`, {
        method: "PUT",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ currentPassword, newPassword }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || data.message || `Erro ${response.status}`)
      }

      console.log("✅ Senha alterada com sucesso")
      return data
      
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "Erro ao alterar senha"
      setError(errorMsg)
      console.error("❌ Erro ao alterar senha:", err)
      throw err
    }
  }

  // ==================== FUNÇÕES ADICIONAIS ====================

  // Estatísticas do usuário
  const getUserStats = async () => {
    try {
      const token = localStorage.getItem("token")
      if (!token) throw new Error("Token não encontrado")
      
      console.log("📊 Buscando estatísticas...")
      const response = await fetch(`${BACKEND_URL}/api/users/stats`, {
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || data.message || `Erro ${response.status}`)
      }

      console.log("✅ Estatísticas carregadas")
      return data.success ? data.data : null
      
    } catch (err) {
      console.error("❌ Erro ao buscar estatísticas:", err)
      return null
    }
  }

  // Informações do plano
  const getSubscriptionInfo = async () => {
    try {
      const token = localStorage.getItem("token")
      if (!token) throw new Error("Token não encontrado")
      
      console.log("💳 Buscando informações do plano...")
      const response = await fetch(`${BACKEND_URL}/api/users/subscription`, {
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || data.message || `Erro ${response.status}`)
      }

      console.log("✅ Informações do plano carregadas")
      return data.success ? data.data : null
      
    } catch (err) {
      console.error("❌ Erro ao buscar informações do plano:", err)
      return null
    }
  }

  // Atividade recente
  const getRecentActivity = async () => {
    try {
      const token = localStorage.getItem("token")
      if (!token) throw new Error("Token não encontrado")
      
      console.log("📈 Buscando atividade recente...")
      const response = await fetch(`${BACKEND_URL}/api/users/activity`, {
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || data.message || `Erro ${response.status}`)
      }

      console.log("✅ Atividade recente carregada")
      return data.success ? data.data : null
      
    } catch (err) {
      console.error("❌ Erro ao buscar atividade recente:", err)
      return null
    }
  }

  // Histórico de consultas
  const getMyQueries = async (page = 1, limit = 20, saved?: boolean) => {
    try {
      const token = localStorage.getItem("token")
      if (!token) throw new Error("Token não encontrado")
      
      let url = `${BACKEND_URL}/api/users/my-queries?page=${page}&limit=${limit}`
      if (saved !== undefined) {
        url += `&saved=${saved}`
      }
      
      console.log("📋 Buscando histórico de consultas...")
      const response = await fetch(url, {
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || data.message || `Erro ${response.status}`)
      }

      console.log("✅ Histórico carregado")
      return data.success ? data.data : null
      
    } catch (err) {
      console.error("❌ Erro ao buscar histórico:", err)
      return null
    }
  }

  // Upgrade de plano
  const requestUpgradePlan = async (plan: "premium" | "enterprise") => {
    try {
      const token = localStorage.getItem("token")
      if (!token) throw new Error("Token não encontrado")
      
      console.log("⬆️ Solicitando upgrade para:", plan)
      const response = await fetch(`${BACKEND_URL}/api/users/upgrade-plan`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ plan }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || data.message || `Erro ${response.status}`)
      }

      console.log("✅ Upgrade solicitado")
      return data.success ? data.data : null
      
    } catch (err) {
      console.error("❌ Erro ao solicitar upgrade:", err)
      throw err
    }
  }

  // Reset de uso
  const resetUsage = async () => {
    try {
      const token = localStorage.getItem("token")
      if (!token) throw new Error("Token não encontrado")
      
      console.log("🔄 Resetando uso...")
      const response = await fetch(`${BACKEND_URL}/api/users/reset-usage`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || data.message || `Erro ${response.status}`)
      }

      console.log("✅ Uso resetado")
      return data.success ? data.data : null
      
    } catch (err) {
      console.error("❌ Erro ao resetar uso:", err)
      throw err
    }
  }

  return {
    // Estado
    profile,
    loading,
    error,
    
    // Perfil
    refetchProfile: fetchProfile,
    updateProfile,
    updatePassword, // AGORA ESTÁ DEFINIDA
    
    // Dados adicionais
    getUserStats,
    getSubscriptionInfo,
    getRecentActivity,
    getMyQueries,
    requestUpgradePlan,
    resetUsage,
  }
}