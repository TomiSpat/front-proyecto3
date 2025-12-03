"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { StatsSummary } from "@/components/statistics/stats-summary"
import { AreaPieChart } from "@/components/statistics/area-pie-chart"
import { ResolutionTimeChart } from "@/components/statistics/resolution-time-chart"
import { StatusPieChart } from "@/components/statistics/status-pie-chart"
import { api } from "@/lib/api"
import { useToast } from "@/components/ui/use-toast"
import { CalendarIcon, RefreshCw } from "lucide-react"

export default function StatisticsPage() {
  const { toast } = useToast()
  const [loading, setLoading] = useState(true)
  const [loadingWorkload, setLoadingWorkload] = useState(true)
  const [loadingResolution, setLoadingResolution] = useState(true)
  const [loadingStatus, setLoadingStatus] = useState(true)
  
  const [stats, setStats] = useState({
    totalReclamos: 0,
    tasaResolucion: 0,
    tasaCancelacion: 0,
  })
  
  const [workloadData, setWorkloadData] = useState({
    porArea: [] as Array<{ area: string; cantidad: number; porcentaje: number }>,
  })

  const [resolutionData, setResolutionData] = useState<Array<{
    tipo: string
    tiempoPromedioDias: number
    cantidadResueltos: number
  }>>([])

  const [statusData, setStatusData] = useState<Array<{
    estado: string
    cantidad: number
    porcentaje: number
  }>>([])
  
  // Filtros
  const [fechaInicio, setFechaInicio] = useState("")
  const [fechaFin, setFechaFin] = useState("")
  const [areaFiltro, setAreaFiltro] = useState("ALL")

  const loadStats = async () => {
    try {
      setLoading(true)
      const data = await api.statistics.getResumen(
        fechaInicio || undefined,
        fechaFin || undefined
      )
      setStats(data)
    } catch (error) {
      console.error(error)
      toast({
        title: "Error",
        description: "No se pudieron cargar las estadísticas",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const loadWorkload = async () => {
    try {
      setLoadingWorkload(true)
      const data = await api.statistics.getCargaTrabajo(
        fechaInicio || undefined,
        fechaFin || undefined,
        areaFiltro === "ALL" ? undefined : areaFiltro
      )
      setWorkloadData(data)
    } catch (error) {
      console.error(error)
      toast({
        title: "Error",
        description: "No se pudo cargar la carga de trabajo",
        variant: "destructive",
      })
    } finally {
      setLoadingWorkload(false)
    }
  }

  const loadResolutionTime = async () => {
    try {
      setLoadingResolution(true)
      const data = await api.statistics.getTiempoResolucion()
      setResolutionData(data)
    } catch (error) {
      console.error(error)
      toast({
        title: "Error",
        description: "No se pudo cargar el tiempo de resolución",
        variant: "destructive",
      })
    } finally {
      setLoadingResolution(false)
    }
  }

  const loadStatusData = async () => {
    try {
      setLoadingStatus(true)
      const data = await api.statistics.getReclamosPorEstado(
        fechaInicio || undefined,
        fechaFin || undefined
      )
      setStatusData(data)
    } catch (error) {
      console.error(error)
      toast({
        title: "Error",
        description: "No se pudo cargar la distribución por estado",
        variant: "destructive",
      })
    } finally {
      setLoadingStatus(false)
    }
  }

  useEffect(() => {
    loadStats()
    loadWorkload()
    loadResolutionTime()
    loadStatusData()
  }, [])

  const handleApplyFilters = () => {
    loadStats()
    loadWorkload()
    loadStatusData()
  }

  const handleClearFilters = () => {
    setFechaInicio("")
    setFechaFin("")
    setAreaFiltro("ALL")
    setTimeout(() => {
      loadStats()
      loadWorkload()
      loadStatusData()
    }, 100)
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Estadísticas</h2>
        <p className="text-muted-foreground">
          Análisis y métricas de rendimiento del sistema de reclamos
        </p>
      </div>

      {/* Filtros */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CalendarIcon className="h-5 w-5" />
            Filtros
          </CardTitle>
          <CardDescription>
            Selecciona filtros para personalizar las estadísticas
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 space-y-2">
                <Label htmlFor="fechaInicio">Fecha de Inicio</Label>
                <Input
                  id="fechaInicio"
                  type="date"
                  value={fechaInicio}
                  onChange={(e) => setFechaInicio(e.target.value)}
                />
              </div>
              <div className="flex-1 space-y-2">
                <Label htmlFor="fechaFin">Fecha de Fin</Label>
                <Input
                  id="fechaFin"
                  type="date"
                  value={fechaFin}
                  onChange={(e) => setFechaFin(e.target.value)}
                />
              </div>
              <div className="flex-1 space-y-2">
                <Label htmlFor="area">Área (para carga de trabajo)</Label>
                <Select value={areaFiltro} onValueChange={setAreaFiltro}>
                  <SelectTrigger id="area">
                    <SelectValue placeholder="Todas las áreas" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ALL">Todas las áreas</SelectItem>
                    <SelectItem value="VENTAS">Ventas</SelectItem>
                    <SelectItem value="SOPORTE_TECNICO">Soporte Técnico</SelectItem>
                    <SelectItem value="FACTURACION">Facturación</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex gap-2">
              <Button onClick={handleApplyFilters} disabled={loading || loadingWorkload || loadingStatus}>
                <RefreshCw className={`h-4 w-4 mr-2 ${(loading || loadingWorkload || loadingStatus) ? 'animate-spin' : ''}`} />
                Aplicar Filtros
              </Button>
              <Button 
                variant="outline" 
                onClick={handleClearFilters}
                disabled={loading || loadingWorkload || loadingStatus || (!fechaInicio && !fechaFin && areaFiltro === "ALL")}
              >
                Limpiar
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Resumen de Estadísticas */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Resumen General</h3>
        <StatsSummary
          totalReclamos={stats.totalReclamos}
          tasaResolucion={stats.tasaResolucion}
          tasaCancelacion={stats.tasaCancelacion}
          loading={loading}
        />
      </div>

      {/* Información adicional */}
      {!loading && (fechaInicio || fechaFin || (areaFiltro && areaFiltro !== "ALL")) && (
        <Card className="bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800">
          <CardContent className="pt-6">
            <p className="text-sm text-blue-800 dark:text-blue-200">
              📊 Filtros activos: 
              {fechaInicio && fechaFin && ` Período: ${new Date(fechaInicio).toLocaleDateString()} - ${new Date(fechaFin).toLocaleDateString()}`}
              {fechaInicio && !fechaFin && ` Desde: ${new Date(fechaInicio).toLocaleDateString()}`}
              {!fechaInicio && fechaFin && ` Hasta: ${new Date(fechaFin).toLocaleDateString()}`}
              {areaFiltro && areaFiltro !== "ALL" && ` | Área: ${areaFiltro}`}
            </p>
          </CardContent>
        </Card>
      )}

      {/* Carga de Trabajo por Área */}
      <div>
        <AreaPieChart
          data={workloadData.porArea}
          loading={loadingWorkload}
        />
      </div>

      {/* Reclamos por Estado */}
      <div>
        <StatusPieChart
          data={statusData}
          loading={loadingStatus}
        />
      </div>
      
      {/* Tiempo de Resolución */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Tiempo de Resolución por Tipo</h3>
        <ResolutionTimeChart
          data={resolutionData}
          loading={loadingResolution}
        />
      </div>
    </div>   
  )
}
