import { UserRole } from "@/lib/constants"
import { FileText, Users, Briefcase, Home, PlusCircle, TrendingUp } from "lucide-react"

export interface NavItem {
  title: string
  href: string
  icon: any
  roles: UserRole[]
}

export const NAV_ITEMS: NavItem[] = [
  // Internal Routes
  {
    title: "Reclamos",
    href: "/claims",
    icon: FileText,
    roles: [UserRole.ADMIN, UserRole.COORDINATOR, UserRole.AGENT],
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
    title: "Estadísticas",
    href: "/statistics",
    icon: TrendingUp,
    roles: [UserRole.ADMIN, UserRole.COORDINATOR],
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
