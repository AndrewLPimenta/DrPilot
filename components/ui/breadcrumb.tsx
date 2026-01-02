"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/auth-context";
import { LoadingSpinner } from "@/components/loading-spinner";
import { PageLayout } from "@/components/page-layout";
import { ProtectedRoute } from "@/components/auth/protected-route";

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import * as PricingCard from '@/components/ui/pricing-card';
import {
  CheckCircle2,
  User,
  Users,
  GraduationCap,
  Brain,
  Stethoscope,
  BookOpen,
  Zap,
  Shield,
  Globe,
  FileText,
  Video,
  Award,
} from 'lucide-react';

export default function PricingPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  if (loading) {
    return <LoadingSpinner fullScreen text="Carregando..." />;
  }

  if (!user) {
    return null;
  }

  return (
    <PageLayout>
      <ProtectedRoute>
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-8 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            {/* Cabeçalho */}
            <div className="text-center mb-12">
              <div className="inline-flex items-center justify-center p-3 bg-blue-50 rounded-full mb-4">
                <Brain className="h-8 w-8 text-blue-600" />
              </div>
              <h1 className="text-4xl font-bold text-black mb-4">
                Eleve sua Preparação Médica
              </h1>
              <p className="text-xl text-black-600 max-w-3xl mx-auto">
                Escolha o plano ideal para sua jornada na medicina. Do estudante ao residente, 
                temos a ferramenta certa para seu desenvolvimento.
              </p>
            </div>

            {/* Cards de Planos */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
              <MultiCards />
            </div>

            {/* Comparação de Recursos */}
            <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
              <h2 className="text-2xl font-bold text-black mb-8 text-center">
                Comparação Completa de Recursos
              </h2>
              <FeatureComparisonTable />
            </div>

            {/* FAQ */}
            <div className="mt-16">
              <h2 className="text-2xl font-bold text-black mb-8 text-center">
                Perguntas Frequentes
              </h2>
              <FAQ />
            </div>

            {/* CTA Final */}
            <div className="mt-16 text-center">
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-8 md:p-12">
                <GraduationCap className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-black mb-4">
                  Comece sua jornada hoje
                </h3>
                <p className="text-black-600 mb-6 max-w-2xl mx-auto">
                  Junte-se a milhares de estudantes e profissionais que já estão 
                  transformando sua forma de estudar medicina.
                </p>
                <Button 
                  size="lg" 
                  className="bg-blue-600 hover:bg-blue-700 text-black px-8 py-6 text-lg"
                  onClick={() => document.getElementById('plans')?.scrollIntoView({ behavior: 'smooth' })}
                >
                  Escolher Plano Agora
                </Button>
              </div>
            </div>
          </div>
        </div>
      </ProtectedRoute>
    </PageLayout>
  );
}

function MultiCards() {
  const plans = [
    {
      icon: <User className="h-6 w-6" />,
      description: 'Para estudantes iniciantes ou autodidatas',
      name: 'Estudante',
      badge: 'Mais Popular',
      price: 'R$ 49',
      original: 'R$ 79',
      period: '/mês',
      variant: 'default',
      features: [
        'Até 100 consultas médicas por mês',
        'Acesso a casos clínicos básicos',
        'Anatomia 3D interativa',
        'Farmacologia essencial',
        'Questões comentadas (1000+)',
        'Suporte por email em 24h',
        '1 dispositivo simultâneo',
        'Relatórios de progresso básicos',
        'Acesso mobile básico',
      ],
      ctaText: 'Começar Estudos',
      popular: true,
    },
    {
      icon: <GraduationCap className="h-6 w-6" />,
      description: 'Ideal para acadêmicos e residentes',
      name: 'Acadêmico',
      price: 'R$ 89',
      original: 'R$ 129',
      period: '/mês',
      variant: 'outline',
      features: [
        'Consultas ilimitadas',
        'Casos clínicos avançados',
        'Simulador de diagnóstico diferencial',
        'Fisiopatologia detalhada',
        'Banco com 5000+ questões',
        'Suporte prioritário em 12h',
        '2 dispositivos simultâneos',
        'Análise de performance detalhada',
        'Acesso ao módulo de emergência',
      ],
      ctaText: 'Avançar na Carreira',
      popular: false,
    },
    {
      icon: <Stethoscope className="h-6 w-6" />,
      name: 'Profissional',
      description: 'Para médicos e especialistas',
      price: 'R$ 149',
      original: 'R$ 199',
      period: '/mês',
      variant: 'outline',
      features: [
        'Todas as funcionalidades do plano Acadêmico',
        'Gestor de conta dedicado',
        'Integração com guidelines internacionais',
        'Recursos de segurança HIPAA compatíveis',
        'Ferramentas de educação continuada',
        'Mentoria e treinamento personalizado',
        'Dispositivos ilimitados',
        'API para integração institucional',
        'Relatórios de auditoria avançados',
        'Acesso a congressos virtuais',
      ],
      ctaText: 'Excelência Profissional',
      popular: false,
    },
  ];

  const handleClick = (plan: string) => {
    // Implementar lógica de checkout aqui
    alert(`Iniciando assinatura do plano ${plan}!`);
  };

  return (
    <>
      {plans.map((plan) => (
        <div 
          key={plan.name} 
          className={cn(
            "relative transition-all duration-300 hover:scale-[1.02]",
            plan.popular && "lg:-translate-y-4"
          )}
        >
          {plan.popular && (
            <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-black px-4 py-1 rounded-full text-sm font-semibold whitespace-nowrap">
                Mais Escolhido
              </div>
            </div>
          )}
          
          <PricingCard.Card 
            className={cn(
              "h-full border-2 transition-all",
              plan.popular 
                ? "border-blue-500 shadow-xl" 
                : "border-gray-200 hover:border-gray-300"
            )}
          >
            <PricingCard.Header className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className={cn(
                    "p-3 rounded-lg",
                    plan.popular 
                      ? "bg-blue-100 text-blue-600" 
                      : "bg-gray-100 text-black-600"
                  )}>
                    {plan.icon}
                  </div>
                  <div>
                    <PricingCard.PlanName className="text-lg font-bold">
                      {plan.name}
                    </PricingCard.PlanName>
                    <p className="text-sm text-black-500">{plan.description}</p>
                  </div>
                </div>
              </div>

              <PricingCard.Price className="mb-6">
                <div className="flex items-baseline">
                  <PricingCard.MainPrice className="text-4xl font-bold">
                    {plan.price}
                  </PricingCard.MainPrice>
                  <PricingCard.Period className="text-black-500 ml-2">
                    {plan.period}
                  </PricingCard.Period>
                </div>
                {plan.original && (
                  <PricingCard.OriginalPrice className="text-black-400 line-through">
                    {plan.original}
                  </PricingCard.OriginalPrice>
                )}
              </PricingCard.Price>

              <Button
                variant={plan.variant as any}
                className={cn(
                  'w-full py-6 text-base font-semibold transition-all',
                  plan.popular 
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-black'
                    : 'hover:bg-gray-50'
                )}
                onClick={() => handleClick(plan.name)}
              >
                {plan.ctaText}
              </Button>
            </PricingCard.Header>

            <PricingCard.Body className="p-6 pt-0">
              <PricingCard.List>
                {plan.features.map((item, index) => (
                  <PricingCard.ListItem 
                    key={item} 
                    className="py-3 border-b border-gray-100 last:border-0"
                  >
                    <CheckCircle2
                      className={cn(
                        "h-5 w-5 flex-shrink-0",
                        plan.popular 
                          ? "text-blue-600" 
                          : "text-green-500"
                      )}
                      aria-hidden="true"
                    />
                    <span className="text-black">{item}</span>
                  </PricingCard.ListItem>
                ))}
              </PricingCard.List>
            </PricingCard.Body>
          </PricingCard.Card>
        </div>
      ))}
    </>
  );
}

function FeatureComparisonTable() {
  const features = [
    {
      name: 'Consultas à IA',
      estudante: '100/mês',
      academico: 'Ilimitadas',
      profissional: 'Ilimitadas + Prioridade',
    },
    {
      name: 'Casos Clínicos',
      estudante: 'Básicos',
      academico: 'Avançados + Raros',
      profissional: 'Complexos + Discussão em Grupo',
    },
    {
      name: 'Questões',
      estudante: '1000+',
      academico: '5000+ com estatísticas',
      profissional: 'Banco completo + Personalizadas',
    },
    {
      name: 'Dispositivos',
      estudante: '1 simultâneo',
      academico: '2 simultâneos',
      profissional: 'Ilimitados',
    },
    {
      name: 'Suporte',
      estudante: 'Email em 24h',
      academico: 'Prioritário em 12h',
      profissional: 'Dedicado + Mentoria',
    },
    {
      name: 'Recursos Especiais',
      estudante: 'Anatomia 3D',
      academico: 'Simulador de Diagnóstico',
      profissional: 'Integração Guidelines + Educação Continuada',
    },
  ];

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-gray-200">
            <th className="text-left py-4 px-4 font-semibold text-black">Recursos</th>
            <th className="text-center py-4 px-4 font-semibold text-black">Estudante</th>
            <th className="text-center py-4 px-4 font-semibold text-black">Acadêmico</th>
            <th className="text-center py-4 px-4 font-semibold text-black">Profissional</th>
          </tr>
        </thead>
        <tbody>
          {features.map((feature, index) => (
            <tr key={feature.name} className={index % 2 === 0 ? 'bg-gray-50' : ''}>
              <td className="py-4 px-4 font-medium text-black">{feature.name}</td>
              <td className="py-4 px-4 text-center">
                <div className="flex items-center justify-center">
                  <CheckCircle2 className="h-4 w-4 text-green-500 mr-2" />
                  <span>{feature.estudante}</span>
                </div>
              </td>
              <td className="py-4 px-4 text-center">
                <div className="flex items-center justify-center">
                  <Zap className="h-4 w-4 text-yellow-500 mr-2" />
                  <span>{feature.academico}</span>
                </div>
              </td>
              <td className="py-4 px-4 text-center">
                <div className="flex items-center justify-center">
                  <Award className="h-4 w-4 text-purple-500 mr-2" />
                  <span>{feature.profissional}</span>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function FAQ() {
  const faqs = [
    {
      question: 'Posso cancelar a qualquer momento?',
      answer: 'Sim, todos os planos podem ser cancelados a qualquer momento sem multa. Você continua com acesso até o final do período pago.',
    },
    {
      question: 'Há plano gratuito?',
      answer: 'Oferecemos um período de teste de 7 dias para todos os planos. Após isso, você pode escolher o plano que melhor atende suas necessidades.',
    },
    {
      question: 'Posso mudar de plano?',
      answer: 'Sim, você pode fazer upgrade ou downgrade a qualquer momento. O valor será ajustado proporcionalmente.',
    },
    {
      question: 'Como são as atualizações?',
      answer: 'Todas as atualizações de conteúdo e funcionalidades são automáticas e inclusas em todos os planos.',
    },
    {
      question: 'É válido para revalidação de diploma?',
      answer: 'Sim, nossos conteúdos são alinhados com as principais provas de revalidação (Revalida, USMLE, AMC, etc.)',
    },
    {
      question: 'Posso usar para estudo em grupo?',
      answer: 'O plano Acadêmico permite estudo colaborativo. O Profissional inclui ferramentas específicas para grupos e instituições.',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
      {faqs.map((faq, index) => (
        <div 
          key={index} 
          className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow"
        >
          <h3 className="font-semibold text-black mb-2">{faq.question}</h3>
          <p className="text-black-600">{faq.answer}</p>
        </div>
      ))}
    </div>
  );
}