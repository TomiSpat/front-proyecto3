"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ClaimPriority, ClaimCriticality, ClaimArea, ClaimType, PRIORITY_LABELS, CRITICALITY_LABELS, AREA_LABELS, TYPE_LABELS } from "@/lib/constants"
import { ArrowLeft } from "lucide-react"
import { api } from "@/lib/api"
import type { Client, Project } from "@/lib/types"
import { useAuth } from "@/lib/auth-context"
import { useToast } from "@/components/ui/use-toast"

export default function NewInternalClaimPage() {
  const router = useRouter()
  const { user } = useAuth()
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [clients, setClients] = useState<Client[]>([])
  const [projects, setProjects] = useState<Project[]>([])

  const [selectedClientId, setSelectedClientId] = useState<string>("")
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([])

  // Form State - aligned with backend CreateReclamoDto
  const [formData, setFormData] = useState({
    descripcion: "",
    proyectoId: "",
    tipo: ClaimType.INCIDENT,
    prioridad: ClaimPriority.MEDIUM,
    criticidad: ClaimCriticality.LOW,
    areaActual: ClaimArea.SUPPORT,
  })

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [clientsData, projectsData] = await Promise.all([
          api.clients.list(),
          api.projects.list(),
        ])
        setClients(clientsData)
        setProjects(projectsData)
      } catch (error) {
        console.error("Failed to fetch data", error)
      }
    }
    fetchData()
  }, [])

  useEffect(() => {
    if (selectedClientId) {
      setFilteredProjects(projects.filter((p) => p.clientId === selectedClientId))
      // Reset project selection when client changes
      setFormData((prev) => ({ ...prev, proyectoId: "" }))
    } else {
      setFilteredProjects([])
    }
  }, [selectedClientId, projects])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return
    if (!selectedClientId || !formData.proyectoId) {
      toast({ title: "Error", description: "Seleccione Cliente y Proyecto", variant: "destructive" })
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
      await api.claims.create({
        clienteId: selectedClientId,
        proyectoId: formData.proyectoId,
        tipoProyectoId: selectedProject.tipoProyectoId,
        tipo: formData.tipo,
        prioridad: formData.prioridad,
        criticidad: formData.criticidad,
        descripcion: formData.descripcion,
        areaActual: formData.areaActual,
        creadoPorUsuarioId: user.id,
      })

      toast({ title: "Reclamo creado", description: "El reclamo ha sido registrado exitosamente." })
      router.push("/claims")
    } catch (error) {
      console.error(error)
      toast({ title: "Error", description: "No se pudo crear el reclamo", variant: "destructive" })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <Button variant="ghost" onClick={() => router.back()} className="pl-0 hover:pl-2 transition-all">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Volver al Listado
      </Button>

      <Card>
        <CardHeader>
          <CardTitle>Registrar Nuevo Reclamo (Interno)</CardTitle>
          <CardDescription>Ingresa los detalles del incidente reportado.</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label>Cliente *</Label>
                <Select value={selectedClientId} onValueChange={setSelectedClientId} required>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar Cliente" />
                  </SelectTrigger>
                  <SelectContent>
                    {clients.map((c) => (
                      <SelectItem key={c.id} value={c.id}>
                        {c.name} {c.lastName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Proyecto *</Label>
                <Select
                  value={formData.proyectoId}
                  onValueChange={(v) => setFormData({ ...formData, proyectoId: v })}
                  disabled={!selectedClientId}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar Proyecto" />
                  </SelectTrigger>
                  <SelectContent>
                    {filteredProjects.map((p) => (
                      <SelectItem key={p.id} value={p.id}>
                        {p.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label>Tipo de Reclamo *</Label>
                <Select
                  value={formData.tipo}
                  onValueChange={(v) => setFormData({ ...formData, tipo: v as ClaimType })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.values(ClaimType).map((t) => (
                      <SelectItem key={t} value={t}>
                        {TYPE_LABELS[t]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Área Inicial</Label>
                <Select value={formData.areaActual} onValueChange={(v) => setFormData({ ...formData, areaActual: v as ClaimArea })}>
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
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label>Prioridad *</Label>
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
                <Label>Criticidad *</Label>
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
              <Label htmlFor="descripcion">Descripción Detallada * (mínimo 20 caracteres)</Label>
              <Textarea
                id="descripcion"
                value={formData.descripcion}
                onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                placeholder="Detalles del reclamo: qué sucedió, pasos para reproducir, impacto en el negocio, etc."
                className="min-h-[150px]"
                minLength={20}
                maxLength={2000}
                required
              />
              <p className="text-xs text-muted-foreground">
                {formData.descripcion.length}/2000 caracteres
              </p>
            </div>
          </CardContent>
          <CardFooter className="justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => router.back()}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Creando..." : "Crear Reclamo"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
