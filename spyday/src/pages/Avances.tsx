import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useProgressProjects } from "@/hooks/useProgressProjects";
import { useProjects } from "@/hooks/useProjects";
import { useMembers } from "@/hooks/useMembers";
import { useLocation } from "react-router-dom";
import { Dialog, DialogTitle, DialogContent } from "@/components/ui/dialog";
import { Plus, Download, ChevronUp, ChevronDown, ChevronsUpDown } from "lucide-react";
import { UploadFile } from "@mui/icons-material";
import * as XLSX from "xlsx";

const Avances = () => {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const initialProject = params.get("project") || "";
  const [selectedProject, setSelectedProject] = useState(initialProject);
  const { projects, loading: loadingProjects } = useProjects();
  const { members, loading: loadingMembers } = useMembers();
  const {
    progress,
    loading,
    error,
    fetchProgress,
    createProgress,
    deleteProgress,
  } = useProgressProjects(selectedProject);
  const [form, setForm] = useState({ hito: "", commit: "", percent: "", createdto: "", project: initialProject });
  const [modalOpen, setModalOpen] = useState(false);

  // Estados para paginación y ordenamiento
  const recordsPerPage = 20
  const [currentPage, setCurrentPage] = useState(1)
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

  // Función para obtener el ícono de ordenamiento
  const getSortIcon = (field) => {
    if (sortField !== field) {
      return <ChevronsUpDown className="w-4 h-4 text-muted-foreground" />
    }
    return sortDirection === "asc" ?
      <ChevronUp className="w-4 h-4 text-blue-600" /> :
      <ChevronDown className="w-4 h-4 text-blue-600" />
  }

  // Estado para importación
  const [importOpen, setImportOpen] = useState(false);
  const [importedRows, setImportedRows] = useState([]);
  const [importError, setImportError] = useState("");
  const [importLoading, setImportLoading] = useState(false);

  useEffect(() => {
    if (selectedProject) {
      fetchProgress();
      setCurrentPage(1); // Resetear página al cambiar proyecto
    }
  }, [selectedProject]);

  // Función de ordenamiento de datos
  const sortData = (data) => {
    if (!sortField) return data;
    
    return [...data].sort((a, b) => {
      let aValue, bValue;
      
      switch (sortField) {
        case "created":
          aValue = new Date(a.created || 0).getTime();
          bValue = new Date(b.created || 0).getTime();
          break;
        case "hito":
          aValue = (a.hito || "").toLowerCase();
          bValue = (b.hito || "").toLowerCase();
          break;
        case "percent":
          aValue = a.percent || 0;
          bValue = b.percent || 0;
          break;
        case "commit":
          aValue = (a.commit || "").toLowerCase();
          bValue = (b.commit || "").toLowerCase();
          break;
        case "responsable":
          aValue = (a.expand?.createdto?.name || "").toLowerCase();
          bValue = (b.expand?.createdto?.name || "").toLowerCase();
          break;
        default:
          return 0;
      }
      
      if (aValue < bValue) return sortDirection === "asc" ? -1 : 1;
      if (aValue > bValue) return sortDirection === "asc" ? 1 : -1;
      return 0;
    });
  };

  // Aplicar ordenamiento y paginación
  const sortedProgress = sortData(progress);
  const startIndex = (currentPage - 1) * recordsPerPage;
  const endIndex = startIndex + recordsPerPage;
  const paginatedProgress = sortedProgress.slice(startIndex, endIndex);
  const totalPages = Math.ceil(sortedProgress.length / recordsPerPage);

  // Función para resetear a primera página
  const resetToFirstPage = () => setCurrentPage(1);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
  const handleChecklist = (e) => {
    setForm((f) => ({ ...f, createdto: e.target.value }));
  };
  const handleProjectSelect = (e) => {
    setSelectedProject(e.target.value);
    setForm((f) => ({ ...f, project: e.target.value }));
  };
  const handleAddAvance = async (e) => {
    e.preventDefault();
    if (!form.hito || !form.commit || !form.percent || !form.createdto || !form.project) return;
    
    const progressData = {
      project: form.project,
      hito: form.hito,
      commit: form.commit,
      percent: Number(form.percent),
      createdto: form.createdto,
    };
    
    console.log("Datos enviados para crear avance:", progressData);
    
    await createProgress(progressData);
    setForm({ hito: "", commit: "", percent: "", createdto: "", project: selectedProject });
    setModalOpen(false);
    fetchProgress();
  };
  const handleDelete = async (pid) => {
    await deleteProgress(pid);
    fetchProgress();
  };

  // Exportar a Excel
  const handleExportExcel = () => {
    if (!selectedProject) {
      alert("Selecciona un proyecto primero");
      return;
    }
    const selectedProjectName = projects.find(p => p.id === selectedProject)?.name || "Proyecto";
    const data = progress.map(a => ({
      Proyecto: selectedProjectName,
      Fecha: a.created ? new Date(a.created).toLocaleDateString() : "-",
      Hito: a.hito,
      Porcentaje: a.percent,
      Comentario: a.commit,
      Responsable: a.expand?.createdto?.name || "-"
    }));
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Avances");
    XLSX.writeFile(wb, `avances_${selectedProjectName}.xlsx`);
  };

  // Exportar a CSV
  const handleExportCSV = () => {
    if (!selectedProject) {
      alert("Selecciona un proyecto primero");
      return;
    }
    const selectedProjectName = projects.find(p => p.id === selectedProject)?.name || "Proyecto";
    const data = progress.map(a => ({
      Proyecto: selectedProjectName,
      Fecha: a.created ? new Date(a.created).toLocaleDateString() : "-",
      Hito: a.hito,
      Porcentaje: a.percent,
      Comentario: a.commit,
      Responsable: a.expand?.createdto?.name || "-"
    }));
    const ws = XLSX.utils.json_to_sheet(data);
    const csv = XLSX.utils.sheet_to_csv(ws);
    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `avances_${selectedProjectName}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  // Descarga plantilla de ejemplo
  const handleDownloadTemplate = () => {
    // Obtener nombres reales para los ejemplos
    const ejemploProyecto = projects.length > 0 ? 
      projects[0].name : 
      "Sistema ERP";
    
    const ejemploResponsable = members.length > 0 ? 
      members[0].name : 
      "Carlos Mendoza";

    const example = [
      {
        id: "",
        project: ejemploProyecto,
        hito: "Análisis de requerimientos",
        commit: "Se completó el análisis inicial de requerimientos del cliente",
        percent: 25,
        created: "",
        createdto: ejemploResponsable
      },
      {
        id: "",
        project: ejemploProyecto,
        hito: "Diseño de base de datos",
        commit: "Diseño del modelo de datos y relaciones",
        percent: 45,
        created: "",
        createdto: members.length > 1 ? members[1].name : ejemploResponsable
      }
    ];
    const ws = XLSX.utils.json_to_sheet(example);
    
    // Agregar hoja de instrucciones
    const instrucciones = [
      { Campo: "id", Descripción: "Dejar vacío para crear nuevo avance, o poner ID existente para actualizar" },
      { Campo: "project", Descripción: "Nombre del proyecto" },
      { Campo: "hito", Descripción: "Nombre del hito o milestone" },
      { Campo: "commit", Descripción: "Comentarios del avance" },
      { Campo: "percent", Descripción: "Porcentaje de avance (número del 0 al 100)" },
      { Campo: "created", Descripción: "Dejar vacío - se asigna automáticamente" },
      { Campo: "createdto", Descripción: "Nombre del responsable del avance" }
    ];
    const wsInstrucciones = XLSX.utils.json_to_sheet(instrucciones);
    
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Avances");
    XLSX.utils.book_append_sheet(wb, wsInstrucciones, "Instrucciones");
    XLSX.writeFile(wb, "plantilla_avances.xlsx");
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
        // 1. Proyecto: convertir nombre a ID
        if (typeof payload.project === "string") {
          const proyecto = projects.find(p => p.name.toLowerCase() === payload.project.toLowerCase());
          if (proyecto) {
            payload.project = proyecto.id;
          } else {
            throw new Error(`No se encontró el proyecto: ${payload.project}`);
          }
        }
        
        // 2. Responsable: convertir nombre a ID
        if (typeof payload.createdto === "string") {
          const miembroResponsable = members.find(m => m.name.toLowerCase() === payload.createdto.toLowerCase());
          if (miembroResponsable) {
            payload.createdto = miembroResponsable.id;
          } else {
            throw new Error(`No se encontró el responsable: ${payload.createdto}`);
          }
        }
        
        // Convertir percent a número
        if (payload.percent) payload.percent = Number(payload.percent);
        
        // La fecha se maneja automáticamente por PocketBase en el campo 'created'
        // Eliminar dateregister ya que no se usa
        delete payload.dateregister;
        
        // Si hay id, actualizar; si no, crear
        if (payload.id) {
          // Para actualizar necesitaríamos una función update en el hook
          throw new Error("La actualización de avances no está disponible aún");
        } else {
          await createProgress(payload);
        }
      }
      setImportOpen(false);
      setImportedRows([]);
      fetchProgress();
    } catch (err) {
      setImportError(`Error al importar registros: ${err.message || 'Verifica los datos e intenta de nuevo.'}`);
    }
    setImportLoading(false);
  };

  return (
    <div className="space-y-6 p-6">
      <Card className="glass border-0 mb-4">
        <CardHeader className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <CardTitle className="text-foreground text-2xl font-bold">Avances de proyectos</CardTitle>
          </div>
          <div className="flex gap-2 items-center flex-wrap">
            <select
              name="project"
              value={selectedProject}
              onChange={handleProjectSelect}
              className="input-field min-w-[220px]"
              required
            >
              <option value="">Selecciona un proyecto</option>
              {loadingProjects ? (
                <option disabled>Cargando proyectos...</option>
              ) : projects.length === 0 ? (
                <option disabled>No hay proyectos registrados</option>
              ) : (
                projects.map((p) => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))
              )}
            </select>
            <Button className="flex items-center gap-2" onClick={() => setModalOpen(true)} disabled={!selectedProject}>
              <Plus className="w-4 h-4" /> Agregar avance
            </Button>
            <Button variant="outline" className="flex items-center gap-2" onClick={handleExportExcel} disabled={!selectedProject}>
              <Download className="w-4 h-4" /> Excel
            </Button>
            <Button variant="outline" className="flex items-center gap-2" onClick={handleExportCSV} disabled={!selectedProject}>
              <Download className="w-4 h-4" /> CSV
            </Button>
            <Button variant="outline" className="flex items-center gap-2" onClick={handleDownloadTemplate}>
              <Download className="w-4 h-4" /> Plantilla
            </Button>
            <Button className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600" onClick={() => setImportOpen(true)}>
              <UploadFile className="w-4 h-4" /> Importar
            </Button>
          </div>
        </CardHeader>
      </Card>
      <Card className="glass border-0">
        <CardHeader>
          <CardTitle className="text-foreground">Avances registrados</CardTitle>
        </CardHeader>
        <CardContent>
          {!selectedProject ? (
            <div className="text-center text-muted-foreground py-8">Selecciona un proyecto para ver sus avances.</div>
          ) : loading ? (
            <div className="text-center text-muted-foreground py-8">Cargando avances...</div>
          ) : error ? (
            <div className="text-center text-red-500 py-8">{error}</div>
          ) : progress.length === 0 ? (
            <div className="text-center text-muted-foreground py-8">No hay avances registrados aún para este proyecto.</div>
          ) : paginatedProgress.length === 0 ? (
            <div className="text-center text-muted-foreground py-8">
              <p>No se encontraron avances en la página {currentPage}.</p>
              <button 
                className="mt-2 text-blue-500 hover:text-blue-700 underline"
                onClick={resetToFirstPage}
              >
                Ir a la primera página
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm text-left divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-muted">
                  <tr>
                    <th 
                      className="py-2 px-3 font-semibold cursor-pointer hover:bg-blue-50 transition-colors select-none"
                      onClick={() => handleSort("created")}
                    >
                      <div className="flex items-center gap-2">
                        Fecha
                        {getSortIcon("created")}
                      </div>
                    </th>
                    <th 
                      className="py-2 px-3 font-semibold cursor-pointer hover:bg-blue-50 transition-colors select-none"
                      onClick={() => handleSort("hito")}
                    >
                      <div className="flex items-center gap-2">
                        Hito
                        {getSortIcon("hito")}
                      </div>
                    </th>
                    <th 
                      className="py-2 px-3 font-semibold cursor-pointer hover:bg-blue-50 transition-colors select-none"
                      onClick={() => handleSort("percent")}
                    >
                      <div className="flex items-center gap-2">
                        Porcentaje
                        {getSortIcon("percent")}
                      </div>
                    </th>
                    <th 
                      className="py-2 px-3 font-semibold cursor-pointer hover:bg-blue-50 transition-colors select-none"
                      onClick={() => handleSort("commit")}
                    >
                      <div className="flex items-center gap-2">
                        Comentario
                        {getSortIcon("commit")}
                      </div>
                    </th>
                    <th 
                      className="py-2 px-3 font-semibold cursor-pointer hover:bg-blue-50 transition-colors select-none"
                      onClick={() => handleSort("responsable")}
                    >
                      <div className="flex items-center gap-2">
                        Responsables
                        {getSortIcon("responsable")}
                      </div>
                    </th>
                    <th className="py-2 px-3 font-semibold">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                                    {paginatedProgress.map((a) => (
                      <tr key={a.id} className="hover:bg-blue-50/40 dark:hover:bg-blue-900/20 transition">
                        <td className="py-2 px-3">
                          {a.created ? new Date(a.created).toLocaleString() : "-"}
                        </td>
                        <td className="py-2 px-3 max-w-[160px] truncate">{a.hito}</td>
                        <td className="py-2 px-3">{a.percent}%</td>
                        <td className="py-2 px-3 max-w-[220px] truncate">{a.commit}</td>
                                                <td className="py-2 px-3">
                          {a.expand?.createdto?.name ? (
                            <span className="inline-block bg-blue-100 text-blue-600 rounded-full px-2 py-1 text-xs font-semibold">
                              {a.expand.createdto.name}
                            </span>
                          ) : a.createdto ? (
                            <span className="inline-block bg-gray-100 text-gray-600 rounded-full px-2 py-1 text-xs font-semibold">
                              ID: {a.createdto}
                            </span>
                          ) : "-"}
                        </td>
                        <td className="py-2 px-3">
                          <Button size="sm" variant="ghost" onClick={() => handleDelete(a.id)}>
                            Eliminar
                          </Button>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
              
              {/* Información de registros y ordenamiento */}
              <div className="mt-4 flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
                <div className="flex flex-col sm:flex-row gap-2">
                  <span>
                    Mostrando {startIndex + 1} - {Math.min(endIndex, sortedProgress.length)} de {sortedProgress.length} registros
                  </span>
                  {sortField && (
                    <span className="text-blue-600">
                      • Ordenado por {sortField} ({sortDirection === "asc" ? "A-Z" : "Z-A"})
                    </span>
                  )}
                </div>
              </div>

              {/* Controles de paginación */}
              {totalPages > 1 && (
                <div className="mt-6 flex flex-col sm:flex-row justify-between items-center gap-4">
                  {/* Botones de navegación */}
                  <div className="flex items-center gap-2">
                    <button
                      className="px-3 py-2 border rounded-lg hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      onClick={() => setCurrentPage(currentPage - 1)}
                      disabled={currentPage === 1}
                    >
                      {currentPage === 1 ? "• Anterior" : "← Anterior"}
                    </button>
                    
                    {/* Números de página */}
                    <div className="flex items-center gap-1">
                      {(() => {
                        let pages = [];
                        let startPage, endPage;
                        
                        if (totalPages <= 5) {
                          startPage = 1;
                          endPage = totalPages;
                        } else if (currentPage <= 3) {
                          startPage = 1;
                          endPage = 5;
                        } else if (currentPage >= totalPages - 2) {
                          startPage = totalPages - 4;
                          endPage = totalPages;
                        } else {
                          startPage = currentPage - 2;
                          endPage = currentPage + 2;
                        }
                        
                        for (let i = startPage; i <= endPage; i++) {
                          const pageNumber = i;
                          pages.push(
                            <button
                              key={i}
                              className={`px-3 py-2 border rounded-lg transition-colors ${
                                currentPage === pageNumber
                                  ? "bg-blue-500 text-white border-blue-500"
                                  : "hover:bg-muted"
                              }`}
                              onClick={() => setCurrentPage(pageNumber)}
                            >
                              {pageNumber}
                            </button>
                          );
                        }
                        return pages;
                      })()}
                    </div>
                    
                    <button
                      className="px-3 py-2 border rounded-lg hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      onClick={() => setCurrentPage(currentPage + 1)}
                      disabled={currentPage === totalPages}
                    >
                      {currentPage === totalPages ? "Siguiente •" : "Siguiente →"}
                    </button>
                  </div>
                  
                  {/* Salto directo a página */}
                  <div className="flex items-center gap-2 text-sm">
                    <span>Ir a página:</span>
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
                      className="w-16 px-2 py-1 border rounded-lg text-center"
                    />
                    <span>de {totalPages}</span>
                  </div>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="p-6 max-w-lg">
          <DialogTitle>Registrar avance</DialogTitle>
          <form className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4" onSubmit={handleAddAvance}>
            <div className="md:col-span-3">
              <Label className="text-foreground">Proyecto</Label>
              <select
                name="project"
                value={form.project}
                onChange={handleProjectSelect}
                className="input-field"
                required
                disabled={!!selectedProject}
              >
                <option value="">Selecciona un proyecto</option>
                {loadingProjects ? (
                  <option disabled>Cargando proyectos...</option>
                ) : projects.length === 0 ? (
                  <option disabled>No hay proyectos registrados</option>
                ) : (
                  projects.map((p) => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))
                )}
              </select>
            </div>
            <div>
              <Label className="text-foreground">Hito</Label>
              <Input name="hito" value={form.hito} onChange={handleChange} className="bg-background border-border text-foreground" />
            </div>
            <div>
              <Label className="text-foreground">Porcentaje (%)</Label>
              <Input name="percent" type="number" min="0" max="100" value={form.percent} onChange={handleChange} className="bg-background border-border text-foreground" />
            </div>
            <div className="md:col-span-3">
              <Label className="text-foreground">Comentario</Label>
              <Textarea name="commit" value={form.commit} onChange={handleChange} className="bg-background border-border text-foreground" />
            </div>
            <div className="md:col-span-3">
              <Label className="text-foreground">Responsables</Label>
              <select
                name="createdto"
                value={form.createdto}
                onChange={handleChecklist}
                className="input-field"
                required
              >
                <option value="">Selecciona un responsable</option>
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
            <div className="md:col-span-3 mt-2">
              <Button type="submit" className="w-full">Agregar avance</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Modal de importación */}
      <Dialog open={importOpen} onOpenChange={setImportOpen}>
        <DialogContent className={`w-full flex flex-col transition-all duration-300 ${
          importedRows.length > 0 
            ? 'max-w-5xl h-[500px]' 
            : 'max-w-md h-auto'
        }`}>
          <DialogTitle className="text-xl font-bold text-gray-900 flex-shrink-0 pb-4">Importar avances desde Excel</DialogTitle>
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

export default Avances; 