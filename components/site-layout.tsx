// import { EnhancedHeader } from "@/components/enhanced-header"
// import { EnhancedFooter } from "@/components/enhanced-footer"
// import { ScrollToTop } from "@/components/scroll-to-top"
import type React from "react"
import { Footer } from "@/components/ui/flickering-footer"
import { Header } from "@/components/ui/header-1"

interface SiteLayoutProps {
  children: React.ReactNode
  hideFooter?: boolean
}

export function SiteLayout({ children, hideFooter = false }: SiteLayoutProps) {
  return (
    <div className="">
        <Header />
     {children}
        <Footer />
    </div>
  )
}
