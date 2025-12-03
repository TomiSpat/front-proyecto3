"use client"

import type React from "react"

import { useState } from "react"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"

export default function LoginPage() {
  const { login, isLoading, error } = useAuth()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [localError, setLocalError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLocalError(null)
    try {
      await login(email, password)
    } catch (err) {
      // El error ya se maneja en el contexto
      setLocalError(error || "Error al iniciar sesión")
    }
  }

  const setDemoCredentials = (demoEmail: string, demoPassword: string = "123456") => {
    setEmail(demoEmail)
    setPassword(demoPassword)
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 p-4">
      <Card className="w-full max-w-md shadow-2xl">
        <CardHeader className="space-y-1 bg-gradient-to-r from-blue-50 to-blue-50 dark:from-slate-800 dark:to-slate-800">
          <CardTitle className="text-2xl font-bold text-center">Bienvenido</CardTitle>
          <CardDescription className="text-center">Sistema de Gestión de Reclamos</CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          {(error || localError) && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error || localError}</AlertDescription>
            </Alert>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="nombre@empresa.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Contraseña</Label>
              <Input 
                id="password" 
                type="password" 
                placeholder="••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Ingresando..." : "Ingresar"}
            </Button>
          </form>

          {/* <div className="mt-6 text-sm text-muted-foreground space-y-2">
            <p className="font-semibold mb-2">Usuarios Demo (click para autocompletar):</p>
            <p className="text-xs mb-2 text-amber-600">Nota: Debes crear usuarios en el backend primero</p>
            <ul className="list-disc pl-5 space-y-1">
              <li
                className="cursor-pointer hover:text-primary transition-colors"
                onClick={() => setDemoCredentials("admin@sys.com")}
              >
                Admin: admin@sys.com
              </li>
              <li
                className="cursor-pointer hover:text-primary transition-colors"
                onClick={() => setDemoCredentials("coord@sys.com")}
              >
                Coordinador: coord@sys.com
              </li>
              <li
                className="cursor-pointer hover:text-primary transition-colors"
                onClick={() => setDemoCredentials("agente@sys.com")}
              >
                Agente: agente@sys.com
              </li>
              <li
                className="cursor-pointer hover:text-primary transition-colors"
                onClick={() => setDemoCredentials("cliente@empresa.com")}
              >
                Cliente: cliente@empresa.com
              </li>
            </ul>
          </div> */}
        </CardContent>
      </Card>
    </div>
  )
}
