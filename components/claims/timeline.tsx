"use client"

import type { TimelineEvent } from "@/lib/types"
import { UserRole, ClaimStatus, STATUS_LABELS } from "@/lib/constants"
import { Circle, CheckCircle2, ArrowRight } from "lucide-react"
import { format } from "date-fns"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface TimelineProps {
  events: TimelineEvent[]
  currentUserRole: UserRole
}

export function ClaimTimeline({ events, currentUserRole }: TimelineProps) {
  // Determinar el tipo de evento basado en los campos
  const getEventType = (event: TimelineEvent): string => {
    if (event.estadoNuevo === ClaimStatus.RESOLVED) return "RESOLVED"
    if (event.estadoNuevo === ClaimStatus.CANCELLED) return "CANCELLED"
    if (event.estadoAnterior && event.estadoNuevo) return "STATUS_CHANGE"
    return "STATUS_CHANGE"
  }

  // Formatear fecha de forma segura
  const formatDate = (fecha: string | undefined): string => {
    if (!fecha) return ""
    const d = new Date(fecha)
    return isNaN(d.getTime()) ? "" : format(d, "dd/MM/yyyy HH:mm")
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">Historial de Cambios de Estado</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative border-l border-muted ml-3 space-y-6 pb-4 mt-4">
          {events.length === 0 && (
            <p className="text-sm text-muted-foreground pl-4">No hay historial de cambios.</p>
          )}
          {events.map((event) => {
            const eventType = getEventType(event)
            const isResolved = eventType === "RESOLVED"
            const isCancelled = eventType === "CANCELLED"

            return (
              <div key={event.id} className="relative flex items-start pl-8">
                <div className="absolute -left-[9px] top-0 bg-background">
                  {isResolved ? (
                    <CheckCircle2 className="h-5 w-5 text-green-500" />
                  ) : isCancelled ? (
                    <Circle className="h-5 w-5 text-gray-400" />
                  ) : (
                    <Circle className="h-5 w-5 text-blue-500" />
                  )}
                </div>
                <div className="flex flex-col gap-1 w-full">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-foreground">
                      Cambio de Estado
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {formatDate(event.fecha)}
                    </span>
                  </div>

                  {event.usuarioNombre && (
                    <p className="text-sm text-muted-foreground">
                      Por <span className="font-medium text-foreground">{event.usuarioNombre}</span>
                    </p>
                  )}

                  {/* Estado anterior -> nuevo */}
                  {(event.estadoAnterior || event.estadoNuevo) && (
                    <div className="mt-2 flex items-center gap-2 text-sm bg-muted/50 p-2 rounded-md w-fit">
                      <span className="line-through text-muted-foreground">
                        {event.estadoAnterior ? STATUS_LABELS[event.estadoAnterior] || event.estadoAnterior : "N/A"}
                      </span>
                      <ArrowRight className="h-3 w-3 text-muted-foreground" />
                      <span className="font-medium">
                        {event.estadoNuevo ? STATUS_LABELS[event.estadoNuevo] || event.estadoNuevo : "N/A"}
                      </span>
                    </div>
                  )}

                  {/* Área responsable */}
                  {event.areaResponsable && (
                    <p className="text-xs text-muted-foreground">
                      Área: <span className="font-medium">{event.areaResponsable}</span>
                    </p>
                  )}

                  {/* Motivo del cambio */}
                  {event.motivoCambio && (
                    <p className="mt-1 text-sm text-foreground bg-slate-50 dark:bg-slate-900 p-2 rounded border">
                      <span className="font-medium">Motivo:</span> {event.motivoCambio}
                    </p>
                  )}

                  {/* Observaciones */}
                  {event.observaciones && (
                    <p className="text-sm text-muted-foreground italic">
                      {event.observaciones}
                    </p>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
