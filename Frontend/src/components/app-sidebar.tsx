import * as React from "react"
import { Link } from "react-router-dom"
import {
  BarChart3,
  FileText,
  Home,
  LayoutGrid,
  Settings,
  Users,
  Upload,
  BrainCircuit,
  LogOut,
  ChevronRight,
  Zap,
  Briefcase,
  User,
  Target,
} from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  useSidebar,
} from "@/components/sidebar"
import { cn } from "@/lib/utils"

const recruiterNavItems = [
  {
    title: "Overview",
    url: "/dashboard",
    icon: Home,
  },
  {
    url: "/dashboard",
    icon: Briefcase,
  },
  {
    title: "Job Openings",
    url: "/jobs",
    icon: LayoutGrid,
  },
  {
    title: "Resumes",
    url: "/resumes",
    icon: FileText,
  },
  {
    title: "Analytics",
    url: "/analytics",
    icon: BarChart3,
  },
]

const individualNavItems = [
  {
    title: "My Dashboard",
    url: "/dashboard",
    icon: User,
  },
  {
    title: "Take Assessment",
    url: "/individual/assessment",
    icon: Target,
  },
  {
    title: "Profile",
    url: "/individual/profile",
    icon: User,
  },
]

const tertiaryItems = [
  {
    title: "Settings",
    url: "/settings",
    icon: Settings,
  },
]

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
  role?: "RECRUITER" | "INDIVIDUAL"
}

export function AppSidebar({ role: propsRole, ...props }: AppSidebarProps) {
  const { state } = useSidebar()
  
  // Detect role from localStorage if not provided via props
  const userRole = React.useMemo(() => {
    if (propsRole) return propsRole
    const userStr = localStorage.getItem("user")
    if (userStr) {
      try {
        const user = JSON.parse(userStr)
        return user.role as "RECRUITER" | "INDIVIDUAL"
      } catch (e) {
        return "RECRUITER"
      }
    }
    return "RECRUITER"
  }, [propsRole])

  const navItems = userRole === "RECRUITER" ? recruiterNavItems : individualNavItems

  return (
    <Sidebar variant="sidebar" className="border-r-3 border-slate-900 bg-[#f8efe2]" {...props}>
      <SidebarHeader className="h-20 flex items-center px-6 bg-[#f8efe2] border-b-3 border-slate-900">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-red-500 flex items-center justify-center shadow-md border-2 border-slate-900" style={{ filter: "url(#squiggle)" }}>
            <BrainCircuit className="w-5 h-5 text-white" />
          </div>
          {state !== "collapsed" && (
            <span className="font-bold text-xl tracking-tight text-slate-900 font-mono">
              TalentIQ
            </span>
          )}
        </div>
      </SidebarHeader>
      <SidebarContent className="px-4 py-6 bg-[#f8efe2]">
        <SidebarMenu>
          {navItems.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton
                asChild
                tooltip={item.title}
                className="hover:bg-yellow-200/40 data-[active=true]:bg-red-100 data-[active=true]:text-red-600 group transition-all duration-300 rounded-xl border-2 border-transparent hover:border-slate-900/20"
              >
                <Link to={item.url} className="flex items-center gap-3 py-2">
                  <item.icon className={cn("w-5 h-5 transition-colors group-hover:text-red-600")} />
                  <span className="font-medium text-slate-900 group-hover:text-red-600">{item.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>

        <div className="mt-8 mb-4 px-2">
          {state !== "collapsed" && (
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4 px-2">
              System
            </p>
          )}
          <SidebarMenu>
            {tertiaryItems.map((item) => (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton
                  asChild
                  tooltip={item.title}
                  className="hover:bg-yellow-200/40 group transition-all duration-300 rounded-xl border-2 border-transparent hover:border-slate-900/20"
                >
                  <Link to={item.url} className="flex items-center gap-3 py-2">
                    <item.icon className="w-5 h-5 transition-colors group-hover:text-red-600 text-slate-700" />
                    <span className="text-slate-700 group-hover:text-red-600 font-medium">{item.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </div>
      </SidebarContent>
      <SidebarFooter className="p-4 border-t-3 border-slate-900 bg-[#f8efe2]">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton onClick={() => {
              localStorage.removeItem("user");
              window.location.href = "/login";
            }} className="w-full justify-start gap-3 hover:bg-red-100 hover:text-red-600 text-slate-700 group transition-all duration-300 rounded-xl border-2 border-transparent hover:border-slate-900/20 font-medium cursor-pointer">
              <LogOut className="w-5 h-5 group-hover:rotate-12 transition-transform" />
              <span>Logout</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail className="bg-[#f8efe2] border-l-2 border-slate-300" />
    </Sidebar>
  )
}
