import { SiteLayout } from "@/components/site-layout"
import type React from "react"

interface PageLayoutProps {
  children: React.ReactNode
  hideFooter?: boolean
}

export function PageLayout({ children, hideFooter = false }: PageLayoutProps) {
  return <SiteLayout hideFooter={hideFooter}>{children}</SiteLayout>
}
