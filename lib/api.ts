import {
  type User,
  type Client,
  type Project,
  type Claim,
  type TimelineEvent,
  type TipoProyecto,
  type ClaimStatistics,
  type Notification,
  type BackendUser,
  type BackendClient,
  type BackendProject,
  type BackendClaim,
  type BackendTipoProyecto,
  type BackendTimelineEvent,
  type LoginResponse,
  UserRole,
  ClaimStatus,
  ClaimPriority,
  ClaimCriticality,
  ClaimArea,
  ClaimType,
  TimelineEventType,
} from "./types"

// ==========================================
// CONFIGURACIÓN
// ==========================================

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000"

// Token storage
let authToken: string | null = null

export const setAuthToken = (token: string | null) => {
  authToken = token
  if (token) {
    localStorage.setItem("authToken", token)
  } else {
    localStorage.removeItem("authToken")
  }
}

export const getAuthToken = (): string | null => {
  if (authToken) return authToken
  if (typeof window !== "undefined") {
    authToken = localStorage.getItem("authToken")
  }
  return authToken
}

// ==========================================
// FETCH HELPER
// ==========================================

async function apiFetch<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = getAuthToken()
  
  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: "Error de red" }))
    throw new Error(error.message || `HTTP error! status: ${response.status}`)
  }

  // Para respuestas 204 No Content
  if (response.status === 204) {
    return undefined as T
  }

  return response.json()
}

// ==========================================
// MAPPERS: Backend -> Frontend
// ==========================================

function mapBackendUser(user: BackendUser): User {
  return {
    id: user._id,
    name: `${user.nombre} ${user.apellido}`,
    email: user.email,
    role: user.rol as UserRole,
    area: user.areaAsignada as ClaimArea | undefined,
  }
}

function mapBackendClient(client: BackendClient): Client {
  return {
    id: client._id,
    name: client.nombre,
    lastName: client.apellido,
    identification: client.numDocumento,
    email: client.email,
    phone: client.numTelefono,
    birthDate: client.fechaNacimiento,
    createdAt: client.createdAt,
  }
}

function mapBackendTipoProyecto(tipo: BackendTipoProyecto): TipoProyecto {
  return {
    id: tipo._id,
    nombre: tipo.nombre,
    descripcion: tipo.descripcion,
    createdAt: tipo.createdAt,
  }
}

function mapBackendProject(project: BackendProject): Project {
  const clienteId = typeof project.clienteId === "object" ? project.clienteId._id : project.clienteId
  const clienteName = typeof project.clienteId === "object" 
    ? `${project.clienteId.nombre} ${project.clienteId.apellido}` 
    : undefined
  const tipoProyectoId = typeof project.tipoProyectoId === "object" ? project.tipoProyectoId._id : project.tipoProyectoId
  const tipoProyectoName = typeof project.tipoProyectoId === "object" ? project.tipoProyectoId.nombre : undefined

  return {
    id: project._id,
    name: project.nombre,
    description: project.descripcion,
    clientId: clienteId,
    clientName: clienteName,
    tipoProyectoId: tipoProyectoId,
    tipoProyectoName: tipoProyectoName,
    startDate: project.fechaInicio,
    endDate: project.fechaFin,
    isActive: !project.isDeleted,
    createdAt: project.createdAt,
  }
}

function mapBackendClaim(claim: BackendClaim): Claim {
  const clienteId = typeof claim.clienteId === "object" ? claim.clienteId._id : claim.clienteId
  const clienteName = typeof claim.clienteId === "object" 
    ? `${claim.clienteId.nombre} ${claim.clienteId.apellido}` 
    : undefined
  const proyectoId = typeof claim.proyectoId === "object" ? claim.proyectoId._id : claim.proyectoId
  const proyectoName = typeof claim.proyectoId === "object" ? claim.proyectoId.nombre : undefined
  const tipoProyectoId = typeof claim.tipoProyectoId === "object" ? claim.tipoProyectoId._id : claim.tipoProyectoId
  const responsableId = typeof claim.responsableActualId === "object" ? claim.responsableActualId._id : claim.responsableActualId
  const responsableName = typeof claim.responsableActualId === "object" 
    ? `${claim.responsableActualId.nombre} ${claim.responsableActualId.apellido}` 
    : undefined

  return {
    id: claim._id,
    codigo: claim.codigo,
    description: claim.descripcion,
    clientId: clienteId,
    clientName: clienteName,
    projectId: proyectoId,
    projectName: proyectoName,
    tipoProyectoId: tipoProyectoId,
    type: claim.tipo as ClaimType,
    status: claim.estadoActual as ClaimStatus,
    priority: claim.prioridad as ClaimPriority,
    criticality: claim.criticidad as ClaimCriticality,
    area: claim.areaActual as ClaimArea,
    assignedToId: responsableId,
    assignedToName: responsableName,
    createdByUserId: claim.creadoPorUsuarioId,
    canModify: claim.puedeModificar,
    canReassign: claim.puedeReasignar,
    resolutionSummary: claim.resumenResolucion,
    clientFeedback: claim.feedbackCliente,
    resolutionDate: claim.fechaResolucion,
    closedDate: claim.fechaCierre,
    createdAt: claim.createdAt,
    updatedAt: claim.updatedAt,
  }
}

function mapBackendTimelineEvent(event: BackendTimelineEvent): TimelineEvent {
  return {
    id: event._id,
    claimId: event.reclamoId,
    tipoCambio: event.tipoCambio as TimelineEventType,
    fecha: event.fechaCambio || event.createdAt || '',
    
    // Cambio de ESTADO
    estadoAnterior: event.estadoAnterior as ClaimStatus | undefined,
    estadoNuevo: event.estadoNuevo as ClaimStatus | undefined,
    
    // Cambio de AREA
    areaAnterior: event.areaAnterior as ClaimArea | undefined,
    areaNueva: event.areaNueva as ClaimArea | undefined,
    
    // Cambio de RESPONSABLE
    responsableAnteriorId: event.responsableAnteriorId?._id,
    responsableAnteriorNombre: event.responsableAnteriorId ? `${event.responsableAnteriorId.nombre} ${event.responsableAnteriorId.apellido}` : undefined,
    responsableNuevoId: event.responsableNuevoId?._id,
    responsableNuevoNombre: event.responsableNuevoId ? `${event.responsableNuevoId.nombre} ${event.responsableNuevoId.apellido}` : undefined,
    
    // Campos comunes
    areaResponsable: event.areaResponsable as ClaimArea | undefined,
    usuarioId: event.usuarioResponsableId?._id,
    usuarioNombre: event.usuarioResponsableId ? `${event.usuarioResponsableId.nombre} ${event.usuarioResponsableId.apellido}` : undefined,
    motivoCambio: event.motivoCambio,
    observaciones: event.observaciones,
  }
}

// ==========================================
// API SERVICE
// ==========================================

export const api = {
  // ==========================================
  // AUTH
  // ==========================================
  auth: {
    login: async (email: string, password: string): Promise<{ user: User; token: string }> => {
      const response = await apiFetch<LoginResponse>("/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      })
      
      setAuthToken(response.access_token)
      
      return {
        user: {
          id: response.user.id,
          name: `${response.user.nombre} ${response.user.apellido}`,
          email: response.user.email,
          role: response.user.rol as UserRole,
          area: response.user.areaAsignada as ClaimArea | undefined,
        },
        token: response.access_token,
      }
    },
    
    logout: () => {
      setAuthToken(null)
    },
    
    getCurrentUser: async (id: string): Promise<User | undefined> => {
      try {
        const user = await apiFetch<BackendUser>(`/usuario/${id}`)
        return mapBackendUser(user)
      } catch {
        return undefined
      }
    },
  },

  // ==========================================
  // USUARIOS
  // ==========================================
  users: {
    list: async (): Promise<User[]> => {
      const users = await apiFetch<BackendUser[]>("/usuario")
      return users.map(mapBackendUser)
    },
    
    get: async (id: string): Promise<User | undefined> => {
      try {
        const user = await apiFetch<BackendUser>(`/usuario/${id}`)
        return mapBackendUser(user)
      } catch {
        return undefined
      }
    },
    
    listByRole: async (role: string): Promise<User[]> => {
      const users = await apiFetch<BackendUser[]>(`/usuario/rol/${role}`)
      return users.map(mapBackendUser)
    },
    
    listByArea: async (area: string): Promise<User[]> => {
      const users = await apiFetch<BackendUser[]>(`/usuario/area/${area}`)
      return users.map(mapBackendUser)
    },
    
    listAgents: async (): Promise<User[]> => {
      const agents = await apiFetch<BackendUser[]>(`/usuario/rol/agente`)
      const coordinators = await apiFetch<BackendUser[]>(`/usuario/rol/coordinador`)
      return [...agents, ...coordinators].map(mapBackendUser)
    },
    
    listAgentsByArea: async (area: string): Promise<User[]> => {
      const agents = await apiFetch<BackendUser[]>(`/usuario/agentes/area/${area}`)
      return agents.map(mapBackendUser)
    },
    
    create: async (data: {
      nombre: string
      apellido: string
      email: string
      password: string
      rol: string
      areaAsignada?: string
    }): Promise<User> => {
      const user = await apiFetch<BackendUser>("/usuario", {
        method: "POST",
        body: JSON.stringify(data),
      })
      return mapBackendUser(user)
    },
    
    update: async (id: string, data: Partial<{
      nombre: string
      apellido: string
      email: string
      password: string
      rol: string
      areaAsignada?: string
    }>): Promise<User> => {
      const user = await apiFetch<BackendUser>(`/usuario/${id}`, {
        method: "PATCH",
        body: JSON.stringify(data),
      })
      return mapBackendUser(user)
    },
    
    delete: async (id: string): Promise<void> => {
      await apiFetch(`/usuario/${id}`, { method: "DELETE" })
    },
  },

  // ==========================================
  // CLIENTES
  // ==========================================
  clients: {
    list: async (): Promise<Client[]> => {
      const clients = await apiFetch<BackendClient[]>("/cliente")
      return clients.map(mapBackendClient)
    },
    
    get: async (id: string): Promise<Client | undefined> => {
      try {
        const client = await apiFetch<BackendClient>(`/cliente/${id}`)
        return mapBackendClient(client)
      } catch {
        return undefined
      }
    },
    
    search: async (filter: Record<string, string>): Promise<Client[]> => {
      const params = new URLSearchParams(filter)
      const clients = await apiFetch<BackendClient[]>(`/cliente/search?${params}`)
      return clients.map(mapBackendClient)
    },
    
    create: async (data: {
      nombre: string
      apellido: string
      numDocumento: string
      fechaNacimiento: string
      numTelefono: string
      email: string
    }): Promise<Client> => {
      const client = await apiFetch<BackendClient>("/cliente", {
        method: "POST",
        body: JSON.stringify(data),
      })
      return mapBackendClient(client)
    },
    
    update: async (id: string, data: Partial<{
      nombre: string
      apellido: string
      numDocumento: string
      fechaNacimiento: string
      numTelefono: string
      email: string
    }>): Promise<Client> => {
      const client = await apiFetch<BackendClient>(`/cliente/${id}`, {
        method: "PATCH",
        body: JSON.stringify(data),
      })
      return mapBackendClient(client)
    },
    
    delete: async (id: string): Promise<void> => {
      await apiFetch(`/cliente/${id}`, { method: "DELETE" })
    },
  },

  // ==========================================
  // TIPOS DE PROYECTO
  // ==========================================
  tipoProyecto: {
    list: async (): Promise<TipoProyecto[]> => {
      const tipos = await apiFetch<BackendTipoProyecto[]>("/tipo-proyecto")
      return tipos.map(mapBackendTipoProyecto)
    },
    
    get: async (id: string): Promise<TipoProyecto | undefined> => {
      try {
        const tipo = await apiFetch<BackendTipoProyecto>(`/tipo-proyecto/${id}`)
        return mapBackendTipoProyecto(tipo)
      } catch {
        return undefined
      }
    },
    
    create: async (data: { nombre: string; descripcion: string }): Promise<TipoProyecto> => {
      const tipo = await apiFetch<BackendTipoProyecto>("/tipo-proyecto", {
        method: "POST",
        body: JSON.stringify(data),
      })
      return mapBackendTipoProyecto(tipo)
    },
    
    update: async (id: string, data: Partial<{ nombre: string; descripcion: string }>): Promise<TipoProyecto> => {
      const tipo = await apiFetch<BackendTipoProyecto>(`/tipo-proyecto/${id}`, {
        method: "PATCH",
        body: JSON.stringify(data),
      })
      return mapBackendTipoProyecto(tipo)
    },
    
    delete: async (id: string): Promise<void> => {
      await apiFetch(`/tipo-proyecto/${id}`, { method: "DELETE" })
    },
  },

  // ==========================================
  // PROYECTOS
  // ==========================================
  projects: {
    list: async (): Promise<Project[]> => {
      const projects = await apiFetch<BackendProject[]>("/proyecto")
      return projects.map(mapBackendProject)
    },
    
    get: async (id: string): Promise<Project | undefined> => {
      try {
        const project = await apiFetch<BackendProject>(`/proyecto/${id}`)
        return mapBackendProject(project)
      } catch {
        return undefined
      }
    },
    
    listByClient: async (clientId: string): Promise<Project[]> => {
      const projects = await apiFetch<BackendProject[]>(`/proyecto/cliente/${clientId}`)
      return projects.map(mapBackendProject)
    },
    
    listByTipoProyecto: async (tipoProyectoId: string): Promise<Project[]> => {
      const projects = await apiFetch<BackendProject[]>(`/proyecto/tipo-proyecto/${tipoProyectoId}`)
      return projects.map(mapBackendProject)
    },
    
    search: async (filter: Record<string, string>): Promise<Project[]> => {
      const params = new URLSearchParams(filter)
      const projects = await apiFetch<BackendProject[]>(`/proyecto/search?${params}`)
      return projects.map(mapBackendProject)
    },
    
    create: async (data: {
      nombre: string
      descripcion: string
      clienteId: string
      tipoProyectoId: string
      fechaInicio: string
      fechaFin?: string
    }): Promise<Project> => {
      const project = await apiFetch<BackendProject>("/proyecto", {
        method: "POST",
        body: JSON.stringify(data),
      })
      return mapBackendProject(project)
    },
    
    update: async (id: string, data: Partial<{
      nombre: string
      descripcion: string
      clienteId: string
      tipoProyectoId: string
      fechaInicio: string
      fechaFin?: string
    }>): Promise<Project> => {
      const project = await apiFetch<BackendProject>(`/proyecto/${id}`, {
        method: "PATCH",
        body: JSON.stringify(data),
      })
      return mapBackendProject(project)
    },
    
    delete: async (id: string): Promise<void> => {
      await apiFetch(`/proyecto/${id}`, { method: "DELETE" })
    },
  },

  // ==========================================
  // RECLAMOS
  // ==========================================
  claims: {
    list: async (filter?: Record<string, string>): Promise<Claim[]> => {
      const params = filter ? `?${new URLSearchParams(filter)}` : ""
      const claims = await apiFetch<BackendClaim[]>(`/reclamo${params}`)
      return claims.map(mapBackendClaim)
    },
    
    get: async (id: string): Promise<Claim | undefined> => {
      try {
        const claim = await apiFetch<BackendClaim>(`/reclamo/${id}`)
        return mapBackendClaim(claim)
      } catch {
        return undefined
      }
    },
    
    listByClient: async (clientId: string): Promise<Claim[]> => {
      const claims = await apiFetch<BackendClaim[]>(`/reclamo/cliente/${clientId}`)
      return claims.map(mapBackendClaim)
    },
    
    listByProject: async (projectId: string): Promise<Claim[]> => {
      const claims = await apiFetch<BackendClaim[]>(`/reclamo/proyecto/${projectId}`)
      return claims.map(mapBackendClaim)
    },
    
    listByTipoProyecto: async (tipoProyectoId: string): Promise<Claim[]> => {
      const claims = await apiFetch<BackendClaim[]>(`/reclamo/tipo-proyecto/${tipoProyectoId}`)
      return claims.map(mapBackendClaim)
    },
    
    listByArea: async (area: string): Promise<Claim[]> => {
      const claims = await apiFetch<BackendClaim[]>(`/reclamo/area/${area}`)
      return claims.map(mapBackendClaim)
    },
    
    search: async (filter: Record<string, string>): Promise<Claim[]> => {
      const params = new URLSearchParams(filter)
      const claims = await apiFetch<BackendClaim[]>(`/reclamo/search?${params}`)
      return claims.map(mapBackendClaim)
    },
    
    create: async (data: {
      clienteId: string
      proyectoId: string
      tipoProyectoId: string
      tipo: ClaimType
      prioridad: ClaimPriority
      criticidad: ClaimCriticality
      descripcion: string
      areaInicial?: ClaimArea
      responsableId?: string
    }): Promise<Claim> => {
      const claim = await apiFetch<BackendClaim>("/reclamo", {
        method: "POST",
        body: JSON.stringify(data),
      })
      return mapBackendClaim(claim)
    },
    
    update: async (id: string, data: Partial<{
      tipo: ClaimType
      prioridad: ClaimPriority
      criticidad: ClaimCriticality
      descripcion: string
      areaInicial?: ClaimArea
      responsableActualId?: string
      estadoActual?: ClaimStatus
      resumenResolucion?: string
      feedbackCliente?: string
    }>): Promise<Claim> => {
      const claim = await apiFetch<BackendClaim>(`/reclamo/${id}`, {
        method: "PATCH",
        body: JSON.stringify(data),
      })
      return mapBackendClaim(claim)
    },
    
    assignArea: async (id: string, data: {
      area: ClaimArea
      subArea?: string
      responsableId?: string
    }): Promise<Claim> => {
      const claim = await apiFetch<BackendClaim>(`/reclamo/${id}/asignar-area`, {
        method: "PATCH",
        body: JSON.stringify(data),
      })
      return mapBackendClaim(claim)
    },
    
    assignResponsable: async (id: string, data: {
      responsableId: string
    }): Promise<Claim> => {
      const claim = await apiFetch<BackendClaim>(`/reclamo/${id}/asignar-responsable`, {
        method: "PATCH",
        body: JSON.stringify(data),
      })
      return mapBackendClaim(claim)
    },
    
    delete: async (id: string): Promise<void> => {
      await apiFetch(`/reclamo/${id}`, { method: "DELETE" })
    },
  },

  // ==========================================
  // ESTADO DE RECLAMOS
  // ==========================================
  claimStatus: {
    changeStatus: async (reclamoId: string, data: {
      nuevoEstado: ClaimStatus
      motivoCambio?: string
      observaciones?: string
      areaResponsable?: ClaimArea
      responsableId?: string
      resumenResolucion?: string
    }): Promise<Claim> => {
      const claim = await apiFetch<BackendClaim>(`/reclamo/${reclamoId}/estado/cambiar`, {
        method: "POST",
        body: JSON.stringify(data),
      })
      return mapBackendClaim(claim)
    },
    
    getHistory: async (reclamoId: string): Promise<TimelineEvent[]> => {
      const events = await apiFetch<BackendTimelineEvent[]>(`/reclamo/${reclamoId}/estado/historial`)
      return events.map(mapBackendTimelineEvent)
    },
    
    canModify: async (reclamoId: string): Promise<boolean> => {
      const response = await apiFetch<{ canModify: boolean }>(`/reclamo/${reclamoId}/estado/puede-modificar`)
      return response.canModify
    },
    
    canReassign: async (reclamoId: string): Promise<boolean> => {
      const response = await apiFetch<{ canReassign: boolean }>(`/reclamo/${reclamoId}/estado/puede-reasignar`)
      return response.canReassign
    },
    
    getStatusInfo: async (): Promise<unknown> => {
      return apiFetch("/reclamo/estados/info")
    },
  },

  // ==========================================
  // TIMELINE (usa historial de estados)
  // ==========================================
  timeline: {
    getByClaimId: async (claimId: string): Promise<TimelineEvent[]> => {
      return api.claimStatus.getHistory(claimId)
    },
  },

  // ==========================================
  // ESTADÍSTICAS (calculadas en frontend por ahora)
  // ==========================================
  statistics: {
    getOverview: async (): Promise<ClaimStatistics> => {
      const claims = await api.claims.list()
      const users = await api.users.list()
      
      // Claims by status
      const claimsByStatus = Object.values(ClaimStatus).reduce(
        (acc, status) => {
          acc[status] = claims.filter((c) => c.status === status).length
          return acc
        },
        {} as Record<ClaimStatus, number>
      )

      // Claims by area
      const claimsByArea = Object.values(ClaimArea).reduce(
        (acc, area) => {
          acc[area] = claims.filter((c) => c.area === area).length
          return acc
        },
        {} as Record<ClaimArea, number>
      )

      // Claims by type
      const claimsByType = Object.values(ClaimType).reduce(
        (acc, type) => {
          acc[type] = claims.filter((c) => c.type === type).length
          return acc
        },
        {} as Record<ClaimType, number>
      )

      // Claims by priority
      const claimsByPriority = Object.values(ClaimPriority).reduce(
        (acc, priority) => {
          acc[priority] = claims.filter((c) => c.priority === priority).length
          return acc
        },
        {} as Record<ClaimPriority, number>
      )

      // Claims by month (last 6 months)
      const now = new Date()
      const monthNames = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"]
      const claimsByMonth = Array.from({ length: 6 }, (_, i) => {
        const date = new Date(now.getFullYear(), now.getMonth() - (5 - i), 1)
        const monthStart = date.toISOString()
        const nextMonth = new Date(date.getFullYear(), date.getMonth() + 1, 1)
        const monthEnd = nextMonth.toISOString()
        
        return {
          month: monthNames[date.getMonth()],
          count: claims.filter((c) => c.createdAt >= monthStart && c.createdAt < monthEnd).length,
        }
      })

      // Resolution time calculation
      const resolvedClaims = claims.filter((c) => c.resolutionDate)
      const avgResolutionTimeHours = resolvedClaims.length > 0
        ? resolvedClaims.reduce((sum, c) => {
            const created = new Date(c.createdAt).getTime()
            const resolved = new Date(c.resolutionDate!).getTime()
            return sum + (resolved - created) / (1000 * 60 * 60)
          }, 0) / resolvedClaims.length
        : 0

      // Avg resolution time by type
      const avgResolutionTimeByType = Object.values(ClaimType).reduce(
        (acc, type) => {
          const typeClaims = resolvedClaims.filter((c) => c.type === type)
          if (typeClaims.length > 0) {
            acc[type] = typeClaims.reduce((sum, c) => {
              const created = new Date(c.createdAt).getTime()
              const resolved = new Date(c.resolutionDate!).getTime()
              return sum + (resolved - created) / (1000 * 60 * 60)
            }, 0) / typeClaims.length
          } else {
            acc[type] = 0
          }
          return acc
        },
        {} as Record<ClaimType, number>
      )

      // Claims per agent
      const agents = users.filter((u) => u.role === UserRole.AGENT || u.role === UserRole.COORDINATOR)
      const claimsPerAgent = agents.map((agent) => ({
        agentId: agent.id,
        agentName: agent.name,
        count: claims.filter((c) => c.assignedToId === agent.id).length,
        resolved: claims.filter(
          (c) => c.assignedToId === agent.id && c.status === ClaimStatus.RESOLVED
        ).length,
      }))

      return {
        totalClaims: claims.length,
        claimsByStatus,
        claimsByArea,
        claimsByType,
        claimsByPriority,
        claimsByMonth,
        avgResolutionTimeHours,
        avgResolutionTimeByType,
        claimsPerAgent,
      }
    },
  },

  // ==========================================
  // NOTIFICACIONES (stub - no implementado en backend)
  // ==========================================
  notifications: {
    listByUser: async (userId: string): Promise<Notification[]> => {
      // Backend no implementa notificaciones aún, retornar array vacío
      return []
    },
    markAsRead: async (notificationId: string): Promise<void> => {
      // Stub
    },
    markAllAsRead: async (userId: string): Promise<void> => {
      // Stub
    },
  },
}
