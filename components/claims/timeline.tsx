"use client"

import type { TimelineEvent } from "@/lib/types"
import { UserRole, ClaimStatus, STATUS_LABELS, AREA_LABELS } from "@/lib/constants"
import { TimelineEventType } from "@/lib/types"
import { Circle, CheckCircle2, ArrowRight, Users, MapPin } from "lucide-react"
import { format } from "date-fns"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface TimelineProps {
  events: TimelineEvent[]
  currentUserRole: UserRole
}

export function ClaimTimeline({ events, currentUserRole }: TimelineProps) {
  // Determinar el estilo del icono basado en el tipo de cambio
  const getEventIcon = (event: TimelineEvent) => {
    if (event.tipoCambio === TimelineEventType.ESTADO) {
      if (event.estadoNuevo === ClaimStatus.RESOLVED) {
        return <CheckCircle2 className="h-5 w-5 text-green-500" />
      }
      if (event.estadoNuevo === ClaimStatus.CANCELLED) {
        return <Circle className="h-5 w-5 text-gray-400" />
      }
      return <Circle className="h-5 w-5 text-blue-500" />
    }
    if (event.tipoCambio === TimelineEventType.AREA) {
      return <MapPin className="h-5 w-5 text-purple-500" />
    }
    if (event.tipoCambio === TimelineEventType.RESPONSABLE) {
      return <Users className="h-5 w-5 text-orange-500" />
    }
    return <Circle className="h-5 w-5 text-blue-500" />
  }

  // Obtener el título del evento
  const getEventTitle = (event: TimelineEvent): string => {
    if (event.tipoCambio === TimelineEventType.ESTADO) return "Cambio de Estado"
    if (event.tipoCambio === TimelineEventType.AREA) return "Cambio de Área"
    if (event.tipoCambio === TimelineEventType.RESPONSABLE) return "Cambio de Responsable"
    return "Cambio"
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
        <CardTitle className="text-lg">Historial de Cambios</CardTitle>
        <p className="text-sm text-muted-foreground">Estados, áreas y responsables</p>
      </CardHeader>
      <CardContent>
        <div className="relative border-l border-muted ml-3 space-y-6 pb-4 mt-4">
          {events.length === 0 && (
            <p className="text-sm text-muted-foreground pl-4">No hay historial de cambios.</p>
          )}
          {events.map((event) => {
            return (
              <div key={event.id} className="relative flex items-start pl-8">
                <div className="absolute -left-[9px] top-0 bg-background">
                  {getEventIcon(event)}
                </div>
                <div className="flex flex-col gap-1 w-full">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-foreground">
                      {getEventTitle(event)}
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

                  {/* Cambio de ESTADO */}
                  {event.tipoCambio === TimelineEventType.ESTADO && (event.estadoAnterior || event.estadoNuevo) && (
                    <div className="mt-2 flex items-center gap-2 text-sm bg-blue-50 dark:bg-blue-950 p-2 rounded-md w-fit border border-blue-200 dark:border-blue-800">
                      <span className="line-through text-muted-foreground">
                        {event.estadoAnterior ? STATUS_LABELS[event.estadoAnterior] || event.estadoAnterior : "N/A"}
                      </span>
                      <ArrowRight className="h-3 w-3 text-muted-foreground" />
                      <span className="font-medium">
                        {event.estadoNuevo ? STATUS_LABELS[event.estadoNuevo] || event.estadoNuevo : "N/A"}
                      </span>
                    </div>
                  )}

                  {/* Cambio de ÁREA */}
                  {event.tipoCambio === TimelineEventType.AREA && (event.areaAnterior || event.areaNueva) && (
                    <div className="mt-2 flex items-center gap-2 text-sm bg-purple-50 dark:bg-purple-950 p-2 rounded-md w-fit border border-purple-200 dark:border-purple-800">
                      <span className="line-through text-muted-foreground">
                        {event.areaAnterior ? AREA_LABELS[event.areaAnterior] || event.areaAnterior : "Sin asignar"}
                      </span>
                      <ArrowRight className="h-3 w-3 text-muted-foreground" />
                      <span className="font-medium">
                        {event.areaNueva ? AREA_LABELS[event.areaNueva] || event.areaNueva : "N/A"}
                      </span>
                    </div>
                  )}

                  {/* Cambio de RESPONSABLE */}
                  {event.tipoCambio === TimelineEventType.RESPONSABLE && (event.responsableAnteriorNombre || event.responsableNuevoNombre) && (
                    <div className="mt-2 flex items-center gap-2 text-sm bg-orange-50 dark:bg-orange-950 p-2 rounded-md w-fit border border-orange-200 dark:border-orange-800">
                      <span className="line-through text-muted-foreground">
                        {event.responsableAnteriorNombre || "Sin asignar"}
                      </span>
                      <ArrowRight className="h-3 w-3 text-muted-foreground" />
                      <span className="font-medium">
                        {event.responsableNuevoNombre || "N/A"}
                      </span>
                    </div>
                  )}

                  {/* Área responsable (contexto) */}
                  {event.areaResponsable && event.tipoCambio !== TimelineEventType.AREA && (
                    <p className="text-xs text-muted-foreground">
                      Área: <span className="font-medium">{AREA_LABELS[event.areaResponsable] || event.areaResponsable}</span>
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
