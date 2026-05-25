import React from "react"
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { Separator } from "@/components/ui/separator"
import { SquiggleFilter, GraphPaper } from "@/components/ui/Sketchy"

interface SketchyDashboardLayoutProps {
  title: string
  children: React.ReactNode
  role?: "RECRUITER" | "INDIVIDUAL"
  headerAction?: React.ReactNode
}

export function SketchyDashboardLayout({ 
  title, 
  children, 
  role = "INDIVIDUAL",
  headerAction 
}: SketchyDashboardLayoutProps) {
  return (
    <SidebarProvider>
      <AppSidebar role={role} />
      <SidebarInset className="bg-[#f8efe2] relative overflow-hidden">
        <SquiggleFilter />
        <GraphPaper />
        
        <header className="sticky top-0 z-20 flex h-16 shrink-0 items-center gap-2 bg-[#f8efe2]/95 backdrop-blur-sm px-4 border-b-2 border-slate-900/20">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4 bg-slate-900/20" />
          <div className="flex-1">
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider font-mono">{title}</h2>
          </div>
          {headerAction && (
            <div className="flex items-center gap-2">
              {headerAction}
            </div>
          )}
        </header>

        <main className="p-6 md:p-10 lg:p-12 w-full max-w-[1600px] mx-auto min-h-[calc(100svh-4rem)] relative z-10">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}
