"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts"
import { Clock } from "lucide-react"

interface ResolutionTimeChartProps {
  data: Array<{
    tipo: string
    tiempoPromedioDias: number
    cantidadResueltos: number
  }>
  loading?: boolean
}

const TIPO_LABELS: Record<string, string> = {
  INCIDENTE: "Incidente",
  CONSULTA: "Consulta",
  MEJORA: "Mejora",
  OTRO: "Otro",
}

const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#8b5cf6"]

export function ResolutionTimeChart({ data, loading = false }: ResolutionTimeChartProps) {
  if (loading) {
    return (
      <Card>
        <CardHeader>
          <div className="h-6 w-48 bg-muted animate-pulse rounded" />
          <div className="h-4 w-64 bg-muted animate-pulse rounded mt-2" />
        </CardHeader>
        <CardContent>
          <div className="h-[300px] bg-muted animate-pulse rounded" />
        </CardContent>
      </Card>
    )
  }

  const chartData = data.map((item) => ({
    tipo: TIPO_LABELS[item.tipo] || item.tipo,
    tiempoPromedioDias: item.tiempoPromedioDias,
    cantidadResueltos: item.cantidadResueltos,
  }))

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Tiempo Promedio de Resolución
            </CardTitle>
            <CardDescription className="mt-1">
              Días promedio para resolver cada tipo de reclamo
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {data.length === 0 ? (
          <div className="h-[300px] flex items-center justify-center">
            <p className="text-sm text-muted-foreground">
              No hay datos de reclamos resueltos
            </p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis 
                dataKey="tipo" 
                className="text-xs"
                tick={{ fill: 'currentColor' }}
              />
              <YAxis 
                label={{ value: 'Días', angle: -90, position: 'insideLeft' }}
                className="text-xs"
                tick={{ fill: 'currentColor' }}
              />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="bg-background border border-border rounded-lg shadow-lg p-3">
                        <p className="font-semibold text-sm mb-1">{payload[0].payload.tipo}</p>
                        <p className="text-sm text-muted-foreground">
                          Tiempo promedio: <span className="font-medium text-foreground">
                            {payload[0].value} días
                          </span>
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          Resueltos: {payload[0].payload.cantidadResueltos}
                        </p>
                      </div>
                    )
                  }
                  return null
                }}
              />
              <Bar dataKey="tiempoPromedioDias" radius={[8, 8, 0, 0]}>
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )}
        
        {/* Leyenda con información adicional */}
        {data.length > 0 && (
          <div className="mt-4 pt-4 border-t grid grid-cols-2 md:grid-cols-4 gap-4">
            {data.map((item, index) => (
              <div key={item.tipo} className="text-center">
                <div 
                  className="w-3 h-3 rounded-full mx-auto mb-1"
                  style={{ backgroundColor: COLORS[index % COLORS.length] }}
                />
                <p className="text-xs font-medium">{TIPO_LABELS[item.tipo] || item.tipo}</p>
                <p className="text-lg font-bold">{item.tiempoPromedioDias}d</p>
                <p className="text-xs text-muted-foreground">{item.cantidadResueltos} resueltos</p>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
