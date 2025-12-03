"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts"
import { Activity } from "lucide-react"

interface StatusPieChartProps {
  data: Array<{ estado: string; cantidad: number; porcentaje: number }>
  loading?: boolean
}

const ESTADO_LABELS: Record<string, string> = {
  PENDIENTE: "Pendiente",
  EN_PROCESO: "En Proceso",
  EN_REVISION: "En Revisión",
  RESUELTO: "Resuelto",
  CANCELADO: "Cancelado",
}

const ESTADO_COLORS: Record<string, string> = {
  PENDIENTE: "#f59e0b",      // Amber/Orange
  EN_PROCESO: "#3b82f6",     // Blue
  EN_REVISION: "#8b5cf6",    // Purple
  RESUELTO: "#10b981",       // Green
  CANCELADO: "#ef4444",      // Red
}

export function StatusPieChart({ data, loading = false }: StatusPieChartProps) {
  if (loading) {
    return (
      <Card>
        <CardHeader>
          <div className="h-6 w-48 bg-muted animate-pulse rounded" />
          <div className="h-4 w-64 bg-muted animate-pulse rounded mt-2" />
        </CardHeader>
        <CardContent>
          <div className="h-[350px] bg-muted animate-pulse rounded" />
        </CardContent>
      </Card>
    )
  }

  const chartData = data.map((item) => ({
    name: ESTADO_LABELS[item.estado] || item.estado,
    value: item.cantidad,
    porcentaje: item.porcentaje,
    estado: item.estado,
  }))

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Reclamos por Estado
            </CardTitle>
            <CardDescription className="mt-1">
              Distribución de reclamos según su estado actual
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {data.length === 0 ? (
          <div className="h-[350px] flex items-center justify-center">
            <p className="text-sm text-muted-foreground">
              No hay datos disponibles
            </p>
          </div>
        ) : (
          <>
            <ResponsiveContainer width="100%" height={350}>
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={(entry: any) => `${entry.name}: ${entry.porcentaje}%`}
                  outerRadius={120}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {chartData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={ESTADO_COLORS[entry.estado] || ESTADO_COLORS.PENDIENTE} 
                    />
                  ))}
                </Pie>
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="bg-background border border-border rounded-lg shadow-lg p-3">
                          <p className="font-semibold text-sm mb-1">{payload[0].name}</p>
                          <p className="text-sm text-muted-foreground">
                            Cantidad: <span className="font-medium text-foreground">
                              {payload[0].value}
                            </span>
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Porcentaje: <span className="font-medium text-foreground">
                              {payload[0].payload.porcentaje}%
                            </span>
                          </p>
                        </div>
                      )
                    }
                    return null
                  }}
                />
                <Legend 
                  verticalAlign="bottom" 
                  height={36}
                  formatter={(value) => <span className="text-sm">{value}</span>}
                />
              </PieChart>
            </ResponsiveContainer>

            {/* Resumen numérico */}
            <div className="mt-6 pt-4 border-t grid grid-cols-2 md:grid-cols-5 gap-4">
              {data.map((item) => (
                <div key={item.estado} className="text-center p-3 rounded-lg bg-muted/50">
                  <div 
                    className="w-4 h-4 rounded-full mx-auto mb-2"
                    style={{ backgroundColor: ESTADO_COLORS[item.estado] || ESTADO_COLORS.PENDIENTE }}
                  />
                  <p className="text-xs font-medium text-muted-foreground mb-1">
                    {ESTADO_LABELS[item.estado] || item.estado}
                  </p>
                  <p className="text-2xl font-bold">{item.cantidad}</p>
                  <p className="text-xs text-muted-foreground mt-1">{item.porcentaje}%</p>
                </div>
              ))}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  )
}
