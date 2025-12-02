"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ClaimPriority, ClaimCriticality, ClaimArea, ClaimType, PRIORITY_LABELS, TYPE_LABELS, CRITICALITY_LABELS, AREA_LABELS } from "@/lib/constants"
import { ArrowLeft, Paperclip, Upload, X } from "lucide-react"
import { Input } from "@/components/ui/input"
import { api } from "@/lib/api"
import { useAuth } from "@/lib/auth-context"
import type { Project } from "@/lib/types"
import { useToast } from "@/components/ui/use-toast"

export default function NewClaimPage() {
  const router = useRouter()
  const { user } = useAuth()
  const { toast } = useToast()

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [projects, setProjects] = useState<Project[]>([])

  // Form State - aligned with backend CreateReclamoDto
  const [formData, setFormData] = useState({
    descripcion: "",
    proyectoId: "",
    tipo: ClaimType.INCIDENT,
    prioridad: ClaimPriority.MEDIUM,
    criticidad: ClaimCriticality.LOW,
    areaInicial: ClaimArea.SUPPORT,
  })

  useEffect(() => {
    const loadProjects = async () => {
      if (user?.clientId) {
        try {
          const data = await api.projects.listByClient(user.clientId)
          setProjects(data)
        } catch (error) {
          console.error(error)
        }
      }
    }
    loadProjects()
  }, [user])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user?.clientId) {
      toast({ title: "Error", description: "No se encontró información del cliente", variant: "destructive" })
      return
    }

    if (!formData.proyectoId) {
      toast({ title: "Error", description: "Seleccione un proyecto", variant: "destructive" })
      return
    }

    // Get tipoProyectoId from the selected project
    const selectedProject = projects.find((p) => p.id === formData.proyectoId)
    if (!selectedProject?.tipoProyectoId) {
      toast({ title: "Error", description: "El proyecto seleccionado no tiene un tipo de proyecto válido", variant: "destructive" })
      return
    }

    if (formData.descripcion.length < 20) {
      toast({ title: "Error", description: "La descripción debe tener al menos 20 caracteres", variant: "destructive" })
      return
    }

    setIsSubmitting(true)
    try {
      const newClaim = await api.claims.create({
        clienteId: user.clientId,
        proyectoId: formData.proyectoId,
        tipoProyectoId: selectedProject.tipoProyectoId,
        tipo: formData.tipo,
        prioridad: formData.prioridad,
        criticidad: formData.criticidad,
        descripcion: formData.descripcion,
        areaInicial: formData.areaInicial,
      })

      toast({ title: "Reclamo enviado", description: `Tu reclamo ha sido recibido exitosamente.` })
      router.push("/home")
    } catch (error) {
      console.error(error)
      toast({ title: "Error", description: "Hubo un problema al enviar el reclamo.", variant: "destructive" })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <Button variant="ghost" onClick={() => router.back()} className="pl-0 hover:pl-2 transition-all">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Volver
      </Button>

      <Card>
        <CardHeader>
          <CardTitle>Crear Nuevo Reclamo</CardTitle>
          <CardDescription>Describe el problema detalladamente para ayudarte mejor.</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="project">Proyecto *</Label>
                <Select
                  required
                  value={formData.proyectoId}
                  onValueChange={(v) => setFormData({ ...formData, proyectoId: v })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona proyecto" />
                  </SelectTrigger>
                  <SelectContent>
                    {projects.map((p) => (
                      <SelectItem key={p.id} value={p.id}>
                        {p.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="type">Tipo de Reclamo *</Label>
                <Select
                  required
                  value={formData.tipo}
                  onValueChange={(v) => setFormData({ ...formData, tipo: v as ClaimType })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.values(ClaimType).map((type) => (
                      <SelectItem key={type} value={type}>
                        {TYPE_LABELS[type]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="priority">Prioridad *</Label>
                <Select
                  value={formData.prioridad}
                  onValueChange={(v) => setFormData({ ...formData, prioridad: v as ClaimPriority })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.values(ClaimPriority).map((p) => (
                      <SelectItem key={p} value={p}>
                        {PRIORITY_LABELS[p]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="criticidad">Criticidad *</Label>
                <Select
                  value={formData.criticidad}
                  onValueChange={(v) => setFormData({ ...formData, criticidad: v as ClaimCriticality })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.values(ClaimCriticality).map((c) => (
                      <SelectItem key={c} value={c}>
                        {CRITICALITY_LABELS[c]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="area">Área *</Label>
              <Select
                value={formData.areaInicial}
                onValueChange={(v) => setFormData({ ...formData, areaInicial: v as ClaimArea })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.values(ClaimArea).map((a) => (
                    <SelectItem key={a} value={a}>
                      {AREA_LABELS[a]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="descripcion">Descripción Detallada * (mínimo 20 caracteres)</Label>
              <Textarea
                id="descripcion"
                required
                value={formData.descripcion}
                onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                placeholder="Explica qué sucedió, pasos para reproducirlo, impacto en tu trabajo, etc."
                className="min-h-[150px]"
                minLength={20}
                maxLength={2000}
              />
              <p className="text-xs text-muted-foreground">
                {formData.descripcion.length}/2000 caracteres
              </p>
            </div>

            {/* Archivos Adjuntos - Solo visual */}
            <div className="space-y-2">
              <Label htmlFor="attachments" className="flex items-center gap-2">
                <Paperclip className="h-4 w-4" />
                Archivos Adjuntos (opcional)
              </Label>
              <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center hover:border-muted-foreground/50 transition-colors cursor-pointer">
                <Input
                  id="attachments"
                  type="file"
                  multiple
                  className="hidden"
                  accept="image/*,.pdf,.doc,.docx,.xls,.xlsx,.txt"
                />
                <label htmlFor="attachments" className="cursor-pointer">
                  <Upload className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                  <p className="text-sm font-medium">Arrastra archivos aquí o haz clic para seleccionar</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Formatos permitidos: imágenes, PDF, Word, Excel (máx. 10MB por archivo)
                  </p>
                </label>
              </div>
              {/* Placeholder para archivos seleccionados */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 p-2 bg-muted rounded-md text-sm text-muted-foreground">
                  <Paperclip className="h-4 w-4" />
                  <span className="flex-1">No hay archivos seleccionados</span>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => router.back()}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isSubmitting || !formData.proyectoId || formData.descripcion.length < 20}>
              {isSubmitting ? "Enviando..." : "Enviar Reclamo"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
