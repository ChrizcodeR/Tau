import { useState } from "react"
import { useTickets } from "@/hooks/useTickets"
import { useMembers } from "@/hooks/useMembers"
import { useTicketTypes } from "@/hooks/useTicketTypes"
import { 
  Dialog,
  DialogContent,
  DialogTitle
} from "@mui/material"
import { Button } from "@/components/ui/button"
import { Add, Delete, Save, Assignment, AssignmentTurnedIn, AssignmentLate, SupportAgent, Edit, Download, Search, FilterList, UploadFile } from "@mui/icons-material"
import { ChevronUp, ChevronDown, ChevronsUpDown } from "lucide-react"
import { motion } from "framer-motion"
import * as XLSX from "xlsx"

const statusOptions = ["Pendiente", "En progreso", "Completado"]

const Tickets = () => {
  const { tickets, loading, error, addTicket, deleteTicket, fetchTickets, updateTicket } = useTickets()
  const { members } = useMembers()
  const { ticketTypes } = useTicketTypes()
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState({
    reference: "",
    name: "",
    status: "Pendiente",
    description: "",
    datefinished: "",
    asignatedto: [],
    createdto: "",
    type: ""
  })
  const [editId, setEditId] = useState<string | null>(null)

  // Estadísticas (con validaciones mejoradas)
  const totalTickets = tickets.length
  
  // Función helper para normalizar estados
  const normalizeStatus = (status) => {
    if (!status) return ""
    return status.toString().trim().toLowerCase()
  }
  
  // Conteos de estados (case-insensitive y con trim)
  const pendientes = tickets.filter(t => {
    const status = normalizeStatus(t.status)
    return status === "pendiente"
  }).length
  
  const cerrados = tickets.filter(t => {
    const status = normalizeStatus(t.status)
    return status === "completado"
  }).length
  
  const enProgreso = tickets.filter(t => {
    const status = normalizeStatus(t.status)
    return status === "en progreso"
  }).length
  
  // Verificar si hay estados no reconocidos (para debugging)
  const estadosDesconocidos = tickets.filter(t => {
    const status = normalizeStatus(t.status)
    return status !== "" && status !== "pendiente" && status !== "completado" && status !== "en progreso"
  })
  
  // Si hay estados desconocidos, mostrar en consola para debugging
  if (estadosDesconocidos.length > 0) {
    console.log("Estados no reconocidos encontrados:", estadosDesconocidos.map(t => t.status))
  }
  
  const progreso = totalTickets > 0 ? Math.round((cerrados / totalTickets) * 100) : 0
  
  // Tipo de soporte más creado (mejorado con cantidad)
  const tipoMasCreado = (() => {
    if (tickets.length === 0) return { nombre: "-", cantidad: 0 }
    
    const counts = {}
    tickets.forEach(t => {
      // Usar expand para datos relacionados
      const tipo = t.expand?.type?.name || "Sin tipo"
      
      if (tipo && tipo !== "Sin tipo" && tipo.trim() !== "") {
        const tipoNormalizado = tipo.trim()
        counts[tipoNormalizado] = (counts[tipoNormalizado] || 0) + 1
      }
    })
    
    // Encontrar el tipo con más ocurrencias
    let max = 0
    let tipoMasComun = "-"
    Object.entries(counts).forEach(([tipo, cantidad]) => {
      if (Number(cantidad) > max) {
        max = Number(cantidad)
        tipoMasComun = tipo
      }
    })
    
    return { nombre: tipoMasComun, cantidad: max }
  })()

  // Filtros y búsqueda
  const [search, setSearch] = useState("")
  const [filtersOpen, setFiltersOpen] = useState(false)
  const [filterStatus, setFilterStatus] = useState("")
  const [filterType, setFilterType] = useState("")
  const [filterAsignado, setFilterAsignado] = useState("")
  const [filterDateFrom, setFilterDateFrom] = useState("")
  const [filterDateTo, setFilterDateTo] = useState("")

  // Paginación
  const [currentPage, setCurrentPage] = useState(1)
  const recordsPerPage = 20

  // Ordenamiento
  const [sortField, setSortField] = useState("")
  const [sortDirection, setSortDirection] = useState("asc")

  // Función para manejar ordenamiento
  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDirection("asc")
    }
    setCurrentPage(1) // Resetear a primera página al ordenar
  }

  // Función para obtener el icono de ordenamiento
  const getSortIcon = (field) => {
    if (sortField !== field) {
      return <ChevronsUpDown className="w-4 h-4 text-gray-400" />
    }
    return sortDirection === "asc" ? 
      <ChevronUp className="w-4 h-4 text-blue-500" /> : 
      <ChevronDown className="w-4 h-4 text-blue-500" />
  }

  // Tickets filtrados
  const filteredTickets = tickets.filter(t => {
    const matchesSearch =
      t.reference?.toLowerCase().includes(search.toLowerCase()) ||
      t.name?.toLowerCase().includes(search.toLowerCase()) ||
      t.description?.toLowerCase().includes(search.toLowerCase()) ||
      t.expand?.asignatedto?.some(m => m.name.toLowerCase().includes(search.toLowerCase()))
    const matchesStatus = filterStatus ? t.status === filterStatus : true
    const matchesType = filterType ? t.expand?.type?.name === filterType : true
    const matchesAsignado = filterAsignado ? t.expand?.asignatedto?.some(m => m.id === filterAsignado) : true
    
    // Filtros por fecha de creación (campo 'created' de PocketBase)
    const fechaCreacion = t.created ? t.created.substring(0, 10) : null // Convertir a formato YYYY-MM-DD
    const matchesDateFrom = filterDateFrom ? fechaCreacion && fechaCreacion >= filterDateFrom : true
    const matchesDateTo = filterDateTo ? fechaCreacion && fechaCreacion <= filterDateTo : true
    
    return matchesSearch && matchesStatus && matchesType && matchesAsignado && matchesDateFrom && matchesDateTo
  })

  // Tickets ordenados
  const sortedTickets = [...filteredTickets].sort((a, b) => {
    if (!sortField) return 0

    let aValue, bValue

    switch (sortField) {
      case "reference":
        aValue = a.reference || ""
        bValue = b.reference || ""
        break
      case "name":
        aValue = a.name || ""
        bValue = b.name || ""
        break
      case "status":
        aValue = a.status || ""
        bValue = b.status || ""
        break
      case "type":
        aValue = a.expand?.type?.name || ""
        bValue = b.expand?.type?.name || ""
        break
      case "asignatedto":
        aValue = a.expand?.asignatedto?.[0]?.name || ""
        bValue = b.expand?.asignatedto?.[0]?.name || ""
        break
      case "created":
        aValue = a.created || ""
        bValue = b.created || ""
        break
      default:
        return 0
    }

    if (aValue < bValue) return sortDirection === "asc" ? -1 : 1
    if (aValue > bValue) return sortDirection === "asc" ? 1 : -1
    return 0
  })

  // Paginación
  const totalRecords = sortedTickets.length
  const totalPages = Math.ceil(totalRecords / recordsPerPage)
  const startIndex = (currentPage - 1) * recordsPerPage
  const endIndex = startIndex + recordsPerPage
  const paginatedTickets = sortedTickets.slice(startIndex, endIndex)

  // Reset página cuando cambian los filtros
  const resetToFirstPage = () => setCurrentPage(1)

  // Exportar a Excel
  const handleExportExcel = () => {
    const data = sortedTickets.map(t => ({
      Referencia: t.reference,
      Nombre: t.name,
      Estado: t.status,
      Tipo: t.expand?.type?.name,
      Asignados: t.expand?.asignatedto?.map(m => m.name).join(", "),
      "Fecha Creación": t.created ? new Date(t.created).toLocaleDateString('es-ES') : "",
      "Fecha Finalización": t.datefinished,
      Descripción: t.description
    }))
    const ws = XLSX.utils.json_to_sheet(data)
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, "Tickets")
    XLSX.writeFile(wb, "tickets.xlsx")
  }
  // Exportar a CSV
  const handleExportCSV = () => {
    const data = sortedTickets.map(t => ({
      Referencia: t.reference,
      Nombre: t.name,
      Estado: t.status,
      Tipo: t.expand?.type?.name,
      Asignados: t.expand?.asignatedto?.map(m => m.name).join(", "),
      "Fecha Creación": t.created ? new Date(t.created).toLocaleDateString('es-ES') : "",
      "Fecha Finalización": t.datefinished,
      Descripción: t.description
    }))
    const ws = XLSX.utils.json_to_sheet(data)
    const csv = XLSX.utils.sheet_to_csv(ws)
    const blob = new Blob([csv], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "tickets.csv"
    a.click()
    window.URL.revokeObjectURL(url)
  }

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }



  const handleEdit = (ticket) => {
    setForm({
      reference: ticket.reference,
      name: ticket.name,
      status: ticket.status,
      description: ticket.description,
      datefinished: ticket.datefinished || "",
      asignatedto: ticket.asignatedto,
      createdto: ticket.expand?.createdto?.name || ticket.createdto || "",
      type: ticket.type
    })
    setEditId(ticket.id)
    setOpen(true)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.reference || !form.name || !form.status || !form.type || !form.createdto) return
    try {
      if (editId) {
        // Editar ticket existente
        await updateTicket(editId, form)
      } else {
        await addTicket(form)
      }
      setForm({
        reference: "",
        name: "",
        status: "Pendiente",
        description: "",
        datefinished: "",
        asignatedto: [],
        createdto: "",
        type: ""
      })
      setEditId(null)
      setOpen(false)
    } catch (err) {
      console.error("Error al guardar ticket", err)
    }
  }

  const handleDelete = async (id) => {
    try {
      await deleteTicket(id)
    } catch (err) {
      console.error("Error al eliminar ticket", err)
    }
  }

  // Estado para importación
  const [importOpen, setImportOpen] = useState(false);
  const [importedRows, setImportedRows] = useState([]);
  const [importError, setImportError] = useState("");
  const [importLoading, setImportLoading] = useState(false);

  // Descarga plantilla de ejemplo
  const handleDownloadTemplate = () => {
    // Obtener nombres reales para los ejemplos
    const ejemploAsignado = members.length > 0 ? 
      members[0].name : 
      "Juan Pérez";
    
    const ejemploCreador = "Ana García";
    
    const ejemploTipo = ticketTypes.length > 0 ? 
      ticketTypes[0].name : 
      "Soporte Técnico";

    const example = [
      {
        id: "",
        reference: "TCK-001",
        name: "Ejemplo de ticket",
        status: "Pendiente",
        description: "Descripción de ejemplo del ticket",
        datefinished: "2024-06-01",
        asignatedto: ejemploAsignado,
        createdto: ejemploCreador,
        type: ejemploTipo
      },
      {
        id: "",
        reference: "TCK-002", 
        name: "Segundo ejemplo",
        status: "En progreso",
        description: "Otro ejemplo de ticket",
        datefinished: "",
        asignatedto: members.length > 1 ? members[1].name : "Luis Martínez",
        createdto: ejemploCreador,
        type: ejemploTipo
      }
    ];
    const ws = XLSX.utils.json_to_sheet(example);
    
    // Agregar hoja de instrucciones
    const instrucciones = [
      { Campo: "id", Descripción: "Dejar vacío para crear nuevo ticket, o poner ID existente para actualizar" },
      { Campo: "reference", Descripción: "Referencia única del ticket (ej: TCK-001)" },
      { Campo: "name", Descripción: "Nombre del ticket" },
      { Campo: "status", Descripción: "Estado: Pendiente, En progreso, o Completado" },
      { Campo: "description", Descripción: "Descripción detallada del ticket" },
      { Campo: "datefinished", Descripción: "Fecha de finalización (formato: AAAA-MM-DD) o vacío" },
      { Campo: "asignatedto", Descripción: "Nombre de un solo miembro asignado (ej: Juan Pérez)" },
      { Campo: "createdto", Descripción: "Nombre de la persona que crea el ticket (texto libre)" },
      { Campo: "type", Descripción: "Nombre del tipo de incidencia" }
    ];
    const wsInstrucciones = XLSX.utils.json_to_sheet(instrucciones);
    
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Tickets");
    XLSX.utils.book_append_sheet(wb, wsInstrucciones, "Instrucciones");
    XLSX.writeFile(wb, "plantilla_tickets.xlsx");
  };

  // Leer archivo Excel
  const handleImportFile = (e) => {
    setImportError("");
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (evt) => {
      if (!evt.target?.result) return;
      const data = new Uint8Array(evt.target.result as ArrayBuffer);
      const workbook = XLSX.read(data, { type: "array" });
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const rows = XLSX.utils.sheet_to_json(sheet, { defval: "" });
      setImportedRows(rows);
    };
    reader.readAsArrayBuffer(file);
  };

  // Importar registros (crear o actualizar)
  const handleImportConfirm = async () => {
    setImportLoading(true);
    setImportError("");
    try {
      for (const row of importedRows) {
        // Normaliza campos
        const payload = { ...row };
        
        // Convertir nombres a IDs
        // 1. Asignado: convertir nombre a ID
        if (typeof payload.asignatedto === "string" && payload.asignatedto.trim()) {
          const miembro = members.find(m => m.name.toLowerCase() === payload.asignatedto.toLowerCase());
          if (miembro) {
            payload.asignatedto = [miembro.id];
          } else {
            throw new Error(`No se encontró el miembro: ${payload.asignatedto}`);
          }
        } else {
          payload.asignatedto = [];
        }
        
        // 2. Creado por: intentar convertir nombre a ID, si no existe mantener como texto
        if (typeof payload.createdto === "string") {
          const miembroCreador = members.find(m => m.name.toLowerCase() === payload.createdto.toLowerCase());
          if (miembroCreador) {
            payload.createdto = miembroCreador.id;
          }
          // Si no encuentra el miembro, mantiene el texto original
        }
        
        // 3. Tipo: convertir nombre a ID
        if (typeof payload.type === "string") {
          const tipoTicket = ticketTypes.find(t => t.name.toLowerCase() === payload.type.toLowerCase());
          if (tipoTicket) {
            payload.type = tipoTicket.id;
          } else {
            throw new Error(`No se encontró el tipo de ticket: ${payload.type}`);
        }
        }
        
        // Si hay id, actualizar; si no, crear
        if (payload.id) {
          await updateTicket(payload.id, payload);
        } else {
          await addTicket(payload);
        }
      }
      setImportOpen(false);
      setImportedRows([]);
      fetchTickets();
    } catch (err) {
      setImportError(`Error al importar registros: ${err.message || 'Verifica los datos e intenta de nuevo.'}`);
    }
    setImportLoading(false);
  };

  return (
    <div className="p-8 bg-background min-h-screen">
      {/* Título y subtítulo + botón */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 mt-2 gap-2">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gestión de Tickets</h1>
          <p className="text-gray-600">Administra todas las solicitudes de soporte</p>
        </div>
        <button
          className="btn-primary flex items-center gap-2 px-6 py-3"
          onClick={() => setOpen(true)}
        >
          <Add className="w-5 h-5" />
          NUEVO TICKET
        </button>
      </div>

      {/* Dashboard superior */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
        {/* Total */}
        <div className="card-unified p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Tickets Total</p>
              <p className="text-2xl font-bold text-gray-900">{totalTickets}</p>
              <p className="text-xs text-gray-500 mt-1">Registrados</p>
              {/* Debug info */}
              {totalTickets > 0 && (
                <p className="text-xs text-gray-400 mt-1">
                  Suma: {pendientes + enProgreso + cerrados} 
                  {estadosDesconocidos.length > 0 && ` + ${estadosDesconocidos.length} otros`}
                </p>
              )}
            </div>
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-500/20 to-cyan-500/20 flex items-center justify-center float-element">
              <Assignment className="w-6 h-6 text-blue-500" />
            </div>
          </div>
        </div>
        {/* Pendientes */}
        <div className="card-unified p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Pendientes</p>
              <p className="text-2xl font-bold text-orange-500">{pendientes}</p>
              <p className="text-xs text-orange-500 mt-1">Por resolver</p>
            </div>
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-orange-500/20 to-red-500/20 flex items-center justify-center float-element">
              <AssignmentLate className="w-6 h-6 text-orange-500" />
            </div>
          </div>
        </div>
        {/* En progreso */}
        <div className="card-unified p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">En progreso</p>
              <p className="text-2xl font-bold text-blue-500">{enProgreso}</p>
              <p className="text-xs text-blue-500 mt-1">Atendidos</p>
            </div>
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-400/20 to-cyan-400/20 flex items-center justify-center float-element">
              <Assignment className="w-6 h-6 text-blue-500" />
            </div>
          </div>
        </div>
        {/* Cerrados */}
        <div className="card-unified p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Cerrados</p>
              <p className="text-2xl font-bold text-green-500">{cerrados}</p>
              <p className="text-xs text-green-500 mt-1">Resueltos</p>
            </div>
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-green-500/20 to-emerald-500/20 flex items-center justify-center float-element">
              <AssignmentTurnedIn className="w-6 h-6 text-green-500" />
            </div>
          </div>
        </div>
        {/* Más solicitado */}
        <div className="card-unified p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Tipo más común</p>
              <p className="text-lg font-bold text-purple-500" title={tipoMasCreado.nombre}>
                {tipoMasCreado.nombre.length > 12 ? `${tipoMasCreado.nombre.substring(0, 12)}...` : tipoMasCreado.nombre}
              </p>
              <p className="text-xs text-purple-500 mt-1">
                {tipoMasCreado.cantidad > 0 ? `${tipoMasCreado.cantidad} tickets` : "Sin registros"}
              </p>
            </div>
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center float-element">
              <SupportAgent className="w-6 h-6 text-purple-500" />
            </div>
          </div>
        </div>
      </div>

      {/* Información de debug (solo cuando hay problemas) */}
      {estadosDesconocidos.length > 0 && (
        <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-sm text-yellow-800 font-medium">
            ⚠️ Se encontraron {estadosDesconocidos.length} tickets con estados no reconocidos
          </p>
          <p className="text-xs text-yellow-600 mt-1">
            Estados encontrados: {[...new Set(estadosDesconocidos.map(t => t.status))].join(", ")}
          </p>
          <p className="text-xs text-yellow-600">
            Estados esperados: "Pendiente", "En progreso", "Completado"
          </p>
        </div>
      )}

      {/* Filtros y búsqueda (rediseñado) */}
      <div className="filter-container mb-8">
        <div className="flex flex-col md:flex-row md:items-center gap-3 md:gap-4">
            <div className="flex-1">
              <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                  placeholder="Buscar tickets..." 
                value={search}
                onChange={e => {
                  setSearch(e.target.value)
                  resetToFirstPage()
                }}
                className="input-field pl-10"
                />
            </div>
          </div>
          <button
            className="btn-outline flex items-center gap-2"
            onClick={() => setFiltersOpen(true)}
          >
            <FilterList className="w-4 h-4" />
            Filtros
          </button>
          <button
            className="btn-success flex items-center gap-2"
            onClick={handleExportExcel}
          >
            <Download className="w-4 h-4" />
            Exportar Excel
          </button>
          <button
            className="btn-info flex items-center gap-2"
            onClick={handleExportCSV}
          >
            <Download className="w-4 h-4" />
            Exportar CSV
          </button>
          <button
            className="btn-outline flex items-center gap-2"
            onClick={handleDownloadTemplate}
          >
            <Download className="w-4 h-4" />
            Plantilla
          </button>
          <button
            className="btn-info flex items-center gap-2"
            onClick={() => setImportOpen(true)}
          >
            <UploadFile className="w-4 h-4" />
            Importar Excel
          </button>
        </div>
      </div>

      {/* Modal de filtros avanzados */}
      <Dialog open={filtersOpen} onClose={() => setFiltersOpen(false)} maxWidth="sm" fullWidth>
        <div className="modal-content">
          <DialogTitle className="text-xl font-bold text-gray-900 p-6 pb-0">Filtros avanzados</DialogTitle>
          <DialogContent className="p-6">
            <div className="space-y-4 mt-2">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Estado</label>
                <select 
                  value={filterStatus} 
                  onChange={e => {
                    setFilterStatus(e.target.value)
                    resetToFirstPage()
                  }}
                  className="input-field"
                >
                  <option value="">Todos</option>
                  {statusOptions.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Tipo</label>
                <select 
                  value={filterType} 
                  onChange={e => {
                    setFilterType(e.target.value)
                    resetToFirstPage()
                  }}
                  className="input-field"
                >
                  <option value="">Todos</option>
                  {ticketTypes.map(t => <option key={t.id} value={t.name}>{t.name}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Asignado</label>
                <select 
                  value={filterAsignado} 
                  onChange={e => {
                    setFilterAsignado(e.target.value)
                    resetToFirstPage()
                  }}
                  className="input-field"
                >
                  <option value="">Todos</option>
                  {members.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Fecha de creación - Desde</label>
                <input
                  type="date"
                  value={filterDateFrom}
                  onChange={e => {
                    setFilterDateFrom(e.target.value)
                    resetToFirstPage()
                  }}
                  className="input-field"
                  title="Filtrar por fecha de creación del ticket desde esta fecha"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Fecha de creación - Hasta</label>
                <input
                  type="date"
                  value={filterDateTo}
                  onChange={e => {
                    setFilterDateTo(e.target.value)
                    resetToFirstPage()
                  }}
                  className="input-field"
                  title="Filtrar por fecha de creación del ticket hasta esta fecha"
                />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setFiltersOpen(false)}
                className="btn-success flex-1"
              >
                Aplicar
              </button>
              <button
                onClick={() => {
                  setFilterStatus("")
                  setFilterType("")
                  setFilterAsignado("")
                  setFilterDateFrom("")
                  setFilterDateTo("")
                  resetToFirstPage()
                  setFiltersOpen(false)
                }}
                className="btn-secondary flex-1"
              >
                Limpiar
              </button>
      </div>
          </DialogContent>
                  </div>
      </Dialog>

      {/* Modal de importación */}
      <Dialog open={importOpen} onClose={() => setImportOpen(false)} maxWidth={false} fullWidth>
        <DialogContent className={`w-full flex flex-col transition-all duration-300 ${
          importedRows.length > 0 
            ? 'max-w-5xl h-[500px]' 
            : 'max-w-md h-auto'
        }`}>
          <DialogTitle className="text-xl font-bold text-gray-900 flex-shrink-0 pb-4">Importar tickets desde Excel</DialogTitle>
          <div className={`flex flex-col ${importedRows.length > 0 ? 'flex-1 min-h-0' : ''}`}>
            <input 
              type="file" 
              accept=".xlsx,.xls,.csv" 
              onChange={handleImportFile} 
              className="mb-4 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 flex-shrink-0" 
            />
            {importError && (
              <div className="text-red-500 mb-4 p-3 bg-red-50 rounded flex-shrink-0">{importError}</div>
            )}
            {importedRows.length > 0 && (
              <div className="flex-1 flex flex-col min-h-0 border rounded mb-4">
                <div className="flex-1 overflow-auto">
                  <table className="w-full text-xs">
                    <thead className="sticky top-0 bg-gray-50 z-10">
                      <tr>
                        {Object.keys(importedRows[0]).map((col) => (
                          <th key={col} className="px-3 py-2 text-left font-semibold text-gray-700 border-b min-w-[100px]">
                            <div className="truncate" title={col}>{col}</div>
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {importedRows.slice(0, 10).map((row, i) => (
                        <tr key={i} className="odd:bg-gray-50 hover:bg-blue-50">
                          {Object.values(row).map((val, j) => (
                            <td key={j} className="px-3 py-2 text-gray-600 border-b">
                              <div className="truncate text-xs max-w-[200px]" title={String(val)}>
                                {String(val)}
                              </div>
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {importedRows.length > 10 && (
                  <div className="text-xs text-gray-400 px-3 py-2 border-t bg-gray-50 flex-shrink-0">
                    Mostrando solo los primeros 10 registros de {importedRows.length} total
                  </div>
                )}
              </div>
            )}
            <div className="flex gap-3 flex-shrink-0">
              <Button
                onClick={handleImportConfirm}
                className="flex-1 bg-green-500 hover:bg-green-600"
                disabled={importLoading || importedRows.length === 0}
              >
                {importLoading ? "Importando..." : "Importar"}
              </Button>
              <Button
                onClick={() => setImportOpen(false)}
                variant="outline"
                className="flex-1"
                disabled={importLoading}
              >
                Cancelar
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Tabla de tickets */}
      {loading ? (
        <div className="text-center text-muted-foreground py-8">Cargando tickets...</div>
      ) : error ? (
        <div className="text-center text-red-500 py-8">{error}</div>
      ) : totalRecords === 0 ? (
        <div className="text-center py-8">
          <div className="text-gray-500 text-lg mb-2">No se encontraron tickets</div>
          <div className="text-gray-400 text-sm">
            {search || filterStatus || filterType || filterAsignado || filterDateFrom || filterDateTo
              ? "Intenta ajustar los filtros de búsqueda"
              : "No hay tickets registrados aún"}
          </div>
        </div>
      ) : (
        <div className="mt-8 overflow-x-auto bg-white dark:bg-muted rounded-xl shadow">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-muted">
              <tr>
                <th 
                  className="px-3 py-2 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  onClick={() => handleSort("reference")}
                >
                  <div className="flex items-center gap-1">
                    Referencia
                    {getSortIcon("reference")}
                  </div>
                </th>
                <th 
                  className="px-3 py-2 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  onClick={() => handleSort("name")}
                >
                  <div className="flex items-center gap-1">
                    Nombre
                    {getSortIcon("name")}
                  </div>
                </th>
                <th 
                  className="px-3 py-2 text-center text-xs font-semibold text-muted-foreground uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  onClick={() => handleSort("status")}
                >
                  <div className="flex items-center justify-center gap-1">
                    Estado
                    {getSortIcon("status")}
                  </div>
                </th>
                <th 
                  className="px-3 py-2 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  onClick={() => handleSort("type")}
                >
                  <div className="flex items-center gap-1">
                    Tipo
                    {getSortIcon("type")}
                  </div>
                </th>
                <th 
                  className="px-3 py-2 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  onClick={() => handleSort("asignatedto")}
                >
                  <div className="flex items-center gap-1">
                    Asignados
                    {getSortIcon("asignatedto")}
                  </div>
                </th>
                <th 
                  className="px-3 py-2 text-center text-xs font-semibold text-muted-foreground uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  onClick={() => handleSort("created")}
                >
                  <div className="flex items-center justify-center gap-1">
                    Fecha Creación
                    {getSortIcon("created")}
                  </div>
                </th>
                <th className="px-3 py-2 text-center text-xs font-semibold text-muted-foreground uppercase tracking-wider">Acciones</th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-muted divide-y divide-gray-100 dark:divide-gray-800">
              {paginatedTickets.map((ticket) => (
                <tr key={ticket.id} className="hover:bg-blue-50/40 dark:hover:bg-blue-900/20 transition">
                  <td className="px-3 py-2 font-medium text-sm text-foreground max-w-[180px] truncate">{ticket.reference}</td>
                  <td className="px-3 py-2 font-medium text-sm text-foreground max-w-[180px] truncate">{ticket.name}</td>
                  <td className="px-3 py-2 text-center">
                    <span className={`inline-block px-2 py-1 rounded-full text-xs font-semibold
                      ${ticket.status === 'Completado' ? 'bg-green-100 text-green-600' :
                        ticket.status === 'En progreso' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-red-100 text-red-600'}
                    `}>{ticket.status}</span>
                  </td>
                  <td className="px-3 py-2 text-sm text-foreground max-w-[120px] truncate">{ticket.expand?.type?.name || '-'}</td>
                  <td className="px-3 py-2 max-w-[120px]">
                    <div className="flex flex-wrap gap-1">
                      {ticket.expand?.asignatedto?.map((member) => (
                        <span
                          key={member.id}
                          className="inline-block px-2 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-600 truncate"
                        >
                          {member.name}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-3 py-2 text-center text-sm text-foreground">
                    {ticket.created ? 
                      new Date(ticket.created).toLocaleDateString('es-ES', {
                        day: '2-digit',
                        month: '2-digit', 
                        year: 'numeric'
                      }) : 
                      '-'
                    }
                  </td>
                  <td className="px-3 py-2 text-center">
                    <button className="text-blue-500 hover:text-blue-700 p-2" title="Editar" onClick={() => handleEdit(ticket)}>
                      <Edit className="w-4 h-4" />
                    </button>
                    <button className="text-red-500 hover:text-red-700 p-2" title="Eliminar" onClick={() => handleDelete(ticket.id)}>
                      <Delete className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {/* Información de paginación y controles */}
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 p-4 bg-gray-50 dark:bg-gray-800 border-t">
            {/* Información de registros */}
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Mostrando {startIndex + 1} a {Math.min(endIndex, totalRecords)} de {totalRecords} registros
              {sortField && (
                <span className="ml-2 text-blue-600">
                  • Ordenado por {sortField} ({sortDirection === "asc" ? "A-Z" : "Z-A"})
                </span>
              )}
            </div>
            
            {/* Controles de paginación */}
            {totalPages > 1 && (
              <div className="flex items-center gap-2">
                {/* Botón anterior */}
                <button
                  onClick={() => setCurrentPage(currentPage - 1)}
                  disabled={currentPage === 1}
                  className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                    currentPage === 1
                      ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                      : "bg-white text-gray-700 border hover:bg-gray-50 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
                  }`}
                >
                  Anterior
                </button>
                
                {/* Números de página */}
                <div className="flex gap-1">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, index) => {
                    let pageNumber;
                    if (totalPages <= 5) {
                      pageNumber = index + 1;
                    } else if (currentPage <= 3) {
                      pageNumber = index + 1;
                    } else if (currentPage >= totalPages - 2) {
                      pageNumber = totalPages - 4 + index;
                    } else {
                      pageNumber = currentPage - 2 + index;
                    }
                    
                    return (
                      <button
                        key={pageNumber}
                        onClick={() => setCurrentPage(pageNumber)}
                        className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                          currentPage === pageNumber
                            ? "bg-blue-500 text-white"
                            : "bg-white text-gray-700 border hover:bg-gray-50 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
                        }`}
                      >
                        {pageNumber}
                      </button>
                    );
                  })}
                </div>
                
                {/* Botón siguiente */}
                <button
                  onClick={() => setCurrentPage(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                    currentPage === totalPages
                      ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                      : "bg-white text-gray-700 border hover:bg-gray-50 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
                  }`}
                >
                  Siguiente
                </button>
                
                {/* Salto a página */}
                <div className="flex items-center gap-2 ml-4">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Ir a:</span>
                  <input
                    type="number"
                    min="1"
                    max={totalPages}
                    value={currentPage}
                    onChange={(e) => {
                      const page = parseInt(e.target.value);
                      if (page >= 1 && page <= totalPages) {
                        setCurrentPage(page);
                      }
                    }}
                    className="w-16 px-2 py-1 text-sm border rounded-md text-center dark:bg-gray-700 dark:border-gray-600"
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Modal de registro */}
      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
        <div className="modal-content">
          <DialogContent className="p-4">
            <form onSubmit={handleSubmit} className="space-y-3 mt-1">
              <div>
                <label className="block text-sm font-semibold mb-1">Referencia</label>
                <input
                  type="text"
                  name="reference"
                  value={form.reference}
                  onChange={handleChange}
                  className="input-field text-sm py-2"
                  placeholder="Referencia del ticket"
                  autoFocus
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">Nombre del ticket</label>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  className="input-field text-sm py-2"
                  placeholder="Nombre del ticket"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">Descripción</label>
                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  rows={2}
                  className="input-field resize-none text-sm"
                  placeholder="Descripción detallada del ticket"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">Estado</label>
                <select
                  name="status"
                  value={form.status}
                  onChange={handleChange}
                  className="input-field text-sm py-2"
                  required
                >
                  {statusOptions.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">Fecha de finalización</label>
                <input
                  type="date"
                  name="datefinished"
                  value={form.datefinished}
                  onChange={handleChange}
                  className="input-field text-sm py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">Asignados a</label>
                <select
                    name="asignatedto"
                  value={form.asignatedto[0] || ""}
                  onChange={(e) => setForm({ ...form, asignatedto: e.target.value ? [e.target.value] : [] })}
                  className="input-field text-sm py-2"
                >
                  <option value="">Selecciona asignado</option>
                    {members.map((m) => (
                    <option key={m.id} value={m.id}>{m.name}</option>
                    ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">Creado por</label>
                <input
                  type="text"
                    name="createdto"
                    value={form.createdto}
                    onChange={handleChange}
                  className="input-field text-sm py-2"
                  placeholder="Nombre del responsable"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">Tipo de incidencia</label>
                <select
                    name="type"
                    value={form.type}
                    onChange={handleChange}
                  className="input-field text-sm py-2"
                  required
                  >
                  <option value="">Selecciona tipo</option>
                    {ticketTypes.map((t) => (
                    <option key={t.id} value={t.id}>{t.name}</option>
                    ))}
                </select>
              </div>
              <div className="flex gap-2 mt-4 justify-end">
                <button type="submit" className="btn-primary flex items-center gap-2 px-6 py-2 text-sm order-1">
                  <Save className="w-4 h-4" />
                  {editId ? "Guardar Cambios" : "Guardar Ticket"}
                </button>
                <button type="button" onClick={() => setOpen(false)} className="btn-secondary px-6 py-2 text-sm order-2">Cancelar</button>
              </div>
            </form>
          </DialogContent>
        </div>
      </Dialog>
    </div>
  )
}

export default Tickets
