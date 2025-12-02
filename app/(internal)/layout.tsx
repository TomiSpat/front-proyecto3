"use client"

import type React from "react"

import { Sidebar } from "@/components/layout/sidebar"
import { useAuth } from "@/lib/auth-context"
import { UserRole } from "@/lib/constants"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

export default function InternalLayout({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login")
    } else if (!isLoading && user && user.role === UserRole.CLIENT) {
      router.push("/home") // Clients shouldn't be here
    }
  }, [user, isLoading, router])

  if (isLoading || !user) return null

  return (
    <div className="flex h-screen bg-background text-foreground">
      <Sidebar />
      <main className="flex-1 overflow-y-auto bg-muted/30 p-8">{children}</main>
    </div>
  )
}
