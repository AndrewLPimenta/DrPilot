"use client";

import { useState } from "react";
import { UserProfile } from "@/hooks/useUserProfile";
import { Crown, Shield, Zap, User, Star, CheckCircle, Info, Edit } from "lucide-react";
import Image from "next/image";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface ProfileHeaderProps {
  profile: UserProfile | null;
  onEditProfile: () => void;
  onAccountInfo: () => void;
}

export function ProfileHeader({ profile, onEditProfile, onAccountInfo }: ProfileHeaderProps) {
  if (!profile) {
    return (
      <div className="bg-background/50 rounded-3xl shadow-2xl border border-primary p-9 animate-pulse mx-auto">
        <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
          <div className="w-[280px] h-[280px] md:w-[250px] md:h-[320px] bg-muted rounded-4xl"></div>
          <div className="space-y-4 flex-1">
            <div className="h-8 bg-muted rounded w-1/3"></div>
            <div className="h-4 bg-muted rounded w-1/4"></div>
            <div className="h-20 bg-muted rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  const getSubscriptionInfo = () => {
    switch (profile.subscription) {
      case "premium":
        return {
          icon: <Crown className="w-5 h-5" />,
          text: "Premium",
          color: "bg-primary/10 text-primary border border-primary/20",
          description: "Consultas ilimitadas",
          limitText: "Ilimitado"
        };
      case "enterprise":
        return {
          icon: <Shield className="w-5 h-5" />,
          text: "Enterprise",
          color: "bg-primary/10 text-primary border border-primary/20",
          description: "Consultas ilimitadas + Recursos avançados",
          limitText: "Ilimitado"
        };
      default:
        return {
          icon: null,
          text: "Free",
          color: "bg-primary/10 text-primary border border-primary/20",
          description: `${profile.queries_limit} consultas/mês`,
          limitText: `${profile.queries_count}/${profile.queries_limit}`
        };
    }
  };

  const getRoleInfo = () => {
    switch (profile.role) {
      case "admin":
        return {
          text: "Administrador",
          icon: <Shield className="w-4 h-4" />,
          color: "bg-primary/10 text-primary border border-primary/20"
        };
      case "beta_tester":
        return {
          text: "Beta Tester",
          icon: <Star className="w-4 h-4" />,
          color: "bg-primary/10 text-primary border border-primary/20"
        };
      default:
        return {
          text: "Perfil",
          icon: <User className="w-2 h-2 p" />,
          color: "bg-primary/10 text-primary border border-primary/20"
        };
    }
  };

  const subscription = getSubscriptionInfo();
  const role = getRoleInfo();
  const usagePercentage = profile.subscription === "free" 
    ? Math.min((profile.queries_count / profile.queries_limit) * 100, 100)
    : 0;

  return (
    <div className={cn("w-full max-w-5xl mx-auto justify-center px-4 py-8")}>
      {/* Layout Desktop */}
      <div className="hidden md:flex relative items-center">
        {/* Avatar/Imagem do perfil */}
        <div className="w-[250px] h-[320px] rounded-4xl overflow-hidden bg-muted flex-shrink-0 relative">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
            className="w-full h-full"
          >
            {profile.imageUrl ? (
              <Image
                src={profile.imageUrl}
                alt={profile.name || "Perfil"}
                width={400}
                height={400}
                className="w-full h-full object-cover"
                draggable={false}
                priority
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center">
                <span className="text-6xl font-bold text-primary-foreground">
                  {profile.name?.charAt(0)?.toUpperCase() || "U"}
                </span>
              </div>
            )}
          </motion.div>
          
          {/* Badge de status ativo */}
          {profile.is_active && (
            <div className="absolute bottom-4 right-4 bg-green-500 rounded-full p-2 border-4 border-background shadow-lg">
              <CheckCircle className="w-5 h-5 text-white" />
            </div>
          )}
        </div>

        {/* Card de informações */}
        <div className={cn(
          "bg-background border border-primary rounded-3xl p-10 ml-[-80px] z-10 max-w-xl flex-1 relative"
        )}>
          {/* Botões de ação no canto superior direito */}
          <div className="absolute top-2 right-3 flex gap-0 ">
            <button
              onClick={onAccountInfo}
              className="p-2 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
              aria-label="Informações da conta"
            >
              <Info className="w-4 h-4" />
            </button>
            <button
              onClick={onEditProfile}
              className="p-2 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
              aria-label="Editar perfil"
            >
              <Edit className="w-4 h-4" />
            </button>
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
          >
            {/* Cabeçalho com nome e badges */}
            <div className="mb-6">
              <div className="flex items-center gap-3 mb-3">
                <h2 className="text-3xl font-bold text-foreground">
                  {profile.name || "Usuário"}
                </h2>
                <span className={`px-3 py-1.5 rounded-full text-sm font-medium border ${role.color} inline-flex items-center gap-1.5`}>
                  {role.icon}
                  {role.text}
                </span>
              </div>

              <p className="text-lg font-medium text-primary mb-2">
                {profile.email || "Email não disponível"}
              </p>

              {/* Subscription Badge */}
              <div className="flex items-center gap-2">
                <span className={`px-3 py-1.5 rounded-full text-sm font-medium border ${subscription.color} inline-flex items-center gap-1.5`}>
                  {subscription.icon}
                  {subscription.text}
                </span>
                <span className="text-sm text-muted-foreground">
                  • {subscription.description}
                </span>
              </div>
            </div>

            {/* Informações acadêmicas/profissionais */}
            {(profile.specialty || profile.university) && (
              <div className="mb-6 space-y-3">
                {profile.specialty && (
                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1.5 bg-foreground/10 text-foreground rounded-full text-sm font-medium border border-primary/20">
                      {profile.specialty}
                    </span>
                  </div>
                )}
                {profile.university && profile.year && (
                  <div className="flex items-center gap-2">
                    <span className="px-7 py-2 bg-primary/10 text-primary rounded-full text-sm font-medium border border-primary/20">
                      {profile.university} • {profile.year}º ano
                    </span>
                  </div>
                )}
              </div>
            )}

            {/* Status de consultas */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2 text-foreground">
                  <Zap className="w-5 h-5" />
                  <span className="font-semibold">Consultas mensais</span>
                </div>
                <span className="text-lg font-bold text-primary">
                  {subscription.limitText}
                </span>
              </div>

              {profile.subscription === "free" && (
                <>
                  <div className="w-full h-3 bg-muted rounded-full overflow-hidden mb-2">
                    <div 
                      className={`h-full rounded-full transition-all duration-500 ${
                        usagePercentage >= 90 ? "bg-red-500" :
                        usagePercentage >= 70 ? "bg-yellow-500" :
                        "bg-primary"
                      }`}
                      style={{ width: `${usagePercentage}%` }}
                    />
                  </div>
                  
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>0</span>
                    <span>{profile.queries_limit}</span>
                  </div>

                  {profile.queries_count >= profile.queries_limit && (
                    <p className="text-sm text-red-500 mt-3 font-medium flex items-center gap-2">
                      <span className="text-lg">⚠️</span>
                      Limite de consultas atingido
                    </p>
                  )}
                </>
              )}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Layout Mobile */}
      <div className="md:hidden relative flex flex-col items-center">
        {/* Foto de fundo */}
        <div className="w-full h-[320px] bg-muted rounded-4xl overflow-hidden relative">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
            className="w-full h-full"
          >
            {profile.imageUrl ? (
              <Image
                src={profile.imageUrl}
                alt={profile.name || "Perfil"}
                width={400}
                height={400}
                className="w-full h-full object-cover"
                draggable={false}
                priority
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center">
                <span className="text-5xl font-bold text-primary-foreground">
                  {profile.name?.charAt(0)?.toUpperCase() || "U"}
                </span>
              </div>
            )}
          </motion.div>
          
          {profile.is_active && (
            <div className="absolute bottom-4 right-4 bg-green-500 rounded-full p-2 border-4 border-background shadow-lg">
              <CheckCircle className="w-5 h-5 text-white" />
            </div>
          )}
        </div>

        {/* Card sobreposto */}
        <div className={cn(
          "bg-background border border-primary rounded-4xl p-6",
          "absolute -bottom-[-55px] left-0 right-0 z-10 mx-4"
        )}>
          {/* Botões de ação no canto superior direito (mobile) */}
          <div className="absolute top-4 right-4 flex gap-2">
            <button
              onClick={onAccountInfo}
              className="p-2 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
              aria-label="Informações da conta"
            >
              <Info className="w-4 h-4" />
            </button>
            <button
              onClick={onEditProfile}
              className="p-2 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
              aria-label="Editar perfil"
            >
              <Edit className="w-4 h-4" />
            </button>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
          >
            {/* Cabeçalho */}
            <div className="mb-6 text-center">
              <div className="flex flex-col items-center gap-2 mb-3">
                <h2 className="text-2xl font-bold text-foreground">
                  {profile.name || "Usuário"}
                </h2>
                <div className="flex flex-wrap justify-center gap-2">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium border ${role.color} inline-flex items-center gap-1`}>
                    {role.icon}
                    {role.text}
                  </span>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium border ${subscription.color} inline-flex items-center gap-1`}>
                    {subscription.icon}
                    {subscription.text}
                  </span>
                </div>
              </div>

              <p className="text-base text-primary mb-2">
                {profile.email || "Email não disponível"}
              </p>

              <p className="text-sm text-muted-foreground">
                {subscription.description}
              </p>
            </div>

            {/* Informações acadêmicas/profissionais */}
            {(profile.specialty || profile.university) && (
              <div className="mb-6 space-y-2">
                {profile.specialty && (
                  <div className="flex justify-center">
                    <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium border border-primary/20">
                      {profile.specialty}
                    </span>
                  </div>
                )}
                {profile.university && profile.year && (
                  <div className="flex justify-center">
                    <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium border border-primary/20">
                      {profile.university} • {profile.year}º ano
                    </span>
                  </div>
                )}
              </div>
            )}

            {/* Status de consultas */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2 text-foreground">
                  <Zap className="w-4 h-4" />
                  <span className="font-medium">Consultas</span>
                </div>
                <span className="font-bold text-primary">
                  {subscription.limitText}
                </span>
              </div>

              {profile.subscription === "free" && (
                <>
                  <div className="w-full h-2.5 bg-muted rounded-full overflow-hidden mb-2">
                    <div 
                      className={`h-full rounded-full transition-all duration-500 ${
                        usagePercentage >= 90 ? "bg-red-500" :
                        usagePercentage >= 70 ? "bg-yellow-500" :
                        "bg-primary"
                      }`}
                      style={{ width: `${usagePercentage}%` }}
                    />
                  </div>
                  
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>0</span>
                    <span>{profile.queries_limit}</span>
                  </div>

                  {profile.queries_count >= profile.queries_limit && (
                    <p className="text-xs text-red-500 mt-2 font-medium text-center">
                      ⚠️ Limite atingido
                    </p>
                  )}
                </>
              )}
            </div>
          </motion.div>
        </div>
        <div className="h-[330px]"></div>
      </div>
    </div>
  );
}