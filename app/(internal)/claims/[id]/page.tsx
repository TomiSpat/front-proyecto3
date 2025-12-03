"use client"
import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { StatusBadge } from "@/components/claims/status-badge"
import { ClaimTimeline } from "@/components/claims/timeline"
import { ClaimStatus, ClaimPriority, UserRole, ClaimArea, STATUS_ALLOWED_ACTIONS, STATUS_LABELS, TRANSITION_REQUIREMENTS, AREA_LABELS } from "@/lib/constants"
import { ArrowLeft, Save, AlertTriangle, CheckCircle2 } from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import { api } from "@/lib/api"
import type { Claim, TimelineEvent, User } from "@/lib/types"
import { useToast } from "@/components/ui/use-toast"

export default function ClaimDetailPage() {
  const { id } = useParams()
  const router = useRouter()
  const { user } = useAuth()
  const { toast } = useToast()

  const [claim, setClaim] = useState<Claim | null>(null)
  const [events, setEvents] = useState<TimelineEvent[]>([])
  const [agents, setAgents] = useState<User[]>([])
  const [loading, setLoading] = useState(true)

  // Edit State
  const [area, setArea] = useState<ClaimArea | "">("")
  const [assignedToId, setAssignedToId] = useState<string>("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  // State Change Form
  const [selectedNewStatus, setSelectedNewStatus] = useState<ClaimStatus | "">("")
  const [motivoCambio, setMotivoCambio] = useState("")
  const [observaciones, setObservaciones] = useState("")
  const [resolutionSummary, setResolutionSummary] = useState("")
  const [showStateChangeForm, setShowStateChangeForm] = useState(false)

  useEffect(() => {
    const loadData = async () => {
      if (!id) return
      try {
        setLoading(true)
        const [claimData, eventsData, agentsData] = await Promise.all([
          api.claims.get(id as string),
          api.timeline.getByClaimId(id as string),
          api.users.listAgents(),
        ])

        if (claimData) {
          setClaim(claimData)
          setArea(claimData.area || "")
          setAssignedToId(claimData.assignedToId || "Unassigned")
          setResolutionSummary(claimData.resolutionSummary || "")
        }
        setEvents(eventsData)
        setAgents(agentsData)
      } catch (error) {
        console.error(error)
        toast({ title: "Error", description: "No se pudo cargar el reclamo", variant: "destructive" })
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [id, toast])

  if (!user || loading) return <div className="p-8 text-center">Cargando detalles...</div>
  if (!claim) return <div className="p-8 text-center">Reclamo no encontrado</div>

  const canEdit = [UserRole.ADMIN, UserRole.COORDINATOR, UserRole.AGENT].includes(user.role)
  const statusActions = STATUS_ALLOWED_ACTIONS[claim.status]

  // Cambiar estado usando el patrón State del backend
  const handleChangeStatus = async () => {
    if (!selectedNewStatus) {
      toast({ title: "Error", description: "Selecciona un nuevo estado", variant: "destructive" })
      return
    }
    
    // Validar requisitos según el estado destino
    if (selectedNewStatus === ClaimStatus.IN_PROCESS) {
      if (!area && assignedToId === "Unassigned") {
        toast({ title: "Error", description: "Para pasar a En Proceso, debe asignar un área o responsable", variant: "destructive" })
        return
      }
    }
    
    if (selectedNewStatus === ClaimStatus.IN_REVIEW) {
      if (!observaciones.trim() && !resolutionSummary.trim()) {
        toast({ title: "Error", description: "Para pasar a En Revisión, debe proporcionar observaciones o resumen de resolución", variant: "destructive" })
        return
      }
    }
    
    if (selectedNewStatus === ClaimStatus.RESOLVED) {
      if (!resolutionSummary.trim() || resolutionSummary.length < 20) {
        toast({ title: "Error", description: "El resumen de resolución debe tener al menos 20 caracteres", variant: "destructive" })
        return
      }
    }
    
    if (selectedNewStatus === ClaimStatus.CANCELLED || 
        (claim.status === ClaimStatus.RESOLVED && selectedNewStatus === ClaimStatus.IN_PROCESS)) {
      if (!motivoCambio.trim() || motivoCambio.length < 10) {
        toast({ title: "Error", description: "Debe proporcionar un motivo (mínimo 10 caracteres)", variant: "destructive" })
        return
      }
    }

    setIsSubmitting(true)
    try {
      const updatedClaim = await api.claimStatus.changeStatus(claim.id, {
        nuevoEstado: selectedNewStatus,
        motivoCambio: motivoCambio.trim() || undefined,
        observaciones: observaciones.trim() || undefined,
        areaResponsable: area as ClaimArea || undefined,
        responsableId: assignedToId !== "Unassigned" ? assignedToId : undefined,
        resumenResolucion: resolutionSummary.trim() || undefined,
      })
      
      setClaim(updatedClaim)
      const newEvents = await api.timeline.getByClaimId(claim.id)
      setEvents(newEvents)
      
      // Limpiar formulario
      setSelectedNewStatus("")
      setMotivoCambio("")
      setObservaciones("")
      setShowStateChangeForm(false)
      
      toast({ title: "Éxito", description: `Estado cambiado a ${STATUS_LABELS[selectedNewStatus]}` })
    } catch (error: any) {
      toast({ 
        title: "Error", 
        description: error.message || "No se pudo cambiar el estado", 
        variant: "destructive" 
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  // Guardar cambios de asignación (sin cambiar estado)
  const handleSaveAssignment = async () => {
    if (!statusActions.canReassign) {
      toast({ title: "Error", description: "No se puede reasignar en este estado", variant: "destructive" })
      return
    }
    
    setIsSubmitting(true)
    try {
      // Si el reclamo está pendiente y se asigna, cambiar a EN_PROCESO
      if (claim.status === ClaimStatus.PENDING && (area || assignedToId !== "Unassigned")) {
        const updatedClaim = await api.claimStatus.changeStatus(claim.id, {
          nuevoEstado: ClaimStatus.IN_PROCESS,
          areaResponsable: area as ClaimArea || undefined,
          responsableId: assignedToId !== "Unassigned" ? assignedToId : undefined,
          observaciones: "Asignado desde panel de gestión",
        })
        setClaim(updatedClaim)
      } else {
        // Actualizar área y/o responsable sin cambiar estado
        let updatedClaim = claim
        
        // Si cambió el área, usar el endpoint de asignar área
        if (area && area !== claim.area) {
          updatedClaim = await api.claims.assignArea(claim.id, {
            area: area as ClaimArea,
            responsableId: assignedToId !== "Unassigned" ? assignedToId : undefined,
          })
        } 
        // Si solo cambió el responsable, usar el endpoint de asignar responsable
        else if (assignedToId !== "Unassigned" && assignedToId !== claim.assignedToId) {
          updatedClaim = await api.claims.assignResponsable(claim.id, {
            responsableId: assignedToId,
          })
        }
        
        setClaim(updatedClaim)
      }
      
      const newEvents = await api.timeline.getByClaimId(claim.id)
      setEvents(newEvents)
      toast({ title: "Guardado", description: "Asignación actualizada correctamente" })
    } catch (error: any) {
      toast({ title: "Error", description: error.message || "No se pudo guardar", variant: "destructive" })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            Reclamo {claim.id}
            <StatusBadge status={claim.status} />
          </h1>
          <p className="text-muted-foreground text-sm">Creado el {new Date(claim.createdAt).toLocaleDateString()}</p>
        </div>
        <div className="ml-auto flex gap-2">
          {canEdit && statusActions.canReassign && (
            <Button onClick={handleSaveAssignment} disabled={isSubmitting} variant="outline">
              <Save className="mr-2 h-4 w-4" />
              {isSubmitting ? "Guardando..." : "Guardar Asignación"}
            </Button>
          )}
          {canEdit && statusActions.allowedTransitions.length > 0 && (
            <Button onClick={() => setShowStateChangeForm(!showStateChangeForm)} variant="default">
              Cambiar Estado
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Info */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Detalle General</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-muted-foreground">Cliente</Label>
                  <div className="font-medium">{claim.clientName}</div>
                </div>
                <div>
                  <Label className="text-muted-foreground">Proyecto</Label>
                  <div className="font-medium">{claim.projectName}</div>
                </div>
              </div>

              <div>
                <Label className="text-muted-foreground">Código</Label>
                <div className="font-medium text-lg">{claim.codigo || claim.id}</div>
              </div>

              <div>
                <Label className="text-muted-foreground">Descripción</Label>
                <div className="bg-muted p-4 rounded-md border text-sm mt-1 min-h-[100px] whitespace-pre-wrap">
                  {claim.description}
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t">
                <div>
                  <Label className="text-muted-foreground">Tipo</Label>
                  <div className="font-medium text-sm">{claim.type}</div>
                </div>
                <div>
                  <Label className="text-muted-foreground">Prioridad</Label>
                  <div
                    className={`font-medium flex items-center gap-1 ${
                      claim.priority === ClaimPriority.URGENT
                        ? "text-red-600"
                        : claim.priority === ClaimPriority.HIGH
                          ? "text-orange-500"
                          : "text-foreground"
                    }`}
                  >
                    <AlertTriangle className="h-4 w-4" />
                    {claim.priority}
                  </div>
                </div>
                <div>
                  <Label className="text-muted-foreground">Criticidad</Label>
                  <div className="font-medium">{claim.criticality}</div>
                </div>
                <div>
                  <Label className="text-muted-foreground">Área Actual</Label>
                  <div className="font-medium">{claim.area}</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <ClaimTimeline events={events} currentUserRole={user.role} />
        </div>

        {/* Sidebar Controls */}
        <div className="space-y-6">
          {/* State Change Form - Visible when clicking "Cambiar Estado" */}
          {showStateChangeForm && (
            <Card className="border-primary">
              <CardHeader>
                <CardTitle className="text-lg">Cambiar Estado</CardTitle>
                <CardDescription>
                  Estado actual: <strong>{STATUS_LABELS[claim.status]}</strong>
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Nuevo Estado</Label>
                  <Select
                    value={selectedNewStatus}
                    onValueChange={(val) => setSelectedNewStatus(val as ClaimStatus)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar estado..." />
                    </SelectTrigger>
                    <SelectContent>
                      {statusActions.allowedTransitions.map((st) => (
                        <SelectItem key={st} value={st}>
                          {STATUS_LABELS[st]}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {selectedNewStatus && (
                    <p className="text-xs text-muted-foreground">
                      {TRANSITION_REQUIREMENTS[selectedNewStatus].description}
                    </p>
                  )}
                </div>

                {/* Campos condicionales según el estado destino */}
                {(selectedNewStatus === ClaimStatus.IN_PROCESS || 
                  selectedNewStatus === ClaimStatus.IN_REVIEW ||
                  selectedNewStatus === ClaimStatus.RESOLVED) && (
                  <div className="space-y-2">
                    <Label>Área Responsable</Label>
                    <Select value={area} onValueChange={(val) => setArea(val as ClaimArea)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar área..." />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.values(ClaimArea).map((ar) => (
                          <SelectItem key={ar} value={ar}>
                            {AREA_LABELS[ar]}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                {selectedNewStatus === ClaimStatus.IN_PROCESS && (
                  <div className="space-y-2">
                    <Label>Responsable</Label>
                    <Select value={assignedToId} onValueChange={setAssignedToId}>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar..." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Unassigned">-- Sin Asignar --</SelectItem>
                        {agents.map((agent) => (
                          <SelectItem key={agent.id} value={agent.id}>
                            {agent.name} ({agent.area || "General"})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                {(selectedNewStatus === ClaimStatus.CANCELLED || 
                  (claim.status === ClaimStatus.RESOLVED && selectedNewStatus === ClaimStatus.IN_PROCESS)) && (
                  <div className="space-y-2">
                    <Label>Motivo del cambio *</Label>
                    <Textarea
                      placeholder="Explique el motivo (mínimo 10 caracteres)..."
                      value={motivoCambio}
                      onChange={(e) => setMotivoCambio(e.target.value)}
                      className="min-h-[80px]"
                    />
                  </div>
                )}

                {(selectedNewStatus === ClaimStatus.IN_REVIEW || 
                  selectedNewStatus === ClaimStatus.RESOLVED) && (
                  <div className="space-y-2">
                    <Label>
                      {selectedNewStatus === ClaimStatus.RESOLVED 
                        ? "Resumen de Resolución *" 
                        : "Observaciones / Resolución propuesta"}
                    </Label>
                    <Textarea
                      placeholder={selectedNewStatus === ClaimStatus.RESOLVED 
                        ? "Descripción final de cómo se resolvió (mín. 20 caracteres)..." 
                        : "Observaciones sobre el trabajo realizado..."}
                      value={resolutionSummary}
                      onChange={(e) => setResolutionSummary(e.target.value)}
                      className="min-h-[100px]"
                    />
                  </div>
                )}

                {selectedNewStatus && selectedNewStatus !== ClaimStatus.CANCELLED && (
                  <div className="space-y-2">
                    <Label>Observaciones adicionales</Label>
                    <Textarea
                      placeholder="Observaciones opcionales..."
                      value={observaciones}
                      onChange={(e) => setObservaciones(e.target.value)}
                    />
                  </div>
                )}

                <div className="flex gap-2 pt-2">
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => {
                      setShowStateChangeForm(false)
                      setSelectedNewStatus("")
                      setMotivoCambio("")
                      setObservaciones("")
                    }}
                  >
                    Cancelar
                  </Button>
                  <Button
                    className="flex-1"
                    onClick={handleChangeStatus}
                    disabled={isSubmitting || !selectedNewStatus}
                  >
                    {isSubmitting ? "Cambiando..." : "Confirmar Cambio"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Assignment Card */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Asignación</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Estado Actual</Label>
                <div className="p-2 bg-muted rounded text-sm font-medium">
                  {STATUS_LABELS[claim.status]}
                </div>
              </div>

              <div className="space-y-2">
                <Label>Área</Label>
                <Select
                  disabled={!canEdit || !statusActions.canReassign}
                  value={area}
                  onValueChange={(val) => setArea(val as ClaimArea)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sin asignar" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.values(ClaimArea).map((ar) => (
                      <SelectItem key={ar} value={ar}>
                        {AREA_LABELS[ar]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Responsable</Label>
                <Select
                  disabled={!canEdit || !statusActions.canReassign}
                  value={assignedToId}
                  onValueChange={setAssignedToId}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Seleccionar..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Unassigned">-- Sin Asignar --</SelectItem>
                    {agents.map((agent) => (
                      <SelectItem key={agent.id} value={agent.id}>
                        {agent.name} ({agent.area || "General"})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {!statusActions.canReassign && (
                <p className="text-xs text-muted-foreground">
                  No se puede reasignar en estado {STATUS_LABELS[claim.status]}
                </p>
              )}
            </CardContent>
          </Card>

          {/* Resolution Info Card */}
          {claim.resolutionSummary && (
            <Card className="border-green-200 bg-green-50 dark:bg-green-950 dark:border-green-800">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-600" />
                  Resolución
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm">{claim.resolutionSummary}</p>
                {claim.resolutionDate && (
                  <p className="text-xs text-muted-foreground">
                    Fecha: {new Date(claim.resolutionDate).toLocaleString()}
                  </p>
                )}
              </CardContent>
            </Card>
          )}

          {/* Client Feedback */}
          {claim.clientFeedback && (
            <Card className="border-primary/20 bg-primary/5">
              <CardHeader>
                <CardTitle className="text-sm">Feedback del Cliente</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground italic">"{claim.clientFeedback}"</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
