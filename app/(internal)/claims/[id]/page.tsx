"use client"
import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { StatusBadge } from "@/components/claims/status-badge"
import { StarRating } from "@/components/claims/star-rating"
import { ClaimTimeline } from "@/components/claims/timeline"
import { ClaimStatus, ClaimPriority, UserRole, ClaimArea, SUB_AREAS, STATUS_ALLOWED_ACTIONS } from "@/lib/constants"
import { ArrowLeft, Save, AlertTriangle, Send, CheckCircle2, Paperclip } from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import { api } from "@/lib/api"
import type { Claim, TimelineEvent, User, Attachment } from "@/lib/types"
import { useToast } from "@/components/ui/use-toast"

export default function ClaimDetailPage() {
  const { id } = useParams()
  const router = useRouter()
  const { user } = useAuth()
  const { toast } = useToast()

  const [claim, setClaim] = useState<Claim | null>(null)
  const [events, setEvents] = useState<TimelineEvent[]>([])
  const [agents, setAgents] = useState<User[]>([])
  const [attachments, setAttachments] = useState<Attachment[]>([])
  const [loading, setLoading] = useState(true)

  // Edit State
  const [status, setStatus] = useState<ClaimStatus | "">("")
  const [area, setArea] = useState<ClaimArea | "">("")
  const [assignedToId, setAssignedToId] = useState<string>("")
  const [subArea, setSubArea] = useState<string>("")

  // Comment State
  const [newComment, setNewComment] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Resolution State
  const [resolutionSummary, setResolutionSummary] = useState("")
  const [showResolutionForm, setShowResolutionForm] = useState(false)

  useEffect(() => {
    const loadData = async () => {
      if (!id) return
      try {
        setLoading(true)
        const [claimData, eventsData, agentsData, attachmentsData] = await Promise.all([
          api.claims.get(id as string),
          api.timeline.getByClaimId(id as string),
          api.users.listAgents(),
          api.claims.getAttachments(id as string),
        ])

        if (claimData) {
          setClaim(claimData)
          setStatus(claimData.status)
          setArea(claimData.area)
          setAssignedToId(claimData.assignedToId || "Unassigned")
          setSubArea(claimData.subArea || "")
          if (claimData.resolution) {
            setResolutionSummary(claimData.resolution.summary)
          }
        }
        setEvents(eventsData)
        setAgents(agentsData)
        setAttachments(attachmentsData)
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
  const availableSubAreas = area ? SUB_AREAS[area as ClaimArea] || [] : []

  const handleSave = async () => {
    setIsSubmitting(true)
    try {
      const assignedAgent = agents.find((a) => a.id === assignedToId)

      const updatedClaim = await api.claims.update(
        claim.id,
        {
          status: status as ClaimStatus,
          area: area as ClaimArea,
          subArea,
          assignedToId: assignedToId === "Unassigned" ? undefined : assignedToId,
          assignedToName: assignedAgent?.name,
        },
        user.id,
      )

      setClaim(updatedClaim)
      const newEvents = await api.timeline.getByClaimId(claim.id)
      setEvents(newEvents)
      toast({ title: "Guardado", description: "Los cambios se han guardado correctamente." })
    } catch (error) {
      toast({ title: "Error", description: "No se pudo guardar los cambios", variant: "destructive" })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleAddComment = async () => {
    if (!newComment.trim()) return
    setIsSubmitting(true)
    try {
      await api.claims.addComment(claim.id, newComment, user.id)
      setNewComment("")
      const newEvents = await api.timeline.getByClaimId(claim.id)
      setEvents(newEvents)
      toast({ title: "Comentario agregado" })
    } catch (error) {
      toast({ title: "Error", description: "No se pudo agregar el comentario", variant: "destructive" })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleResolve = async () => {
    if (!resolutionSummary.trim()) {
      toast({ title: "Error", description: "Debes ingresar un resumen de la resolución", variant: "destructive" })
      return
    }
    setIsSubmitting(true)
    try {
      const updatedClaim = await api.claims.resolve(
        claim.id,
        {
          summary: resolutionSummary,
          resolvedBy: user.id,
          resolvedByName: user.name,
          resolvedAt: new Date().toISOString(),
        },
        user.id,
      )
      setClaim(updatedClaim)
      setStatus(updatedClaim.status)
      setShowResolutionForm(false)
      const newEvents = await api.timeline.getByClaimId(claim.id)
      setEvents(newEvents)
      toast({ title: "Reclamo Resuelto", description: "El cliente ha sido notificado." })
    } catch (error) {
      toast({ title: "Error", description: "No se pudo resolver el reclamo", variant: "destructive" })
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
          {canEdit && statusActions.canEdit && (
            <Button onClick={handleSave} disabled={isSubmitting}>
              <Save className="mr-2 h-4 w-4" />
              {isSubmitting ? "Guardando..." : "Guardar Cambios"}
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
                <Label className="text-muted-foreground">Título</Label>
                <div className="font-medium text-lg">{claim.title}</div>
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

          {/* Attachments */}
          {attachments.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Paperclip className="h-4 w-4" />
                  Archivos Adjuntos ({attachments.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-2">
                  {attachments.map((attachment) => (
                    <div key={attachment.id} className="flex items-center gap-3 p-2 rounded border bg-muted/50">
                      <Paperclip className="h-4 w-4 text-muted-foreground" />
                      <div className="flex-1">
                        <p className="text-sm font-medium">{attachment.fileName}</p>
                        <p className="text-xs text-muted-foreground">
                          {(attachment.fileSize / 1024).toFixed(1)} KB -{" "}
                          {new Date(attachment.uploadedAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Comments Section */}
          {statusActions.canComment && (
            <Card>
              <CardHeader>
                <CardTitle>Comentarios Internos</CardTitle>
                <CardDescription>Solo visible para el equipo interno</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <Textarea
                    placeholder="Escribe un comentario interno..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                  />
                  <Button
                    className="self-end"
                    size="icon"
                    onClick={handleAddComment}
                    disabled={!newComment.trim() || isSubmitting}
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          <ClaimTimeline events={events} currentUserRole={user.role} />
        </div>

        {/* Sidebar Controls */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Gestión</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Estado del Reclamo</Label>
                <Select
                  disabled={!canEdit || !statusActions.canEdit}
                  value={status}
                  onValueChange={(val) => setStatus(val as ClaimStatus)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.values(ClaimStatus).map((st) => (
                      <SelectItem key={st} value={st}>
                        {st}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Asignar Área</Label>
                <Select
                  disabled={!canEdit || !statusActions.canReassign}
                  value={area}
                  onValueChange={(val) => {
                    setArea(val as ClaimArea)
                    setSubArea("")
                  }}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.values(ClaimArea).map((ar) => (
                      <SelectItem key={ar} value={ar}>
                        {ar}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Sub-área (Interno)</Label>
                <Select
                  disabled={!canEdit || !statusActions.canEdit || availableSubAreas.length === 0}
                  value={subArea}
                  onValueChange={setSubArea}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar sub-área" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableSubAreas.map((sa) => (
                      <SelectItem key={sa} value={sa}>
                        {sa}
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
            </CardContent>
          </Card>

          {/* Resolution Card */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5" />
                Resolución
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {claim.resolution ? (
                <div className="space-y-3">
                  <div className="p-3 bg-green-50 dark:bg-green-950 rounded border border-green-200 dark:border-green-800">
                    <p className="text-sm text-green-900 dark:text-green-100">{claim.resolution.summary}</p>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    <p>Resuelto por: {claim.resolution.resolvedByName}</p>
                    <p>Fecha: {new Date(claim.resolution.resolvedAt).toLocaleString()}</p>
                  </div>
                </div>
              ) : statusActions.canResolve ? (
                showResolutionForm ? (
                  <div className="space-y-3">
                    <Textarea
                      placeholder="Describe cómo se resolvió el problema..."
                      value={resolutionSummary}
                      onChange={(e) => setResolutionSummary(e.target.value)}
                      className="min-h-[100px]"
                    />
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        className="flex-1 bg-transparent"
                        onClick={() => setShowResolutionForm(false)}
                      >
                        Cancelar
                      </Button>
                      <Button
                        className="flex-1"
                        onClick={handleResolve}
                        disabled={isSubmitting || !resolutionSummary.trim()}
                      >
                        {isSubmitting ? "Resolviendo..." : "Resolver"}
                      </Button>
                    </div>
                  </div>
                ) : (
                  <Button className="w-full" variant="secondary" onClick={() => setShowResolutionForm(true)}>
                    Marcar como Resuelto
                  </Button>
                )
              ) : (
                <p className="text-sm text-muted-foreground text-center py-2">
                  {claim.status === ClaimStatus.RESOLVED || claim.status === ClaimStatus.CLOSED
                    ? "Este reclamo ya está cerrado"
                    : "El reclamo debe estar En Proceso para resolverlo"}
                </p>
              )}
            </CardContent>
          </Card>

          {/* Client Feedback (if exists) */}
          {claim.feedback && (
            <Card className="border-primary/20 bg-primary/5">
              <CardHeader>
                <CardTitle className="text-sm">Feedback del Cliente</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <StarRating rating={claim.feedback.rating} readonly size="md" />
                {claim.feedback.comment && (
                  <p className="text-sm text-muted-foreground italic">"{claim.feedback.comment}"</p>
                )}
                <p className="text-xs text-muted-foreground">
                  Recibido el {new Date(claim.feedback.submittedAt).toLocaleDateString()}
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
