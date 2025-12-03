"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import type { User } from "./types"
import { useRouter } from "next/navigation"
import { api, setAuthToken, getAuthToken } from "./api"
import { UserRole } from "./constants"

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<void>
  logout: () => void
  isLoading: boolean
  error: string | null
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    const checkSession = async () => {
      const storedUserId = localStorage.getItem("claim_sys_user_id")
      const token = getAuthToken()
      
      if (storedUserId && token) {
        try {
          const user = await api.auth.getCurrentUser(storedUserId)
          if (user) {
            setUser(user)
          } else {
            // Token inválido o usuario no existe
            localStorage.removeItem("claim_sys_user_id")
            setAuthToken(null)
          }
        } catch (e) {
          console.error("Session check failed", e)
          localStorage.removeItem("claim_sys_user_id")
          setAuthToken(null)
        }
      }
      setIsLoading(false)
    }
    checkSession()
  }, [])

  const login = async (email: string, password: string) => {
    setIsLoading(true)
    setError(null)
    try {
      const { user: loggedUser, token } = await api.auth.login(email, password)
      
      setUser(loggedUser)
      localStorage.setItem("claim_sys_user_id", loggedUser.id)

      // Redirect based on role
      if (loggedUser.role === UserRole.CLIENT) {
        router.push("/home")
      } else {
        router.push("/claims")
      }
    } catch (err) {
      console.error("Login failed", err)
      const message = err instanceof Error ? err.message : "Error al iniciar sesión"
      setError(message)
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("claim_sys_user_id")
    api.auth.logout()
    router.push("/login")
  }

  return <AuthContext.Provider value={{ user, login, logout, isLoading, error }}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
