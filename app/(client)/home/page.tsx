"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { PlusCircle, Loader2, ChevronLeft, ChevronRight } from "lucide-react"
import Link from "next/link"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { StatusBadge } from "@/components/claims/status-badge"
import { api } from "@/lib/api"
import { useAuth } from "@/lib/auth-context"
import type { Claim, PaginationMeta } from "@/lib/types"
import { useToast } from "@/components/ui/use-toast"

export default function ClientHome() {
  const { user } = useAuth()
  const { toast } = useToast()
  const [claims, setClaims] = useState<Claim[]>([])
  const [loading, setLoading] = useState(true)
  const [pagination, setPagination] = useState<PaginationMeta>({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 0,
    hasNextPage: false,
    hasPreviousPage: false,
  })

  const loadClaims = async (page: number = 1) => {
    if (!user?.clientId) {
      setLoading(false)
      return
    }
    try {
      setLoading(true)
      const response = await api.claims.listByClient(user.clientId, page, 10)
      setClaims(response.data)
      setPagination(response.meta)
    } catch (error) {
      console.error(error)
      toast({ title: "Error", description: "No se pudieron cargar los reclamos", variant: "destructive" })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadClaims(1)
  }, [user])

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

          {/* Paginación */}
          {!loading && pagination.totalPages > 1 && (
            <div className="flex items-center justify-between px-2 py-4 border-t">
              <div className="text-sm text-muted-foreground">
                Mostrando {claims.length} de {pagination.total} reclamos
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => loadClaims(pagination.page - 1)}
                  disabled={!pagination.hasPreviousPage}
                >
                  <ChevronLeft className="h-4 w-4 mr-1" />
                  Anterior
                </Button>
                <div className="text-sm font-medium">
                  Página {pagination.page} de {pagination.totalPages}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => loadClaims(pagination.page + 1)}
                  disabled={!pagination.hasNextPage}
                >
                  Siguiente
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
