"use client"

import { useState } from "react"
import type { TimelineEvent } from "@/lib/types"
import { UserRole } from "@/lib/constants"
import { Circle, CheckCircle2, AlertCircle, ArrowRight, Filter } from "lucide-react"
import { format } from "date-fns"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface TimelineProps {
  events: TimelineEvent[]
  currentUserRole: UserRole
}

export function ClaimTimeline({ events, currentUserRole }: TimelineProps) {
  // Filter state
  const [activeFilters, setActiveFilters] = useState<string[]>(["ALL"])

  const toggleFilter = (type: string) => {
    if (type === "ALL") {
      setActiveFilters(["ALL"])
      return
    }

    let newFilters = [...activeFilters]
    if (newFilters.includes("ALL")) {
      newFilters = []
    }

    if (newFilters.includes(type)) {
      newFilters = newFilters.filter((t) => t !== type)
    } else {
      newFilters.push(type)
    }

    if (newFilters.length === 0) {
      setActiveFilters(["ALL"])
    } else {
      setActiveFilters(newFilters)
    }
  }

  // Filter internal events for clients
  const baseEvents =
    currentUserRole === UserRole.CLIENT
      ? events.filter((e) => ["STATUS_CHANGE", "CREATION", "COMMENT", "RESOLVED", "CLOSED"].includes(e.type))
      : events

  // Apply UI filters
  const visibleEvents = baseEvents.filter((e) => {
    if (activeFilters.includes("ALL")) return true
    return activeFilters.includes(e.type)
  })

  const filterOptions = [
    { label: "Todos", value: "ALL" },
    { label: "Estados", value: "STATUS_CHANGE" },
    { label: "Áreas", value: "AREA_CHANGE" },
    { label: "Asignaciones", value: "ASSIGNMENT_CHANGE" },
  ]

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Historial de Actividad</CardTitle>
          <Filter className="h-4 w-4 text-muted-foreground" />
        </div>
        {/* Filter Chips */}
        <div className="flex flex-wrap gap-2 mt-2">
          {filterOptions.map((option) => (
            <Badge
              key={option.value}
              variant={activeFilters.includes(option.value) ? "default" : "outline"}
              className="cursor-pointer"
              onClick={() => toggleFilter(option.value)}
            >
              {option.label}
            </Badge>
          ))}
        </div>
      </CardHeader>
      <CardContent>
        <div className="relative border-l border-muted ml-3 space-y-8 pb-4 mt-4">
          {visibleEvents.length === 0 && (
            <p className="text-sm text-muted-foreground pl-4">No hay eventos que coincidan con los filtros.</p>
          )}
          {visibleEvents.map((event, idx) => (
            <div key={event.id} className="relative flex items-start pl-8">
              <div className="absolute -left-[9px] top-0 bg-background">
                {event.type === "RESOLVED" || event.type === "CLOSED" ? (
                  <CheckCircle2 className="h-5 w-5 text-green-500" />
                ) : event.type === "ESCALATED" ? (
                  <AlertCircle className="h-5 w-5 text-orange-500" />
                ) : (
                  <Circle className="h-5 w-5 text-muted-foreground" />
                )}
              </div>
              <div className="flex flex-col gap-1 w-full">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-foreground">
                    {event.type === "STATUS_CHANGE"
                      ? "Cambio de Estado"
                      : event.type === "AREA_CHANGE"
                        ? "Cambio de Área"
                        : event.type === "ASSIGNMENT_CHANGE"
                          ? "Reasignación"
                          : event.type === "CREATION"
                            ? "Reclamo Creado"
                            : event.type === "RESOLVED"
                              ? "Resuelto"
                              : event.type === "CLOSED"
                                ? "Cerrado"
                                : "Comentario"}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {format(new Date(event.timestamp), "dd/MM/yyyy HH:mm")}
                  </span>
                </div>

                <p className="text-sm text-muted-foreground">
                  Por <span className="font-medium text-foreground">{event.userName}</span> ({event.userRole})
                </p>

                {/* Diff View */}
                {(event.previousValue || event.newValue) && (
                  <div className="mt-2 flex items-center gap-2 text-sm bg-muted/50 p-2 rounded-md w-fit">
                    <span className="line-through text-muted-foreground">{event.previousValue || "N/A"}</span>
                    <ArrowRight className="h-3 w-3 text-muted-foreground" />
                    <span className="font-medium">{event.newValue}</span>
                  </div>
                )}

                {event.details && (
                  <p className="mt-1 text-sm text-foreground bg-slate-50 p-2 rounded border">{event.details}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
