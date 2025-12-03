"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp, TrendingDown, FileText } from "lucide-react"

interface StatsSummaryProps {
  totalReclamos: number
  tasaResolucion: number
  tasaCancelacion: number
  loading?: boolean
}

export function StatsSummary({ 
  totalReclamos, 
  tasaResolucion, 
  tasaCancelacion,
  loading = false 
}: StatsSummaryProps) {
  if (loading) {
    return (
      <div className="grid gap-4 md:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                <div className="h-4 w-24 bg-muted animate-pulse rounded" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-8 w-16 bg-muted animate-pulse rounded" />
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className="grid gap-4 md:grid-cols-3">
      {/* Total de Reclamos */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total de Reclamos</CardTitle>
          <FileText className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalReclamos}</div>
          <p className="text-xs text-muted-foreground mt-1">
            Reclamos recibidos en el período
          </p>
        </CardContent>
      </Card>

      {/* Tasa de Resolución */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Tasa de Resolución</CardTitle>
          <TrendingUp className="h-4 w-4 text-green-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-600">{tasaResolucion}%</div>
          <p className="text-xs text-muted-foreground mt-1">
            Reclamos resueltos exitosamente
          </p>
        </CardContent>
      </Card>

      {/* Tasa de Cancelación */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Tasa de Cancelación</CardTitle>
          <TrendingDown className="h-4 w-4 text-red-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-red-600">{tasaCancelacion}%</div>
          <p className="text-xs text-muted-foreground mt-1">
            Reclamos cancelados
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
