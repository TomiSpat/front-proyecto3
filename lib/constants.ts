// Valores que coinciden con el backend
export enum UserRole {
  ADMIN = "admin",
  COORDINATOR = "coordinador",
  AGENT = "agente",
  CLIENT = "cliente",
}

// Estados del reclamo (backend: ReclamoEstado)
export enum ClaimStatus {
  PENDING = "PENDIENTE",
  IN_PROCESS = "EN_PROCESO",
  IN_REVIEW = "EN_REVISION",
  RESOLVED = "RESUELTO",
  CANCELLED = "CANCELADO",
}

// Prioridad del reclamo (backend: ReclamoPrioridad)
export enum ClaimPriority {
  LOW = "BAJA",
  MEDIUM = "MEDIA",
  HIGH = "ALTA",
  URGENT = "URGENTE",
}

// Criticidad del reclamo (backend: ReclamoCriticidad)
export enum ClaimCriticality {
  LOW = "BAJA",
  MEDIUM = "MEDIA",
  HIGH = "ALTA",
  CRITICAL = "CRITICA",
}

// Áreas generales (backend: AreaGeneralReclamo)
export enum ClaimArea {
  SALES = "VENTAS",
  SUPPORT = "SOPORTE_TECNICO",
  BILLING = "FACTURACION",
}

// Tipo de reclamo (backend: ReclamoTipo)
export enum ClaimType {
  INCIDENT = "INCIDENTE",
  INQUIRY = "CONSULTA",
  IMPROVEMENT = "MEJORA",
  OTHER = "OTRO",
}

// ProjectType no tiene equivalente directo en backend, se usa TipoProyecto como entidad
export enum ProjectType {
  SOFTWARE = "Software",
  MARKETING = "Marketing",
  CONSULTING = "Consultoría",
  OTHER = "Otros",
}

export const SUB_AREAS: Record<ClaimArea, string[]> = {
  [ClaimArea.SALES]: ["Preventa", "Postventa", "Renovaciones", "Nuevos Clientes"],
  [ClaimArea.SUPPORT]: ["Backend", "Frontend", "Infraestructura", "Base de Datos", "Mobile"],
  [ClaimArea.BILLING]: ["Cobranzas", "Facturación", "Pagos", "Reembolsos"],
}

export const STATUS_COLORS: Record<ClaimStatus, string> = {
  [ClaimStatus.PENDING]: "bg-slate-100 text-slate-800 border-slate-200",
  [ClaimStatus.IN_PROCESS]: "bg-indigo-100 text-indigo-800 border-indigo-200",
  [ClaimStatus.IN_REVIEW]: "bg-purple-100 text-purple-800 border-purple-200",
  [ClaimStatus.RESOLVED]: "bg-green-100 text-green-800 border-green-200",
  [ClaimStatus.CANCELLED]: "bg-gray-100 text-gray-800 border-gray-200",
}

export const PRIORITY_COLORS: Record<ClaimPriority, string> = {
  [ClaimPriority.LOW]: "text-slate-500",
  [ClaimPriority.MEDIUM]: "text-blue-500",
  [ClaimPriority.HIGH]: "text-orange-500",
  [ClaimPriority.URGENT]: "text-red-600 font-bold",
}

// Acciones permitidas por estado (coincide con backend State Pattern)
export const STATUS_ALLOWED_ACTIONS: Record<
  ClaimStatus,
  { canEdit: boolean; canComment: boolean; canReassign: boolean; canResolve: boolean; allowedTransitions: ClaimStatus[] }
> = {
  [ClaimStatus.PENDING]: { 
    canEdit: true, 
    canComment: true, 
    canReassign: true, 
    canResolve: false,
    allowedTransitions: [ClaimStatus.IN_PROCESS, ClaimStatus.CANCELLED]
  },
  [ClaimStatus.IN_PROCESS]: { 
    canEdit: true, 
    canComment: true, 
    canReassign: true, 
    canResolve: false, // No puede resolver directamente, debe pasar por EN_REVISION
    allowedTransitions: [ClaimStatus.IN_REVIEW, ClaimStatus.PENDING, ClaimStatus.CANCELLED]
  },
  [ClaimStatus.IN_REVIEW]: { 
    canEdit: false, 
    canComment: true, 
    canReassign: false, 
    canResolve: true,
    allowedTransitions: [ClaimStatus.RESOLVED, ClaimStatus.IN_PROCESS, ClaimStatus.CANCELLED]
  },
  [ClaimStatus.RESOLVED]: { 
    canEdit: false, 
    canComment: false, 
    canReassign: false, 
    canResolve: false,
    allowedTransitions: [ClaimStatus.IN_PROCESS] // Solo reabrir
  },
  [ClaimStatus.CANCELLED]: { 
    canEdit: false, 
    canComment: false, 
    canReassign: false, 
    canResolve: false,
    allowedTransitions: [] // Estado final
  },
}

// Requisitos para transiciones de estado
export const TRANSITION_REQUIREMENTS: Record<ClaimStatus, {
  requiresResponsable?: boolean
  requiresArea?: boolean
  requiresObservaciones?: boolean
  requiresResolucion?: boolean
  requiresMotivo?: boolean
  description: string
}> = {
  [ClaimStatus.PENDING]: {
    description: "Reclamo pendiente de asignación"
  },
  [ClaimStatus.IN_PROCESS]: {
    requiresResponsable: true,
    requiresArea: true,
    description: "Requiere responsable o área asignada"
  },
  [ClaimStatus.IN_REVIEW]: {
    requiresObservaciones: true,
    description: "Requiere observaciones o resumen de resolución propuesta"
  },
  [ClaimStatus.RESOLVED]: {
    requiresResolucion: true,
    description: "Requiere resumen final de la resolución"
  },
  [ClaimStatus.CANCELLED]: {
    requiresMotivo: true,
    description: "Requiere motivo de cancelación"
  },
}

// Labels para mostrar en UI
export const STATUS_LABELS: Record<ClaimStatus, string> = {
  [ClaimStatus.PENDING]: "Pendiente",
  [ClaimStatus.IN_PROCESS]: "En Proceso",
  [ClaimStatus.IN_REVIEW]: "En Revisión",
  [ClaimStatus.RESOLVED]: "Resuelto",
  [ClaimStatus.CANCELLED]: "Cancelado",
}

export const PRIORITY_LABELS: Record<ClaimPriority, string> = {
  [ClaimPriority.LOW]: "Baja",
  [ClaimPriority.MEDIUM]: "Media",
  [ClaimPriority.HIGH]: "Alta",
  [ClaimPriority.URGENT]: "Urgente",
}

export const CRITICALITY_LABELS: Record<ClaimCriticality, string> = {
  [ClaimCriticality.LOW]: "Baja",
  [ClaimCriticality.MEDIUM]: "Media",
  [ClaimCriticality.HIGH]: "Alta",
  [ClaimCriticality.CRITICAL]: "Crítica",
}

export const AREA_LABELS: Record<ClaimArea, string> = {
  [ClaimArea.SALES]: "Ventas",
  [ClaimArea.SUPPORT]: "Soporte Técnico",
  [ClaimArea.BILLING]: "Facturación",
}

export const TYPE_LABELS: Record<ClaimType, string> = {
  [ClaimType.INCIDENT]: "Incidente",
  [ClaimType.INQUIRY]: "Consulta",
  [ClaimType.IMPROVEMENT]: "Mejora",
  [ClaimType.OTHER]: "Otro",
}

export const ROLE_LABELS: Record<UserRole, string> = {
  [UserRole.ADMIN]: "Administrador",
  [UserRole.COORDINATOR]: "Coordinador",
  [UserRole.AGENT]: "Agente",
  [UserRole.CLIENT]: "Cliente",
}
