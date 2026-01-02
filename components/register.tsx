"use client"

import React, { useState, useEffect, useRef } from "react";
import { Eye, EyeOff, AlertCircle, UserPlus } from "lucide-react";
import { useAuth } from "@/contexts/auth-context";
import { Alert, AlertDescription } from "@/components/ui/alert";

// --- HELPER COMPONENT (Ícone do Google) ---
const GoogleIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 48 48">
    <path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8-6.627 0-12-5.373-12-12s12-5.373 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-2.641-.21-5.236-.611-7.743z" />
    <path fill="#FF3D00" d="M6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 16.318 4 9.656 8.337 6.306 14.691z" />
    <path fill="#4CAF50" d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238C29.211 35.091 26.715 36 24 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z" />
    <path fill="#1976D2" d="M43.611 20.083H42V20H24v8h11.303c-.792 2.237-2.231 4.166-4.087 5.571l6.19 5.238C42.022 35.026 44 30.038 44 24c0-2.641-.21-5.236-.611-7.743z" />
  </svg>
);

// --- TYPE DEFINITIONS ---
export interface Testimonial {
  avatarSrc: string;
  name: string;
  handle: string;
  text: string;
}

interface RegisterPageProps {
  title?: React.ReactNode;
  description?: React.ReactNode;
  heroImageSrc?: string;
  testimonials?: Testimonial[];
  onGoogleSignIn?: () => void;
  onResetPassword?: () => void;
  onLogin?: () => void;
}

// --- SUB-COMPONENTS ---
const GlassInputWrapper = ({ children }: { children: React.ReactNode }) => (
  <div className="rounded-2xl border border-border bg-foreground/5 backdrop-blur-sm transition-colors focus-within:border-violet-400/70 focus-within:bg-violet-500/10">
    {children}
  </div>
);

const TestimonialCard = ({ testimonial, delay }: { testimonial: Testimonial; delay: string }) => (
  <div className={`animate-testimonial ${delay} flex items-start gap-3 rounded-3xl bg-card/40 dark:bg-zinc-800/40 backdrop-blur-xl border border-white/10 p-5 w-64`}>
    <img src={testimonial.avatarSrc} className="h-10 w-10 object-cover rounded-2xl" alt="avatar" />
    <div className="text-sm leading-snug">
      <p className="flex items-center gap-1 font-medium">{testimonial.name}</p>
      <p className="text-muted-foreground">{testimonial.handle}</p>
      <p className="mt-1 text-foreground/80">{testimonial.text}</p>
    </div>
  </div>
);

// --- MAIN COMPONENT ---
export const RegisterPage: React.FC<RegisterPageProps> = ({
  title = <span className="font-light text-foreground tracking-tighter">Criar Conta</span>,
  description = "Cadastre-se para começar a usar o Dr Pilot",
  heroImageSrc,
  testimonials = [],
  onGoogleSignIn,
  onResetPassword,
  onLogin,
}) => {
  const { register } = useAuth();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    specialty: "",
    year: "",
    university: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // --- AUTOCOMPLETE STATES ---
  const [universities, setUniversities] = useState<string[]>([]);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const universityInputRef = useRef<HTMLInputElement>(null);

  // ---- Carrega universidades do CSV (RAW GitHub) ----
  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(
          "https://gist.githubusercontent.com/alexandremcosta/c9361cc23722a5aa1133/raw/1a49c7cfff76dedea615dee4ea4bc47c2e7be621/universidades.csv"
        );

        if (!res.ok) throw new Error("Falha ao carregar universidades");
        const csvText = await res.text();
        let lines = csvText
          .split("\n")
          .map((l) => l.trim())
          .filter((l) => l.length > 0);
        lines = Array.from(new Set(lines)); // 🔥 REMOVER DUPLICADOS
        setUniversities(lines);
      } catch (e) {
        console.error("Erro carregando universidades:", e);
      }
    }
    load();
  }, []);

  // ---- Fecha dropdown ao clicar fora ----
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // ---- Filtra sugestões conforme o usuário digita ----
  useEffect(() => {
    const q = formData.university.trim();
    if (!q) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }
    const filtered = universities.filter((u) =>
      u.toLowerCase().includes(q.toLowerCase())
    );
    setSuggestions(filtered.slice(0, 12));
    setShowSuggestions(filtered.length > 0);
  }, [formData.university, universities]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSuggestionClick = (value: string) => {
    setFormData((prev) => ({ ...prev, university: value }));
    setSuggestions([]);
    setShowSuggestions(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const response = await register(formData);
      if (!response?.success) {
        setError(response?.error || "Erro ao cadastrar");
        return;
      }
    } catch (err) {
      console.error("Erro no formulário:", err);
      setError("Erro ao cadastrar");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-[100dvh] flex flex-col md:flex-row font-geist w-[100dvw]">
      {/* Seção da Imagem (agora à ESQUERDA) */}
      {heroImageSrc && (
        <section className="hidden md:block flex-1 relative p-4 order-1 md:order-1">
          <div
            className="animate-slide-right animate-delay-300 absolute inset-4 rounded-3xl bg-cover bg-center"
            style={{ backgroundImage: `url(${heroImageSrc})` }}
          ></div>
          {testimonials.length > 0 && (
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-4 px-8 w-full justify-center">
              <TestimonialCard testimonial={testimonials[0]} delay="animate-delay-1000" />
              {testimonials[1] && (
                <div className="hidden xl:flex">
                  <TestimonialCard testimonial={testimonials[1]} delay="animate-delay-1200" />
                </div>
              )}
              {testimonials[2] && (
                <div className="hidden 2xl:flex">
                  <TestimonialCard testimonial={testimonials[2]} delay="animate-delay-1400" />
                </div>
              )}
            </div>
          )}
        </section>
      )}

      {/* Seção do Formulário (agora à DIREITA) */}
      <section className="flex-1 flex items-center justify-center p-8 order-2 md:order-2">
        <div className="w-full max-w-md">
          <div className="flex flex-col gap-6">
            {/* Cabeçalho */}
            <div className="flex items-center gap-3 mb-2">
              <UserPlus className="w-6 h-6 text-secondary" />
              <h1 className="animate-element animate-delay-100 text-4xl md:text-5xl font-semibold leading-tight">{title}</h1>
            </div>
            <p className="animate-element animate-delay-200 text-muted-foreground">{description}</p>

            {/* Mensagem de Erro */}
            {error && (
              <Alert variant="destructive" className="animate-element animate-delay-250 bg-destructive/10 border-destructive/30">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {/* Formulário de Registro */}
            <form className="space-y-5" onSubmit={handleSubmit}>
              {/* Nome */}
              <div className="animate-element animate-delay-300">
                <label className="text-sm font-medium text-muted-foreground">Nome Completo</label>
                <GlassInputWrapper>
                  <input
                    name="name"
                    type="text"
                    placeholder="João Silva"
                    value={formData.name}
                    onChange={handleChange}
                    disabled={loading}
                    required
                    className="w-full bg-transparent text-sm p-4 rounded-2xl focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
                  />
                </GlassInputWrapper>
              </div>

              {/* Email */}
              <div className="animate-element animate-delay-350">
                <label className="text-sm font-medium text-muted-foreground">Email</label>
                <GlassInputWrapper>
                  <input
                    name="email"
                    type="email"
                    placeholder="seu@email.com"
                    value={formData.email}
                    onChange={handleChange}
                    disabled={loading}
                    required
                    className="w-full bg-transparent text-sm p-4 rounded-2xl focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
                  />
                </GlassInputWrapper>
              </div>

              {/* Senha com Toggle de Visibilidade */}
              <div className="animate-element animate-delay-400">
                <label className="text-sm font-medium text-muted-foreground">Senha</label>
                <GlassInputWrapper>
                  <div className="relative">
                    <input
                      name="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={formData.password}
                      onChange={handleChange}
                      disabled={loading}
                      required
                      className="w-full bg-transparent text-sm p-4 pr-12 rounded-2xl focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-3 flex items-center"
                      disabled={loading}
                    >
                      {showPassword ? (
                        <EyeOff className="w-5 h-5 text-muted-foreground hover:text-foreground transition-colors" />
                      ) : (
                        <Eye className="w-5 h-5 text-muted-foreground hover:text-foreground transition-colors" />
                      )}
                    </button>
                  </div>
                </GlassInputWrapper>
              </div>

              {/* Especialidade e Ano em Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Especialidade */}
                <div className="animate-element animate-delay-450">
                  <label className="text-sm font-medium text-muted-foreground">Especialidade</label>
                  <GlassInputWrapper>
                    <input
                      name="specialty"
                      type="text"
                      placeholder="Ex: Cardiologia"
                      value={formData.specialty}
                      onChange={handleChange}
                      disabled={loading}
                      required
                      className="w-full bg-transparent text-sm p-4 rounded-2xl focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
                    />
                  </GlassInputWrapper>
                </div>

                {/* Ano */}
                <div className="animate-element animate-delay-500">
                  <label className="text-sm font-medium text-muted-foreground">Ano</label>
                  <GlassInputWrapper>
                    <input
                      name="year"
                      type="text"
                      placeholder="1 - 6"
                      value={formData.year}
                      onChange={handleChange}
                      disabled={loading}
                      required
                      className="w-full bg-transparent text-sm p-4 rounded-2xl focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
                    />
                  </GlassInputWrapper>
                </div>
              </div>

              {/* Universidade com Autocomplete */}
              <div className="animate-element animate-delay-550 space-y-2 relative" ref={wrapperRef}>
                <label className="text-sm font-medium text-muted-foreground">Universidade</label>
                <div className="relative">
                  <GlassInputWrapper>
                    <input
                      ref={universityInputRef}
                      name="university"
                      type="text"
                      placeholder="Ex: Universidade de São Paulo"
                      value={formData.university}
                      onChange={handleChange}
                      onFocus={() => {
                        if (suggestions.length > 0) setShowSuggestions(true);
                      }}
                      disabled={loading}
                      required
                      autoComplete="off"
                      className="w-full bg-transparent text-sm p-4 rounded-2xl focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
                    />
                  </GlassInputWrapper>
                  {/* Dropdown de Sugestões */}
                  {showSuggestions && suggestions.length > 0 && (
                    <div className="absolute z-20 left-0 right-0 mt-1 bg-card border border-border/30 rounded-2xl shadow-lg max-h-48 overflow-y-auto animate-in fade-in-50 slide-in-from-top-1">
                      {suggestions.map((s) => (
                        <div
                          key={s}
                          className="px-4 py-3 hover:bg-accent/20 cursor-pointer text-sm transition-colors"
                          onMouseDown={(e) => {
                            e.preventDefault();
                            handleSuggestionClick(s);
                          }}
                        >
                          {s}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Botão de Submit */}
              <button
                type="submit"
                disabled={loading}
                className="animate-element animate-delay-600 w-full rounded-2xl bg-primary py-4 font-medium text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Cadastrando..." : "Cadastrar"}
              </button>
            </form>

            {/* Divisor ou Botão do Google */}
            {/* <div className="animate-element animate-delay-700 relative flex items-center justify-center">
              <span className="w-full border-t border-border"></span>
              <span className="absolute bg-card px-4 text-sm text-muted-foreground">ou</span>
            </div> */}


            {/* {&& (
              <button
                onClick={}
                disabled={loading}
                className="animate-element animate-delay-800 w-full flex items-center justify-center gap-3 border border-border rounded-2xl py-4 hover:bg-secondary transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <GoogleIcon />
                Continuar com Google
              </button>
            )} */}

            {/* Link para Login */}
            <p className="animate-element animate-delay-900 text-center text-sm text-muted-foreground">
              Já tem uma conta?{" "}
              <a
                href="/login"
                className="text-green-400 hover:underline transition-colors"
              >
                Fazer Login
              </a>
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};