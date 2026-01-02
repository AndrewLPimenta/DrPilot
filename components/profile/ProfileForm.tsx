"use client"

import { useState } from "react"
import { UserProfile } from "@/hooks/useUserProfile"
import { Loader2, Save, GraduationCap, Building, Edit, X, User, Mail, Briefcase, BookOpen } from "lucide-react"
import { Separator } from "@/components/ui/separator"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

interface ProfileFormProps {
  profile: UserProfile | null
  onUpdate: (updates: Partial<UserProfile>) => Promise<any>
}

export function ProfileForm({ profile, onUpdate }: ProfileFormProps) {
  if (!profile) {
    return (
      <div className="space-y-8 animate-pulse">
        <div>
          <div className="h-8 bg-muted rounded w-1/3 mb-2" />
          <div className="h-4 bg-muted rounded w-1/2" />
        </div>
        <Separator />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="space-y-3">
              <div className="h-4 bg-muted rounded w-1/3" />
              <div className="h-10 bg-muted rounded" />
            </div>
          ))}
        </div>
      </div>
    )
  }

  const [isEditing, setIsEditing] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: profile.name || "",
    specialty: profile.specialty || "",
    university: profile.university || "",
    year: profile.year?.toString() || "",
  })

  const specialties = [
    "Clínica Geral",
    "Cardiologia",
    "Dermatologia",
    "Endocrinologia",
    "Gastroenterologia",
    "Ginecologia",
    "Neurologia",
    "Oftalmologia",
    "Ortopedia",
    "Pediatria",
    "Psiquiatria",
    "Urologia",
    "Outra"
  ]

  const universities = [
    "USP - Universidade de São Paulo",
    "UNIFESP - Universidade Federal de São Paulo",
    "UNICAMP - Universidade Estadual de Campinas",
    "UFMG - Universidade Federal de Minas Gerais",
    "UFRJ - Universidade Federal do Rio de Janeiro",
    "UFPR - Universidade Federal do Paraná",
    "UFRGS - Universidade Federal do Rio Grande do Sul",
    "Outra"
  ]

  const years = [1, 2, 3, 4, 5, 6]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    
    try {
      const updates: any = {
        name: formData.name.trim(),
      }

      if (formData.specialty.trim()) {
        updates.specialty = formData.specialty.trim()
      } else {
        updates.specialty = null
      }

      if (formData.university.trim()) {
        updates.university = formData.university.trim()
      } else {
        updates.university = null
      }

      if (formData.year && formData.year !== "") {
        updates.year = parseInt(formData.year)
      } else {
        updates.year = null
      }

      await onUpdate(updates)
      setIsEditing(false)
    } catch (error) {
      console.error("Erro ao atualizar perfil:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleCancel = () => {
    setFormData({
      name: profile.name || "",
      specialty: profile.specialty || "",
      university: profile.university || "",
      year: profile.year?.toString() || "",
    })
    setIsEditing(false)
  }

  const formFields = [
    {
      id: "name",
      label: "Nome Completo",
      icon: <User className="h-5 w-5" />,
      required: true,
      type: "text",
      placeholder: "Seu nome completo",
      value: formData.name,
      onChange: (value: string) => setFormData({...formData, name: value}),
      displayValue: profile.name,
      bgColor: "bg-blue-500/10",
      iconColor: "text-blue-500"
    },
    {
      id: "email",
      label: "Email",
      icon: <Mail className="h-5 w-5" />,
      required: false,
      type: "text",
      placeholder: "Seu email",
      value: profile.email,
      displayValue: profile.email,
      readonly: true,
      bgColor: "bg-purple-500/10",
      iconColor: "text-purple-500",
      note: "Não editável"
    },
    {
      id: "specialty",
      label: "Especialidade",
      icon: <Briefcase className="h-5 w-5" />,
      required: false,
      type: "select",
      options: specialties,
      placeholder: "Selecione uma especialidade",
      value: formData.specialty,
      onChange: (value: string) => setFormData({...formData, specialty: value}),
      displayValue: profile.specialty || "Não informada",
      bgColor: "bg-green-500/10",
      iconColor: "text-green-500"
    },
    {
      id: "university",
      label: "Universidade",
      icon: <GraduationCap className="h-5 w-5" />,
      required: false,
      type: "select",
      options: universities,
      placeholder: "Selecione uma universidade",
      value: formData.university,
      onChange: (value: string) => setFormData({...formData, university: value}),
      displayValue: profile.university || "Não informada",
      bgColor: "bg-amber-500/10",
      iconColor: "text-amber-500"
    }
  ]

  return (
          <div className="">

      {/* Cabeçalho */}
      <div className="flex items-start justify-center gap-2 mb-1">
        <div>
          <h1 className="text-3xl font-semibold mb-2">Informações do Perfil</h1>
          <p className="text-muted-foreground">
            Gerencie suas informações pessoais e profissionais
          </p>
        </div>
        
        {!isEditing ? (
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setIsEditing(true)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg font-medium transition-colors hover:bg-primary/90"
          >
            <Edit className="h-4 w-4" />
            Editar Perfil
          </motion.button>
        ) : (
          <div className="flex gap-2">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleCancel}
              className="inline-flex items-center gap-2 px-4 py-2 bg-muted text-muted-foreground rounded-lg font-medium transition-colors hover:bg-muted/80"
              disabled={isLoading}
            >
              <X className="h-4 w-4" />
              Cancelar
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              form="profile-form"
              className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg font-medium transition-colors hover:bg-primary/90 disabled:opacity-50"
              disabled={isLoading}
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Save className="h-4 w-4" />
              )}
              Salvar Alterações
            </motion.button>
          </div>
        )}
      </div>

      <Separator />

      {/* Formulário */}
      <form id="profile-form" onSubmit={handleSubmit} className="space-y-9">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {formFields.map((field, index) => (
            <motion.div
              key={field.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="space-y-3"
            >
              <label className="flex items-center  text-sm font-medium">
                <div className={cn("p-2 rounded-lg", field.bgColor)}>
                  <span className={field.iconColor}>{field.icon}</span>
                </div>
                {field.label}
                {field.required && <span className="text-destructive">*</span>}
              </label>

              {isEditing && !field.readonly ? (
                field.type === "select" ? (
                  <select
                    value={field.value}
                    // onChange={(e) => field.onChange(e.target.value)}
                    className="w-full px-4 py-3 bg-background border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition"
                    required={field.required}
                  >
                    <option value="" className="text-muted-foreground">{field.placeholder}</option>
                    {field.options?.map((option) => (
                      <option key={option} value={option} className="text-foreground">
                        {option}
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    type={field.type}
                    value={field.value}
                    // onChange={(e) => field.onChange(e.target.value)}
                    className="w-full px-4 py-3 bg-background border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition"
                    placeholder={field.placeholder}
                    required={field.required}
                    minLength={field.type === "text" ? 2 : undefined}
                  />
                )
              ) : (
                <div className="px-4 py-3 bg-muted/30 border rounded-lg">
                  <div className="flex items-center justify-between">
                    <span className={cn(
                      "font-medium",
                      field.displayValue === "Não informada" || field.displayValue === "Não informado"
                        ? "text-muted-foreground"
                        : "text-foreground"
                    )}>
                      {field.displayValue}
                    </span>
                    {field.note && (
                      <span className="text-xs text-muted-foreground">{field.note}</span>
                    )}
                  </div>
                </div>
              )}
            </motion.div>
          ))}
        </div>

        {/* Ano da Graduação - Condicional */}
        {formData.university && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-3 max-w-md"
          >
            <label className="flex items-center  text-sm font-medium">
              <div className="p-2 rounded-lg bg-cyan-500/10">
                <BookOpen className="h-5 w-5 text-cyan-500" />
              </div>
              Ano da Graduação
            </label>

            {isEditing ? (
              <select
                value={formData.year}
                onChange={(e) => setFormData({...formData, year: e.target.value})}
                className="w-full px-4 py-3 bg-background border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition"
              >
                <option value="" className="text-muted-foreground">Selecione o ano</option>
                {years.map((year) => (
                  <option key={year} value={year} className="text-foreground">
                    {year}º ano
                  </option>
                ))}
              </select>
            ) : (
              <div className="px-4 py-3 bg-muted/30 border rounded-lg">
                <span className={cn(
                  "font-medium",
                  !profile.year ? "text-muted-foreground" : "text-foreground"
                )}>
                  {profile.year ? `${profile.year}º ano` : "Não informado"}
                </span>
              </div>
            )}
          </motion.div>
        )}

        {isEditing && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="pt-6 border-t"
          >
            <div className="flex items-center text-sm text-muted-foreground">
              <div className="h-2 w-2 rounded-full bg-primary" />
              <p>Campos marcados com * são obrigatórios</p>
            </div>
          </motion.div>
        )}
      </form>

      {/* Cards informativos */}
      {!isEditing && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Separator />
          <div className="pt-6">
            <h3 className="text-lg font-medium mb-4">Dicas para seu perfil</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 ">
              <div className="p-4 bg-blue-500/5 border border-blue-500/20 rounded-lg">
                <h4 className="font-medium text-blue-500 mb-2">Perfil Completo</h4>
                <p className="text-sm text-muted-foreground">
                  Um perfil completo aumenta sua credibilidade e melhora a experiência.
                </p>
              </div>
              <div className="p-4 bg-green-500/5 border border-green-500/20 rounded-lg">
                <h4 className="font-medium text-green-500 mb-2">Atualização</h4>
                <p className="text-sm text-muted-foreground">
                  Mantenha suas informações sempre atualizadas para melhores resultados.
                </p>
              </div>
              <div className="p-4 bg-amber-500/5 border border-amber-500/20 rounded-lg">
                <h4 className="font-medium text-amber-500 mb-2">Privacidade</h4>
                <p className="text-sm text-muted-foreground">
                  Suas informações são seguras e só serão usadas para melhorar seu atendimento.
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  )
}