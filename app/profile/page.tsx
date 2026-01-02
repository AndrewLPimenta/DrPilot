"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { useUserProfile } from "@/hooks/useUserProfile"
import { Loader2, AlertCircle, User, Shield, CreditCard, Zap, ChevronRight } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PageLayout } from "@/components/page-layout"
import { ProtectedRoute } from "@/components/auth/protected-route"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Progress } from "@/components/ui/progress"

export default function ProfilePage() {
  const router = useRouter()
  const { user, loading: authLoading } = useAuth()
  const { profile, loading: profileLoading, error, updateProfile, updatePassword } = useUserProfile()

  const [isUpdating, setIsUpdating] = useState(false)
  const [successMessage, setSuccessMessage] = useState("")
  const [errorMessage, setErrorMessage] = useState("")

  // Profile form state
  const [profileData, setProfileData] = useState({
    name: "",
    email: "",
  })

  // Password form state
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login")
    }
  }, [user, authLoading, router])

  useEffect(() => {
    if (profile) {
      setProfileData({
        name: profile.name || "",
        email: profile.email || "",
      })
    }
  }, [profile])

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsUpdating(true)
    setErrorMessage("")
    setSuccessMessage("")

    try {
      await updateProfile(profileData)
      setSuccessMessage("Perfil atualizado com sucesso!")
      setTimeout(() => setSuccessMessage(""), 3000)
    } catch (err: any) {
      setErrorMessage(err.message || "Erro ao atualizar perfil")
    } finally {
      setIsUpdating(false)
    }
  }

  const handlePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault()

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setErrorMessage("As senhas não coincidem")
      return
    }

    setIsUpdating(true)
    setErrorMessage("")
    setSuccessMessage("")

    try {
      await updatePassword(passwordData.currentPassword, passwordData.newPassword)
      setSuccessMessage("Senha alterada com sucesso!")
      setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" })
      setTimeout(() => setSuccessMessage(""), 3000)
    } catch (err: any) {
      setErrorMessage(err.message || "Erro ao alterar senha")
    } finally {
      setIsUpdating(false)
    }
  }

  if (authLoading || profileLoading) {
    return (
      <PageLayout>
        <div className="min-h-screen flex items-center justify-center">
          <Loader2 className="w-8 h-8 text-primary animate-spin" />
        </div>
      </PageLayout>
    )
  }

  if (!user || !profile) return null

  const usagePercentage = profile.subscription === "free" ? (profile.queries_count / profile.queries_limit) * 100 : 0

  return (
    <ProtectedRoute>
      <PageLayout>
        <div className="min-h-screen bg-muted/30">
          <div className="border-b bg-background">
            <div className="container mx-auto px-6 py-4">
              <div className="flex items-center justify-between">
                <h1 className="text-lg font-medium">Minha Conta</h1>
                <Badge variant="secondary" className="text-xs">
                  {profile.subscription === "free" ? "Free" : "Premium"}
                </Badge>
              </div>
            </div>
          </div>

          <div className="container mx-auto px-6 py-8">
            <div className="max-w-5xl mx-auto">
              {successMessage && (
                <Alert className="mb-6 border-green-200 bg-green-50 dark:bg-green-950/20 dark:border-green-900">
                  <AlertDescription className="text-green-800 dark:text-green-200">{successMessage}</AlertDescription>
                </Alert>
              )}

              {errorMessage && (
                <Alert variant="destructive" className="mb-6">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{errorMessage}</AlertDescription>
                </Alert>
              )}

              <Tabs defaultValue="general" className="space-y-6">
                <TabsList className="bg-muted/50">
                  <TabsTrigger value="general" className="gap-2">
                    <User className="w-4 h-4" />
                    Geral
                  </TabsTrigger>
                  <TabsTrigger value="security" className="gap-2">
                    <Shield className="w-4 h-4" />
                    Segurança
                  </TabsTrigger>
                  <TabsTrigger value="usage" className="gap-2">
                    <Zap className="w-4 h-4" />
                    Uso
                  </TabsTrigger>
                  <TabsTrigger value="billing" className="gap-2">
                    <CreditCard className="w-4 h-4" />
                    Plano
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="general" className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base font-medium">Informações do Perfil</CardTitle>
                      <CardDescription className="text-sm">Atualize suas informações pessoais</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <form onSubmit={handleProfileUpdate} className="space-y-6">
                        <div className="space-y-2">
                          <Label htmlFor="name" className="text-sm font-normal">
                            Nome completo
                          </Label>
                          <Input
                            id="name"
                            value={profileData.name}
                            onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                            className="max-w-md"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="email" className="text-sm font-normal">
                            Email
                          </Label>
                          <Input
                            id="email"
                            type="email"
                            value={profileData.email}
                            onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                            className="max-w-md"
                          />
                          <p className="text-xs text-muted-foreground">
                            Este é o email usado para login e notificações
                          </p>
                        </div>

                        <div className="flex items-center gap-3">
                          <Button type="submit" disabled={isUpdating} size="sm">
                            {isUpdating && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                            Salvar alterações
                          </Button>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => setProfileData({ name: profile.name || "", email: profile.email || "" })}
                          >
                            Cancelar
                          </Button>
                        </div>
                      </form>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base font-medium">Informações da Conta</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center justify-between py-2">
                        <div className="space-y-0.5">
                          <p className="text-sm font-medium">ID da Conta</p>
                          <p className="text-xs text-muted-foreground">{user.id}</p>
                        </div>
                      </div>
                      <Separator />
                      <div className="flex items-center justify-between py-2">
                        <div className="space-y-0.5">
                          <p className="text-sm font-medium">Data de Criação</p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(profile.created_at || profile.updated_at).toLocaleDateString("pt-BR", {
                              day: "numeric",
                              month: "long",
                              year: "numeric",
                            })}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="security" className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base font-medium">Alterar Senha</CardTitle>
                      <CardDescription className="text-sm">
                        Mantenha sua conta segura com uma senha forte
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <form onSubmit={handlePasswordUpdate} className="space-y-6">
                        <div className="space-y-2">
                          <Label htmlFor="currentPassword" className="text-sm font-normal">
                            Senha atual
                          </Label>
                          <Input
                            id="currentPassword"
                            type="password"
                            value={passwordData.currentPassword}
                            onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                            className="max-w-md"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="newPassword" className="text-sm font-normal">
                            Nova senha
                          </Label>
                          <Input
                            id="newPassword"
                            type="password"
                            value={passwordData.newPassword}
                            onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                            className="max-w-md"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="confirmPassword" className="text-sm font-normal">
                            Confirmar nova senha
                          </Label>
                          <Input
                            id="confirmPassword"
                            type="password"
                            value={passwordData.confirmPassword}
                            onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                            className="max-w-md"
                          />
                        </div>

                        <div className="flex items-center gap-3">
                          <Button type="submit" disabled={isUpdating} size="sm">
                            {isUpdating && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                            Atualizar senha
                          </Button>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() =>
                              setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" })
                            }
                          >
                            Cancelar
                          </Button>
                        </div>
                      </form>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="usage" className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base font-medium">Uso de Consultas</CardTitle>
                      <CardDescription className="text-sm">
                        {profile.subscription === "free"
                          ? "Acompanhe seu uso mensal de consultas"
                          : "Você tem acesso ilimitado a consultas"}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="grid grid-cols-3 gap-6">
                        <div className="space-y-1">
                          <p className="text-xs text-muted-foreground">Utilizadas</p>
                          <p className="text-2xl font-semibold">{profile.queries_count}</p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-xs text-muted-foreground">Limite</p>
                          <p className="text-2xl font-semibold">
                            {profile.subscription === "free" ? profile.queries_limit : "∞"}
                          </p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-xs text-muted-foreground">Disponíveis</p>
                          <p className="text-2xl font-semibold text-primary">
                            {profile.subscription === "free"
                              ? Math.max(0, profile.queries_limit - profile.queries_count)
                              : "∞"}
                          </p>
                        </div>
                      </div>

                      {profile.subscription === "free" && (
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">Progresso</span>
                            <span className="text-sm font-medium">{usagePercentage.toFixed(0)}%</span>
                          </div>
                          <Progress value={usagePercentage} className="h-2" />
                          {usagePercentage > 80 && (
                            <Alert className="mt-4">
                              <AlertCircle className="h-4 w-4" />
                              <AlertDescription className="text-sm">
                                Você está próximo do seu limite. Considere fazer upgrade para continuar usando.
                              </AlertDescription>
                            </Alert>
                          )}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="billing" className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base font-medium">Plano Atual</CardTitle>
                      <CardDescription className="text-sm">Gerencie sua assinatura</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="flex items-start justify-between p-4 border rounded-lg">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <p className="font-semibold">
                              {profile.subscription === "free" ? "Plano Free" : "Plano Premium"}
                            </p>
                            <Badge variant="secondary" className="text-xs">
                              {profile.subscription === "free" ? "Gratuito" : "Pago"}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {profile.subscription === "free"
                              ? `${profile.queries_limit} consultas por mês`
                              : "Consultas ilimitadas"}
                          </p>
                        </div>
                        {profile.subscription === "free" && (
                          <Button size="sm" onClick={() => router.push("/plans")}>
                            <Zap className="w-4 h-4 mr-2" />
                            Fazer Upgrade
                          </Button>
                        )}
                      </div>

                      {profile.subscription === "free" && (
                        <div className="space-y-3">
                          <Separator />
                          <div className="space-y-3">
                            <p className="text-sm font-medium">Benefícios do Premium</p>
                            <div className="space-y-2">
                              {[
                                "Consultas ilimitadas",
                                "Suporte prioritário",
                                "Acesso a recursos avançados",
                                "Histórico completo",
                              ].map((benefit, index) => (
                                <div key={index} className="flex items-center gap-2 text-sm text-muted-foreground">
                                  <ChevronRight className="w-4 h-4" />
                                  {benefit}
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </PageLayout>
    </ProtectedRoute>
  )
}
