"use client"

import type React from "react"

import { useState, useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { type Project, type Client, type TipoProyecto } from "@/lib/types"
import { api } from "@/lib/api"
import { useToast } from "@/components/ui/use-toast"

interface ProjectDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  project?: Project | null
  onSuccess: () => void
}

interface ProjectFormData {
  nombre: string
  descripcion: string
  clienteId: string
  tipoProyectoId: string
  fechaInicio: string
  fechaFin: string
  presupuesto: number
}

export function ProjectDialog({ open, onOpenChange, project, onSuccess }: ProjectDialogProps) {
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [clients, setClients] = useState<Client[]>([])
  const [tiposProyecto, setTiposProyecto] = useState<TipoProyecto[]>([])
  const [formData, setFormData] = useState<ProjectFormData>({
    nombre: "",
    descripcion: "",
    clienteId: "",
    tipoProyectoId: "",
    fechaInicio: "",
    fechaFin: "",
    presupuesto: 0,
  })

  useEffect(() => {
    const loadData = async () => {
      try {
        const [clientsData, tiposData] = await Promise.all([
          api.clients.list(),
          api.tipoProyecto.list(),
        ])
        setClients(clientsData)
        setTiposProyecto(tiposData)
      } catch (e) {
        console.error(e)
      }
    }
    loadData()
  }, [])

  useEffect(() => {
    if (project) {
      // Map frontend Project type to backend form fields
      setFormData({
        nombre: project.name || "",
        descripcion: project.description || "",
        clienteId: project.clientId || "",
        tipoProyectoId: project.tipoProyectoId || "",
        fechaInicio: project.startDate || "",
        fechaFin: project.endDate || "",
        presupuesto: project.budget || 0,
      })
    } else {
      setFormData({
        nombre: "",
        descripcion: "",
        clienteId: "",
        tipoProyectoId: "",
        fechaInicio: "",
        fechaFin: "",
        presupuesto: 0,
      })
    }
  }, [project, open])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const dataToSave = {
        nombre: formData.nombre,
        descripcion: formData.descripcion,
        clienteId: formData.clienteId,
        tipoProyectoId: formData.tipoProyectoId,
        fechaInicio: formData.fechaInicio,
        fechaFin: formData.fechaFin || undefined,
        presupuesto: formData.presupuesto,
      }

      if (project) {
        await api.projects.update(project.id, dataToSave)
        toast({ title: "Proyecto actualizado", description: "Los cambios se han guardado." })
      } else {
        await api.projects.create(dataToSave)
        toast({ title: "Proyecto creado", description: "El proyecto ha sido registrado." })
      }
      onSuccess()
      onOpenChange(false)
    } catch (error) {
      toast({ title: "Error", description: "Ocurrió un error al guardar.", variant: "destructive" })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>{project ? "Editar Proyecto" : "Nuevo Proyecto"}</DialogTitle>
          <DialogDescription>Gestiona la información del proyecto.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="nombre">Nombre del Proyecto</Label>
              <Input
                id="nombre"
                value={formData.nombre}
                onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                placeholder="Ej: Sistema de Gestión"
                minLength={3}
                maxLength={200}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="descripcion">Descripción</Label>
              <Textarea
                id="descripcion"
                value={formData.descripcion}
                onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                placeholder="Descripción detallada del proyecto..."
                minLength={10}
                maxLength={1000}
                className="min-h-[80px]"
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="cliente">Cliente</Label>
                <Select
                  value={formData.clienteId}
                  onValueChange={(v) => setFormData({ ...formData, clienteId: v })}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar cliente" />
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
                <Label htmlFor="tipoProyecto">Tipo de Proyecto</Label>
                <Select
                  value={formData.tipoProyectoId}
                  onValueChange={(v) => setFormData({ ...formData, tipoProyectoId: v })}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    {tiposProyecto.map((t) => (
                      <SelectItem key={t.id} value={t.id}>
                        {t.nombre}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="fechaInicio">Fecha de Inicio</Label>
                <Input
                  id="fechaInicio"
                  type="date"
                  value={formData.fechaInicio ? formData.fechaInicio.split("T")[0] : ""}
                  onChange={(e) => setFormData({ ...formData, fechaInicio: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="fechaFin">Fecha de Fin (opcional)</Label>
                <Input
                  id="fechaFin"
                  type="date"
                  value={formData.fechaFin ? formData.fechaFin.split("T")[0] : ""}
                  onChange={(e) => setFormData({ ...formData, fechaFin: e.target.value })}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="presupuesto">Presupuesto</Label>
              <Input
                id="presupuesto"
                type="number"
                min={0}
                step={0.01}
                value={formData.presupuesto}
                onChange={(e) => setFormData({ ...formData, presupuesto: parseFloat(e.target.value) || 0 })}
                placeholder="0.00"
                required
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Guardando..." : "Guardar"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
