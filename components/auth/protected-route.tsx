// components/protected-route.tsx
"use client"

import { useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { LoadingSpinner } from "@/components/loading-spinner"

interface ProtectedRouteProps {
  children: React.ReactNode
  requiredRole?: "user" | "admin" | "beta_tester" | string // Aceita strings customizadas
  redirectTo?: string // Para onde redirecionar se não autorizado
  fallback?: React.ReactNode // Componente alternativo enquanto carrega
}

export function ProtectedRoute({ 
  children, 
  requiredRole, 
  redirectTo = "/login",
  fallback = <DefaultLoadingFallback />
}: ProtectedRouteProps) {
  const { user, loading: authLoading } = useAuth()
  const router = useRouter()
  const pathname = usePathname()
  const [isRedirecting, setIsRedirecting] = useState(false)
  const [accessChecked, setAccessChecked] = useState(false)

  useEffect(() => {
    // Só executa quando o auth termina de carregar
    if (!authLoading) {
      setAccessChecked(true)
      
      // Se não há usuário, redireciona para login
      if (!user) {
        setIsRedirecting(true)
        // Adiciona a rota atual como parâmetro para redirecionamento de volta
        const redirectUrl = redirectTo === "/login" 
          ? `${redirectTo}?redirect=${encodeURIComponent(pathname)}`
          : redirectTo
        router.push(redirectUrl)
        return
      }

      // Se há role específico e o usuário não tem, redireciona para acesso negado
      if (requiredRole && user.role !== requiredRole) {
        setIsRedirecting(true)
        router.push("/unauthorized")
        return
      }
    }
  }, [user, authLoading, router, requiredRole, redirectTo, pathname])

  // Se ainda está carregando OU está redirecionando, mostra fallback
  if (authLoading || !accessChecked || isRedirecting) {
    return <>{fallback}</>
  }

  // Se não tem usuário após verificação (não deve acontecer devido ao redirecionamento)
  if (!user) {
    return null
  }

  // Se precisa de role específico e o usuário não tem (não deve acontecer devido ao redirecionamento)
  if (requiredRole && user.role !== requiredRole) {
    return null
  }

  // Tudo ok, renderiza o conteúdo protegido
  return <>{children}</>
}

// Fallback padrão enquanto carrega
function DefaultLoadingFallback() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
        <p className="mt-4 text-muted-foreground">Verificando acesso...</p>
      </div>
    </div>
  )
}