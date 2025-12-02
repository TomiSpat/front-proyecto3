"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Clock, CheckCircle2, AlertCircle, Users, TrendingUp, FileText } from "lucide-react"
import { UserRole, ClaimStatus, ClaimPriority } from "@/lib/constants"
import { useAuth } from "@/lib/auth-context"
import { api } from "@/lib/api"
import type { Claim, ClaimStatistics } from "@/lib/types"
import Link from "next/link"
import { StatusBadge } from "@/components/claims/status-badge"
import {
  Bar,
  BarChart,
  Line,
  LineChart,
  Pie,
  PieChart,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"

const CHART_COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#ec4899", "#06b6d4", "#84cc16"]

export default function DashboardPage() {
  const { user } = useAuth()
  const [claims, setClaims] = useState<Claim[]>([])
  const [statistics, setStatistics] = useState<ClaimStatistics | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadData = async () => {
      try {
        const [claimsData, statsData] = await Promise.all([api.claims.list(), api.statistics.getOverview()])
        setClaims(claimsData)
        setStatistics(statsData)
      } catch (e) {
        console.error(e)
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [])

  // Rol de auditor removido en la nueva versión

  // Calculate KPIs
  const totalClaims = claims.length
  const inProcess = claims.filter(
    (c) => c.status === ClaimStatus.IN_PROCESS || c.status === ClaimStatus.IN_REVIEW,
  ).length
  const resolved = claims.filter((c) => c.status === ClaimStatus.RESOLVED).length
  const critical = claims.filter((c) => c.priority === ClaimPriority.URGENT || c.priority === ClaimPriority.HIGH).length
  const pending = claims.filter((c) => c.status === ClaimStatus.PENDING).length
  const cancelled = claims.filter((c) => c.status === ClaimStatus.CANCELLED).length

  const kpis = [
    {
      title: "Total Reclamos",
      value: loading ? "-" : totalClaims,
      icon: FileText,
      description: "Total histórico",
      color: "text-blue-500",
    },
    {
      title: "En Proceso",
      value: loading ? "-" : inProcess,
      icon: Clock,
      description: "Requieren atención",
      color: "text-amber-500",
    },
    {
      title: "Resueltos",
      value: loading ? "-" : resolved,
      icon: CheckCircle2,
      description: "Casos cerrados",
      color: "text-green-500",
    },
    {
      title: "Críticos",
      value: loading ? "-" : critical,
      icon: AlertCircle,
      description: "Alta prioridad",
      color: "text-red-500",
    },
    {
      title: "Pendientes",
      value: loading ? "-" : pending,
      icon: TrendingUp,
      description: "Sin atender",
      color: "text-purple-500",
    },
  ]

  // Prepare chart data
  const statusChartData = statistics
    ? Object.entries(statistics.claimsByStatus).map(([status, count]) => ({
        name: status,
        value: count,
      }))
    : []

  const areaChartData = statistics
    ? Object.entries(statistics.claimsByArea).map(([area, count]) => ({
        name: area === "SoporteTecnico" ? "Soporte" : area,
        reclamos: count,
      }))
    : []

  const typeChartData = statistics
    ? Object.entries(statistics.claimsByType)
        .filter(([_, count]) => count > 0)
        .map(([type, count]) => ({
          name: type.length > 15 ? type.substring(0, 15) + "..." : type,
          value: count,
        }))
    : []

  const monthlyChartData = statistics?.claimsByMonth || []

  const agentPerformanceData = statistics?.claimsPerAgent.filter((a) => a.count > 0) || []

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        <p className="text-muted-foreground">Resumen general de actividad y rendimiento.</p>
      </div>

      {/* KPIs */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        {kpis.map((kpi, i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{kpi.title}</CardTitle>
              <kpi.icon className={`h-4 w-4 ${kpi.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{kpi.value}</div>
              <p className="text-xs text-muted-foreground">{kpi.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Statistics Card */}
      {statistics && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Métricas de Rendimiento
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="rounded-lg border p-4 text-center">
                <div className="text-3xl font-bold text-primary">{statistics.avgResolutionTimeHours}h</div>
                <p className="text-sm text-muted-foreground">Tiempo Promedio de Resolución</p>
              </div>
              <div className="rounded-lg border p-4 text-center">
                <div className="text-3xl font-bold text-green-500">
                  {Math.round((resolved / totalClaims) * 100) || 0}%
                </div>
                <p className="text-sm text-muted-foreground">Tasa de Resolución</p>
              </div>
              <div className="rounded-lg border p-4 text-center">
                <div className="text-3xl font-bold text-amber-500">{statistics.claimsPerAgent.length}</div>
                <p className="text-sm text-muted-foreground">Agentes Activos</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Charts Row 1 */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Monthly Trend */}
        <Card>
          <CardHeader>
            <CardTitle>Tendencia Mensual</CardTitle>
            <CardDescription>Reclamos recibidos por mes</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={monthlyChartData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="month" className="text-xs" />
                  <YAxis className="text-xs" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "var(--radius)",
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="count"
                    stroke="#3b82f6"
                    strokeWidth={2}
                    dot={{ fill: "#3b82f6" }}
                    name="Reclamos"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* By Area */}
        <Card>
          <CardHeader>
            <CardTitle>Reclamos por Área</CardTitle>
            <CardDescription>Distribución por departamento</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={areaChartData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis type="number" className="text-xs" />
                  <YAxis dataKey="name" type="category" width={80} className="text-xs" />
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
      </div>

      {/* Charts Row 2 */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {/* By Type - Pie Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Por Tipo de Reclamo</CardTitle>
            <CardDescription>Clasificación de reclamos</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={typeChartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={80}
                    paddingAngle={2}
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${((percent ?? 0) * 100).toFixed(0)}%`}
                    labelLine={false}
                  >
                    {typeChartData.map((_, index) => (
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
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Agent Performance */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Rendimiento por Agente
            </CardTitle>
            <CardDescription>Reclamos asignados vs resueltos</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={agentPerformanceData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="agentName" className="text-xs" />
                  <YAxis className="text-xs" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "var(--radius)",
                    }}
                  />
                  <Legend />
                  <Bar dataKey="count" name="Asignados" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="resolved" name="Resueltos" fill="#10b981" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Claims and Quick Actions */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Reclamos Recientes</CardTitle>
              <CardDescription>Últimos reclamos registrados</CardDescription>
            </div>
            <Link href="/claims" className="text-sm text-primary hover:underline">
              Ver todos
            </Link>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {loading ? (
                <div className="text-center py-4">Cargando...</div>
              ) : (
                claims.slice(0, 5).map((claim) => (
                  <Link
                    key={claim.id}
                    href={`/claims/${claim.id}`}
                    className="flex items-center justify-between border-b pb-3 last:border-0 hover:bg-accent/50 -mx-2 px-2 py-1 rounded transition-colors"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-sm">{claim.id}</span>
                        <StatusBadge status={claim.status} />
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-1">{claim.description}</p>
                      <p className="text-xs text-muted-foreground">
                        {claim.clientName} - {claim.projectName}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-muted-foreground">{new Date(claim.createdAt).toLocaleDateString()}</p>
                      <p
                        className={`text-xs font-medium ${
                          claim.priority === ClaimPriority.URGENT
                            ? "text-red-500"
                            : claim.priority === ClaimPriority.HIGH
                              ? "text-orange-500"
                              : "text-muted-foreground"
                        }`}
                      >
                        {claim.priority}
                      </p>
                    </div>
                  </Link>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Estado del Sistema</CardTitle>
            <CardDescription>Información general</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between py-2 border-b">
              <span className="text-sm text-muted-foreground">Versión</span>
              <span className="text-sm font-medium">v1.0.0</span>
            </div>
            <div className="flex items-center justify-between py-2 border-b">
              <span className="text-sm text-muted-foreground">Clientes Activos</span>
              <span className="text-sm font-medium">5</span>
            </div>
            <div className="flex items-center justify-between py-2 border-b">
              <span className="text-sm text-muted-foreground">Proyectos</span>
              <span className="text-sm font-medium">8</span>
            </div>
            <div className="flex items-center justify-between py-2">
              <span className="text-sm text-muted-foreground">Usuarios</span>
              <span className="text-sm font-medium">7</span>
            </div>
            <div className="pt-4">
              <div className="rounded-lg bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 p-3 text-center">
                <p className="text-sm font-medium text-green-800 dark:text-green-200">Sistema Operativo</p>
                <p className="text-xs text-green-600 dark:text-green-400">Todos los servicios funcionando</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
