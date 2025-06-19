import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { Pencil, Trash2, FolderKanban, Plus, Save, FolderOpen, Edit, Download, Filter, Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Dialog, DialogTitle, DialogContent } from "@/components/ui/dialog";
import { useProjects } from "@/hooks/useProjects";
import { motion } from "framer-motion";
import { DollarSign, Package, Truck, CheckCircle2, RefreshCcw } from "lucide-react";
import { useMembers } from "@/hooks/useMembers";
import * as XLSX from "xlsx";
import { Paper, Table, TableHead, TableBody, TableRow, TableCell, Chip, IconButton, Box } from "@mui/material";
import { getAllProgress } from "@/hooks/useProgressProjects";
import { format, parseISO } from 'date-fns';
import { UploadFile } from "@mui/icons-material";
import parse from 'html-react-parser';

const statusOptions = ["Planificación", "En desarrollo", "En revisión", "Completado", "Pausado"];

// Función para parsear HTML de forma segura
const parseHTMLDescription = (htmlString) => {
  if (!htmlString || htmlString === '-') return htmlString;
  
  // Si no contiene etiquetas HTML, devolver tal como está (más eficiente)
  if (!htmlString.includes('<') || !htmlString.includes('>')) {
    return htmlString;
  }
  
  try {
    // Solo procesar si realmente contiene HTML
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = htmlString;
    return tempDiv.textContent || tempDiv.innerText || htmlString;
  } catch (error) {
    console.warn('Error parseando HTML:', error);
    return htmlString;
  }
}

const dashboardCards = [
  {
    title: "Total Proyectos",
    valueKey: "totalProyectos",
    icon: DollarSign,
    iconColor: "text-blue-500",
    bg: "bg-blue-50",
    extra: (values) => (
      <span className="text-xs text-green-500">{values.totalProyectos > 0 ? `Último: ${values.ultimoProyecto}` : "Sin proyectos"}</span>
    )
  },
  {
    title: "Activos",
    valueKey: "activos",
    icon: Package,
    iconColor: "text-blue-500",
    bg: "bg-blue-50",
    extra: (values) => (
      <span className="text-xs text-blue-500">{values.activos > 0 ? `${values.porcentajeActivos}% del total` : ""}</span>
    )
  },
  {
    title: "Finalizados",
    valueKey: "finalizados",
    icon: CheckCircle2,
    iconColor: "text-green-500",
    bg: "bg-green-50",
    extra: (values) => (
      <span className="text-xs text-green-500">{values.finalizados > 0 ? `${values.porcentajeFinalizados}% del total` : ""}</span>
    )
  },
  {
    title: "En desarrollo",
    valueKey: "enDesarrollo",
    icon: Truck,
    iconColor: "text-orange-500",
    bg: "bg-orange-50",
    extra: (values) => (
      <span className="text-xs text-orange-500">{values.enDesarrollo > 0 ? `${values.porcentajeEnDesarrollo}% del total` : ""}</span>
    )
  },
  {
    title: "Partner más frecuente",
    valueKey: "partnerMasFrecuente",
    icon: FolderOpen,
    iconColor: "text-purple-500",
    bg: "bg-purple-50",
    extra: (values) => null
  }
];

const Proyectos = () => {
  const {
    projects,
    total,
    loading,
    error,
    page,
    setPage,
    search,
    setSearch,
    filters,
    setFilterField,
    clearFilters,
    createProject,
    updateProject,
    deleteProject,
  } = useProjects();

  const { members, loading: loadingMembers } = useMembers();

  const [open, setOpen] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState({
    name: "",
    description: "",
    status: "Planificación",
    partner: "",
    datefinished: "",
    createdto: "",
    datestart: ""
  });

  // Estadísticas
  const totalProyectos = Number(total);
  const activos = projects.filter(p => p.status === "Activo" || p.status === "En desarrollo").length;
  const finalizados = projects.filter(p => p.status === "Completado").length;
  const enDesarrollo = projects.filter(p => p.status === "En desarrollo").length;
  const partnerMasFrecuente = (() => {
    const counts = {};
    projects.forEach(p => {
      const partner = p.partner || "-";
      counts[partner] = (counts[partner] || 0) + 1;
    });
    let max = 0, partner = "-";
    Object.entries(counts).forEach(([k, v]) => { if (v > max) { max = v; partner = k } });
    return partner;
  })();
  const ultimoProyecto = projects.length > 0 ? projects[0].name : "-";
  const porcentajeFinalizados = totalProyectos > 0 ? Math.round((finalizados / totalProyectos) * 100) : 0;
  const porcentajeActivos = totalProyectos > 0 ? Math.round((activos / totalProyectos) * 100) : 0;
  const porcentajeEnDesarrollo = totalProyectos > 0 ? Math.round((enDesarrollo / totalProyectos) * 100) : 0;
  const dashboardValues = {
    totalProyectos,
    activos,
    finalizados,
    enDesarrollo,
    partnerMasFrecuente,
    ultimoProyecto,
    porcentajeFinalizados,
    porcentajeActivos,
    porcentajeEnDesarrollo
  };

  // Estado para filtros avanzados
  const [filtersOpen, setFiltersOpen] = useState(false);

  // Estado para importación
  const [importOpen, setImportOpen] = useState(false);
  const [importedRows, setImportedRows] = useState([]);
  const [importError, setImportError] = useState("");
  const [importLoading, setImportLoading] = useState(false);

  const navigate = useNavigate();

  const [progressData, setProgressData] = useState([]);
  const [progressLoading, setProgressLoading] = useState(true);
  
  // Función para refrescar datos de avances
  const refreshProgressData = async () => {
    console.log("🔄 Refrescando datos de avances...");
    setProgressLoading(true);
    try {
      const data = await getAllProgress();
      console.log("✅ Datos de avances actualizados:", data.length, "registros");
      setProgressData(data);
    } catch (error) {
      console.error("❌ Error al refrescar avances:", error);
    } finally {
      setProgressLoading(false);
    }
  };
  
  useEffect(() => {
    refreshProgressData();
  }, []);
  
  // Los datos se refrescan automáticamente cada vez que se carga la página

  // Calcula el promedio de avance para un proyecto
  const getAvgProgress = (projectId) => {
    const avances = progressData.filter(a => a.project === projectId);
    
    console.log(`\n=== CÁLCULO PROMEDIO PROYECTO ${projectId} ===`);
    console.log("Total avances encontrados:", avances.length);
    console.log("Avances del proyecto:", avances);
    
    if (avances.length === 0) {
      console.log("Sin avances - retornando 0%");
      return 0;
    }
    
    const porcentajes = avances.map(a => a.percent || 0);
    console.log("Porcentajes individuales:", porcentajes);
    
    const sum = porcentajes.reduce((acc, cur) => acc + cur, 0);
    const promedio = Math.round(sum / avances.length);
    
    console.log(`Suma: ${sum}, Cantidad: ${avances.length}, Promedio: ${promedio}%`);
    console.log("=======================================\n");
    
    return promedio;
  };

  // Handlers
  const handleOpen = () => {
    setEditId(null);
    setForm({ name: "", description: "", status: "Planificación", partner: "", datefinished: "", createdto: "", datestart: "" });
    setOpen(true);
  };
  const handleEdit = (project) => {
    setEditId(project.id);
    setForm({
      name: project.name || "",
      description: project.description || "",
      status: project.status || "Planificación",
      partner: project.partner || "",
      datefinished: project.datefinished || "",
      createdto: project.createdto || "",
      datestart: project.datestart || ""
    });
    setOpen(true);
  };
  const handleDelete = (id) => {
    if (window.confirm("¿Eliminar este proyecto?")) {
      deleteProject(id);
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    const datestartFormatted = form.datestart ? new Date(form.datestart).toISOString() : "";
    const payload = { ...form, datestart: datestartFormatted };
    if (editId) {
      await updateProject(editId, payload);
    } else {
      await createProject(payload);
    }
    setOpen(false);
  };

  // Paginación
  const totalPages = Math.ceil(Number(total) / 10);

  // Exportar a Excel
  const handleExportExcel = () => {
    const data = projects.map(p => ({
      Nombre: p.name,
      Descripción: p.description,
      Estado: p.status,
      Partner: p.partner,
      "Fecha Finalización": p.datefinished,
      Responsable: p.createdto
    }))
    const ws = XLSX.utils.json_to_sheet(data)
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, "Proyectos")
    XLSX.writeFile(wb, "proyectos.xlsx")
  }
  // Exportar a CSV
  const handleExportCSV = () => {
    const data = projects.map(p => ({
      Nombre: p.name,
      Descripción: p.description,
      Estado: p.status,
      Partner: p.partner,
      "Fecha Finalización": p.datefinished,
      Responsable: p.createdto
    }))
    const ws = XLSX.utils.json_to_sheet(data)
    const csv = XLSX.utils.sheet_to_csv(ws)
    const blob = new Blob([csv], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "proyectos.csv"
    a.click()
    window.URL.revokeObjectURL(url)
  }

  // Descarga plantilla de ejemplo
  const handleDownloadTemplate = () => {
    // Obtener nombres reales para los ejemplos
    const ejemploResponsable = members.length > 0 ? 
      members[0].name : 
      "Carlos Mendoza";

    const example = [
      {
        id: "",
        name: "Sistema de Gestión ERP",
        description: "Desarrollo de sistema empresarial",
        status: "Planificación",
        partner: "TechCorp",
        datefinished: "2024-08-01",
        createdto: ejemploResponsable,
        datestart: "2024-03-01"
      },
      {
        id: "",
        name: "App Móvil de Ventas",
        description: "Aplicación móvil para equipo comercial",
        status: "En desarrollo",
        partner: "SalesInc",
        datefinished: "2024-09-15",
        createdto: members.length > 1 ? members[1].name : ejemploResponsable,
        datestart: "2024-05-01"
      }
    ];
    const ws = XLSX.utils.json_to_sheet(example);
    
    // Agregar hoja de instrucciones
    const instrucciones = [
      { Campo: "id", Descripción: "Dejar vacío para crear nuevo proyecto, o poner ID existente para actualizar" },
      { Campo: "name", Descripción: "Nombre del proyecto" },
      { Campo: "description", Descripción: "Descripción detallada del proyecto" },
      { Campo: "status", Descripción: "Estado: Planificación, En desarrollo, En revisión, Completado, o Pausado" },
      { Campo: "partner", Descripción: "Nombre del cliente o partner" },
      { Campo: "datefinished", Descripción: "Fecha de finalización (formato: AAAA-MM-DD)" },
      { Campo: "createdto", Descripción: "Nombre del responsable del proyecto" },
      { Campo: "datestart", Descripción: "Fecha de inicio (formato: AAAA-MM-DD)" }
    ];
    const wsInstrucciones = XLSX.utils.json_to_sheet(instrucciones);
    
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Proyectos");
    XLSX.utils.book_append_sheet(wb, wsInstrucciones, "Instrucciones");
    XLSX.writeFile(wb, "plantilla_proyectos.xlsx");
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
        // 1. Responsable: convertir nombre a ID
        if (typeof payload.createdto === "string") {
          const miembroResponsable = members.find(m => m.name.toLowerCase() === payload.createdto.toLowerCase());
          if (miembroResponsable) {
            payload.createdto = miembroResponsable.id;
          } else {
            throw new Error(`No se encontró el responsable: ${payload.createdto}`);
          }
        }
        
        // Formatear fechas si están presentes
        if (payload.datestart) {
          payload.datestart = new Date(payload.datestart).toISOString();
        }
        
        // Si hay id, actualizar; si no, crear
        if (payload.id) {
          await updateProject(payload.id, payload);
        } else {
          await createProject(payload);
        }
      }
      setImportOpen(false);
      setImportedRows([]);
    } catch (err) {
      setImportError(`Error al importar registros: ${err.message || 'Verifica los datos e intenta de nuevo.'}`);
    }
    setImportLoading(false);
  };

  // Utilidad para mostrar siempre la fecha como DD/MM/YYYY sin errores de zona horaria
  function formatDateToDDMMYYYY(dateString) {
    if (!dateString) return "-";
    // Extrae solo la parte de la fecha (YYYY-MM-DD)
    const datePart = dateString.split(" ")[0].split("T")[0];
    const [year, month, day] = datePart.split("-");
    return `${day}/${month}/${year}`;
  }

  return (
    <div className="p-8 bg-background min-h-screen">
      {/* Encabezado y botón */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 mb-8">
        <div>
          <h1 className="text-4xl font-bold text-foreground">Gestión de Proyectos</h1>
          <p className="text-muted-foreground">Registro, seguimiento y control de proyectos IT</p>
        </div>
        <button className="flex items-center gap-2 px-5 py-2 rounded-lg bg-green-500 text-white hover:bg-green-600 shadow font-semibold text-base mt-4 md:mt-0" onClick={handleOpen}>
          <Plus className="w-5 h-5" />
          Nuevo Proyecto
        </button>
      </div>

      {/* Dashboard animado */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
        {dashboardCards.map((card, idx) => (
          <motion.div
            key={card.title}
            className="bg-white dark:bg-muted rounded-xl p-6 shadow flex flex-col gap-2 animate-slide-up"
            style={{ animationDelay: `${idx * 100}ms` }}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: idx * 0.1 }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground font-medium mb-1">{card.title === "Partner más frecuente" ? <span className="text-[11px]">{card.title}</span> : card.title}</p>
                {card.title === "Partner más frecuente" ? (
                  <p className="text-base font-bold text-foreground leading-tight">{dashboardValues[card.valueKey]}</p>
                ) : (
                  <p className="text-1xl font-bold text-foreground">{dashboardValues[card.valueKey]}</p>
                )}
                {card.extra && card.extra(dashboardValues)}
              </div>
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity, repeatType: 'loop', ease: 'easeInOut' }}
                className={`rounded-full p-2 ${card.bg} flex items-center justify-center shadow-md transition-transform`}
              >
                <card.icon className={`w-6 h-6 ${card.iconColor}`} />
              </motion.div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Barra de acciones igual a Compras */}
      <div className="flex flex-col md:flex-row items-center gap-2 mb-8 bg-white dark:bg-muted rounded-xl p-4 shadow">
        <div className="flex-1 flex items-center bg-muted rounded-lg px-3">
          <Filter className="text-muted-foreground mr-2" />
          <input
            className="bg-transparent outline-none w-full py-2 text-foreground"
            placeholder="Buscar proyectos..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <button className="flex items-center gap-2 px-4 py-2 rounded-lg border text-foreground hover:bg-muted" onClick={() => setFiltersOpen(true)}>
          <Filter className="w-4 h-4" /> Filtros
        </button>
        <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-green-500 text-white hover:bg-green-600" onClick={handleExportExcel}>
          <Download className="w-4 h-4" /> Exportar Excel
        </button>
        <button className="flex items-center gap-2 px-4 py-2 rounded-lg border text-foreground hover:bg-muted" onClick={handleExportCSV}>
          <Download className="w-4 h-4" /> Exportar CSV
        </button>
        <button className="flex items-center gap-2 px-4 py-2 rounded-lg border text-foreground hover:bg-muted" onClick={handleDownloadTemplate}>
          <Download className="w-4 h-4" /> Plantilla
        </button>
        <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600" onClick={() => setImportOpen(true)}>
          <UploadFile className="w-4 h-4" /> Importar Excel
        </button>
        <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-purple-500 text-white hover:bg-purple-600" onClick={refreshProgressData}>
          <RefreshCcw className="w-4 h-4" /> Actualizar Avances
        </button>
      </div>

      {/* Tabla de proyectos rediseñada, limpia y compacta */}
      <div className="mt-8 overflow-x-auto bg-white dark:bg-muted rounded-xl shadow">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700 table-fixed">
          <colgroup>
            <col className="w-[25%]" />
            <col className="w-[12%]" />
            <col className="w-[12%]" />
            <col className="w-[15%]" />
            <col className="w-[10%]" />
            <col className="w-[12%]" />
            <col className="w-[14%]" />
          </colgroup>
          <thead className="bg-muted">
            <tr>
              <th className="px-3 py-2 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Nombre</th>
              <th className="px-3 py-2 text-center text-xs font-semibold text-muted-foreground uppercase tracking-wider">Estado</th>
              <th className="px-3 py-2 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Partner</th>
              <th className="px-3 py-2 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Responsable</th>
              <th className="px-3 py-2 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Fecha inicio</th>
              <th className="px-3 py-2 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Avance (%)</th>
              <th className="px-3 py-2 text-center text-xs font-semibold text-muted-foreground uppercase tracking-wider">Acciones</th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-muted divide-y divide-gray-100 dark:divide-gray-800">
            {projects.map((p) => (
              <tr key={p.id} className="hover:bg-blue-50/40 dark:hover:bg-blue-900/20 transition">
                <td className="px-3 py-2 font-medium text-sm text-foreground overflow-hidden" title={p.name}>
                  <div className="truncate">{p.name}</div>
                </td>
                <td className="px-3 py-2 text-center">
                  <span className={`inline-block px-2 py-1 rounded-full text-xs font-semibold whitespace-nowrap
                    ${p.status === 'Completado' ? 'bg-green-100 text-green-600' :
                      p.status === 'En desarrollo' ? 'bg-yellow-100 text-yellow-700' :
                      p.status === 'Pausado' ? 'bg-gray-200 text-gray-700' :
                      p.status === 'En revisión' ? 'bg-orange-100 text-orange-600' :
                      'bg-red-100 text-red-600'}
                  `}>{p.status}</span>
                </td>
                <td className="px-3 py-2 text-sm text-foreground overflow-hidden" title={p.partner}>
                  <div className="truncate">{p.partner}</div>
                </td>
                <td className="px-3 py-2 overflow-hidden">
                  <span className="inline-block px-2 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-600 max-w-full truncate" title={p.expand?.createdto?.name || '-'}>
                    {p.expand?.createdto?.name || '-'}
                  </span>
                </td>
                <td className="px-3 py-2 text-sm text-foreground whitespace-nowrap">{formatDateToDDMMYYYY(p.datestart)}</td>
                <td className="px-3 py-2 text-sm text-foreground">
                  {progressLoading ? (
                    <span className="inline-block bg-gray-100 text-gray-400 rounded-full px-2 py-1 text-xs font-semibold">-</span>
                  ) : (
                    <div className="flex flex-col gap-1">
                      <span className={`inline-block px-2 py-1 rounded-full text-xs font-semibold text-center whitespace-nowrap
                        ${getAvgProgress(p.id) >= 80 ? 'bg-green-100 text-green-600' :
                          getAvgProgress(p.id) >= 40 ? 'bg-yellow-100 text-yellow-700' :
                          'bg-red-100 text-red-600'}
                      `} title={`Promedio de avance: ${getAvgProgress(p.id)}%`}>
                        {getAvgProgress(p.id)}%
                      </span>
                      <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div className={`h-2 rounded-full transition-all
                          ${getAvgProgress(p.id) >= 80 ? 'bg-green-500' :
                            getAvgProgress(p.id) >= 40 ? 'bg-yellow-400' :
                            'bg-red-500'}`}
                          style={{ width: `${getAvgProgress(p.id)}%` }}
                        />
                      </div>
                    </div>
                  )}
                </td>
                <td className="px-3 py-2 text-center">
                  <div className="flex justify-center gap-1">
                    <button className="text-blue-500 hover:text-blue-700 p-1" title="Editar" onClick={() => handleEdit(p)}>
                      <Edit className="w-4 h-4" />
                    </button>
                    <button className="text-red-500 hover:text-red-700 p-1" title="Eliminar" onClick={() => handleDelete(p.id)}>
                      <Trash2 className="w-4 h-4" />
                    </button>
                    <button className="text-green-500 hover:text-green-700 p-1" title="Ver avances" onClick={() => navigate(`/avances?project=${p.id}`)}>
                      <Eye className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {/* Paginación */}
        {totalPages > 1 && (
          <div className="flex justify-center mt-6 gap-2">
            {Array.from({ length: totalPages }).map((_, i) => (
              <button
                key={i}
                className={`px-3 py-1 rounded border text-foreground ${page === i + 1 ? 'bg-blue-100 border-blue-500' : 'border-muted'}`}
                onClick={() => setPage(i + 1)}
              >
                {i + 1}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Modal de registro/edición de proyecto */}
      <Dialog open={open} onOpenChange={() => setOpen(false)}>
        <div className="modal-content">
          <DialogContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-4 mt-2">
              <div>
                <label className="block text-sm font-semibold mb-1">Nombre del proyecto</label>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                  className="input-field"
                  placeholder="Nombre del proyecto"
                  autoFocus
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">Descripción</label>
                <textarea
                  name="description"
                  value={form.description}
                  onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                  rows={3}
                  className="input-field resize-none"
                  placeholder="Descripción"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">Estado</label>
                <select
                  name="status"
                  value={form.status}
                  onChange={e => setForm(f => ({ ...f, status: e.target.value }))}
                  className="input-field"
                  required
                >
                  <option value="">Selecciona un estado</option>
                  {statusOptions.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">Partner</label>
                <input
                  type="text"
                  name="partner"
                  value={form.partner}
                  onChange={e => setForm(f => ({ ...f, partner: e.target.value }))}
                  className="input-field"
                  placeholder="Partner"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">Fecha de inicio</label>
                <input
                  type="date"
                  name="datestart"
                  value={form.datestart || ''}
                  onChange={e => setForm(f => ({ ...f, datestart: e.target.value }))}
                  className="input-field"
                  placeholder="Fecha de inicio"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">Fecha de finalización</label>
                <input
                  type="date"
                  name="datefinished"
                  value={form.datefinished}
                  onChange={e => setForm(f => ({ ...f, datefinished: e.target.value }))}
                  className="input-field"
                  placeholder="Fecha de finalización"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">Responsable</label>
                <select
                  name="createdto"
                  value={form.createdto}
                  onChange={e => setForm(f => ({ ...f, createdto: e.target.value }))}
                  className="input-field"
                  required
                >
                  <option value="">Responsable</option>
                  {loadingMembers ? (
                    <option disabled>Cargando miembros...</option>
                  ) : members.length === 0 ? (
                    <option disabled>No hay miembros registrados</option>
                  ) : (
                    members.map((m) => (
                      <option key={m.id} value={m.id}>{m.name}</option>
                    ))
                  )}
                </select>
              </div>
              <div className="flex gap-3 mt-6 justify-end">
                <button type="submit" className="btn-primary flex items-center gap-2 px-8 py-3 text-base order-1">
                  <Save className="w-5 h-5" />
                  {editId ? "Guardar Cambios" : "Guardar Proyecto"}
                </button>
                <button type="button" onClick={() => setOpen(false)} className="btn-secondary px-8 py-3 text-base order-2">Cancelar</button>
              </div>
            </form>
          </DialogContent>
        </div>
      </Dialog>

      {/* Modal de importación */}
      <Dialog open={importOpen} onOpenChange={setImportOpen}>
        <DialogContent className={`w-full flex flex-col transition-all duration-300 ${
          importedRows.length > 0 
            ? 'max-w-5xl h-[500px]' 
            : 'max-w-md h-auto'
        }`}>
          <DialogTitle className="text-xl font-bold text-gray-900 flex-shrink-0 pb-4">Importar proyectos desde Excel</DialogTitle>
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
    </div>
  );
};

export default Proyectos; 