"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { PlusCircle, Loader2 } from "lucide-react"
import Link from "next/link"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { StatusBadge } from "@/components/claims/status-badge"
import { api } from "@/lib/api"
import { useAuth } from "@/lib/auth-context"
import type { Claim } from "@/lib/types"
import { useToast } from "@/components/ui/use-toast"

export default function ClientHome() {
  const { user } = useAuth()
  const { toast } = useToast()
  const [claims, setClaims] = useState<Claim[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadClaims = async () => {
      if (!user?.clientId) {
        setLoading(false)
        return
      }
      try {
        setLoading(true)
        const data = await api.claims.listByClient(user.clientId)
        setClaims(data)
      } catch (error) {
        console.error(error)
        toast({ title: "Error", description: "No se pudieron cargar los reclamos", variant: "destructive" })
      } finally {
        setLoading(false)
      }
    }
    loadClaims()
  }, [user, toast])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Mis Reclamos</h1>
          <p className="text-muted-foreground">Gestiona tus tickets y revisa su estado.</p>
        </div>
        <Link href="/my-claims/new">
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            Nuevo Reclamo
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Reclamos Activos</CardTitle>
          <CardDescription>Lista de tus últimos reclamos registrados.</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Código</TableHead>
                  <TableHead>Proyecto</TableHead>
                  <TableHead>Descripción</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Fecha</TableHead>
                  <TableHead className="text-right">Acción</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {claims.map((claim) => (
                  <TableRow key={claim.id}>
                    <TableCell className="font-medium">{claim.codigo || claim.id.slice(-8)}</TableCell>
                    <TableCell>{claim.projectName}</TableCell>
                    <TableCell className="max-w-[200px] truncate">{claim.description}</TableCell>
                    <TableCell>
                      <StatusBadge status={claim.status} />
                    </TableCell>
                    <TableCell>{new Date(claim.createdAt).toLocaleDateString()}</TableCell>
                    <TableCell className="text-right">
                      <Link href={`/my-claims/${claim.id}`} className="text-primary hover:underline text-sm font-medium">
                        Ver Detalle
                      </Link>
                    </TableCell>
                  </TableRow>
                ))}
                {claims.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                      No tienes reclamos registrados.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
