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
  GraduationCap,
  Stethoscope,
  Brain,
  Zap,
  Award,
  ChevronRight,
  Sparkles,
  ShieldCheck,
  Globe,
  Users,
  BookOpen,
  Clock,
  Smartphone,
  Headphones,
  BarChart,
  HelpCircle,
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
        <div className="min-h-screen bg-gradient-to-b from-background to-slate-50 dark:to-slate-900/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
            {/* Cabeçalho */}
            <div className="text-center mb-8 sm:mb-12 lg:mb-16">
              <div className="inline-flex items-center justify-center p-3 sm:p-4 bg-gradient-to-br from-primary/10 to-primary/5 rounded-2xl mb-4 sm:mb-6 shadow-sm">
                <Brain className="h-7 w-7 sm:h-9 sm:w-9 text-primary/100" />
              </div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-primary-300 dark:text-white mb-3 sm:mb-4 px-2">
                Planos de Preparação Médica
              </h1>
              <p className="text-base sm:text-lg lg:text-xl text-primary dark:text-gray-300 max-w-3xl mx-auto px-4">
                Escolha o plano ideal para sua jornada na medicina. Do estudante ao residente, 
                temos a ferramenta certa para seu desenvolvimento.
              </p>
            </div>

            {/* Cards de Planos */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8 mb-12 sm:mb-16 px-2 sm:px-0">
              <MultiCards />
            </div>

            {/* Comparação de Recursos */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-4 sm:p-6 md:p-8 mb-12 sm:mb-16">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-6 sm:mb-8 text-center">
                Comparação Completa de Recursos
              </h2>
              <FeatureComparisonTable />
            </div>

            {/* FAQ */}
            <div className="mb-12 sm:mb-16 px-2 sm:px-0">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-6 sm:mb-8 text-center">
                Perguntas Frequentes
              </h2>
              <FAQ />
            </div>

            {/* CTA Final */}
            <div className="text-center px-2 sm:px-0">
              <div className="bg-gradient-to-r from-primary/5 via-primary/10 to-primary/5 dark:from-primary/10 dark:via-primary/15 dark:to-primary/10 rounded-2xl p-6 sm:p-8 md:p-12">
                <div className="inline-flex items-center justify-center p-3 sm:p-4 bg-primary/10 rounded-full mb-4 sm:mb-6">
                  <GraduationCap className="h-7 w-7 sm:h-9 sm:w-9 text-primary" />
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-3 sm:mb-4">
                  Comece sua jornada hoje
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-6 max-w-2xl mx-auto text-sm sm:text-base">
                  Junte-se a milhares de estudantes e profissionais que já estão 
                  transformando sua forma de estudar medicina.
                </p>
                <Button 
                  size="lg" 
                  className="bg-primary hover:bg-primary/90 text-primary-foreground px-6 sm:px-8 py-5 sm:py-6 text-base sm:text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                  onClick={() => document.getElementById('plans')?.scrollIntoView({ behavior: 'smooth' })}
                >
                  <Sparkles className="mr-2 h-5 w-5" />
                  Escolher Plano Agora
                  <ChevronRight className="ml-2 h-5 w-5" />
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
      icon: <User className="h-5 w-5 sm:h-6 sm:w-6" />,
      description: 'Para estudantes iniciantes ou autodidatas',
      name: 'Estudante',
      price: 'R$ 49',
      original: 'R$ 79',
      period: '/mês',
      variant: 'outline',
      features: [
        { text: 'Até 100 consultas médicas por mês', icon: <Brain className="h-4 w-4" /> },
        { text: 'Acesso a casos clínicos básicos', icon: <BookOpen className="h-4 w-4" /> },
        { text: 'Anatomia 3D interativa', icon: <Globe className="h-4 w-4" /> },
        { text: 'Farmacologia essencial', icon: <BookOpen className="h-4 w-4" /> },
        { text: 'Questões comentadas (1000+)', icon: <BarChart className="h-4 w-4" /> },
        { text: 'Suporte por email em 24h', icon: <Headphones className="h-4 w-4" /> },
        { text: '1 dispositivo simultâneo', icon: <Smartphone className="h-4 w-4" /> },
        { text: 'Relatórios de progresso básicos', icon: <BarChart className="h-4 w-4" /> },
        { text: 'Acesso mobile básico', icon: <Smartphone className="h-4 w-4" /> },
      ],
      ctaText: 'Começar Estudos',
      popular: false,
    },
    {
      icon: <GraduationCap className="h-5 w-5 sm:h-6 sm:w-6" />,
      description: 'Ideal para acadêmicos e residentes',
      name: 'Acadêmico',
      price: 'R$ 89',
      original: 'R$ 129',
      period: '/mês',
      variant: 'default',
      features: [
        { text: 'Consultas ilimitadas', icon: <Brain className="h-4 w-4" /> },
        { text: 'Casos clínicos avançados', icon: <BookOpen className="h-4 w-4" /> },
        { text: 'Simulador de diagnóstico diferencial', icon: <Zap className="h-4 w-4" /> },
        { text: 'Fisiopatologia detalhada', icon: <BookOpen className="h-4 w-4" /> },
        { text: 'Banco com 5000+ questões', icon: <BarChart className="h-4 w-4" /> },
        { text: 'Suporte prioritário em 12h', icon: <Headphones className="h-4 w-4" /> },
        { text: '2 dispositivos simultâneos', icon: <Smartphone className="h-4 w-4" /> },
        { text: 'Análise de performance detalhada', icon: <BarChart className="h-4 w-4" /> },
        { text: 'Acesso ao módulo de emergência', icon: <Zap className="h-4 w-4" /> },
      ],
      ctaText: 'Avançar na Carreira',
      popular: true,
    },
    {
      icon: <Stethoscope className="h-5 w-5 sm:h-6 sm:w-6" />,
      name: 'Profissional',
      description: 'Para médicos e especialistas',
      price: 'R$ 149',
      original: 'R$ 199',
      period: '/mês',
      variant: 'outline',
      features: [
        { text: 'Consultas ilimitadas + Prioridade', icon: <Brain className="h-4 w-4" /> },
        { text: 'Integração com guidelines internacionais', icon: <Globe className="h-4 w-4" /> },
        { text: 'Recursos HIPAA compatíveis', icon: <ShieldCheck className="h-4 w-4" /> },
        { text: 'Ferramentas de educação continuada', icon: <BookOpen className="h-4 w-4" /> },
        { text: 'Mentoria personalizada', icon: <Users className="h-4 w-4" /> },
        { text: 'Dispositivos ilimitados', icon: <Smartphone className="h-4 w-4" /> },
        { text: 'API para integração institucional', icon: <Zap className="h-4 w-4" /> },
        { text: 'Relatórios de auditoria avançados', icon: <BarChart className="h-4 w-4" /> },
        { text: 'Acesso a congressos virtuais', icon: <Users className="h-4 w-4" /> },
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
      {plans.map((plan, index) => (
        <div 
          key={plan.name} 
          id={index === 0 ? 'plans' : undefined}
          className={cn(
            "relative h-full",
            plan.popular && "lg:scale-105 lg:z-10"
          )}
        >
          {plan.popular && (
            <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 z-20">
              <div className="bg-gradient-to-r from-primary to-primary/80 text-white px-4 py-2 rounded-full text-xs sm:text-sm font-semibold whitespace-nowrap shadow-lg flex items-center gap-1">
                <Sparkles className="h-3 w-3 sm:h-4 sm:w-4" />
                Mais Popular
              </div>
            </div>
          )}
          
          <div className={cn(
            "h-full rounded-2xl border-2 transition-all duration-300 hover:shadow-xl",
            plan.popular 
              ? "border-primary shadow-lg bg-gradient-to-b from-white to-slate-50 dark:from-slate-800 dark:to-slate-900" 
              : "border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-primary/50"
          )}>
            <div className="p-5 sm:p-6">
              {/* Cabeçalho do Card */}
              <div className="flex items-start justify-between mb-4 sm:mb-6">
                <div className="flex items-center space-x-3">
                  <div className={cn(
                    "p-2.5 sm:p-3 rounded-xl",
                    plan.popular 
                      ? "bg-primary/10 text-primary" 
                      : "bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-gray-300"
                  )}>
                    {plan.icon}
                  </div>
                  <div>
                    <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">
                      {plan.name}
                    </h3>
                    <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1">
                      {plan.description}
                    </p>
                  </div>
                </div>
              </div>

              {/* Preço */}
              <div className="mb-6">
                <div className="flex items-baseline">
                  <span className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white">
                    {plan.price}
                  </span>
                  <span className="text-gray-500 dark:text-gray-400 ml-2 text-sm sm:text-base">
                    {plan.period}
                  </span>
                </div>
                {plan.original && (
                  <p className="text-gray-400 dark:text-gray-500 line-through text-sm sm:text-base mt-1">
                    {plan.original}
                  </p>
                )}
              </div>

              {/* Botão */}
              <Button
                variant={plan.popular ? "default" : "outline"}
                className={cn(
                  'w-full py-5 sm:py-6 text-sm sm:text-base font-semibold transition-all duration-300 mb-6',
                  plan.popular 
                    ? 'bg-primary hover:bg-primary/90 text-white shadow-md hover:shadow-lg'
                    : 'border-primary/30 text-primary hover:bg-primary/5 hover:border-primary'
                )}
                onClick={() => handleClick(plan.name)}
              >
                {plan.ctaText}
                <ChevronRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
              </Button>

              {/* Lista de Features */}
              <div className="space-y-3">
                {plan.features.map((item, idx) => (
                  <div 
                    key={idx} 
                    className="flex items-start gap-3 py-2"
                  >
                    <div className={cn(
                      "p-1 rounded-full flex-shrink-0 mt-0.5",
                      plan.popular 
                        ? "text-primary" 
                        : "text-gray-400 dark:text-gray-500"
                    )}>
                      <CheckCircle2 className="h-4 w-4 sm:h-5 sm:w-5" />
                    </div>
                    <div className="flex items-center gap-2">
                      <div className={cn(
                        "p-1 rounded-md",
                        plan.popular 
                          ? "text-primary/70" 
                          : "text-gray-400 dark:text-gray-500"
                      )}>
                        {item.icon}
                      </div>
                      <span className="text-xs sm:text-sm text-gray-700 dark:text-gray-300">
                        {item.text}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
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
      icons: {
        estudante: <Brain className="h-4 w-4 text-gray-500" />,
        academico: <Zap className="h-4 w-4 text-primary" />,
        profissional: <Award className="h-4 w-4 text-black" />,
      }
    },
    {
      name: 'Casos Clínicos',
      estudante: 'Básicos',
      academico: 'Avançados + Raros',
      profissional: 'Complexos + Discussão',
      icons: {
        estudante: <BookOpen className="h-4 w-4 text-gray-500" />,
        academico: <BookOpen className="h-4 w-4 text-primary" />,
        profissional: <Users className="h-4 w-4 text-black" />,
      }
    },
    {
      name: 'Questões',
      estudante: '1000+',
      academico: '5000+ com estatísticas',
      profissional: 'Banco completo',
      icons: {
        estudante: <BarChart className="h-4 w-4 text-gray-500" />,
        academico: <BarChart className="h-4 w-4 text-primary" />,
        profissional: <BarChart className="h-4 w-4 text-black" />,
      }
    },
    {
      name: 'Dispositivos',
      estudante: '1 simultâneo',
      academico: '2 simultâneos',
      profissional: 'Ilimitados',
      icons: {
        estudante: <Smartphone className="h-4 w-4 text-gray-500" />,
        academico: <Smartphone className="h-4 w-4 text-primary" />,
        profissional: <Smartphone className="h-4 w-4 text-black" />,
      }
    },
    {
      name: 'Suporte',
      estudante: 'Email em 24h',
      academico: 'Prioritário em 12h',
      profissional: 'Dedicado + Mentoria',
      icons: {
        estudante: <Headphones className="h-4 w-4 text-gray-500" />,
        academico: <Headphones className="h-4 w-4 text-primary" />,
        profissional: <Users className="h-4 w-4 text-black" />,
      }
    },
    {
      name: 'Segurança',
      estudante: 'Básica',
      academico: 'Avançada',
      profissional: 'HIPAA + Auditoria',
      icons: {
        estudante: <ShieldCheck className="h-4 w-4 text-gray-500" />,
        academico: <ShieldCheck className="h-4 w-4 text-primary" />,
        profissional: <ShieldCheck className="h-4 w-4 text-black" />,
      }
    },
  ];

  return (
    <div className="overflow-x-auto -mx-4 sm:mx-0">
      <div className="min-w-full inline-block align-middle">
        {/* Mobile View */}
        <div className="lg:hidden space-y-4">
          {features.map((feature) => (
            <div key={feature.name} className="bg-gray-50 dark:bg-slate-700/50 rounded-xl p-4">
              <h4 className="font-semibold text-gray-900 dark:text-white mb-3 text-sm sm:text-base">
                {feature.name}
              </h4>
              <div className="space-y-2">
                {/* Estudante - cinza */}
                <div className="flex items-center justify-between p-2 bg-white dark:bg-slate-800 rounded-lg">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-gray-500" />
                    <span className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 font-medium">Estudante</span>
                  </div>
                  <div className="flex items-center gap-1">
                    {feature.icons.estudante}
                    <span className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 font-medium">{feature.estudante}</span>
                  </div>
                </div>
                
                {/* Acadêmico - cor primária */}
                <div className="flex items-center justify-between p-2 bg-primary/5 dark:bg-primary/10 rounded-lg">
                  <div className="flex items-center gap-2">
                    <GraduationCap className="h-4 w-4 text-primary" />
                    <span className="text-xs sm:text-sm text-primary dark:text-primary font-medium">Acadêmico</span>
                  </div>
                  <div className="flex items-center gap-1">
                    {feature.icons.academico}
                    <span className="text-xs sm:text-sm text-primary dark:text-primary font-medium">{feature.academico}</span>
                  </div>
                </div>
                
                {/* Profissional - preto */}
                <div className="flex items-center justify-between p-2 bg-white dark:bg-slate-800 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Stethoscope className="h-4 w-4 text-black dark:text-white" />
                    <span className="text-xs sm:text-sm text-black dark:text-white font-medium">Profissional</span>
                  </div>
                  <div className="flex items-center gap-1">
                    {feature.icons.profissional}
                    <span className="text-xs sm:text-sm text-black dark:text-white font-medium">{feature.profissional}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Desktop View */}
        <table className="w-full hidden lg:table">
          <thead>
            <tr className="border-b border-gray-200 dark:border-slate-700">
              <th className="text-left py-4 px-6 font-semibold text-gray-900 dark:text-white text-sm">Recursos</th>
              {/* Estudante - cinza */}
              <th className="text-center py-4 px-6 font-semibold text-gray-500 dark:text-gray-400 text-sm">Estudante</th>
              {/* Acadêmico - cor primária */}
              <th className="text-center py-4 px-6 font-semibold text-primary dark:text-primary text-sm bg-primary/5 dark:bg-primary/10">Acadêmico</th>
              {/* Profissional - preto */}
              <th className="text-center py-4 px-6 font-semibold text-black dark:text-white text-sm">Profissional</th>
            </tr>
          </thead>
          <tbody>
            {features.map((feature, index) => (
              <tr key={feature.name} className={index % 2 === 0 ? 'bg-gray-50 dark:bg-slate-700/30' : ''}>
                <td className="py-4 px-6 font-medium text-gray-900 dark:text-white text-sm">
                  <div className="flex items-center gap-2">
                    {feature.name}
                  </div>
                </td>
                
                {/* Estudante - cinza */}
                <td className="py-4 px-6 text-center">
                  <div className="flex flex-col items-center justify-center">
                    <div className="flex items-center gap-1 mb-1">
                      {feature.icons.estudante}
                    </div>
                    <span className="text-sm text-gray-500 dark:text-gray-400">{feature.estudante}</span>
                  </div>
                </td>
                
                {/* Acadêmico - cor primária */}
                <td className="py-4 px-6 text-center bg-primary/5 dark:bg-primary/10">
                  <div className="flex flex-col items-center justify-center">
                    <div className="flex items-center gap-1 mb-1">
                      {feature.icons.academico}
                    </div>
                    <span className="text-sm text-primary dark:text-primary font-medium">{feature.academico}</span>
                  </div>
                </td>
                
                {/* Profissional - preto */}
                <td className="py-4 px-6 text-center">
                  <div className="flex flex-col items-center justify-center">
                    <div className="flex items-center gap-1 mb-1">
                      {feature.icons.profissional}
                    </div>
                    <span className="text-sm text-black dark:text-white">{feature.profissional}</span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function FAQ() {
  const faqs = [
    {
      question: 'Posso cancelar a qualquer momento?',
      answer: 'Sim, todos os planos podem ser cancelados a qualquer momento sem multa. Você continua com acesso até o final do período pago.',
      icon: <HelpCircle className="h-5 w-5 text-primary" />,
    },
    {
      question: 'Há plano gratuito?',
      answer: 'Oferecemos um período de teste de 7 dias para todos os planos. Após isso, você pode escolher o plano que melhor atende suas necessidades.',
      icon: <Clock className="h-5 w-5 text-primary" />,
    },
    {
      question: 'Posso mudar de plano?',
      answer: 'Sim, você pode fazer upgrade ou downgrade a qualquer momento. O valor será ajustado proporcionalmente.',
      icon: <Zap className="h-5 w-5 text-primary" />,
    },
    {
      question: 'Como são as atualizações?',
      answer: 'Todas as atualizações de conteúdo e funcionalidades são automáticas e inclusas em todos os planos.',
      icon: <Sparkles className="h-5 w-5 text-primary" />,
    },
    {
      question: 'É válido para revalidação de diploma?',
      answer: 'Sim, nossos conteúdos são alinhados com as principais provas de revalidação (Revalida, USMLE, AMC, etc.)',
      icon: <GraduationCap className="h-5 w-5 text-primary" />,
    },
    {
      question: 'Posso usar para estudo em grupo?',
      answer: 'O plano Acadêmico permite estudo colaborativo. O Profissional inclui ferramentas específicas para grupos e instituições.',
      icon: <Users className="h-5 w-5 text-primary" />,
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 max-w-4xl mx-auto">
      {faqs.map((faq, index) => (
        <div 
          key={index} 
          className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl p-4 sm:p-6 hover:shadow-lg transition-all duration-300 hover:border-primary/50 group"
        >
          <div className="flex items-start gap-3 sm:gap-4">
            <div className="p-2 bg-primary/10 rounded-lg group-hover:scale-110 transition-transform">
              {faq.icon}
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2 text-sm sm:text-base">
                {faq.question}
              </h3>
              <p className="text-gray-600 dark:text-gray-300 text-xs sm:text-sm">
                {faq.answer}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}