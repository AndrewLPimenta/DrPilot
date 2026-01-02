"use client"
import { RegisterPage, type Testimonial } from "@/components/register"
import { Metadata } from "next"

// export const metadata: Metadata = {
//   title: "Cadastre-se | Dr Pilot",
//   description: "Crie sua conta no Dr Pilot - Sua IA Médica Assistente",
// }

export default function RegisterRoute() {
  // Dados dos testemunhos
  const testimonials: Testimonial[] = [
    {
      avatarSrc: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&h=400&fit=crop&crop=face",
      name: "Dra. Ana Silva",
      handle: "@dra.ana",
      text: "Revolucionou minha forma de estudar para a residência!",
    },
    {
      avatarSrc: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&h=400&fit=crop&crop=face",
      name: "Dr. Carlos Mendes",
      handle: "@carlos.md",
      text: "As análises de sintomas são incrivelmente precisas.",
    },
    {
      avatarSrc: "https://images.unsplash.com/photo-1594824434340-7e7dfc37cabb?w=400&h=400&fit=crop&crop=face",
      name: "Dra. Beatriz Santos",
      handle: "@beatriz.cardio",
      text: "Indispensável para revisão de farmacologia clínica.",
    },
  ]

  // Função para login com Google
  const handleGoogleSignIn = () => {
    console.log("Iniciando login com Google...")
    // Aqui você pode integrar com sua lógica de autenticação do Google
    // window.location.href = "/api/auth/google" ou similar
  }

  // Função para navegação
  const handleLogin = () => {
    console.log("Redirecionando para login...")
    // Para Next.js, você pode usar:
    // router.push("/login")
  }

  return (
    <RegisterPage
      // Título personalizado (opcional)
      title={
        <>
          <span className="font-light">Crie </span>
          <span className="font-semibold bg-gradient-to-r from-violet-400 to-green-400 bg-clip-text text-transparent">
            sua Conta
          </span>
        </>
      }
      
      // Descrição personalizada
      description="Cadastre-se gratuitamente e tenha acesso a ferramentas de IA especializadas para educação médica."

      // Imagem de fundo (hero)
      heroImageSrc="https://images.unsplash.com/photo-1559757148-5c350d0d3c56?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80"
      
      // Testemunhos
      testimonials={testimonials}
      
      // Callbacks
      onGoogleSignIn={handleGoogleSignIn}
      onLogin={handleLogin}

    />
  )
}