"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { ProfileHeader } from "@/components/profile/ProfileHeader"
import { Loader2, AlertCircle, ArrowLeft, Heart, Brain, Shield, Activity } from "lucide-react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Hero } from "@/components/blocks/hero"
import Image from "next/image"
import { Header } from "@/components/ui/header-1"


export default function Home() { 
    return (
      <>
      <Header />
      <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
        {/* Gradiente de fundo */}
        <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-primary/5" />
        
        {/* Logo como background - DEVE estar ATRÁS do conteúdo */}
        <div className="absolute inset-0 opacity-10 flex items-center justify-center">
          <div className="relative w-[800px] h-[800px]">
            {/* Gradiente radial atrás da logo */}
            <div className="absolute inset-0 bg-gradient-radial from-primary/20 via-transparent to-transparent rounded-full" />
            
            {/* Logo */}
            <div className="absolute inset-0 flex items-center justify-center">
              {/* Primeiro, teste com uma cor sólida para ver se aparece */}
              <div className="w-[600px] h-[600px] bg-blue-500/30 rounded-full"></div>
              
              {/* Depois, tente a imagem */}
              <Image
                src="/logo-DrPilot.png"
                alt="Dr Pilot Logo"
                width={600}
                height={600}
                className="opacity-30 object-contain"
                priority
              />
            </div>
          </div>
        </div>

        {/* Conteúdo principal - DEVE estar NA FRENTE */}
        <div className="relative z-10">
          <Hero
            title="Estudo médico simples, rápido e inteligente."
            subtitle="Dr Pilot entrega aprendizado claro, descomplicado, eficiente e inteligente."
            actions={[
              {
                label: "Entrar",
                href: "/login",
                variant: "outline"
              },
              {
                label: "Cadastrar",
                href: "/register",
                variant: "default"
              }
            ]}
            titleClassName="text-5xl md:text-6xl font-extrabold"
            subtitleClassName="text-lg md:text-xl max-w-[600px]"
            actionsClassName="mt-6"
          />
        </div>
      </div>
      </>
    )
}