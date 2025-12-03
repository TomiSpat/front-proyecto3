"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { StatusBadge } from "@/components/claims/status-badge"
import { ClaimStatus, ClaimPriority, UserRole, AREA_LABELS, TYPE_LABELS, PRIORITY_LABELS, CRITICALITY_LABELS } from "@/lib/constants"
import { ArrowLeft, CheckCircle2 } from "lucide-react"
import { ClaimTimeline } from "@/components/claims/timeline"
import { api } from "@/lib/api"
import { useAuth } from "@/lib/auth-context"
import type { Claim, TimelineEvent } from "@/lib/types"
import { useToast } from "@/components/ui/use-toast"

export default function ClientClaimDetailPage() {
  const router = useRouter()
  const { id } = useParams()
  const { user } = useAuth()
  const { toast } = useToast()

  const [claim, setClaim] = useState<Claim | null>(null)
  const [events, setEvents] = useState<TimelineEvent[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadData = async () => {
      if (!id) return
      try {
        setLoading(true)
        const [claimData, eventsData] = await Promise.all([
          api.claims.get(id as string),
          api.timeline.getByClaimId(id as string),
        ])
        if (claimData) {
          setClaim(claimData)
        }
        setEvents(eventsData)
      } catch (error) {
        console.error(error)
        toast({ title: "Error", description: "No se pudo cargar el reclamo", variant: "destructive" })
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [id, toast])

  if (loading) return <div className="p-8 text-center">Cargando detalles...</div>
  if (!claim) return <div className="p-8 text-center">Reclamo no encontrado</div>

  const isResolved = claim.status === ClaimStatus.RESOLVED

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            Reclamo {claim.codigo || id}
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
                <Label className="text-muted-foreground">Código</Label>
                <div className="font-medium text-lg">{claim.codigo || claim.id}</div>
              </div>
              <div>
                <Label className="text-muted-foreground">Descripción</Label>
                <div className="bg-muted p-4 rounded-md border text-sm mt-1 whitespace-pre-wrap min-h-[100px]">
                  {claim.description}
                </div>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t">
                <div>
                  <Label className="text-muted-foreground">Tipo</Label>
                  <div className="font-medium text-sm">{TYPE_LABELS[claim.type] || claim.type}</div>
                </div>
                <div>
                  <Label className="text-muted-foreground">Prioridad</Label>
                  <div
                    className={`font-medium text-sm ${
                      claim.priority === ClaimPriority.URGENT
                        ? "text-red-500"
                        : claim.priority === ClaimPriority.HIGH
                          ? "text-orange-500"
                          : ""
                    }`}
                  >
                    {PRIORITY_LABELS[claim.priority] || claim.priority}
                  </div>
                </div>
                <div>
                  <Label className="text-muted-foreground">Criticidad</Label>
                  <div className="font-medium text-sm">{CRITICALITY_LABELS[claim.criticality] || claim.criticality}</div>
                </div>
                <div>
                  <Label className="text-muted-foreground">Área Responsable</Label>
                  <div className="font-medium text-sm">{AREA_LABELS[claim.area] || claim.area}</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Timeline */}
          <ClaimTimeline events={events} currentUserRole={UserRole.CLIENT} />
        </div>

        <div className="space-y-6">
          {/* Resolution Section */}
          {isResolved && claim.resolutionSummary && (
            <Card className="border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-950">
              <CardHeader>
                <CardTitle className="text-green-800 dark:text-green-200 flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5" />
                  Resolución
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-green-900 dark:text-green-100">{claim.resolutionSummary}</p>
                {claim.resolutionDate && (
                  <div className="text-xs text-green-700 dark:text-green-300 pt-2 border-t border-green-200 dark:border-green-800">
                    <p>Fecha de resolución: {new Date(claim.resolutionDate).toLocaleString()}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Client Feedback */}
          {claim.clientFeedback && (
            <Card className="border-primary/20 bg-primary/5">
              <CardHeader>
                <CardTitle className="text-sm">Tu Feedback</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground italic">"{claim.clientFeedback}"</p>
              </CardContent>
            </Card>
          )}

          {/* Assigned Agent */}
          {claim.assignedToName && (
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Responsable Asignado</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="font-medium">{claim.assignedToName}</p>
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
