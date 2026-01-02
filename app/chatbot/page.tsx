"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import DrPilot from "@/components/dr-pilot"
import { LoadingSpinner } from "@/components/loading-spinner"
import { Header } from "@/components/ui/header-1"
import { ProtectedRoute } from "@/components/auth/protected-route"

export default function ChatPage() {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login")
    }
  }, [user, loading, router])

  if (loading) {
    return <LoadingSpinner fullScreen text="Carregando chat..." />
  }

  if (!user) {
    return null
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen flex flex-col relative">
        <Header />
        <DrPilot />
      </div>
    </ProtectedRoute>
  )
}
