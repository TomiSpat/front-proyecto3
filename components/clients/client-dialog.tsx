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
import type { Client } from "@/lib/types"
import { api } from "@/lib/api"
import { useToast } from "@/components/ui/use-toast"

interface ClientDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  client?: Client | null
  onSuccess: () => void
}

interface ClientFormData {
  nombre: string
  apellido: string
  numDocumento: string
  fechaNacimiento: string
  numTelefono: string
  email: string
}

export function ClientDialog({ open, onOpenChange, client, onSuccess }: ClientDialogProps) {
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState<ClientFormData>({
    nombre: "",
    apellido: "",
    numDocumento: "",
    fechaNacimiento: "",
    numTelefono: "",
    email: "",
  })

  useEffect(() => {
    if (client) {
      // Map frontend Client type to backend form fields
      setFormData({
        nombre: client.name || "",
        apellido: client.lastName || "",
        numDocumento: client.identification || "",
        fechaNacimiento: client.birthDate || "",
        numTelefono: client.phone || "",
        email: client.email || "",
      })
    } else {
      setFormData({
        nombre: "",
        apellido: "",
        numDocumento: "",
        fechaNacimiento: "",
        numTelefono: "",
        email: "",
      })
    }
  }, [client, open])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      if (client) {
        await api.clients.update(client.id, formData)
        toast({ title: "Cliente actualizado", description: "Los datos se han guardado correctamente." })
      } else {
        await api.clients.create(formData)
        toast({ title: "Cliente creado", description: "El nuevo cliente ha sido registrado." })
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
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{client ? "Editar Cliente" : "Nuevo Cliente"}</DialogTitle>
          <DialogDescription>
            {client
              ? "Modifica los datos del cliente existente."
              : "Ingresa los datos para registrar un nuevo cliente."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="nombre">Nombre</Label>
                <Input
                  id="nombre"
                  value={formData.nombre}
                  onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                  placeholder="Ej: Juan"
                  minLength={2}
                  maxLength={50}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="apellido">Apellido</Label>
                <Input
                  id="apellido"
                  value={formData.apellido}
                  onChange={(e) => setFormData({ ...formData, apellido: e.target.value })}
                  placeholder="Ej: Pérez"
                  minLength={2}
                  maxLength={50}
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="numDocumento">Documento de Identidad</Label>
              <Input
                id="numDocumento"
                value={formData.numDocumento}
                onChange={(e) => setFormData({ ...formData, numDocumento: e.target.value })}
                placeholder="Ej: 12345678-9"
                minLength={7}
                maxLength={20}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="fechaNacimiento">Fecha de Nacimiento</Label>
              <Input
                id="fechaNacimiento"
                type="date"
                value={formData.fechaNacimiento ? formData.fechaNacimiento.split("T")[0] : ""}
                onChange={(e) => setFormData({ ...formData, fechaNacimiento: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="ejemplo@correo.com"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="numTelefono">Teléfono</Label>
              <Input
                id="numTelefono"
                value={formData.numTelefono}
                onChange={(e) => setFormData({ ...formData, numTelefono: e.target.value })}
                placeholder="Ej: +56912345678"
                minLength={8}
                maxLength={20}
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
