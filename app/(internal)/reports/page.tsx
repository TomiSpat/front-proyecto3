"use client"

import { useState, useEffect, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ClaimStatus, ClaimArea, ClaimPriority, ClaimType } from "@/lib/constants"
import { StatusBadge } from "@/components/claims/status-badge"
import { Download, Filter, Calendar, BarChart3, PieChart, TrendingUp, Clock } from "lucide-react"
import { api } from "@/lib/api"
import type { Claim, Client, Project, ClaimStatistics } from "@/lib/types"
import {
  Bar,
  BarChart,
  Pie,
  PieChart as RechartsPieChart,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"
import Link from "next/link"

const CHART_COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#ec4899", "#06b6d4", "#84cc16"]

export default function ReportsPage() {
  const [claims, setClaims] = useState<Claim[]>([])
  const [clients, setClients] = useState<Client[]>([])
  const [projects, setProjects] = useState<Project[]>([])
  const [statistics, setStatistics] = useState<ClaimStatistics | null>(null)
  const [loading, setLoading] = useState(true)

  // Filters
  const [clientFilter, setClientFilter] = useState<string>("ALL")
  const [projectFilter, setProjectFilter] = useState<string>("ALL")
  const [statusFilter, setStatusFilter] = useState<string>("ALL")
  const [areaFilter, setAreaFilter] = useState<string>("ALL")
  const [typeFilter, setTypeFilter] = useState<string>("ALL")
  const [dateFrom, setDateFrom] = useState<string>("")
  const [dateTo, setDateTo] = useState<string>("")

  useEffect(() => {
    const loadData = async () => {
      try {
        const [claimsData, clientsData, projectsData, statsData] = await Promise.all([
          api.claims.list(),
          api.clients.list(),
          api.projects.list(),
          api.statistics.getOverview(),
        ])
        setClaims(claimsData)
        setClients(clientsData)
        setProjects(projectsData)
        setStatistics(statsData)
      } catch (e) {
        console.error(e)
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [])

  // Filter claims based on selected filters
  const filteredClaims = useMemo(() => {
    return claims.filter((claim) => {
      if (clientFilter !== "ALL" && claim.clientId !== clientFilter) return false
      if (projectFilter !== "ALL" && claim.projectId !== projectFilter) return false
      if (statusFilter !== "ALL" && claim.status !== statusFilter) return false
      if (areaFilter !== "ALL" && claim.area !== areaFilter) return false
      if (typeFilter !== "ALL" && claim.type !== typeFilter) return false
      if (dateFrom) {
        const claimDate = new Date(claim.createdAt)
        const fromDate = new Date(dateFrom)
        if (claimDate < fromDate) return false
      }
      if (dateTo) {
        const claimDate = new Date(claim.createdAt)
        const toDate = new Date(dateTo)
        toDate.setHours(23, 59, 59, 999)
        if (claimDate > toDate) return false
      }
      return true
    })
  }, [claims, clientFilter, projectFilter, statusFilter, areaFilter, typeFilter, dateFrom, dateTo])

  // Calculate filtered statistics
  const filteredStats = useMemo(() => {
    const total = filteredClaims.length
    const resolved = filteredClaims.filter(
      (c) => c.status === ClaimStatus.RESOLVED || c.status === ClaimStatus.CLOSED,
    ).length
    const inProcess = filteredClaims.filter(
      (c) =>
        c.status === ClaimStatus.IN_PROCESS || c.status === ClaimStatus.ASSIGNED || c.status === ClaimStatus.TRIAGE,
    ).length
    const pending = filteredClaims.filter(
      (c) => c.status === ClaimStatus.CREATED || c.status === ClaimStatus.WAITING,
    ).length

    // By status
    const byStatus = Object.values(ClaimStatus)
      .map((status) => ({
        name: status,
        value: filteredClaims.filter((c) => c.status === status).length,
      }))
      .filter((d) => d.value > 0)

    // By area
    const byArea = Object.values(ClaimArea).map((area) => ({
      name: area === "SoporteTecnico" ? "Soporte Técnico" : area,
      reclamos: filteredClaims.filter((c) => c.area === area).length,
    }))

    // By type
    const byType = Object.values(ClaimType)
      .map((type) => ({
        name: type.length > 12 ? type.substring(0, 12) + "..." : type,
        value: filteredClaims.filter((c) => c.type === type).length,
      }))
      .filter((d) => d.value > 0)

    // By priority
    const byPriority = Object.values(ClaimPriority)
      .map((priority) => ({
        name: priority,
        value: filteredClaims.filter((c) => c.priority === priority).length,
      }))
      .filter((d) => d.value > 0)

    return { total, resolved, inProcess, pending, byStatus, byArea, byType, byPriority }
  }, [filteredClaims])

  const handleExport = () => {
    const headers = [
      "ID",
      "Cliente",
      "Proyecto",
      "Titulo",
      "Tipo",
      "Prioridad",
      "Estado",
      "Area",
      "Fecha Creación",
      "Tiempo Resolución",
    ]
    const rows = filteredClaims.map((c) => {
      const resolutionTime = c.resolution
        ? `${Math.round((new Date(c.resolution.resolvedAt).getTime() - new Date(c.createdAt).getTime()) / (1000 * 60 * 60))}h`
        : "-"
      return [
        c.id,
        c.clientName,
        c.projectName,
        `"${c.title.replace(/"/g, '""')}"`,
        c.type,
        c.priority,
        c.status,
        c.area,
        new Date(c.createdAt).toLocaleDateString(),
        resolutionTime,
      ].join(",")
    })

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows].join("\n")
    const encodedUri = encodeURI(csvContent)
    const link = document.createElement("a")
    link.setAttribute("href", encodedUri)
    link.setAttribute("download", `reporte_reclamos_${new Date().toISOString().split("T")[0]}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const clearFilters = () => {
    setClientFilter("ALL")
    setProjectFilter("ALL")
    setStatusFilter("ALL")
    setAreaFilter("ALL")
    setTypeFilter("ALL")
    setDateFrom("")
    setDateTo("")
  }

  // Get projects for selected client
  const filteredProjects = clientFilter !== "ALL" ? projects.filter((p) => p.clientId === clientFilter) : projects

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Reportes</h2>
          <p className="text-muted-foreground">Análisis y exportación de datos de reclamos.</p>
        </div>
        <Button onClick={handleExport}>
          <Download className="mr-2 h-4 w-4" />
          Exportar a CSV
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Filtros Avanzados
            </CardTitle>
            <Button variant="ghost" size="sm" onClick={clearFilters}>
              Limpiar filtros
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Cliente</label>
              <Select
                value={clientFilter}
                onValueChange={(v) => {
                  setClientFilter(v)
                  setProjectFilter("ALL") // Reset project when client changes
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Todos los clientes" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">Todos</SelectItem>
                  {clients.map((client) => (
                    <SelectItem key={client.id} value={client.id}>
                      {client.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Proyecto</label>
              <Select value={projectFilter} onValueChange={setProjectFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Todos los proyectos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">Todos</SelectItem>
                  {filteredProjects.map((project) => (
                    <SelectItem key={project.id} value={project.id}>
                      {project.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Estado</label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Todos los estados" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">Todos</SelectItem>
                  {Object.values(ClaimStatus).map((status) => (
                    <SelectItem key={status} value={status}>
                      {status}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Área</label>
              <Select value={areaFilter} onValueChange={setAreaFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Todas las áreas" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">Todas</SelectItem>
                  {Object.values(ClaimArea).map((area) => (
                    <SelectItem key={area} value={area}>
                      {area}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Tipo de Reclamo</label>
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Todos los tipos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">Todos</SelectItem>
                  {Object.values(ClaimType).map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Fecha Desde</label>
              <div className="relative">
                <Calendar className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input type="date" className="pl-9" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Fecha Hasta</label>
              <div className="relative">
                <Calendar className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input type="date" className="pl-9" value={dateTo} onChange={(e) => setDateTo(e.target.value)} />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Summary Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <BarChart3 className="h-4 w-4 text-blue-500" />
              Total Filtrado
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{filteredStats.total}</div>
            <p className="text-xs text-muted-foreground">de {claims.length} total</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Clock className="h-4 w-4 text-amber-500" />
              En Proceso
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{filteredStats.inProcess}</div>
            <p className="text-xs text-muted-foreground">
              {filteredStats.total > 0 ? Math.round((filteredStats.inProcess / filteredStats.total) * 100) : 0}% del
              total
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-green-500" />
              Resueltos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{filteredStats.resolved}</div>
            <p className="text-xs text-muted-foreground">
              {filteredStats.total > 0 ? Math.round((filteredStats.resolved / filteredStats.total) * 100) : 0}% del
              total
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <PieChart className="h-4 w-4 text-purple-500" />
              Pendientes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{filteredStats.pending}</div>
            <p className="text-xs text-muted-foreground">
              {filteredStats.total > 0 ? Math.round((filteredStats.pending / filteredStats.total) * 100) : 0}% del total
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Por Área</CardTitle>
            <CardDescription>Distribución de reclamos filtrados</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={filteredStats.byArea} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis type="number" className="text-xs" />
                  <YAxis dataKey="name" type="category" width={100} className="text-xs" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "var(--radius)",
                    }}
                  />
                  <Bar dataKey="reclamos" fill="#3b82f6" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Por Tipo</CardTitle>
            <CardDescription>Clasificación de reclamos</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <RechartsPieChart>
                  <Pie
                    data={filteredStats.byType}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={80}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {filteredStats.byType.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "var(--radius)",
                    }}
                  />
                  <Legend />
                </RechartsPieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Data Table */}
      <Card>
        <CardHeader>
          <CardTitle>Detalle de Reclamos</CardTitle>
          <CardDescription>
            Mostrando {filteredClaims.length} de {claims.length} reclamos
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Cliente</TableHead>
                <TableHead>Proyecto</TableHead>
                <TableHead>Título</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Área</TableHead>
                <TableHead>Prioridad</TableHead>
                <TableHead>Fecha</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={9} className="text-center py-8">
                    Cargando...
                  </TableCell>
                </TableRow>
              ) : filteredClaims.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} className="text-center py-8 text-muted-foreground">
                    No se encontraron reclamos con los filtros aplicados
                  </TableCell>
                </TableRow>
              ) : (
                filteredClaims.map((item) => (
                  <TableRow key={item.id} className="hover:bg-accent/50">
                    <TableCell>
                      <Link href={`/claims/${item.id}`} className="font-medium text-primary hover:underline">
                        {item.id}
                      </Link>
                    </TableCell>
                    <TableCell>{item.clientName}</TableCell>
                    <TableCell className="max-w-[150px] truncate">{item.projectName}</TableCell>
                    <TableCell className="max-w-[200px] truncate">{item.title}</TableCell>
                    <TableCell className="text-xs">{item.type}</TableCell>
                    <TableCell>
                      <StatusBadge status={item.status} />
                    </TableCell>
                    <TableCell>{item.area}</TableCell>
                    <TableCell>
                      <span
                        className={`text-xs font-medium ${
                          item.priority === ClaimPriority.URGENT
                            ? "text-red-500"
                            : item.priority === ClaimPriority.HIGH
                              ? "text-orange-500"
                              : item.priority === ClaimPriority.MEDIUM
                                ? "text-blue-500"
                                : "text-slate-500"
                        }`}
                      >
                        {item.priority}
                      </span>
                    </TableCell>
                    <TableCell className="text-sm">{new Date(item.createdAt).toLocaleDateString()}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
