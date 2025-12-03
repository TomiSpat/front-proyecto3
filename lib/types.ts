import { UserRole, ClaimStatus, ClaimPriority, ClaimCriticality, ClaimArea, ProjectType, ClaimType } from "./constants"

export { UserRole, ClaimStatus, ClaimPriority, ClaimCriticality, ClaimArea, ProjectType, ClaimType }

// ==========================================
// TIPOS DEL FRONTEND
// ==========================================

export interface PaginationMeta {
  total: number
  page: number
  limit: number
  totalPages: number
  hasNextPage: boolean
  hasPreviousPage: boolean
}

export interface PaginatedResponse<T> {
  data: T[]
  meta: PaginationMeta
}

export interface User {
  id: string
  name: string
  email: string
  role: UserRole
  area?: ClaimArea
  clientId?: string
  avatar?: string
}

export interface Client {
  id: string
  name: string
  lastName: string
  identification: string
  email: string
  phone: string
  birthDate?: string
  createdAt?: string
}

export interface TipoProyecto {
  id: string
  nombre: string
  descripcion: string
  createdAt?: string
}

export interface Project {
  id: string
  name: string
  description: string
  clientId: string
  clientName?: string
  tipoProyectoId: string
  tipoProyectoName?: string
  startDate: string
  endDate?: string
  isActive: boolean
  createdAt?: string
}

export interface Attachment {
  id: string
  claimId: string
  fileName: string
  fileType: string
  fileSize: number
  url: string
  uploadedAt: string
  uploadedBy: string
}

// Tipo de cambio en el historial
export enum TimelineEventType {
  ESTADO = 'ESTADO',
  AREA = 'AREA',
  RESPONSABLE = 'RESPONSABLE',
}

export interface TimelineEvent {
  id: string
  claimId: string
  fecha: string
  tipoCambio: TimelineEventType
  
  // Campos para cambio de ESTADO
  estadoAnterior?: ClaimStatus
  estadoNuevo?: ClaimStatus
  
  // Campos para cambio de AREA
  areaAnterior?: ClaimArea
  areaNueva?: ClaimArea
  
  // Campos para cambio de RESPONSABLE
  responsableAnteriorId?: string
  responsableAnteriorNombre?: string
  responsableNuevoId?: string
  responsableNuevoNombre?: string
  
  // Campos comunes
  areaResponsable?: ClaimArea
  usuarioId?: string
  usuarioNombre?: string
  motivoCambio?: string
  observaciones?: string
}

export interface Resolution {
  summary: string
  resolvedBy: string
  resolvedByName: string
  resolvedAt: string
}

export interface ClientFeedback {
  rating: number
  comment: string
  submittedAt: string
}

export interface Notification {
  id: string
  userId: string
  claimId: string
  type: "STATUS_CHANGE" | "AREA_CHANGE" | "ASSIGNMENT" | "NEW_COMMENT" | "RESOLVED"
  message: string
  read: boolean
  createdAt: string
}

export interface Claim {
  id: string
  codigo?: string
  description: string
  clientId: string
  clientName?: string
  projectId: string
  projectName?: string
  tipoProyectoId: string
  type: ClaimType
  status: ClaimStatus
  priority: ClaimPriority
  criticality: ClaimCriticality
  area: ClaimArea
  assignedToId?: string
  assignedToName?: string
  createdByUserId?: string
  canModify?: boolean
  canReassign?: boolean
  resolutionSummary?: string
  clientFeedback?: string
  resolutionDate?: string
  closedDate?: string
  createdAt: string
  updatedAt: string
}

export interface ClaimStatistics {
  totalClaims: number
  claimsByStatus: Record<ClaimStatus, number>
  claimsByArea: Record<ClaimArea, number>
  claimsByType: Record<ClaimType, number>
  claimsByPriority: Record<ClaimPriority, number>
  claimsByMonth: { month: string; count: number }[]
  avgResolutionTimeHours: number
  avgResolutionTimeByType: Record<ClaimType, number>
  claimsPerAgent: { agentId: string; agentName: string; count: number; resolved: number }[]
}

// ==========================================
// TIPOS DE RESPUESTA DEL BACKEND
// ==========================================

export interface BackendUser {
  _id: string
  nombre: string
  apellido: string
  email: string
  rol: string
  areaAsignada?: string
  estado: string
  clienteId?: string | { _id: string } // Puede venir como string o como objeto poblado
  createdAt?: string
  updatedAt?: string
}

export interface BackendClient {
  _id: string
  nombre: string
  apellido: string
  numDocumento: string
  fechaNacimiento?: string
  numTelefono: string
  email: string
  isDeleted?: boolean
  createdAt?: string
  updatedAt?: string
}

export interface BackendTipoProyecto {
  _id: string
  nombre: string
  descripcion: string
  isDeleted: boolean
  createdAt?: string
  updatedAt?: string
}

export interface BackendProject {
  _id: string
  nombre: string
  descripcion?: string
  clienteNombre?: string
  clienteApellido?: string
  tipoProyecto?: string
  clienteId?: string | { _id: string; nombre: string; apellido: string }
  tipoProyectoId?: string | { _id: string; nombre: string }
  fechaInicio?: string
  fechaFin?: string
  isDeleted?: boolean
  createdAt?: string
  updatedAt?: string
}

export interface BackendClaim {
  _id: string
  clienteNombre?: string
  clienteApellido?: string
  proyectoNombre?: string
  responsableNombre?: string
  responsableApellido?: string
  clienteId?: string | { _id: string; nombre: string; apellido: string }
  proyectoId?: string | { _id: string; nombre: string }
  tipoProyectoId?: string | { _id: string; nombre: string }
  codigo?: string
  tipo?: string
  prioridad: string
  criticidad?: string
  descripcion?: string
  areaActual?: string
  estadoActual: string
  puedeModificar?: boolean
  puedeReasignar?: boolean
  responsableActualId?: string | { _id: string; nombre: string; apellido: string }
  creadoPorUsuarioId?: string
  fechaResolucion?: string
  fechaCierre?: string
  resumenResolucion?: string
  feedbackCliente?: string
  createdAt: string
  updatedAt?: string
}

export interface BackendTimelineEvent {
  _id: string
  reclamoId: string
  tipoCambio: string // 'ESTADO', 'AREA', 'RESPONSABLE'
  fechaCambio: string // El backend envía fechaCambio
  createdAt?: string
  
  // Cambio de ESTADO
  estadoAnterior?: string
  estadoNuevo?: string
  
  // Cambio de AREA
  areaAnterior?: string
  areaNueva?: string
  
  // Cambio de RESPONSABLE
  responsableAnteriorId?: { _id: string; nombre: string; apellido: string }
  responsableNuevoId?: { _id: string; nombre: string; apellido: string }
  
  // Campos comunes
  areaResponsable?: string
  usuarioResponsableId?: { _id: string; nombre: string; apellido: string }
  motivoCambio?: string
  observaciones?: string
}

export interface LoginResponse {
  access_token: string
  user: {
    id: string
    nombre: string
    apellido: string
    email: string
    rol: string
    areaAsignada?: string
    clienteId?: string
  }
}
