"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { PlusCircle } from "lucide-react"
import Link from "next/link"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { StatusBadge } from "@/components/claims/status-badge"
import { ClaimStatus } from "@/lib/constants"

// Mock Data for Client
const MY_CLAIMS = [
  {
    id: "CLM-001",
    project: "Website Redesign",
    title: "Login error on mobile",
    status: ClaimStatus.CREATED,
    date: "2023-10-25",
  },
  {
    id: "CLM-004",
    project: "Website Redesign",
    title: "Typo in footer",
    status: ClaimStatus.RESOLVED,
    date: "2023-10-20",
  },
]

export default function ClientHome() {
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
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Proyecto</TableHead>
                <TableHead>Título</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Fecha</TableHead>
                <TableHead className="text-right">Acción</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {MY_CLAIMS.map((claim) => (
                <TableRow key={claim.id}>
                  <TableCell className="font-medium">{claim.id}</TableCell>
                  <TableCell>{claim.project}</TableCell>
                  <TableCell>{claim.title}</TableCell>
                  <TableCell>
                    <StatusBadge status={claim.status} />
                  </TableCell>
                  <TableCell>{claim.date}</TableCell>
                  <TableCell className="text-right">
                    <Link href={`/my-claims/${claim.id}`} className="text-primary hover:underline text-sm font-medium">
                      Ver Detalle
                    </Link>
                  </TableCell>
                </TableRow>
              ))}
              {MY_CLAIMS.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                    No tienes reclamos activos.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
