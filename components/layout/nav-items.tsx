import { UserRole } from "@/lib/constants"
import { LayoutDashboard, FileText, Users, Briefcase, BarChart3, Home, PlusCircle } from "lucide-react"

export interface NavItem {
  title: string
  href: string
  icon: any
  roles: UserRole[]
}

export const NAV_ITEMS: NavItem[] = [
  // Internal Routes
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
    roles: [UserRole.ADMIN, UserRole.COORDINATOR],
  },
  {
    title: "Reclamos",
    href: "/claims",
    icon: FileText,
    roles: [UserRole.ADMIN, UserRole.COORDINATOR, UserRole.AGENT, UserRole.AUDITOR],
  },
  {
    title: "Clientes",
    href: "/clients",
    icon: Users,
    roles: [UserRole.ADMIN, UserRole.COORDINATOR],
  },
  {
    title: "Proyectos",
    href: "/projects",
    icon: Briefcase,
    roles: [UserRole.ADMIN, UserRole.COORDINATOR],
  },
  {
    title: "Reportes",
    href: "/reports",
    icon: BarChart3,
    roles: [UserRole.ADMIN, UserRole.COORDINATOR, UserRole.AUDITOR],
  },

  // Client Routes
  {
    title: "Mis Reclamos",
    href: "/home",
    icon: Home,
    roles: [UserRole.CLIENT],
  },
  {
    title: "Nuevo Reclamo",
    href: "/my-claims/new",
    icon: PlusCircle,
    roles: [UserRole.CLIENT],
  },
]
