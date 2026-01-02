"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useAuth } from "@/contexts/auth-context";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import {
  Stethoscope,
  BookOpen,
  GraduationCap,
  Pill,
  ClipboardCheck,
  Brain,
  FileText,
  Activity,
  Send,
  Loader2,
  Copy,
  Check,
  MessageSquare,
  ArrowDown,
} from "lucide-react";
import ReactMarkdown from "react-markdown";



interface Message {
  id: string;
  text: string;
  sender: "user" | "ai";
  timestamp: Date;
  type?: string;
}

interface QuickActionProps {
  icon: React.ReactNode;
  label: string;
  endpoint: string;
}

function useAutoResizeTextarea({ minHeight, maxHeight }: { minHeight: number; maxHeight?: number }) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const adjustHeight = useCallback(
    (reset?: boolean) => {
      const textarea = textareaRef.current;
      if (!textarea) return;

      if (reset) {
        textarea.style.height = `${minHeight}px`;
        return;
      }

      textarea.style.height = `${minHeight}px`;
      const newHeight = Math.max(minHeight, Math.min(textarea.scrollHeight, maxHeight ?? Infinity));
      textarea.style.height = `${newHeight}px`;
    },
    [minHeight, maxHeight]
  );

  useEffect(() => {
    if (textareaRef.current) textareaRef.current.style.height = `${minHeight}px`;
  }, [minHeight]);

  return { textareaRef, adjustHeight };
}

export default function DrPilot() {
  const { user, logout } = useAuth();
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeEndpoint, setActiveEndpoint] = useState<string | null>(null);
  const [copiedMessageId, setCopiedMessageId] = useState<string | null>(null);
  const [showScrollButton, setShowScrollButton] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const { textareaRef, adjustHeight } = useAutoResizeTextarea({ minHeight: 48, maxHeight: 150 });

  const scrollToBottom = useCallback(() => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTo({ top: messagesContainerRef.current.scrollHeight, behavior: "smooth" });
    }
  }, []);

  useEffect(() => {
    if (messages.length > 0) {
      const timer = setTimeout(() => scrollToBottom(), 100);
      return () => clearTimeout(timer);
    }
  }, [messages, scrollToBottom]);

  useEffect(() => {
    const container = messagesContainerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = container;
      const isScrolledFromBottom = scrollHeight - scrollTop - clientHeight > 140; // tweaked threshold
      setShowScrollButton(isScrolledFromBottom);
    };

    container.addEventListener("scroll", handleScroll, { passive: true });
    return () => container.removeEventListener("scroll", handleScroll);
  }, []);

  const handleCopyMessage = async (text: string, messageId: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedMessageId(messageId);
      setTimeout(() => setCopiedMessageId(null), 2000);
    } catch (err) {
      console.error("Failed to copy text:", err);
    }
  };

  const handleSendMessage = async (e: React.FormEvent | any, endpoint: string = "/query", extraData?: any) => {
    if (e && e.preventDefault) e.preventDefault();
    if (!message.trim()) return;

    const userMessage: Message = { id: Date.now().toString(), text: message, sender: "user", timestamp: new Date(), type: endpoint };
    setMessages((prev) => [...prev, userMessage]);
    setMessage("");
    adjustHeight(true);
    setLoading(true);

    try {
      const token = localStorage.getItem("token");
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

      const requestBody =
        endpoint === "/query"
          ? { query: message }
          : endpoint === "/analyze-symptoms"
          ? { symptoms: message.split(",").map((s) => s.trim()), ...extraData }
          : endpoint === "/study-topic"
          ? { topic: message, ...extraData }
          : endpoint === "/exam-review"
          ? { subjects: message.split(",").map((s) => s.trim()), ...extraData }
          : endpoint === "/pharmacology"
          ? { query: message, ...extraData }
          : endpoint === "/osce"
          ? { station: message, ...extraData }
          : { query: message };

      const response = await fetch(`${baseUrl}/api/ai${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(requestBody),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || data.message || "Erro ao processar sua solicitação");

      let aiText: string;
      if (Array.isArray(data.data?.response)) aiText = data.data.response.join("\n\n");
      else if (typeof data.data?.response === "object" && data.data?.response !== null) aiText = JSON.stringify(data.data.response, null, 2);
      else aiText = String(data.data?.response || "Desculpe, não consegui processar sua pergunta.");

      const aiMessage: Message = { id: (Date.now() + 1).toString(), text: aiText, sender: "ai", timestamp: new Date(), type: endpoint };
      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      const errorMessage: Message = {
        id: (Date.now() + 2).toString(),
        text: error instanceof Error ? error.message : "Erro ao conectar com o servidor",
        sender: "ai",
        timestamp: new Date(),
        type: endpoint,
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setLoading(false);
      setActiveEndpoint(null);
    }
  };

  const handleQuickAction = (action: QuickActionProps) => {
    setActiveEndpoint(action.endpoint);
    setMessage(`Quero usar a funcionalidade de ${action.label.toLowerCase()}: `);
    textareaRef.current?.focus();
  };

  const quickActions: QuickActionProps[] = [
    { icon: <Stethoscope className="w-5 h-5" />, label: "Análise de Sintomas", endpoint: "/analyze-symptoms" },
    { icon: <BookOpen className="w-5 h-5" />, label: "Estudo de Tópico", endpoint: "/study-topic" },
    { icon: <GraduationCap className="w-5 h-5" />, label: "Revisão de Prova", endpoint: "/exam-review" },
    { icon: <Pill className="w-5 h-5" />, label: "Farmacologia", endpoint: "/pharmacology" },
    { icon: <ClipboardCheck className="w-5 h-5" />, label: "OSCE", endpoint: "/osce" },
    { icon: <Brain className="w-5 h-5" />, label: "Consulta IA", endpoint: "/query" },
    { icon: <FileText className="w-5 h-5" />, label: "Histórico", endpoint: "/history" },
    { icon: <Activity className="w-5 h-5" />, label: "Sinais Vitais", endpoint: "/vital-signs" },
  ];

  /* ---------------- UI small components ---------------- */
  const MessageBubble = ({ msg }: { msg: Message }) => {
    const isUser = msg.sender === "user";
    return (
      <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
        <div className={`max-w-xs sm:max-w-md lg:max-w-lg ${isUser ? "ml-auto" : "mr-auto"}`}>
          <Card
            className={cn(
              "px-4 py-3 backdrop-blur-sm",
              isUser ? "bg-primary/90 text-white border-primary/50" : "bg-background/7 text-white border-white/10"
            )}
          >
            <div className="flex items-start justify-between gap-2 mb-2">
              {msg.type && msg.type !== "/query" && (
                <div className="flex items-center gap-2 flex-1 min-w-0">
                  <div className="flex-shrink-0">{quickActions.find((a) => a.endpoint === msg.type)?.icon}</div>
                  <span className="text-xs opacity-70 truncate">{quickActions.find((a) => a.endpoint === msg.type)?.label}</span>
                </div>
              )}

              <div className="flex items-center gap-2 flex-shrink-0">
                <span className="text-xs opacity-60">
                  {msg.timestamp.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}
                </span>
                <button onClick={() => handleCopyMessage(msg.text, msg.id)} className="p-1 rounded hover:bg-background/5 transition-colors" aria-label="Copiar mensagem">
                  {copiedMessageId === msg.id ? <Check className="w-3 h-3 text-green-400" /> : <Copy className="w-3 h-3 opacity-60 hover:opacity-100" />}
                </button>
              </div>
            </div>

            <div className="prose prose-invert max-w-none break-words whitespace-pre-wrap">
              <ReactMarkdown className="text-sm leading-relaxed">{msg.text}</ReactMarkdown>
            </div>
          </Card>
        </div>
      </div>
    );
  };

  return (
    <div className="relative w-full  flex flex-col items-center bg-black">
      {/* Background image + overlay (kept exactly as requested) */}
      <div className="fixed inset-0 bg-cover bg-center overflow-hidden" style={{ backgroundImage: "url('https://pub-940ccf6255b54fa799a9b01050e6c227.r2.dev/ruixen_moon_2.png')", backgroundAttachment: "fixed", filter: "grayscale(100%) brightness(0.5) contrast(1.9)", }} />
      <div className="absolute inset-0 bg-black/30 -z-20" />

      {/* Header (kept commented for now but improved structure if enabled) */}
      {/* <header className="relative w-full bg-black/30 backdrop-blur-sm border-b border-white/5 z-10">...</header> */}

      <main className="relative flex-1 w-full max-w-6xl mx-auto px-4 sm:px-6 py-6 flex flex-col">
        <div className="flex-1 w-full flex flex-col lg:flex-row gap-6">
          {/* Left / Main column */}
          <section className="flex-1 flex flex-col gap-4">
            {/* Messages container card */}
            {/* <div className="flex-1 bg-background/3 backdrop-blur-sm border border-white/6 rounded-2xl shadow-sm overflow-hidden flex flex-col"> */}
            <div className="">
              {/* Top intro / quick actions area (when no messages) */}
              <div ref={messagesContainerRef} className="flex-1 overflow-y-auto px-3 sm:px-6 py-4 scroll-smooth" style={{ paddingBottom: 220 }}>
                <div className="max-w-4xl mx-auto">
                  {messages.length === 0 ? (
                    <div className="flex flex-col items-center justify-center text-center py-6 sm:py-12 px-4">
                      <div className="mb-6">
                        <Activity className="w-14 h-14 text-primary mx-auto" />
                      </div>
                      <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">Bem-vindo ao Dr Pilot</h2>
                      <p className="text-white/70 max-w-md mb-8 text-sm sm:text-base">No que você está precisando de ajuda hoje?</p>

                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full max-w-4xl">
                        {quickActions.map((action) => (
                          <Card key={action.endpoint} className="bg-background/6 backdrop-blur-sm border border-white/8 hover:bg-background/8 transition-all cursor-pointer p-4" onClick={() => handleQuickAction(action)}>
                            <div className="flex items-center gap-3">
                              <div className="p-2.5 bg-primary/30 rounded-lg flex-shrink-0">{action.icon}</div>
                              <div className="flex-1 min-w-0">
                                <h3 className="font-semibold text-white text-sm truncate">{action.label}</h3>
                                <p className="text-xs text-white/60 mt-1 truncate">Clique para usar</p>
                              </div>
                            </div>
                          </Card>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4 pb-6">
                      {messages.map((msg) => (
                        <MessageBubble key={msg.id} msg={msg} />
                      ))}

                      {loading && (
                        <div className="flex justify-start">
                          <div className="max-w-xs sm:max-w-md lg:max-w-lg">
                            <Card className="bg-background/7 text-white border-white/10 px-4 py-3 backdrop-blur-sm">
                              <div className="flex items-center gap-3">
                                <Loader2 className="h-4 w-4 animate-spin text-primary" />
                                <p className="text-sm">Pensando bem...</p>
                              </div>
                            </Card>
                          </div>
                        </div>
                      )}

                      <div ref={messagesEndRef} />
                    </div>
                  )}
                </div>
              </div>

              {/* Scroll to bottom button (kept floating) */}
              {showScrollButton && (
                <button onClick={scrollToBottom} className="absolute right-8 bottom-36 z-30 p-2 rounded-full bg-primary/90 hover:bg-primary text-white shadow-lg transition-all" aria-label="Scroll para o final">
                  <ArrowDown className="w-5 h-5" />
                </button>
              )}
            </div>
          </section>

          {/* Right / secondary column (IPTU or extras) */}
          {/* <aside className="w-full lg:w-96 flex-shrink-0">
            <div className="bg-background/3 backdrop-blur-sm border border-white/6 rounded-2xl shadow-sm p-4 sticky top-6">
              <h4 className="text-sm font-semibold text-white mb-2">IPTU / Painel</h4>
              <p className="text-xs text-white/60 mb-3">Informações rápidas ou componentes auxiliares vão aqui.</p>

              <div className="space-y-2">
                <div className="text-xs text-white/70">Endereço</div>
                <div className="text-sm font-medium text-white">Rua Exemplo, 123</div>
                <hr className="border-white/6 my-3" />
                <div className="text-xs text-white/70">Status</div>
                <div className="text-sm font-medium text-white">Em dia</div>
              </div>
            </div>
          </aside> */}
        </div>

        {/* Input fixed area (keeps original look but improved spacing/no black bars) */}
        <div className="fixed left-0 right-0 bottom-0 z-40 pointer-events-none">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 pb-6 pointer-events-auto">
            <div className="relative bg-black/60 backdrop-blur-md rounded-2xl border border-white/10 overflow-hidden">
              <form onSubmit={(e) => handleSendMessage(e, activeEndpoint || "/query")} className="flex flex-col">
                <Textarea
                  ref={textareaRef}
                  value={message}
                  onChange={(e) => {
                    setMessage(e.target.value);
                    adjustHeight();
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage(e, activeEndpoint || "/query");
                    }
                  }}
                  placeholder={
                    activeEndpoint
                      ? `Digite os detalhes para ${quickActions.find((a) => a.endpoint === activeEndpoint)?.label.toLowerCase()}...`
                      : "Converse comigo..."
                  }
                  className={cn(
                    "w-full px-4 py-3 resize-none border-none",
                    "bg-transparent text-white text-sm sm:text-base",
                    "focus-visible:ring-0 focus-visible:ring-offset-0",
                    "placeholder:text-white/40 min-h-[48px]"
                  )}
                  style={{ overflow: "hidden" }}
                />

                <div className="flex items-center justify-between gap-3 p-3 border-t border-white/6">
                  <div className="flex items-center gap-2">
                    {activeEndpoint && <span className="text-xs px-2 py-1 bg-primary/20 rounded text-primary">{quickActions.find((a) => a.endpoint === activeEndpoint)?.label}</span>}
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      type="submit"
                      disabled={loading || !message.trim()}
                      className={cn(
                        "flex items-center gap-2 px-4 py-2 rounded-lg transition-all",
                        "bg-gradient-to-r from-primary to-primary/80 text-white",
                        "hover:from-primary/90 hover:to-primary/70",
                        "disabled:opacity-50 disabled:cursor-not-allowed",
                        "text-sm sm:text-base"
                      )}
                    >
                      {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                      <span className="hidden sm:inline">Enviar</span>
                      <span className="sm:hidden">OK</span>
                    </Button>
                  </div>
                </div>

                {/* Quick actions compact bar */}
                <div className="flex items-center justify-center flex-wrap gap-2 p-3 bg-black/40">
                  {quickActions.map((action) => (
                    <button
                      key={action.endpoint}
                      onClick={() => handleQuickAction(action)}
                      type="button"
                      className={cn(
                        "flex items-center gap-2 rounded-full px-3 py-1.5 text-xs transition-all",
                        "border border-white/10",
                        activeEndpoint === action.endpoint ? "bg-primary/20 text-primary border-primary/30" : "bg-black/50 text-white/80 hover:text-white hover:bg-background/6"
                      )}
                    >
                      <span className="flex-shrink-0">{action.icon}</span>
                      <span className="hidden sm:inline">{action.label}</span>
                      <span className="sm:hidden truncate max-w-[80px]">{action.label.split(" ")[0]}</span>
                    </button>
                  ))}
                </div>
              </form>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}