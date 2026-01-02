import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { AuthProvider } from "@/contexts/auth-context"
import "./globals.css"

const inter = Inter({
  subsets: ["latin"],
  display: 'swap',
})

export const metadata: Metadata = {
  title: "Dr. Pilot - Assistente Médico de IA",
  description: "Seu assistente virtual de IA especializado em medicina e estudos médicos",
  icons: {
    icon: '/logo-DrPilot.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-BR">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5, user-scalable=yes" />


        {/* Fonts */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />

        {/* ========== FAVICONS ESPECÍFICOS PARA SAFARI macOS ========== */}

        {/* 1. ÍCONE PRINCIPAL PARA SAFARI (PNG 32x32 - OBRIGATÓRIO) */}
        <link
          rel="icon"
          type="image/png"
          href="/favicon-32x32.png" // n é
          sizes="32x32"
        />

        {/* 2. SVG para Safari pinned tabs (Safari 9+) */}
        <link
          rel="mask-icon"
          href="/safari-pinned-tab.svg" // n é
          color="#10300c"
        />

        {/* 3. Apple Touch Icon (para "Adicionar ao Dock" no macOS) */}
        <link
          rel="apple-touch-icon"
          href="/apple-touch-icon.png"
          sizes="180x180"
        />

        {/* 4. Ícone alternativo para alta DPI (Retina displays) */}
        <link
          rel="icon"
          type="image/png"
          href="/favicon-64x64.png"
          sizes="64x64"
        />

        {/* 5. Para compatibilidade com navegadores antigos */}
        <link
          rel="shortcut icon"
          href="/favicon.ico"
          type="image/x-icon"
        />

        {/* 6. Para PWA (se quiser) */}
        <link rel="manifest" href="/site.webmanifest" />

        {/* ========== META TAGS ESPECÍFICAS PARA SAFARI macOS ========== */}

        {/* Cor do tema para Safari 15+ */}
        {/* <meta name="theme-color" content="#10300c" /> */}

        {/* Para Safari no macOS (ícone na barra de favoritos) */}
        <meta name="favicon.ico" content="yes" />

        {/* Título quando adicionado ao Dock */}
        <meta name="apple-mobile-web-app-title" content="Dr Pilot" />

        {/* Para quando o site é aberto do Dock */}
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />

        {/* Para compartilhamento no Safari */}
        <meta property="og:image" content="/android-chrome-512x512.png" />
        <meta property="og:image:width" content="512" />
        <meta property="og:image:height" content="512" />
        <meta property="og:image:type" content="image/png" />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Dr Pilot - Assistente Médico de IA" />
        <meta property="og:description" content="Seu assistente virtual de IA especializado em medicina e estudos médicos" />

        {/* Para Twitter cards (também afeta Safari) */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:image" content="/android-chrome-512x512.png" />

        {/* Para Microsoft */}
        <meta name="msapplication-TileColor" content="#10300c" />
        <meta name="msapplication-TileImage" content="/mstile-144x144.png" />

        {/* Cor para address bar no Safari iOS (também afeta macOS) */}
        <meta name="apple-mobile-web-app-status-bar-style" content="#10300c" />

      </head>

      <body className={`${inter.className} antialiased bg-background text-foreground`}>
        {/* Script específico para corrigir Safari macOS */}
        <AuthProvider>
          <main className="min-h-screen">
            {children}
          </main>
        </AuthProvider>
        <Analytics />
      </body>
    </html>
  )
}