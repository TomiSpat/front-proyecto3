"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts"
import { Briefcase } from "lucide-react"

interface AreaPieChartProps {
  data: Array<{ area: string; cantidad: number; porcentaje: number }>
  loading?: boolean
}

const AREA_LABELS: Record<string, string> = {
  VENTAS: "Ventas",
  SOPORTE_TECNICO: "Soporte Técnico",
  FACTURACION: "Facturación",
}

const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#8b5cf6", "#ec4899"]

export function AreaPieChart({ data, loading = false }: AreaPieChartProps) {
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
    name: AREA_LABELS[item.area] || item.area,
    value: item.cantidad,
    porcentaje: item.porcentaje,
  }))

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Briefcase className="h-5 w-5" />
              Carga de Trabajo por Área
            </CardTitle>
            <CardDescription className="mt-1">
              Distribución de reclamos entre las diferentes áreas
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
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
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
            <div className="mt-6 pt-4 border-t grid grid-cols-1 md:grid-cols-3 gap-4">
              {data.map((item, index) => (
                <div key={item.area} className="text-center p-3 rounded-lg bg-muted/50">
                  <div 
                    className="w-4 h-4 rounded-full mx-auto mb-2"
                    style={{ backgroundColor: COLORS[index % COLORS.length] }}
                  />
                  <p className="text-xs font-medium text-muted-foreground mb-1">
                    {AREA_LABELS[item.area] || item.area}
                  </p>
                  <p className="text-2xl font-bold">{item.cantidad}</p>
                  <p className="text-xs text-muted-foreground mt-1">{item.porcentaje}% del total</p>
                </div>
              ))}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  )
}
