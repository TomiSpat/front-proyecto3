module.exports = [
"[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/action-async-storage.external.js [external] (next/dist/server/app-render/action-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/action-async-storage.external.js", () => require("next/dist/server/app-render/action-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-unit-async-storage.external.js [external] (next/dist/server/app-render/work-unit-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-unit-async-storage.external.js", () => require("next/dist/server/app-render/work-unit-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-async-storage.external.js [external] (next/dist/server/app-render/work-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-async-storage.external.js", () => require("next/dist/server/app-render/work-async-storage.external.js"));

module.exports = mod;
}),
"[project]/lib/constants.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// Valores que coinciden con el backend
__turbopack_context__.s([
    "AREA_LABELS",
    ()=>AREA_LABELS,
    "CRITICALITY_LABELS",
    ()=>CRITICALITY_LABELS,
    "ClaimArea",
    ()=>ClaimArea,
    "ClaimCriticality",
    ()=>ClaimCriticality,
    "ClaimPriority",
    ()=>ClaimPriority,
    "ClaimStatus",
    ()=>ClaimStatus,
    "ClaimType",
    ()=>ClaimType,
    "PRIORITY_COLORS",
    ()=>PRIORITY_COLORS,
    "PRIORITY_LABELS",
    ()=>PRIORITY_LABELS,
    "ProjectType",
    ()=>ProjectType,
    "ROLE_LABELS",
    ()=>ROLE_LABELS,
    "STATUS_ALLOWED_ACTIONS",
    ()=>STATUS_ALLOWED_ACTIONS,
    "STATUS_COLORS",
    ()=>STATUS_COLORS,
    "STATUS_LABELS",
    ()=>STATUS_LABELS,
    "SUB_AREAS",
    ()=>SUB_AREAS,
    "TRANSITION_REQUIREMENTS",
    ()=>TRANSITION_REQUIREMENTS,
    "TYPE_LABELS",
    ()=>TYPE_LABELS,
    "UserRole",
    ()=>UserRole
]);
var UserRole = /*#__PURE__*/ function(UserRole) {
    UserRole["ADMIN"] = "admin";
    UserRole["COORDINATOR"] = "coordinador";
    UserRole["AGENT"] = "agente";
    UserRole["CLIENT"] = "cliente";
    return UserRole;
}({});
var ClaimStatus = /*#__PURE__*/ function(ClaimStatus) {
    ClaimStatus["PENDING"] = "PENDIENTE";
    ClaimStatus["IN_PROCESS"] = "EN_PROCESO";
    ClaimStatus["IN_REVIEW"] = "EN_REVISION";
    ClaimStatus["RESOLVED"] = "RESUELTO";
    ClaimStatus["CANCELLED"] = "CANCELADO";
    return ClaimStatus;
}({});
var ClaimPriority = /*#__PURE__*/ function(ClaimPriority) {
    ClaimPriority["LOW"] = "BAJA";
    ClaimPriority["MEDIUM"] = "MEDIA";
    ClaimPriority["HIGH"] = "ALTA";
    ClaimPriority["URGENT"] = "URGENTE";
    return ClaimPriority;
}({});
var ClaimCriticality = /*#__PURE__*/ function(ClaimCriticality) {
    ClaimCriticality["LOW"] = "BAJA";
    ClaimCriticality["MEDIUM"] = "MEDIA";
    ClaimCriticality["HIGH"] = "ALTA";
    ClaimCriticality["CRITICAL"] = "CRITICA";
    return ClaimCriticality;
}({});
var ClaimArea = /*#__PURE__*/ function(ClaimArea) {
    ClaimArea["SALES"] = "VENTAS";
    ClaimArea["SUPPORT"] = "SOPORTE_TECNICO";
    ClaimArea["BILLING"] = "FACTURACION";
    return ClaimArea;
}({});
var ClaimType = /*#__PURE__*/ function(ClaimType) {
    ClaimType["INCIDENT"] = "INCIDENTE";
    ClaimType["INQUIRY"] = "CONSULTA";
    ClaimType["IMPROVEMENT"] = "MEJORA";
    ClaimType["OTHER"] = "OTRO";
    return ClaimType;
}({});
var ProjectType = /*#__PURE__*/ function(ProjectType) {
    ProjectType["SOFTWARE"] = "Software";
    ProjectType["MARKETING"] = "Marketing";
    ProjectType["CONSULTING"] = "Consultoría";
    ProjectType["OTHER"] = "Otros";
    return ProjectType;
}({});
const SUB_AREAS = {
    ["VENTAS"]: [
        "Preventa",
        "Postventa",
        "Renovaciones",
        "Nuevos Clientes"
    ],
    ["SOPORTE_TECNICO"]: [
        "Backend",
        "Frontend",
        "Infraestructura",
        "Base de Datos",
        "Mobile"
    ],
    ["FACTURACION"]: [
        "Cobranzas",
        "Facturación",
        "Pagos",
        "Reembolsos"
    ]
};
const STATUS_COLORS = {
    ["PENDIENTE"]: "bg-slate-100 text-slate-800 border-slate-200",
    ["EN_PROCESO"]: "bg-indigo-100 text-indigo-800 border-indigo-200",
    ["EN_REVISION"]: "bg-purple-100 text-purple-800 border-purple-200",
    ["RESUELTO"]: "bg-green-100 text-green-800 border-green-200",
    ["CANCELADO"]: "bg-gray-100 text-gray-800 border-gray-200"
};
const PRIORITY_COLORS = {
    ["BAJA"]: "text-slate-500",
    ["MEDIA"]: "text-blue-500",
    ["ALTA"]: "text-orange-500",
    ["URGENTE"]: "text-red-600 font-bold"
};
const STATUS_ALLOWED_ACTIONS = {
    ["PENDIENTE"]: {
        canEdit: true,
        canComment: true,
        canReassign: true,
        canResolve: false,
        allowedTransitions: [
            "EN_PROCESO",
            "CANCELADO"
        ]
    },
    ["EN_PROCESO"]: {
        canEdit: true,
        canComment: true,
        canReassign: true,
        canResolve: false,
        allowedTransitions: [
            "EN_REVISION",
            "PENDIENTE",
            "CANCELADO"
        ]
    },
    ["EN_REVISION"]: {
        canEdit: false,
        canComment: true,
        canReassign: false,
        canResolve: true,
        allowedTransitions: [
            "RESUELTO",
            "EN_PROCESO",
            "CANCELADO"
        ]
    },
    ["RESUELTO"]: {
        canEdit: false,
        canComment: false,
        canReassign: false,
        canResolve: false,
        allowedTransitions: [
            "EN_PROCESO"
        ] // Solo reabrir
    },
    ["CANCELADO"]: {
        canEdit: false,
        canComment: false,
        canReassign: false,
        canResolve: false,
        allowedTransitions: [] // Estado final
    }
};
const TRANSITION_REQUIREMENTS = {
    ["PENDIENTE"]: {
        description: "Reclamo pendiente de asignación"
    },
    ["EN_PROCESO"]: {
        requiresResponsable: true,
        requiresArea: true,
        description: "Requiere responsable o área asignada"
    },
    ["EN_REVISION"]: {
        requiresObservaciones: true,
        description: "Requiere observaciones o resumen de resolución propuesta"
    },
    ["RESUELTO"]: {
        requiresResolucion: true,
        description: "Requiere resumen final de la resolución"
    },
    ["CANCELADO"]: {
        requiresMotivo: true,
        description: "Requiere motivo de cancelación"
    }
};
const STATUS_LABELS = {
    ["PENDIENTE"]: "Pendiente",
    ["EN_PROCESO"]: "En Proceso",
    ["EN_REVISION"]: "En Revisión",
    ["RESUELTO"]: "Resuelto",
    ["CANCELADO"]: "Cancelado"
};
const PRIORITY_LABELS = {
    ["BAJA"]: "Baja",
    ["MEDIA"]: "Media",
    ["ALTA"]: "Alta",
    ["URGENTE"]: "Urgente"
};
const CRITICALITY_LABELS = {
    ["BAJA"]: "Baja",
    ["MEDIA"]: "Media",
    ["ALTA"]: "Alta",
    ["CRITICA"]: "Crítica"
};
const AREA_LABELS = {
    ["VENTAS"]: "Ventas",
    ["SOPORTE_TECNICO"]: "Soporte Técnico",
    ["FACTURACION"]: "Facturación"
};
const TYPE_LABELS = {
    ["INCIDENTE"]: "Incidente",
    ["CONSULTA"]: "Consulta",
    ["MEJORA"]: "Mejora",
    ["OTRO"]: "Otro"
};
const ROLE_LABELS = {
    ["admin"]: "Administrador",
    ["coordinador"]: "Coordinador",
    ["agente"]: "Agente",
    ["cliente"]: "Cliente"
};
}),
"[project]/lib/types.ts [app-ssr] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "TimelineEventType",
    ()=>TimelineEventType
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$constants$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/constants.ts [app-ssr] (ecmascript)");
;
;
var TimelineEventType = /*#__PURE__*/ function(TimelineEventType) {
    TimelineEventType["ESTADO"] = "ESTADO";
    TimelineEventType["AREA"] = "AREA";
    TimelineEventType["RESPONSABLE"] = "RESPONSABLE";
    return TimelineEventType;
}({});
}),
"[project]/lib/api.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "api",
    ()=>api,
    "getAuthToken",
    ()=>getAuthToken,
    "setAuthToken",
    ()=>setAuthToken
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$types$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/lib/types.ts [app-ssr] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$constants$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/constants.ts [app-ssr] (ecmascript)");
;
// ==========================================
// CONFIGURACIÓN
// ==========================================
const API_BASE_URL = ("TURBOPACK compile-time value", "http://localhost:4000") || "http://localhost:4000";
// Token storage
let authToken = null;
const setAuthToken = (token)=>{
    authToken = token;
    if (token) {
        localStorage.setItem("authToken", token);
    } else {
        localStorage.removeItem("authToken");
    }
};
const getAuthToken = ()=>{
    if (authToken) return authToken;
    if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
    ;
    return authToken;
};
// ==========================================
// FETCH HELPER
// ==========================================
async function apiFetch(endpoint, options = {}) {
    const token = getAuthToken();
    const headers = {
        "Content-Type": "application/json",
        ...token ? {
            Authorization: `Bearer ${token}`
        } : {},
        ...options.headers
    };
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers
    });
    if (!response.ok) {
        const error = await response.json().catch(()=>({
                message: "Error de red"
            }));
        throw new Error(error.message || `HTTP error! status: ${response.status}`);
    }
    // Para respuestas 204 No Content
    if (response.status === 204) {
        return undefined;
    }
    return response.json();
}
// ==========================================
// MAPPERS: Backend -> Frontend
// ==========================================
function mapBackendUser(user) {
    return {
        id: user._id,
        name: `${user.nombre} ${user.apellido}`,
        email: user.email,
        role: user.rol,
        area: user.areaAsignada,
        // clienteId puede venir como string o como objeto poblado
        clientId: typeof user.clienteId === 'string' ? user.clienteId : user.clienteId?._id || undefined
    };
}
function mapBackendClient(client) {
    return {
        id: client._id,
        name: client.nombre,
        lastName: client.apellido,
        identification: client.numDocumento,
        email: client.email,
        phone: client.numTelefono,
        birthDate: client.fechaNacimiento || '',
        createdAt: client.createdAt
    };
}
function mapBackendTipoProyecto(tipo) {
    return {
        id: tipo._id,
        nombre: tipo.nombre,
        descripcion: tipo.descripcion,
        createdAt: tipo.createdAt
    };
}
function mapBackendProject(project) {
    // Si viene del mapper simplificado, usar esos campos directamente
    if (project.clienteNombre && project.clienteApellido && project.tipoProyecto) {
        return {
            id: project._id,
            name: project.nombre,
            description: project.descripcion || '',
            clientId: '',
            clientName: `${project.clienteNombre} ${project.clienteApellido}`,
            tipoProyectoId: '',
            tipoProyectoName: project.tipoProyecto,
            startDate: project.fechaInicio || '',
            endDate: project.fechaFin || undefined,
            isActive: !project.isDeleted,
            createdAt: project.createdAt || ''
        };
    }
    // Si viene con populate (formato completo)
    const clienteId = typeof project.clienteId === "object" ? project.clienteId._id : project.clienteId;
    const clienteName = typeof project.clienteId === "object" ? `${project.clienteId.nombre} ${project.clienteId.apellido}` : undefined;
    const tipoProyectoId = typeof project.tipoProyectoId === "object" ? project.tipoProyectoId._id : project.tipoProyectoId;
    const tipoProyectoName = typeof project.tipoProyectoId === "object" ? project.tipoProyectoId.nombre : undefined;
    return {
        id: project._id,
        name: project.nombre,
        description: project.descripcion || '',
        clientId: clienteId || '',
        clientName: clienteName || 'N/A',
        tipoProyectoId: tipoProyectoId || '',
        tipoProyectoName: tipoProyectoName || 'N/A',
        startDate: project.fechaInicio || '',
        endDate: project.fechaFin || undefined,
        isActive: !project.isDeleted,
        createdAt: project.createdAt || ''
    };
}
function mapBackendClaim(claim) {
    // Si viene del mapper simplificado, usar esos campos directamente
    if (claim.clienteNombre && claim.clienteApellido && claim.proyectoNombre) {
        return {
            id: claim._id,
            codigo: claim.codigo,
            description: claim.descripcion || '',
            clientId: '',
            clientName: `${claim.clienteNombre} ${claim.clienteApellido}`,
            projectId: '',
            projectName: claim.proyectoNombre,
            tipoProyectoId: '',
            type: claim.tipo,
            status: claim.estadoActual,
            priority: claim.prioridad,
            criticality: claim.criticidad,
            area: claim.areaActual,
            assignedToId: '',
            assignedToName: claim.responsableNombre && claim.responsableApellido ? `${claim.responsableNombre} ${claim.responsableApellido}`.trim() : claim.responsableNombre || 'Sin asignar',
            createdByUserId: claim.creadoPorUsuarioId || '',
            canModify: claim.puedeModificar || false,
            canReassign: claim.puedeReasignar || false,
            resolutionSummary: claim.resumenResolucion || undefined,
            clientFeedback: claim.feedbackCliente || undefined,
            resolutionDate: claim.fechaResolucion || undefined,
            closedDate: claim.fechaCierre || undefined,
            createdAt: claim.createdAt,
            updatedAt: claim.updatedAt || ''
        };
    }
    // Si viene con populate (formato completo)
    const clienteId = typeof claim.clienteId === "object" ? claim.clienteId._id : claim.clienteId;
    const clienteName = typeof claim.clienteId === "object" ? `${claim.clienteId.nombre} ${claim.clienteId.apellido}` : undefined;
    const proyectoId = typeof claim.proyectoId === "object" ? claim.proyectoId._id : claim.proyectoId;
    const proyectoName = typeof claim.proyectoId === "object" ? claim.proyectoId.nombre : undefined;
    const tipoProyectoId = typeof claim.tipoProyectoId === "object" ? claim.tipoProyectoId._id : claim.tipoProyectoId;
    const responsableId = typeof claim.responsableActualId === "object" ? claim.responsableActualId._id : claim.responsableActualId;
    const responsableName = typeof claim.responsableActualId === "object" ? `${claim.responsableActualId.nombre} ${claim.responsableActualId.apellido}` : undefined;
    return {
        id: claim._id,
        codigo: claim.codigo,
        description: claim.descripcion || '',
        clientId: clienteId || '',
        clientName: clienteName || 'N/A',
        projectId: proyectoId || '',
        projectName: proyectoName || 'N/A',
        tipoProyectoId: tipoProyectoId || '',
        type: claim.tipo,
        status: claim.estadoActual,
        priority: claim.prioridad,
        criticality: claim.criticidad,
        area: claim.areaActual,
        assignedToId: responsableId || '',
        assignedToName: responsableName || 'Sin asignar',
        createdByUserId: claim.creadoPorUsuarioId || '',
        canModify: claim.puedeModificar || false,
        canReassign: claim.puedeReasignar || false,
        resolutionSummary: claim.resumenResolucion || undefined,
        clientFeedback: claim.feedbackCliente || undefined,
        resolutionDate: claim.fechaResolucion || undefined,
        closedDate: claim.fechaCierre || undefined,
        createdAt: claim.createdAt,
        updatedAt: claim.updatedAt || ''
    };
}
function mapBackendTimelineEvent(event) {
    return {
        id: event._id,
        claimId: event.reclamoId,
        tipoCambio: event.tipoCambio,
        fecha: event.fechaCambio || event.createdAt || '',
        // Cambio de ESTADO
        estadoAnterior: event.estadoAnterior,
        estadoNuevo: event.estadoNuevo,
        // Cambio de AREA
        areaAnterior: event.areaAnterior,
        areaNueva: event.areaNueva,
        // Cambio de RESPONSABLE
        responsableAnteriorId: event.responsableAnteriorId?._id,
        responsableAnteriorNombre: event.responsableAnteriorId ? `${event.responsableAnteriorId.nombre} ${event.responsableAnteriorId.apellido}` : undefined,
        responsableNuevoId: event.responsableNuevoId?._id,
        responsableNuevoNombre: event.responsableNuevoId ? `${event.responsableNuevoId.nombre} ${event.responsableNuevoId.apellido}` : undefined,
        // Campos comunes
        areaResponsable: event.areaResponsable,
        usuarioId: event.usuarioResponsableId?._id,
        usuarioNombre: event.usuarioResponsableId ? `${event.usuarioResponsableId.nombre} ${event.usuarioResponsableId.apellido}` : undefined,
        motivoCambio: event.motivoCambio,
        observaciones: event.observaciones
    };
}
const api = {
    // ==========================================
    // AUTH
    // ==========================================
    auth: {
        login: async (email, password)=>{
            const response = await apiFetch("/auth/login", {
                method: "POST",
                body: JSON.stringify({
                    email,
                    password
                })
            });
            setAuthToken(response.access_token);
            return {
                user: {
                    id: response.user.id,
                    name: `${response.user.nombre} ${response.user.apellido}`,
                    email: response.user.email,
                    role: response.user.rol,
                    area: response.user.areaAsignada,
                    clientId: response.user.clienteId
                },
                token: response.access_token
            };
        },
        logout: ()=>{
            setAuthToken(null);
        },
        getCurrentUser: async (id)=>{
            try {
                const user = await apiFetch(`/usuario/${id}`);
                return mapBackendUser(user);
            } catch  {
                return undefined;
            }
        }
    },
    // ==========================================
    // USUARIOS
    // ==========================================
    users: {
        list: async ()=>{
            const users = await apiFetch("/usuario");
            return users.map(mapBackendUser);
        },
        get: async (id)=>{
            try {
                const user = await apiFetch(`/usuario/${id}`);
                return mapBackendUser(user);
            } catch  {
                return undefined;
            }
        },
        listByRole: async (role)=>{
            const users = await apiFetch(`/usuario/rol/${role}`);
            return users.map(mapBackendUser);
        },
        listByArea: async (area)=>{
            const users = await apiFetch(`/usuario/area/${area}`);
            return users.map(mapBackendUser);
        },
        listAgents: async ()=>{
            const agents = await apiFetch(`/usuario/rol/agente`);
            const coordinators = await apiFetch(`/usuario/rol/coordinador`);
            return [
                ...agents,
                ...coordinators
            ].map(mapBackendUser);
        },
        listAgentsByArea: async (area)=>{
            const agents = await apiFetch(`/usuario/agentes/area/${area}`);
            return agents.map(mapBackendUser);
        },
        create: async (data)=>{
            const user = await apiFetch("/usuario", {
                method: "POST",
                body: JSON.stringify(data)
            });
            return mapBackendUser(user);
        },
        update: async (id, data)=>{
            const user = await apiFetch(`/usuario/${id}`, {
                method: "PATCH",
                body: JSON.stringify(data)
            });
            return mapBackendUser(user);
        },
        delete: async (id)=>{
            await apiFetch(`/usuario/${id}`, {
                method: "DELETE"
            });
        }
    },
    // ==========================================
    // CLIENTES
    // ==========================================
    clients: {
        list: async ()=>{
            const clients = await apiFetch("/cliente");
            return clients.map(mapBackendClient);
        },
        get: async (id)=>{
            try {
                const client = await apiFetch(`/cliente/${id}`);
                return mapBackendClient(client);
            } catch  {
                return undefined;
            }
        },
        search: async (filter)=>{
            const params = new URLSearchParams(filter);
            const clients = await apiFetch(`/cliente/search?${params}`);
            return clients.map(mapBackendClient);
        },
        create: async (data)=>{
            const client = await apiFetch("/cliente", {
                method: "POST",
                body: JSON.stringify(data)
            });
            return mapBackendClient(client);
        },
        update: async (id, data)=>{
            const client = await apiFetch(`/cliente/${id}`, {
                method: "PATCH",
                body: JSON.stringify(data)
            });
            return mapBackendClient(client);
        },
        delete: async (id)=>{
            await apiFetch(`/cliente/${id}`, {
                method: "DELETE"
            });
        }
    },
    // ==========================================
    // TIPOS DE PROYECTO
    // ==========================================
    tipoProyecto: {
        list: async ()=>{
            const tipos = await apiFetch("/tipo-proyecto");
            return tipos.map(mapBackendTipoProyecto);
        },
        get: async (id)=>{
            try {
                const tipo = await apiFetch(`/tipo-proyecto/${id}`);
                return mapBackendTipoProyecto(tipo);
            } catch  {
                return undefined;
            }
        },
        create: async (data)=>{
            const tipo = await apiFetch("/tipo-proyecto", {
                method: "POST",
                body: JSON.stringify(data)
            });
            return mapBackendTipoProyecto(tipo);
        },
        update: async (id, data)=>{
            const tipo = await apiFetch(`/tipo-proyecto/${id}`, {
                method: "PATCH",
                body: JSON.stringify(data)
            });
            return mapBackendTipoProyecto(tipo);
        },
        delete: async (id)=>{
            await apiFetch(`/tipo-proyecto/${id}`, {
                method: "DELETE"
            });
        }
    },
    // ==========================================
    // PROYECTOS
    // ==========================================
    projects: {
        list: async ()=>{
            const projects = await apiFetch("/proyecto");
            return projects.map(mapBackendProject);
        },
        get: async (id)=>{
            try {
                const project = await apiFetch(`/proyecto/${id}`);
                return mapBackendProject(project);
            } catch  {
                return undefined;
            }
        },
        listByClient: async (clientId)=>{
            const projects = await apiFetch(`/proyecto/cliente/${clientId}`);
            return projects.map(mapBackendProject);
        },
        listByTipoProyecto: async (tipoProyectoId)=>{
            const projects = await apiFetch(`/proyecto/tipo-proyecto/${tipoProyectoId}`);
            return projects.map(mapBackendProject);
        },
        search: async (filter)=>{
            const params = new URLSearchParams(filter);
            const projects = await apiFetch(`/proyecto/search?${params}`);
            return projects.map(mapBackendProject);
        },
        create: async (data)=>{
            const project = await apiFetch("/proyecto", {
                method: "POST",
                body: JSON.stringify(data)
            });
            return mapBackendProject(project);
        },
        update: async (id, data)=>{
            const project = await apiFetch(`/proyecto/${id}`, {
                method: "PATCH",
                body: JSON.stringify(data)
            });
            return mapBackendProject(project);
        },
        delete: async (id)=>{
            await apiFetch(`/proyecto/${id}`, {
                method: "DELETE"
            });
        }
    },
    // ==========================================
    // RECLAMOS
    // ==========================================
    claims: {
        list: async (page = 1, limit = 10, filter)=>{
            // El endpoint /reclamo ahora retorna un array simple (formato simplificado)
            const filterParams = filter ? new URLSearchParams(filter).toString() : "";
            const params = filterParams ? `?${filterParams}` : "";
            const claims = await apiFetch(`/reclamo${params}`);
            // Simular paginación en el cliente
            const total = claims.length;
            const startIndex = (page - 1) * limit;
            const endIndex = startIndex + limit;
            const paginatedClaims = claims.slice(startIndex, endIndex);
            return {
                data: paginatedClaims.map(mapBackendClaim),
                meta: {
                    total,
                    page,
                    limit,
                    totalPages: Math.ceil(total / limit),
                    hasNextPage: endIndex < total,
                    hasPreviousPage: page > 1
                }
            };
        },
        get: async (id)=>{
            try {
                const claim = await apiFetch(`/reclamo/${id}`);
                return mapBackendClaim(claim);
            } catch  {
                return undefined;
            }
        },
        listByClient: async (clientId, page = 1, limit = 10)=>{
            const response = await apiFetch(`/reclamo/cliente/${clientId}?page=${page}&limit=${limit}`);
            return {
                data: response.data.map(mapBackendClaim),
                meta: response.meta
            };
        },
        listByProject: async (projectId)=>{
            const claims = await apiFetch(`/reclamo/proyecto/${projectId}`);
            return claims.map(mapBackendClaim);
        },
        listByTipoProyecto: async (tipoProyectoId)=>{
            const claims = await apiFetch(`/reclamo/tipo-proyecto/${tipoProyectoId}`);
            return claims.map(mapBackendClaim);
        },
        listByArea: async (area)=>{
            const claims = await apiFetch(`/reclamo/area/${area}`);
            return claims.map(mapBackendClaim);
        },
        search: async (filter)=>{
            const params = new URLSearchParams(filter);
            const claims = await apiFetch(`/reclamo/search?${params}`);
            return claims.map(mapBackendClaim);
        },
        create: async (data)=>{
            const claim = await apiFetch("/reclamo", {
                method: "POST",
                body: JSON.stringify(data)
            });
            return mapBackendClaim(claim);
        },
        update: async (id, data)=>{
            const claim = await apiFetch(`/reclamo/${id}`, {
                method: "PATCH",
                body: JSON.stringify(data)
            });
            return mapBackendClaim(claim);
        },
        assignArea: async (id, data)=>{
            const claim = await apiFetch(`/reclamo/${id}/asignar-area`, {
                method: "PATCH",
                body: JSON.stringify(data)
            });
            return mapBackendClaim(claim);
        },
        assignResponsable: async (id, data)=>{
            const claim = await apiFetch(`/reclamo/${id}/asignar-responsable`, {
                method: "PATCH",
                body: JSON.stringify(data)
            });
            return mapBackendClaim(claim);
        },
        delete: async (id)=>{
            await apiFetch(`/reclamo/${id}`, {
                method: "DELETE"
            });
        }
    },
    // ==========================================
    // ESTADO DE RECLAMOS
    // ==========================================
    claimStatus: {
        changeStatus: async (reclamoId, data)=>{
            const claim = await apiFetch(`/reclamo/${reclamoId}/estado/cambiar`, {
                method: "POST",
                body: JSON.stringify(data)
            });
            return mapBackendClaim(claim);
        },
        getHistory: async (reclamoId)=>{
            const events = await apiFetch(`/reclamo/${reclamoId}/estado/historial`);
            return events.map(mapBackendTimelineEvent);
        },
        canModify: async (reclamoId)=>{
            const response = await apiFetch(`/reclamo/${reclamoId}/estado/puede-modificar`);
            return response.canModify;
        },
        canReassign: async (reclamoId)=>{
            const response = await apiFetch(`/reclamo/${reclamoId}/estado/puede-reasignar`);
            return response.canReassign;
        },
        getStatusInfo: async ()=>{
            return apiFetch("/reclamo/estados/info");
        }
    },
    // ==========================================
    // TIMELINE (usa historial de estados)
    // ==========================================
    timeline: {
        getByClaimId: async (claimId)=>{
            return api.claimStatus.getHistory(claimId);
        }
    },
    // ==========================================
    // ESTADÍSTICAS
    // ==========================================
    statistics: {
        getResumen: async (fechaInicio, fechaFin)=>{
            const params = new URLSearchParams();
            if (fechaInicio) params.append('fechaInicio', fechaInicio);
            if (fechaFin) params.append('fechaFin', fechaFin);
            const queryString = params.toString() ? `?${params.toString()}` : '';
            return await apiFetch(`/reporte/estadisticas/resumen${queryString}`);
        },
        getCargaTrabajo: async (fechaInicio, fechaFin, area)=>{
            const params = new URLSearchParams();
            if (fechaInicio) params.append('fechaInicio', fechaInicio);
            if (fechaFin) params.append('fechaFin', fechaFin);
            if (area) params.append('area', area);
            const queryString = params.toString() ? `?${params.toString()}` : '';
            return await apiFetch(`/reporte/estadisticas/carga-trabajo${queryString}`);
        },
        getTiempoResolucion: async ()=>{
            return await apiFetch('/reporte/estadisticas/tiempo-resolucion');
        },
        getReclamosPorEstado: async (fechaInicio, fechaFin)=>{
            const params = new URLSearchParams();
            if (fechaInicio) params.append('fechaInicio', fechaInicio);
            if (fechaFin) params.append('fechaFin', fechaFin);
            const queryString = params.toString() ? `?${params.toString()}` : '';
            return await apiFetch(`/reporte/estadisticas/por-estado${queryString}`);
        },
        getOverview: async ()=>{
            // Obtener todos los reclamos (sin paginación para estadísticas)
            const response = await api.claims.list(1, 1000) // Obtener hasta 1000 reclamos
            ;
            const claims = response.data;
            const users = await api.users.list();
            // Claims by status
            const claimsByStatus = Object.values(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$constants$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ClaimStatus"]).reduce((acc, status)=>{
                acc[status] = claims.filter((c)=>c.status === status).length;
                return acc;
            }, {});
            // Claims by area
            const claimsByArea = Object.values(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$constants$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ClaimArea"]).reduce((acc, area)=>{
                acc[area] = claims.filter((c)=>c.area === area).length;
                return acc;
            }, {});
            // Claims by type
            const claimsByType = Object.values(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$constants$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ClaimType"]).reduce((acc, type)=>{
                acc[type] = claims.filter((c)=>c.type === type).length;
                return acc;
            }, {});
            // Claims by priority
            const claimsByPriority = Object.values(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$constants$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ClaimPriority"]).reduce((acc, priority)=>{
                acc[priority] = claims.filter((c)=>c.priority === priority).length;
                return acc;
            }, {});
            // Claims by month (last 6 months)
            const now = new Date();
            const monthNames = [
                "Ene",
                "Feb",
                "Mar",
                "Abr",
                "May",
                "Jun",
                "Jul",
                "Ago",
                "Sep",
                "Oct",
                "Nov",
                "Dic"
            ];
            const claimsByMonth = Array.from({
                length: 6
            }, (_, i)=>{
                const date = new Date(now.getFullYear(), now.getMonth() - (5 - i), 1);
                const monthStart = date.toISOString();
                const nextMonth = new Date(date.getFullYear(), date.getMonth() + 1, 1);
                const monthEnd = nextMonth.toISOString();
                return {
                    month: monthNames[date.getMonth()],
                    count: claims.filter((c)=>c.createdAt >= monthStart && c.createdAt < monthEnd).length
                };
            });
            // Resolution time calculation
            const resolvedClaims = claims.filter((c)=>c.resolutionDate);
            const avgResolutionTimeHours = resolvedClaims.length > 0 ? resolvedClaims.reduce((sum, c)=>{
                const created = new Date(c.createdAt).getTime();
                const resolved = new Date(c.resolutionDate).getTime();
                return sum + (resolved - created) / (1000 * 60 * 60);
            }, 0) / resolvedClaims.length : 0;
            // Avg resolution time by type
            const avgResolutionTimeByType = Object.values(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$constants$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ClaimType"]).reduce((acc, type)=>{
                const typeClaims = resolvedClaims.filter((c)=>c.type === type);
                if (typeClaims.length > 0) {
                    acc[type] = typeClaims.reduce((sum, c)=>{
                        const created = new Date(c.createdAt).getTime();
                        const resolved = new Date(c.resolutionDate).getTime();
                        return sum + (resolved - created) / (1000 * 60 * 60);
                    }, 0) / typeClaims.length;
                } else {
                    acc[type] = 0;
                }
                return acc;
            }, {});
            // Claims per agent
            const agents = users.filter((u)=>u.role === __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$constants$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["UserRole"].AGENT || u.role === __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$constants$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["UserRole"].COORDINATOR);
            const claimsPerAgent = agents.map((agent)=>({
                    agentId: agent.id,
                    agentName: agent.name,
                    count: claims.filter((c)=>c.assignedToId === agent.id).length,
                    resolved: claims.filter((c)=>c.assignedToId === agent.id && c.status === __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$constants$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ClaimStatus"].RESOLVED).length
                }));
            return {
                totalClaims: claims.length,
                claimsByStatus,
                claimsByArea,
                claimsByType,
                claimsByPriority,
                claimsByMonth,
                avgResolutionTimeHours,
                avgResolutionTimeByType,
                claimsPerAgent
            };
        }
    },
    // ==========================================
    // NOTIFICACIONES (stub - no implementado en backend)
    // ==========================================
    notifications: {
        listByUser: async (userId)=>{
            // Backend no implementa notificaciones aún, retornar array vacío
            return [];
        },
        markAsRead: async (notificationId)=>{
        // Stub
        },
        markAllAsRead: async (userId)=>{
        // Stub
        }
    }
};
}),
"[project]/lib/auth-context.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "AuthProvider",
    ()=>AuthProvider,
    "useAuth",
    ()=>useAuth
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/api.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$constants$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/constants.ts [app-ssr] (ecmascript)");
"use client";
;
;
;
;
;
const AuthContext = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createContext"])(undefined);
function AuthProvider({ children }) {
    const [user, setUser] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const [isLoading, setIsLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(true);
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRouter"])();
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        const checkSession = async ()=>{
            const storedUserId = localStorage.getItem("claim_sys_user_id");
            const token = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getAuthToken"])();
            if (storedUserId && token) {
                try {
                    const user = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["api"].auth.getCurrentUser(storedUserId);
                    if (user) {
                        setUser(user);
                    } else {
                        // Token inválido o usuario no existe
                        localStorage.removeItem("claim_sys_user_id");
                        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["setAuthToken"])(null);
                    }
                } catch (e) {
                    console.error("Session check failed", e);
                    localStorage.removeItem("claim_sys_user_id");
                    (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["setAuthToken"])(null);
                }
            }
            setIsLoading(false);
        };
        checkSession();
    }, []);
    const login = async (email, password)=>{
        setIsLoading(true);
        setError(null);
        try {
            const { user: loggedUser, token } = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["api"].auth.login(email, password);
            setUser(loggedUser);
            localStorage.setItem("claim_sys_user_id", loggedUser.id);
            // Redirect based on role
            if (loggedUser.role === __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$constants$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["UserRole"].CLIENT) {
                router.push("/home");
            } else {
                router.push("/claims");
            }
        } catch (err) {
            console.error("Login failed", err);
            const message = err instanceof Error ? err.message : "Error al iniciar sesión";
            setError(message);
            throw err;
        } finally{
            setIsLoading(false);
        }
    };
    const logout = ()=>{
        setUser(null);
        localStorage.removeItem("claim_sys_user_id");
        __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$api$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["api"].auth.logout();
        router.push("/login");
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(AuthContext.Provider, {
        value: {
            user,
            login,
            logout,
            isLoading,
            error
        },
        children: children
    }, void 0, false, {
        fileName: "[project]/lib/auth-context.tsx",
        lineNumber: 84,
        columnNumber: 10
    }, this);
}
const useAuth = ()=>{
    const context = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useContext"])(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};
}),
"[project]/hooks/use-toast.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "reducer",
    ()=>reducer,
    "toast",
    ()=>toast,
    "useToast",
    ()=>useToast
]);
// Inspired by react-hot-toast library
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
'use client';
;
const TOAST_LIMIT = 1;
const TOAST_REMOVE_DELAY = 1000000;
const actionTypes = {
    ADD_TOAST: 'ADD_TOAST',
    UPDATE_TOAST: 'UPDATE_TOAST',
    DISMISS_TOAST: 'DISMISS_TOAST',
    REMOVE_TOAST: 'REMOVE_TOAST'
};
let count = 0;
function genId() {
    count = (count + 1) % Number.MAX_SAFE_INTEGER;
    return count.toString();
}
const toastTimeouts = new Map();
const addToRemoveQueue = (toastId)=>{
    if (toastTimeouts.has(toastId)) {
        return;
    }
    const timeout = setTimeout(()=>{
        toastTimeouts.delete(toastId);
        dispatch({
            type: 'REMOVE_TOAST',
            toastId: toastId
        });
    }, TOAST_REMOVE_DELAY);
    toastTimeouts.set(toastId, timeout);
};
const reducer = (state, action)=>{
    switch(action.type){
        case 'ADD_TOAST':
            return {
                ...state,
                toasts: [
                    action.toast,
                    ...state.toasts
                ].slice(0, TOAST_LIMIT)
            };
        case 'UPDATE_TOAST':
            return {
                ...state,
                toasts: state.toasts.map((t)=>t.id === action.toast.id ? {
                        ...t,
                        ...action.toast
                    } : t)
            };
        case 'DISMISS_TOAST':
            {
                const { toastId } = action;
                // ! Side effects ! - This could be extracted into a dismissToast() action,
                // but I'll keep it here for simplicity
                if (toastId) {
                    addToRemoveQueue(toastId);
                } else {
                    state.toasts.forEach((toast)=>{
                        addToRemoveQueue(toast.id);
                    });
                }
                return {
                    ...state,
                    toasts: state.toasts.map((t)=>t.id === toastId || toastId === undefined ? {
                            ...t,
                            open: false
                        } : t)
                };
            }
        case 'REMOVE_TOAST':
            if (action.toastId === undefined) {
                return {
                    ...state,
                    toasts: []
                };
            }
            return {
                ...state,
                toasts: state.toasts.filter((t)=>t.id !== action.toastId)
            };
    }
};
const listeners = [];
let memoryState = {
    toasts: []
};
function dispatch(action) {
    memoryState = reducer(memoryState, action);
    listeners.forEach((listener)=>{
        listener(memoryState);
    });
}
function toast({ ...props }) {
    const id = genId();
    const update = (props)=>dispatch({
            type: 'UPDATE_TOAST',
            toast: {
                ...props,
                id
            }
        });
    const dismiss = ()=>dispatch({
            type: 'DISMISS_TOAST',
            toastId: id
        });
    dispatch({
        type: 'ADD_TOAST',
        toast: {
            ...props,
            id,
            open: true,
            onOpenChange: (open)=>{
                if (!open) dismiss();
            }
        }
    });
    return {
        id: id,
        dismiss,
        update
    };
}
function useToast() {
    const [state, setState] = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"](memoryState);
    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"](()=>{
        listeners.push(setState);
        return ()=>{
            const index = listeners.indexOf(setState);
            if (index > -1) {
                listeners.splice(index, 1);
            }
        };
    }, [
        state
    ]);
    return {
        ...state,
        toast,
        dismiss: (toastId)=>dispatch({
                type: 'DISMISS_TOAST',
                toastId
            })
    };
}
;
}),
"[project]/lib/utils.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "cn",
    ()=>cn
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$clsx$2f$dist$2f$clsx$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/clsx/dist/clsx.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$tailwind$2d$merge$2f$dist$2f$bundle$2d$mjs$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/tailwind-merge/dist/bundle-mjs.mjs [app-ssr] (ecmascript)");
;
;
function cn(...inputs) {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$tailwind$2d$merge$2f$dist$2f$bundle$2d$mjs$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["twMerge"])((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$clsx$2f$dist$2f$clsx$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["clsx"])(inputs));
}
}),
"[project]/components/ui/toast.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Toast",
    ()=>Toast,
    "ToastAction",
    ()=>ToastAction,
    "ToastClose",
    ()=>ToastClose,
    "ToastDescription",
    ()=>ToastDescription,
    "ToastProvider",
    ()=>ToastProvider,
    "ToastTitle",
    ()=>ToastTitle,
    "ToastViewport",
    ()=>ToastViewport
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$toast$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@radix-ui/react-toast/dist/index.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$class$2d$variance$2d$authority$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/class-variance-authority/dist/index.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/x.js [app-ssr] (ecmascript) <export default as X>");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/utils.ts [app-ssr] (ecmascript)");
'use client';
;
;
;
;
;
;
const ToastProvider = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$toast$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Provider"];
const ToastViewport = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["forwardRef"](({ className, ...props }, ref)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$toast$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Viewport"], {
        ref: ref,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])('fixed top-0 z-[100] flex max-h-screen w-full flex-col-reverse p-4 sm:bottom-0 sm:right-0 sm:top-auto sm:flex-col md:max-w-[420px]', className),
        ...props
    }, void 0, false, {
        fileName: "[project]/components/ui/toast.tsx",
        lineNumber: 16,
        columnNumber: 3
    }, ("TURBOPACK compile-time value", void 0)));
ToastViewport.displayName = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$toast$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Viewport"].displayName;
const toastVariants = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$class$2d$variance$2d$authority$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cva"])('group pointer-events-auto relative flex w-full items-center justify-between space-x-4 overflow-hidden rounded-md border p-6 pr-8 shadow-lg transition-all data-[swipe=cancel]:translate-x-0 data-[swipe=end]:translate-x-[var(--radix-toast-swipe-end-x)] data-[swipe=move]:translate-x-[var(--radix-toast-swipe-move-x)] data-[swipe=move]:transition-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[swipe=end]:animate-out data-[state=closed]:fade-out-80 data-[state=closed]:slide-out-to-right-full data-[state=open]:slide-in-from-top-full data-[state=open]:sm:slide-in-from-bottom-full', {
    variants: {
        variant: {
            default: 'border bg-background text-foreground',
            destructive: 'destructive group border-destructive bg-destructive text-destructive-foreground'
        }
    },
    defaultVariants: {
        variant: 'default'
    }
});
const Toast = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["forwardRef"](({ className, variant, ...props }, ref)=>{
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$toast$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Root"], {
        ref: ref,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])(toastVariants({
            variant
        }), className),
        ...props
    }, void 0, false, {
        fileName: "[project]/components/ui/toast.tsx",
        lineNumber: 49,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
});
Toast.displayName = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$toast$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Root"].displayName;
const ToastAction = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["forwardRef"](({ className, ...props }, ref)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$toast$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Action"], {
        ref: ref,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])('inline-flex h-8 shrink-0 items-center justify-center rounded-md border bg-transparent px-3 text-sm font-medium ring-offset-background transition-colors hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 group-[.destructive]:border-muted/40 group-[.destructive]:hover:border-destructive/30 group-[.destructive]:hover:bg-destructive group-[.destructive]:hover:text-destructive-foreground group-[.destructive]:focus:ring-destructive', className),
        ...props
    }, void 0, false, {
        fileName: "[project]/components/ui/toast.tsx",
        lineNumber: 62,
        columnNumber: 3
    }, ("TURBOPACK compile-time value", void 0)));
ToastAction.displayName = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$toast$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Action"].displayName;
const ToastClose = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["forwardRef"](({ className, ...props }, ref)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$toast$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Close"], {
        ref: ref,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])('absolute right-2 top-2 rounded-md p-1 text-foreground/50 opacity-0 transition-opacity hover:text-foreground focus:opacity-100 focus:outline-none focus:ring-2 group-hover:opacity-100 group-[.destructive]:text-red-300 group-[.destructive]:hover:text-red-50 group-[.destructive]:focus:ring-red-400 group-[.destructive]:focus:ring-offset-red-600', className),
        "toast-close": "",
        ...props,
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__["X"], {
            className: "h-4 w-4"
        }, void 0, false, {
            fileName: "[project]/components/ui/toast.tsx",
            lineNumber: 86,
            columnNumber: 5
        }, ("TURBOPACK compile-time value", void 0))
    }, void 0, false, {
        fileName: "[project]/components/ui/toast.tsx",
        lineNumber: 77,
        columnNumber: 3
    }, ("TURBOPACK compile-time value", void 0)));
ToastClose.displayName = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$toast$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Close"].displayName;
const ToastTitle = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["forwardRef"](({ className, ...props }, ref)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$toast$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Title"], {
        ref: ref,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])('text-sm font-semibold', className),
        ...props
    }, void 0, false, {
        fileName: "[project]/components/ui/toast.tsx",
        lineNumber: 95,
        columnNumber: 3
    }, ("TURBOPACK compile-time value", void 0)));
ToastTitle.displayName = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$toast$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Title"].displayName;
const ToastDescription = /*#__PURE__*/ __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["forwardRef"](({ className, ...props }, ref)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$toast$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Description"], {
        ref: ref,
        className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["cn"])('text-sm opacity-90', className),
        ...props
    }, void 0, false, {
        fileName: "[project]/components/ui/toast.tsx",
        lineNumber: 107,
        columnNumber: 3
    }, ("TURBOPACK compile-time value", void 0)));
ToastDescription.displayName = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$radix$2d$ui$2f$react$2d$toast$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Description"].displayName;
;
}),
"[project]/components/ui/toaster.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Toaster",
    ()=>Toaster
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$use$2d$toast$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/hooks/use-toast.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$toast$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/toast.tsx [app-ssr] (ecmascript)");
'use client';
;
;
;
function Toaster() {
    const { toasts } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$use$2d$toast$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useToast"])();
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$toast$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ToastProvider"], {
        children: [
            toasts.map(function({ id, title, description, action, ...props }) {
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$toast$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Toast"], {
                    ...props,
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "grid gap-1",
                            children: [
                                title && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$toast$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ToastTitle"], {
                                    children: title
                                }, void 0, false, {
                                    fileName: "[project]/components/ui/toaster.tsx",
                                    lineNumber: 22,
                                    columnNumber: 25
                                }, this),
                                description && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$toast$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ToastDescription"], {
                                    children: description
                                }, void 0, false, {
                                    fileName: "[project]/components/ui/toaster.tsx",
                                    lineNumber: 24,
                                    columnNumber: 17
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/ui/toaster.tsx",
                            lineNumber: 21,
                            columnNumber: 13
                        }, this),
                        action,
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$toast$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ToastClose"], {}, void 0, false, {
                            fileName: "[project]/components/ui/toaster.tsx",
                            lineNumber: 28,
                            columnNumber: 13
                        }, this)
                    ]
                }, id, true, {
                    fileName: "[project]/components/ui/toaster.tsx",
                    lineNumber: 20,
                    columnNumber: 11
                }, this);
            }),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$toast$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ToastViewport"], {}, void 0, false, {
                fileName: "[project]/components/ui/toaster.tsx",
                lineNumber: 32,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/ui/toaster.tsx",
        lineNumber: 17,
        columnNumber: 5
    }, this);
}
}),
"[project]/components/theme-provider.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ThemeProvider",
    ()=>ThemeProvider
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2d$themes$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next-themes/dist/index.mjs [app-ssr] (ecmascript)");
'use client';
;
;
function ThemeProvider({ children, ...props }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2d$themes$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["ThemeProvider"], {
        ...props,
        children: children
    }, void 0, false, {
        fileName: "[project]/components/theme-provider.tsx",
        lineNumber: 10,
        columnNumber: 10
    }, this);
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__20b92a6f._.js.map