
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/auth-context";
import DrPilot from "@/components/dr-pilot";
import { LoadingSpinner } from "@/components/loading-spinner";
import { Header } from "@/components/ui/header-1";
import { ProtectedRoute } from "@/components/auth/protected-route";


export default function ChatPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  // Redireciona se não estiver autenticado
  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  // Mostra loading enquanto verifica autenticação
  if (loading) {
    return <LoadingSpinner fullScreen text="Carregando chat..." />;
  }

  // Se não tem usuário após loading (não deve acontecer devido ao redirecionamento)
  if (!user) {
    return null;
  }

  return (
    <ProtectedRoute>
<div className="min-h-screen flex flex-col">
        <Header/>
  <DrPilot />
</div>
    </ProtectedRoute>
);
}