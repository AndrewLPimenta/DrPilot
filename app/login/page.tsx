"use client"
import { SignInPage, Testimonial } from "@/components/ui/sign-in";

export default function LoginPage() {
  // Dados de exemplo para os testemunhos
  const testimonials: Testimonial[] = [
    {
      avatarSrc: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR4fSyuS3vXwCxfScTbbkmap8KL634-7diq8w&s",
      name: "Maria Silva",
      handle: "@mariasilva",
      text: "O Dr Pilot revolucionou a forma como gerencio minha clínica. Economizei 10 horas semanais!"
    },
    {
      avatarSrc: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
      name: "Dr. Carlos Santos",
      handle: "@dr.carlos",
      text: "Ferramenta essencial para qualquer profissional de saúde. Interface intuitiva e poderosa."
    },
    {
      avatarSrc: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face",
      name: "Dra. Ana Costa",
      handle: "@anacosta",
      text: "Sistema completo que atende todas as necessidades da minha prática médica. Recomendo!"
    }
  ];

  // Funções de callback
  const handleSignIn = async () => {
    // Esta função será tratada pelo componente SignInPage através do useAuth
  };

  const handleGoogleSignIn = () => {
    // Implemente a lógica de login com Google aqui
    console.log("Login com Google");
    // Exemplo:
    // window.location.href = "/api/auth/google";
  };

  const handleResetPassword = () => {
    console.log("Redirecionar para recuperação de senha");
    // Exemplo:
    // window.location.href = "/reset-password";
  };

  const handleCreateAccount = () => {
    console.log("Redirecionar para criação de conta");
    // Exemplo:
    // window.location.href = "/register";
  };

  return (
    <div className="">
      {/* Header opcional - pode ser removido se não quiser */}
     
      {/* Componente principal de login */}
      <SignInPage
        title={
          <>
            <span className="font-light text-foreground tracking-tighter">Bem-vindo ao</span>
            <br />
            <span className="text-primary font-bold">Dr. Pilot</span>
          </>
        }
        description="Gerencie sua prática médica de forma eficiente e moderna com nossa plataforma completa."
        heroImageSrc="/hero-L.jpg"
        testimonials={testimonials}
        onGoogleSignIn={handleGoogleSignIn}
        onResetPassword={handleResetPassword}
        onCreateAccount={handleCreateAccount}
      />

    </div>
  );
}

