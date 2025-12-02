"use client"

import type React from "react"

import { useAuth } from "@/lib/auth-context"
import { UserRole } from "@/lib/constants"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import { LogOut } from "lucide-react"

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const { user, isLoading, logout } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login")
    } else if (!isLoading && user && user.role !== UserRole.CLIENT) {
      router.push("/dashboard") // Internal users shouldn't be here
    }
  }, [user, isLoading, router])

  if (isLoading || !user) return null

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-white dark:bg-slate-800 sticky top-0 z-10 shadow-sm">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-2 font-bold text-xl text-primary">Portal de Clientes</div>
          <div className="flex items-center gap-4">
            <div className="text-sm text-right hidden sm:block">
              <p className="font-medium text-foreground">{user.name}</p>
              <p className="text-xs text-muted-foreground">{user.email}</p>
            </div>
            <Button variant="ghost" size="icon" onClick={logout}>
              <LogOut className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>
      <main className="container mx-auto py-8 px-4 bg-muted/20">{children}</main>
    </div>
  )
}
