"use client"

import { useEffect, useCallback, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { useUserProfile } from "@/hooks/useUserProfile"
import { ProfileHeader } from "@/components/profile/ProfileHeader"
import { ProfileForm } from "@/components/profile/ProfileForm"
import { AccountInfo } from "@/components/profile/AccountInfo"
import { Loader2, AlertCircle, ArrowLeft, Heart, Brain, Shield, Activity, X } from "lucide-react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { PageLayout } from "@/components/page-layout";
import { ProtectedRoute } from "@/components/auth/protected-route";
import { motion, AnimatePresence } from "framer-motion";

export default function ProfilePage() {
  const router = useRouter()
  const { user, loading: authLoading } = useAuth()
  const {
    profile,
    loading: profileLoading,
    error,
    updateProfile,
    updatePassword,
  } = useUserProfile()

  // Estados para controlar os popups
  const [showProfilePopup, setShowProfilePopup] = useState(false);
  const [showAccountPopup, setShowAccountPopup] = useState(false);

  // Handler para atualizar perfil
  const handleUpdate = useCallback(async (data: any) => {
    try {
      await updateProfile(data)
      // Se necessário, adicionar lógica adicional após atualização
    } catch (err) {
      console.error("Erro ao atualizar perfil:", err)
      throw err
    }
  }, [updateProfile])

  // Handler para alterar senha
  const handlePasswordChange = useCallback(async (currentPassword: string, newPassword: string) => {
    try {
      await updatePassword(currentPassword, newPassword)
      // Se necessário, adicionar lógica adicional após alterar senha
    } catch (err) {
      console.error("Erro ao alterar senha:", err)
      throw err
    }
  }, [updatePassword])

  // Redireciona se não estiver autenticado
  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login")
    }
  }, [user, authLoading, router])

  if (authLoading || profileLoading) {
    return (
      <PageLayout>
        <div className="min-h-screen flex items-center justify-center bg-background">
          <Card className="border-border/50 bg-card/40 backdrop-blur-sm shadow-lg">
            <CardContent className="pt-6">
              <div className="text-center">
                <Loader2 className="w-12 h-12 text-primary animate-spin mx-auto mb-4" />
                <p className="text-muted-foreground">Carregando perfil...</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </PageLayout>
    )
  }

  if (!user) {
    return null
  }

  if (error && !profile) {
    return (
      <PageLayout>
        <div className="min-h-screen flex items-center justify-center bg-background px-4">
          <Card className="border-border/50 bg-card/40 backdrop-blur-sm shadow-lg max-w-md w-full">
            <CardContent className="pt-6">
              <div className="text-center">
                <AlertCircle className="w-12 h-12 text-destructive mx-auto mb-4" />
                <h2 className="text-xl font-semibold text-foreground mb-2">Erro ao carregar perfil</h2>
                <p className="text-muted-foreground mb-6">{error}</p>
                <Button
                  onClick={() => window.location.reload()}
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold"
                >
                  Tentar novamente
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </PageLayout>
    )
  }

  if (!profile) {
    return (
      <PageLayout>
        <div className="min-h-screen flex items-center justify-center bg-background">
          <Card className="border-border/50 bg-card/40 backdrop-blur-sm shadow-lg">
            <CardContent className="pt-6">
              <div className="text-center">
                <AlertCircle className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
                <p className="text-muted-foreground">Perfil não encontrado</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </PageLayout>
    )
  }

  return (
    <ProtectedRoute>
      <PageLayout>
        <div className="min-h-screen bg-background relative">
          {/* Header */}
          <div className="bg-card/50 border-b border-border">
            <div className="container mx-auto px-4 py-4">
              <div className="flex items-center justify-between">
               
                <div className="flex items-center gap-2">
                  <Heart className="w-6 h-6 text-primary" />
                  <h1 className="text-2xl font-bold text-foreground">Meu Perfil</h1>
                </div>
                <div className="w-24"></div>
              </div>
            </div>
          </div>

          {/* Conteúdo */}
          <div className="container mx-auto px-4 py-8">
            <div className="max-w-6xl mx-auto space-y-8">
              {/* Breadcrumb */}
              

              {/* Alertas */}
              {error && (
                <Alert variant="destructive" className="bg-destructive/10 border-destructive/30">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {/* Conteúdo principal */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Coluna esquerda - 2/3 */}
                <div className="lg:col-span-2 space-y-8">
                  <Card className="border-border/50 bg-card/40 backdrop-blur-sm shadow-lg">
                    <CardContent className="pt-6">
                      <ProfileHeader 
                        profile={profile} 
                        onEditProfile={() => setShowProfilePopup(true)}
                        onAccountInfo={() => setShowAccountPopup(true)}
                      />
                    </CardContent>
                  </Card>
                  

                  
                  {/* <Card className="border-border/50 bg-card/40 backdrop-blur-sm shadow-lg">
                    <CardHeader>
                      <CardTitle>Informações da Conta</CardTitle>
                      <CardDescription>Gerencie as configurações da sua conta</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <AccountInfo 
                        profile={profile} 
                        onPasswordChange={handlePasswordChange}
                      />
                    </CardContent>
                  </Card> */}
                </div>

                {/* Coluna direita - 1/3 */}
                <div className="space-y-8">
                  {/* Estatísticas */}
                  <Card className="border-border/50 bg-card/40 backdrop-blur-sm shadow-lg">
                    <CardHeader className="pb-4">
                      <div className="flex items-center gap-2">
                        <Activity className="w-5 h-5 text-primary" />
                        <CardTitle className="text-lg">Estatísticas</CardTitle>
                      </div>
                      <CardDescription>Suas consultas e uso</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-6">
                        <div>
                          <p className="text-sm text-muted-foreground mb-1">Total de Consultas</p>
                          <p className="text-3xl font-bold text-foreground">{profile.queries_count}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground mb-1">Limite Mensal</p>
                          <p className="text-3xl font-bold text-foreground">
                            {profile.subscription === "free" ? profile.queries_limit : "∞"}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground mb-1">Disponíveis</p>
                          <p className="text-3xl font-bold text-foreground">
                            {profile.subscription === "free" 
                              ? Math.max(0, profile.queries_limit - profile.queries_count)
                              : "∞"
                            }
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Ações Rápidas */}
                  <Card className="border-border/50 bg-card/40 backdrop-blur-sm shadow-lg">
                    <CardHeader className="pb-4">
                      <div className="flex items-center gap-2">
                        <Brain className="w-5 h-5 text-secondary" />
                        <CardTitle className="text-lg">Ações Rápidas</CardTitle>
                      </div>
                      <CardDescription>Acesso rápido às funcionalidades</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <Button
                          onClick={() => router.push("/chatbot")}
                          className="w-full justify-start bg-primary/10 hover:bg-primary/20 text-primary border border-primary/20"
                          variant="ghost"
                        >
                          Nova Consulta
                        </Button>
                        
                        <Button
                          onClick={() => router.push("/history")}
                          className="w-full justify-start bg-primary/10 hover:bg-primary/20 text-primary border border-primary/20"
                          variant="ghost"
                        >
                          Histórico de Consultas
                        </Button>
                        
                        {profile.subscription === "free" && (
                          <Button
                            onClick={() => router.push("/plans")}
                            className="w-full justify-start bg-secondary/10 hover:bg-secondary/20 text-secondary border border-secondary/20"
                            variant="ghost"
                          >
                            Fazer Upgrade
                          </Button>
                        )}
                        
                        <Button
                          onClick={() => {
                            localStorage.clear()
                            router.push("/login")
                          }}
                          className="w-full justify-start bg-muted hover:bg-muted/80 text-muted-foreground"
                          variant="ghost"
                        >
                          Sair em Outros Dispositivos
                        </Button>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Informações do Sistema */}
                  {/* <Card className="border-border/50 bg-card/40 backdrop-blur-sm shadow-lg">
                    <CardHeader className="pb-4">
                      <div className="flex items-center gap-2">
                        <Shield className="w-5 h-5 text-primary" />
                        <CardTitle className="text-lg">Dr Pilot</CardTitle>
                      </div>
                      <CardDescription>Informações técnicas</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3 text-sm text-muted-foreground">
                        <div>
                          <p className="font-medium">Última atualização:</p>
                          <p>{formatDate(profile.updated_at)}</p>
                        </div>
                        <div>
                          <p className="font-medium">Versão:</p>
                          <p>1.0.0</p>
                        </div>
                        <div className="pt-4">
                          <p className="text-xs">
                            Precisa de ajuda?{" "}
                            <a 
                              href="mailto:suporte@drpilot.com" 
                              className="text-primary hover:underline"
                            >
                              Contate o suporte
                            </a>
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card> */}
                </div>
              </div>
            </div>
          </div>

          {/* Popup do ProfileForm - AGORA NO NÍVEL DA PÁGINA */}
          <AnimatePresence>
            {showProfilePopup && (
              <>
                {/* Overlay */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setShowProfilePopup(false)}
                  className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50"
                />
                
                {/* Modal */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: 20 }}
                  transition={{ type: "spring", damping: 25, stiffness: 300 }}
                  className="fixed inset-0 z-50 flex items-center justify-center p-4"
                >
                  <div className="relative w-full max-w-2xl max-h-[85vh] overflow-y-auto bg-background rounded-2xl border border-primary shadow-2xl">
                    {/* Botão de fechar */}
                    <button
                      onClick={() => setShowProfilePopup(false)}
                      className="absolute top-4 right-4 p-2 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-colors z-10"
                      aria-label="Fechar"
                    >
                      <X className="w-5 h-5" />
                    </button>
                    
                    {/* Conteúdo do ProfileForm */}
                    <div className="p-6">
                        
                      <ProfileForm profile={profile} onUpdate={handleUpdate} />
                    </div>
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>

          {/* Popup do AccountInfo - AGORA NO NÍVEL DA PÁGINA */}
          <AnimatePresence>
            {showAccountPopup && (
              <>
                {/* Overlay */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setShowAccountPopup(false)}
                  className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50"
                />
                
                {/* Modal */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: 20 }}
                  transition={{ type: "spring", damping: 25, stiffness: 300 }}
                  className="fixed inset-0 z-50 flex items-center justify-center p-4"
                >
                  <div className="relative w-full max-w-2xl max-h-[85vh] overflow-y-auto bg-background rounded-2xl border border-primary shadow-2xl">
                    {/* Botão de fechar */}
                    <button
                      onClick={() => setShowAccountPopup(false)}
                      className="absolute top-4 right-4 p-2 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-colors z-10"
                      aria-label="Fechar"
                    >
                      <X className="w-5 h-5" />
                    </button>
                    
                    {/* Conteúdo do AccountInfo */}
                    <div className="p-6">
                      <div className="mb-6">
                        <h2 className="text-2xl font-bold text-foreground">Informações da Conta</h2>
                        <p className="text-muted-foreground">Gerencie as configurações da sua conta</p>
                      </div>
                      <AccountInfo 
                        profile={profile} 
                        onPasswordChange={handlePasswordChange}
                      />
                    </div>
                  </div>
                </motion.div>
              </>
            )}
                              <Card className="border-border/50 bg-card/40 backdrop-blur-sm shadow-lg">
  <CardHeader className="pb-4">
    <div className="flex flex-col items-center justify-center gap-2">
      <Shield className="w-5 h-5 text-primary" />
      <CardTitle className="text-lg text-center">Dr Pilot</CardTitle>
    </div>
    <CardDescription className="text-center">Informações técnicas</CardDescription>
  </CardHeader>
  <CardContent>
    <div className="space-y-3 text-sm text-muted-foreground">
      <div className="text-center">
        <p className="font-medium">Última atualização:</p>
        <p>{formatDate(profile.updated_at)}</p>
      </div>
      <div className="text-center">
        <p className="font-medium">Versão:</p>
        <p>1.0.0</p>
      </div>
      <div className="pt-4 text-center">
        <p className="text-xs">
          Precisa de ajuda?{" "}
          <a 
            href="mailto:suporte@drpilot.com" 
            className="text-primary hover:underline"
          >
            Contate o suporte
          </a>
        </p>
      </div>
    </div>
  </CardContent>
</Card>
          </AnimatePresence>
        </div>
      </PageLayout>
    </ProtectedRoute>
  )
}

// Helper function
function formatDate(dateString: string) {
  try {
    const date = new Date(dateString)
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  } catch {
    return "Data inválida"
  }
}