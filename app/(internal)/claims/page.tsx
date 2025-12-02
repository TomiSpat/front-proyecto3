"use client"

import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ClaimStatus, PRIORITY_COLORS, STATUS_LABELS, PRIORITY_LABELS } from "@/lib/constants"
import { StatusBadge } from "@/components/claims/status-badge"
import { useRouter } from "next/navigation"
import { Filter, Search, Plus } from "lucide-react"
import { api } from "@/lib/api"
import type { Claim } from "@/lib/types"
import { format } from "date-fns"

export default function ClaimsPage() {
  const router = useRouter()
  const [claims, setClaims] = useState<Claim[]>([])
  const [loading, setLoading] = useState(true)
  const [filterStatus, setFilterStatus] = useState<string>("ALL")
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    const loadClaims = async () => {
      try {
        const data = await api.claims.list()
        setClaims(data)
      } catch (error) {
        console.error(error)
      } finally {
        setLoading(false)
      }
    }
    loadClaims()
  }, [])

  const filteredClaims = claims.filter((claim) => {
    const matchesStatus = filterStatus === "ALL" || claim.status === filterStatus
    const matchesSearch =
      claim.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (claim.clientName || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      claim.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (claim.codigo || "").toLowerCase().includes(searchTerm.toLowerCase())

    return matchesStatus && matchesSearch
  })

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Reclamos</h2>
          <p className="text-muted-foreground">Gestión centralizada de tickets y reclamos.</p>
        </div>
        <Button onClick={() => router.push("/claims/new")} className="bg-primary hover:bg-blue-700">
          <Plus className="mr-2 h-4 w-4" />
          Nuevo Reclamo
        </Button>
      </div>

      <div className="flex flex-wrap items-center gap-4 bg-card p-4 rounded-lg border border-border shadow-sm">
        <div className="flex-1 min-w-[200px]">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Buscar por ID, cliente o título..."
              className="pl-9"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        <div className="w-[180px]">
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger>
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4" />
                <SelectValue placeholder="Estado" />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">Todos los estados</SelectItem>
              {Object.values(ClaimStatus).map((status) => (
                <SelectItem key={status} value={status}>
                  {status}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Button
          variant="outline"
          onClick={() => {
            setFilterStatus("ALL")
            setSearchTerm("")
          }}
        >
          Limpiar Filtros
        </Button>
      </div>

      <div className="rounded-md border border-border bg-card shadow-sm overflow-hidden">
        <Table>
          <TableHeader className="bg-muted/50">
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Cliente / Proyecto</TableHead>
              <TableHead>Descripción</TableHead>
              <TableHead>Prioridad</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead>Asignado a</TableHead>
              <TableHead>Fecha</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                  Cargando reclamos...
                </TableCell>
              </TableRow>
            ) : filteredClaims.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                  No se encontraron reclamos.
                </TableCell>
              </TableRow>
            ) : (
              filteredClaims.map((claim) => (
                <TableRow
                  key={claim.id}
                  className="cursor-pointer hover:bg-muted/50 transition-colors"
                  onClick={() => router.push(`/claims/${claim.id}`)}
                >
                  <TableCell className="font-medium">{claim.codigo || claim.id}</TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-medium">{claim.clientName || "Sin cliente"}</span>
                      <span className="text-xs text-muted-foreground">{claim.projectName || "Sin proyecto"}</span>
                    </div>
                  </TableCell>
                  <TableCell className="max-w-[200px] truncate">{claim.description}</TableCell>
                  <TableCell>
                    <span className={PRIORITY_COLORS[claim.priority]}>{PRIORITY_LABELS[claim.priority]}</span>
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={claim.status} />
                  </TableCell>
                  <TableCell>{claim.assignedToName || "Sin asignar"}</TableCell>
                  <TableCell>{format(new Date(claim.createdAt), "dd/MM/yyyy")}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm">
                      Ver
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
