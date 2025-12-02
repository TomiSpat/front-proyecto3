"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { StatusBadge } from "@/components/claims/status-badge"
import { StarRating } from "@/components/claims/star-rating"
import { ClaimStatus, ClaimPriority, UserRole } from "@/lib/constants"
import { ArrowLeft, CheckCircle2, Paperclip, MessageSquare } from "lucide-react"
import { ClaimTimeline } from "@/components/claims/timeline"
import { api } from "@/lib/api"
import { useAuth } from "@/lib/auth-context"
import type { Claim, TimelineEvent, Attachment } from "@/lib/types"
import { useToast } from "@/components/ui/use-toast"

export default function ClientClaimDetailPage() {
  const router = useRouter()
  const { id } = useParams()
  const { user } = useAuth()
  const { toast } = useToast()

  const [claim, setClaim] = useState<Claim | null>(null)
  const [events, setEvents] = useState<TimelineEvent[]>([])
  const [attachments, setAttachments] = useState<Attachment[]>([])
  const [loading, setLoading] = useState(true)

  // Feedback state
  const [feedbackRating, setFeedbackRating] = useState(0)
  const [feedbackComment, setFeedbackComment] = useState("")
  const [isSubmittingFeedback, setIsSubmittingFeedback] = useState(false)

  useEffect(() => {
    const loadData = async () => {
      if (!id) return
      try {
        setLoading(true)
        const [claimData, eventsData, attachmentsData] = await Promise.all([
          api.claims.get(id as string),
          api.timeline.getByClaimId(id as string),
          api.claims.getAttachments(id as string),
        ])
        if (claimData) {
          setClaim(claimData)
          if (claimData.feedback) {
            setFeedbackRating(claimData.feedback.rating)
            setFeedbackComment(claimData.feedback.comment)
          }
        }
        // Filter events for client view (exclude internal comments and sub-area details)
        const clientEvents = eventsData.filter((e) => e.type !== "COMMENT" || e.userRole === UserRole.CLIENT)
        setEvents(clientEvents)
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

  const handleSubmitFeedback = async () => {
    if (!claim || !user || feedbackRating === 0) return
    setIsSubmittingFeedback(true)
    try {
      const updatedClaim = await api.claims.submitFeedback(
        claim.id,
        {
          rating: feedbackRating,
          comment: feedbackComment,
          submittedAt: new Date().toISOString(),
        },
        user.id,
      )
      setClaim(updatedClaim)
      toast({ title: "Gracias por tu feedback", description: "Tu opinión nos ayuda a mejorar." })
    } catch (error) {
      toast({ title: "Error", description: "No se pudo enviar el feedback", variant: "destructive" })
    } finally {
      setIsSubmittingFeedback(false)
    }
  }

  if (loading) return <div className="p-8 text-center">Cargando detalles...</div>
  if (!claim) return <div className="p-8 text-center">Reclamo no encontrado</div>

  const isResolved = claim.status === ClaimStatus.RESOLVED
  const isClosed = claim.status === ClaimStatus.CLOSED
  const hasFeedback = !!claim.feedback

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            Reclamo {id}
            <StatusBadge status={claim.status} />
          </h1>
          <p className="text-muted-foreground text-sm">
            {claim.projectName} - Creado el {new Date(claim.createdAt).toLocaleDateString()}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Claim Details */}
          <Card>
            <CardHeader>
              <CardTitle>Detalle del Reclamo</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-muted-foreground">Título</Label>
                <div className="font-medium text-lg">{claim.title}</div>
              </div>
              <div>
                <Label className="text-muted-foreground">Descripción</Label>
                <div className="bg-muted p-4 rounded-md border text-sm mt-1 whitespace-pre-wrap">
                  {claim.description}
                </div>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 pt-4 border-t">
                <div>
                  <Label className="text-muted-foreground">Tipo</Label>
                  <div className="font-medium text-sm">{claim.type}</div>
                </div>
                <div>
                  <Label className="text-muted-foreground">Prioridad</Label>
                  <div
                    className={`font-medium ${
                      claim.priority === ClaimPriority.URGENT
                        ? "text-red-500"
                        : claim.priority === ClaimPriority.HIGH
                          ? "text-orange-500"
                          : ""
                    }`}
                  >
                    {claim.priority}
                  </div>
                </div>
                <div>
                  <Label className="text-muted-foreground">Área Responsable</Label>
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
                  Archivos Adjuntos
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-2">
                  {attachments.map((attachment) => (
                    <div key={attachment.id} className="flex items-center gap-3 p-2 rounded border bg-muted/50">
                      <Paperclip className="h-4 w-4 text-muted-foreground" />
                      <div className="flex-1">
                        <p className="text-sm font-medium">{attachment.fileName}</p>
                        <p className="text-xs text-muted-foreground">{(attachment.fileSize / 1024).toFixed(1)} KB</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Timeline */}
          <ClaimTimeline events={events} currentUserRole={UserRole.CLIENT} />
        </div>

        <div className="space-y-6">
          {/* Resolution Section */}
          {(isResolved || isClosed) && claim.resolution && (
            <Card className="border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-950">
              <CardHeader>
                <CardTitle className="text-green-800 dark:text-green-200 flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5" />
                  Resolución
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-green-900 dark:text-green-100">{claim.resolution.summary}</p>
                <div className="text-xs text-green-700 dark:text-green-300 pt-2 border-t border-green-200 dark:border-green-800">
                  <p>Resuelto por: {claim.resolution.resolvedByName}</p>
                  <p>Fecha: {new Date(claim.resolution.resolvedAt).toLocaleString()}</p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Feedback Section */}
          {isResolved && !hasFeedback && (
            <Card className="border-primary/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5" />
                  Tu Opinión
                </CardTitle>
                <CardDescription>Ayúdanos a mejorar calificando la atención recibida</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Calificación</Label>
                  <StarRating rating={feedbackRating} onChange={setFeedbackRating} size="lg" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="feedback">Comentarios (opcional)</Label>
                  <Textarea
                    id="feedback"
                    placeholder="Cuéntanos tu experiencia..."
                    value={feedbackComment}
                    onChange={(e) => setFeedbackComment(e.target.value)}
                    className="min-h-[100px]"
                  />
                </div>
                <Button
                  className="w-full"
                  onClick={handleSubmitFeedback}
                  disabled={feedbackRating === 0 || isSubmittingFeedback}
                >
                  {isSubmittingFeedback ? "Enviando..." : "Enviar Feedback"}
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Feedback Already Submitted */}
          {hasFeedback && claim.feedback && (
            <Card className="border-primary/20 bg-primary/5">
              <CardHeader>
                <CardTitle className="text-sm">Tu Feedback</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <StarRating rating={claim.feedback.rating} readonly size="md" />
                {claim.feedback.comment && (
                  <p className="text-sm text-muted-foreground italic">"{claim.feedback.comment}"</p>
                )}
                <p className="text-xs text-muted-foreground">
                  Enviado el {new Date(claim.feedback.submittedAt).toLocaleDateString()}
                </p>
              </CardContent>
            </Card>
          )}

          {/* Help Card */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Ayuda</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground space-y-2">
              <p>Si tienes dudas sobre el estado de tu reclamo, por favor contacta a soporte.</p>
              <p className="text-xs">Email: soporte@empresa.com</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
