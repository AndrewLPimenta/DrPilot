"use client"

import { useState } from "react"
import { UserProfile } from "@/hooks/useUserProfile"
import {
  Calendar,
  Clock,
  Shield,
  Activity,
  Mail,
  Key,
  Loader2,
  ArrowRight,
  UserCheck,
  Lock,
  Globe,
  CreditCard,
  CheckCircle,
  XCircle,
} from "lucide-react"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

interface AccountInfoProps {
  profile: UserProfile | null
  onPasswordChange: (currentPassword: string, newPassword: string) => Promise<any>
}

export function AccountInfo({ profile, onPasswordChange }: AccountInfoProps) {
  if (!profile) {
    return (
      <div className="space-y-8 animate-pulse">
        <div className="h-8 w-1/3 bg-muted rounded" />
        <Separator />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-32 bg-muted rounded-lg" />
          ))}
        </div>
        <Separator />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="h-24 bg-muted rounded-lg" />
          ))}
        </div>
        <Separator />
        <div className="h-48 bg-muted rounded-lg" />
      </div>
    )
  }

  const [showPasswordForm, setShowPasswordForm] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })
  const [passwordError, setPasswordError] = useState("")

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "Nunca"
    try {
      return format(new Date(dateString), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })
    } catch {
      return "Data inválida"
    }
  }

  const formatDateTime = (dateString: string | null) => {
    if (!dateString) return "Nunca"
    try {
      return format(new Date(dateString), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })
    } catch {
      return "Data inválida"
    }
  }

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setPasswordError("")

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordError("As senhas não coincidem")
      return
    }

    if (passwordForm.newPassword.length < 8) {
      setPasswordError("A nova senha deve ter pelo menos 8 caracteres")
      return
    }

    setIsLoading(true)
    try {
      await onPasswordChange(passwordForm.currentPassword, passwordForm.newPassword)
      setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" })
      setShowPasswordForm(false)
      setPasswordError("")
      alert("Senha alterada com sucesso!")
    } catch (err: any) {
      setPasswordError(err.message || "Erro ao alterar senha. Verifique sua senha atual.")
    } finally {
      setIsLoading(false)
    }
  }

  const accountItems = [
    {
      icon: <Activity className="h-6 w-6" />,
      title: "Status da Conta",
      category: "Verificação",
      description: profile.is_active ? "Conta verificada e ativa" : "Conta pendente de ativação",
      value: profile.is_active ? "Ativo" : "Inativo",
      color: profile.is_active ? "text-primary" : "text-destructive",
      bgColor: profile.is_active ? "bg-primary/10" : "bg-destructive/10",
      iconColor: "text-primary"
    },
    {
      icon: <Shield className="h-6 w-6" />,
      title: "Nível de Acesso",
      category: "Permissões",
      description: getRoleDescription(profile.role),
      value: getRoleDisplayName(profile.role),
      color: "text-primary",
      bgColor: "bg-primary/10",
      iconColor: "text-primary"
    },
    {
      icon: <Mail className="h-6 w-6" />,
      title: "Email",
      category: "Contato",
      description: "Endereço de email principal",
      value: profile.email,
      color: "text-primary",
      bgColor: "bg-primary/10",
      iconColor: "text-primary"
    },
  ]

  const dateItems = [
    {
      icon: <Calendar className="h-6 w-6" />,
      title: "Data de Criação",
      category: "Conta",
      description: "Quando sua conta foi criada",
      value: formatDate(profile.created_at),
      color: "text-primary",
      bgColor: "bg-primary/10",
      iconColor: "text-primary"
    },
    {
      icon: <Clock className="h-6 w-6" />,
      title: "Último Acesso",
      category: "Atividade",
      description: "Seu último login no sistema",
      value: formatDateTime(profile.last_login),
      color: "text-primary",
      bgColor: "bg-primary/10",
      iconColor: "text-primary"
    },
  ]

  function getRoleDescription(role: string) {
    switch (role) {
      case "admin":
        return "Acesso completo ao sistema"
      case "beta_tester":
        return "Acesso a funcionalidades beta"
      default:
        return "Acesso padrão do usuário"
    }
  }

  function getRoleDisplayName(role: string) {
    switch (role) {
      case "admin":
        return "Administrador"
      case "beta_tester":
        return "Beta Tester"
      default:
        return "Usuário"
    }
  }

  return (
    <div className="space-y-8 p-4 md:p-6 border border-primary/20 rounded-2xl bg-background">
      <div>
        <h1 className="mb-4 text-2xl font-semibold text-foreground">Informações da Conta</h1>
        <p className="text-muted-foreground">
          Gerencie suas configurações de conta e preferências de segurança
        </p>
      </div>

      <Separator className="bg-border" />

      {/* Status da Conta - Grid */}
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
          {accountItems.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="group relative overflow-hidden rounded-xl border border-border bg-card p-6 transition-all hover:border-primary/30 hover:shadow-lg"
            >
              <div className="flex items-start gap-4">
                <div className={cn("flex h-14 w-14 shrink-0 items-center justify-center rounded-lg", item.bgColor)}>
                  <span className={item.iconColor}>{item.icon}</span>
                </div>
                <div className="flex-1 space-y-2">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-foreground">{item.title}</h3>
                    <span className={cn("rounded-full px-3 py-1 text-xs font-medium border border-primary/20", item.color)}>
                      {item.value}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">{item.category}</p>
                  <p className="text-sm text-foreground">{item.description}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <Separator className="bg-border" />

      {/* Datas - Grid */}
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {dateItems.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="group relative overflow-hidden rounded-xl border border-border bg-card p-6 transition-all hover:border-primary/30 hover:shadow-lg"
            >
              <div className="flex items-start gap-4">
                <div className={cn("flex h-14 w-14 shrink-0 items-center justify-center rounded-lg", item.bgColor)}>
                  <span className={item.iconColor}>{item.icon}</span>
                </div>
                <div className="flex-1 space-y-2">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-foreground">{item.title}</h3>
                    <span className="rounded-full px-3 py-1 text-xs font-medium bg-muted text-muted-foreground border border-border">
                      {item.value}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">{item.category}</p>
                  <p className="text-sm text-foreground">{item.description}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <Separator className="bg-border" />

      {/* Segurança */}
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-semibold text-foreground">Segurança</h2>
            <p className="text-muted-foreground">Proteja sua conta com uma senha forte</p>
          </div>
          
          {!showPasswordForm && (
            <Button
              onClick={() => setShowPasswordForm(true)}
              variant="outline"
              className="gap-2 border-primary text-primary hover:bg-primary/10 hover:text-primary"
            >
              <Key className="h-4 w-4" />
              Alterar Senha
            </Button>
          )}
        </div>

        {showPasswordForm ? (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="rounded-xl border border-border bg-card p-6">
              <div className="mb-6 flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <Lock className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">Alteração de Senha</h3>
                  <p className="text-sm text-muted-foreground">Digite sua senha atual e a nova senha</p>
                </div>
              </div>

              <form onSubmit={handlePasswordSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">Senha Atual</label>
                    <input
                      type="password"
                      value={passwordForm.currentPassword}
                      onChange={(e) =>
                        setPasswordForm({ ...passwordForm, currentPassword: e.target.value })
                      }
                      className="w-full rounded-lg border border-border bg-background px-3 py-2 text-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none"
                      placeholder="Digite sua senha atual"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">Nova Senha</label>
                    <input
                      type="password"
                      value={passwordForm.newPassword}
                      onChange={(e) =>
                        setPasswordForm({ ...passwordForm, newPassword: e.target.value })
                      }
                      className="w-full rounded-lg border border-border bg-background px-3 py-2 text-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none"
                      placeholder="Mínimo 8 caracteres"
                      required
                      minLength={8}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">Confirmar Nova Senha</label>
                    <input
                      type="password"
                      value={passwordForm.confirmPassword}
                      onChange={(e) =>
                        setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })
                      }
                      className="w-full rounded-lg border border-border bg-background px-3 py-2 text-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none"
                      placeholder="Digite novamente a nova senha"
                      required
                    />
                  </div>

                  <div className="flex items-end">
                    <div className="space-y-2 w-full">
                      <label className="text-sm font-medium text-transparent">.</label>
                      <Button
                        type="submit"
                        className="w-full gap-2 bg-primary text-primary-foreground hover:bg-primary/90"
                        disabled={isLoading}
                      >
                        {isLoading ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <>
                            <CheckCircle className="h-4 w-4" />
                            Confirmar Alteração
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                </div>

                {passwordError && (
                  <div className="rounded-lg border border-destructive/20 bg-destructive/10 p-4">
                    <div className="flex items-center gap-2 text-destructive">
                      <XCircle className="h-5 w-5" />
                      <p className="font-medium">{passwordError}</p>
                    </div>
                  </div>
                )}

                <div className="flex justify-end gap-3">
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => {
                      setShowPasswordForm(false)
                      setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" })
                      setPasswordError("")
                    }}
                    disabled={isLoading}
                    className="text-muted-foreground hover:text-foreground hover:bg-muted"
                  >
                    Cancelar
                  </Button>
                </div>
              </form>
            </div>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="rounded-xl border border-border bg-card p-6">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <CheckCircle className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">Senha Configurada</h3>
                  <p className="text-sm text-muted-foreground">Sua senha está ativa e protegendo sua conta</p>
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-border bg-card p-6">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <Shield className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">Autenticação</h3>
                  <p className="text-sm text-muted-foreground">Login seguro com criptografia</p>
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-border bg-card p-6">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <Globe className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">Privacidade</h3>
                  <p className="text-sm text-muted-foreground">Seus dados são protegidos</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}