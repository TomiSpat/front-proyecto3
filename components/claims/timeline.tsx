"use client"

import type { TimelineEvent } from "@/lib/types"
import { UserRole, ClaimStatus, STATUS_LABELS, AREA_LABELS } from "@/lib/constants"
import { TimelineEventType } from "@/lib/types"
import { Circle, CheckCircle2, ArrowRight, Users, MapPin, User, Calendar, MessageSquare, FileText } from "lucide-react"
import { format } from "date-fns"
import { es } from "date-fns/locale"
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
    return isNaN(d.getTime()) ? "" : format(d, "dd/MM/yyyy HH:mm", { locale: es })
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
                <div className="flex flex-col gap-1.5 w-full">
                  {/* Header: Título y Fecha */}
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <span className="text-sm font-semibold text-foreground">
                      {getEventTitle(event)}
                    </span>
                    {event.fecha && (
                      <span className="text-xs text-muted-foreground flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {formatDate(event.fecha)}
                      </span>
                    )}
                  </div>

                  {/* Usuario que realizó el cambio */}
                  {event.usuarioNombre && (
                    <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                      <User className="h-3.5 w-3.5" />
                      <span>Realizado por: <span className="font-medium text-foreground">{event.usuarioNombre}</span></span>
                    </div>
                  )}

                  {/* Cambio de ESTADO */}
                  {event.tipoCambio === TimelineEventType.ESTADO && (event.estadoAnterior || event.estadoNuevo) && (
                    <div className="mt-2 flex items-center gap-2 text-sm bg-blue-50 dark:bg-blue-950 p-2.5 rounded-md w-fit border border-blue-200 dark:border-blue-800">
                      <span className={event.estadoAnterior ? "line-through text-muted-foreground" : "text-muted-foreground"}>
                        {event.estadoAnterior ? STATUS_LABELS[event.estadoAnterior] || event.estadoAnterior : "Sin estado"}
                      </span>
                      <ArrowRight className="h-4 w-4 text-blue-500" />
                      <span className="font-semibold text-blue-700 dark:text-blue-300">
                        {event.estadoNuevo ? STATUS_LABELS[event.estadoNuevo] || event.estadoNuevo : "N/A"}
                      </span>
                    </div>
                  )}

                  {/* Cambio de ÁREA */}
                  {event.tipoCambio === TimelineEventType.AREA && (event.areaAnterior || event.areaNueva) && (
                    <div className="mt-2 space-y-2">
                      <div className="flex items-center gap-2 text-sm bg-purple-50 dark:bg-purple-950 p-2.5 rounded-md w-fit border border-purple-200 dark:border-purple-800">
                        <MapPin className="h-4 w-4 text-purple-500" />
                        <span className={event.areaAnterior ? "line-through text-muted-foreground" : "text-muted-foreground"}>
                          {event.areaAnterior ? AREA_LABELS[event.areaAnterior] || event.areaAnterior : "Sin área"}
                        </span>
                        <ArrowRight className="h-4 w-4 text-purple-500" />
                        <span className="font-semibold text-purple-700 dark:text-purple-300">
                          {event.areaNueva ? AREA_LABELS[event.areaNueva] || event.areaNueva : "N/A"}
                        </span>
                      </div>
                      {/* Mostrar responsable asignado si vino con el cambio de área */}
                      {event.responsableNuevoNombre && (
                        <div className="flex items-center gap-2 text-sm bg-orange-50 dark:bg-orange-950 p-2.5 rounded-md w-fit border border-orange-200 dark:border-orange-800">
                          <User className="h-4 w-4 text-orange-500" />
                          <span className="text-muted-foreground">Responsable:</span>
                          <span className="font-semibold text-orange-700 dark:text-orange-300">
                            {event.responsableNuevoNombre}
                          </span>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Cambio de RESPONSABLE */}
                  {event.tipoCambio === TimelineEventType.RESPONSABLE && (event.responsableAnteriorNombre || event.responsableNuevoNombre) && (
                    <div className="mt-2 space-y-2">
                      <div className="flex items-center gap-2 text-sm bg-orange-50 dark:bg-orange-950 p-2.5 rounded-md w-fit border border-orange-200 dark:border-orange-800">
                        <Users className="h-4 w-4 text-orange-500" />
                        <span className={event.responsableAnteriorNombre ? "line-through text-muted-foreground" : "text-muted-foreground"}>
                          {event.responsableAnteriorNombre || "Sin asignar"}
                        </span>
                        <ArrowRight className="h-4 w-4 text-orange-500" />
                        <span className="font-semibold text-orange-700 dark:text-orange-300">
                          {event.responsableNuevoNombre || "N/A"}
                        </span>
                      </div>
                      {/* Mostrar área si cambió junto con el responsable */}
                      {event.areaNueva && event.areaAnterior !== event.areaNueva && (
                        <div className="flex items-center gap-2 text-sm bg-purple-50 dark:bg-purple-950 p-2.5 rounded-md w-fit border border-purple-200 dark:border-purple-800">
                          <MapPin className="h-4 w-4 text-purple-500" />
                          <span className="line-through text-muted-foreground">
                            {event.areaAnterior ? AREA_LABELS[event.areaAnterior] || event.areaAnterior : "Sin área"}
                          </span>
                          <ArrowRight className="h-4 w-4 text-purple-500" />
                          <span className="font-semibold text-purple-700 dark:text-purple-300">
                            {AREA_LABELS[event.areaNueva] || event.areaNueva}
                          </span>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Información adicional */}
                  <div className="mt-2 space-y-1.5">
                    {/* Área responsable (contexto) - solo si hay, no es cambio de área, y no se mostró ya en cambio de responsable */}
                    {event.areaResponsable && 
                     event.tipoCambio !== TimelineEventType.AREA && 
                     !(event.tipoCambio === TimelineEventType.RESPONSABLE && event.areaNueva) && (
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <MapPin className="h-3 w-3" />
                        <span>Área: <span className="font-medium">{AREA_LABELS[event.areaResponsable] || event.areaResponsable}</span></span>
                      </div>
                    )}

                    {/* Nuevo responsable asignado - mostrar en cambios de estado si hay */}
                    {event.tipoCambio === TimelineEventType.ESTADO && event.responsableNuevoNombre && (
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <User className="h-3 w-3" />
                        <span>Responsable asignado: <span className="font-medium">{event.responsableNuevoNombre}</span></span>
                      </div>
                    )}
                  </div>

                  {/* Motivo del cambio */}
                  {event.motivoCambio && (
                    <div className="mt-2 text-sm bg-amber-50 dark:bg-amber-950 p-2.5 rounded-md border border-amber-200 dark:border-amber-800">
                      <div className="flex items-start gap-2">
                        <MessageSquare className="h-4 w-4 text-amber-600 mt-0.5 flex-shrink-0" />
                        <div>
                          <span className="font-medium text-amber-800 dark:text-amber-200">Motivo:</span>
                          <p className="text-amber-700 dark:text-amber-300">{event.motivoCambio}</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Observaciones */}
                  {event.observaciones && (
                    <div className="mt-2 text-sm bg-slate-50 dark:bg-slate-900 p-2.5 rounded-md border border-slate-200 dark:border-slate-700">
                      <div className="flex items-start gap-2">
                        <FileText className="h-4 w-4 text-slate-500 mt-0.5 flex-shrink-0" />
                        <div>
                          <span className="font-medium text-slate-700 dark:text-slate-300">Observaciones:</span>
                          <p className="text-slate-600 dark:text-slate-400">{event.observaciones}</p>
                        </div>
                      </div>
                    </div>
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
