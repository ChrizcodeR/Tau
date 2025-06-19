import { useState } from "react"
import { useMembers } from "@/hooks/useMembers"
import { useTicketTypes } from "@/hooks/useTicketTypes"
import { useSalesTypes } from "@/hooks/useSalesTypes"
import { 
  Dialog,
  DialogTitle,
  DialogContent
} from "@mui/material"
import { Save, Delete, Add, Settings, Group, NotificationImportant, ShoppingCart, Brightness4, Brightness7 } from "@mui/icons-material"
import { Trash2, Eye, Edit } from "lucide-react"
import { motion } from "framer-motion"
import parse from 'html-react-parser'

const tabList = [
  { label: "Equipo IT", icon: <Group /> },
  { label: "Incidencias", icon: <NotificationImportant /> },
  { label: "Compras", icon: <ShoppingCart /> },
  { label: "General", icon: <Settings /> }
]

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

const Configuracion = () => {
  // Equipo IT
  const [form, setForm] = useState({ name: "", rol: "", contact: "" })
  const { members, loading, error, addMember, updateMember, deleteMember } = useMembers()
  // Incidencias
  const [incidenciaForm, setIncidenciaForm] = useState({ name: "", priority: "", replytime: 0 })
  const {
    ticketTypes,
    loading: loadingIncidencias,
    error: errorIncidencias,
    addTicketType,
    updateTicketType,
    deleteTicketType
  } = useTicketTypes()
  // Compras
  const [compraForm, setCompraForm] = useState({ name: "", description: "" })
  const {
    salesTypes,
    loading: loadingCompras,
    error: errorCompras,
    addSalesType,
    updateSalesType,
    deleteSalesType
  } = useSalesTypes()
  // Tabs
  const [tab, setTab] = useState(0)
  // Dialogs
  const [openMember, setOpenMember] = useState(false)
  const [openIncidencia, setOpenIncidencia] = useState(false)
  const [openCompra, setOpenCompra] = useState(false)
  // Edit IDs
  const [editMemberId, setEditMemberId] = useState(null)
  const [editIncidenciaId, setEditIncidenciaId] = useState(null)
  const [editCompraId, setEditCompraId] = useState(null)

  // Equipo IT handlers
  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })
  const handleOpenMember = (member = null) => {
    if (member) {
      setForm({ name: member.name, rol: member.rol, contact: member.contact })
      setEditMemberId(member.id)
    } else {
      setForm({ name: "", rol: "", contact: "" })
      setEditMemberId(null)
    }
    setOpenMember(true)
  }
  const handleAdd = async (e) => {
    e.preventDefault()
    if (!form.name || !form.rol || !form.contact) return
    try {
      if (editMemberId) {
        await updateMember(editMemberId, form)
      } else {
        await addMember(form)
      }
      setForm({ name: "", rol: "", contact: "" })
      setEditMemberId(null)
      setOpenMember(false)
    } catch (err) { console.error("Error al guardar miembro:", err) }
  }
  const handleDelete = async (id) => { try { await deleteMember(id) } catch (err) { console.error("Error al eliminar miembro:", err) } }

  // Incidencias handlers
  const handleIncidenciaChange = (e) => setIncidenciaForm({ ...incidenciaForm, [e.target.name]: e.target.value })
  const handleOpenIncidencia = (incidencia = null) => {
    if (incidencia) {
      setIncidenciaForm({ name: incidencia.name, priority: incidencia.priority, replytime: incidencia.replytime })
      setEditIncidenciaId(incidencia.id)
    } else {
      setIncidenciaForm({ name: "", priority: "", replytime: 0 })
      setEditIncidenciaId(null)
    }
    setOpenIncidencia(true)
  }
  const handleAddIncidencia = async (e) => {
    e.preventDefault()
    if (!incidenciaForm.name || !incidenciaForm.priority || !incidenciaForm.replytime) return
    try {
      const payload = {
        name: incidenciaForm.name,
        priority: incidenciaForm.priority,
        replytime: Number(incidenciaForm.replytime)
      }
      if (editIncidenciaId) {
        await updateTicketType(editIncidenciaId, payload)
      } else {
        await addTicketType(payload)
      }
      setIncidenciaForm({ name: "", priority: "", replytime: 0 })
      setEditIncidenciaId(null)
      setOpenIncidencia(false)
    } catch (err) { console.error("Error al guardar tipo de incidencia:", err) }
  }
  const handleDeleteIncidencia = async (id) => { try { await deleteTicketType(id) } catch (err) { console.error("Error al eliminar tipo de incidencia:", err) } }

  // Compras handlers
  const handleCompraChange = (e) => setCompraForm({ ...compraForm, [e.target.name]: e.target.value })
  const handleOpenCompra = (compra = null) => {
    if (compra) {
      setCompraForm({ name: compra.name, description: compra.description })
      setEditCompraId(compra.id)
    } else {
      setCompraForm({ name: "", description: "" })
      setEditCompraId(null)
    }
    setOpenCompra(true)
  }
  const handleAddCompra = async (e) => {
    e.preventDefault()
    if (!compraForm.name) return
    try {
      if (editCompraId) {
        await updateSalesType(editCompraId, compraForm)
      } else {
        await addSalesType(compraForm)
      }
      setCompraForm({ name: "", description: "" })
      setEditCompraId(null)
      setOpenCompra(false)
    } catch (err) { console.error("Error al guardar tipo de compra:", err) }
  }
  const handleDeleteCompra = async (id) => { try { await deleteSalesType(id) } catch (err) { console.error("Error al eliminar tipo de compra:", err) } }

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-1">Configuración</h1>
        <p className="text-gray-600 text-base">Administra las configuraciones del sistema</p>
        </div>
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        {tabList.map((t, i) => (
          <button
            key={t.label}
            onClick={() => setTab(i)}
            className={`flex items-center gap-2 px-4 py-3 rounded-lg font-medium transition-all duration-200 ${
              tab === i 
                ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg' 
                : 'bg-white/80 text-gray-700 hover:bg-gray-100 shadow-sm'
            }`}
          >
            <span className={`p-2 rounded-full ${tab === i ? 'bg-white/20' : 'bg-gray-100'}`}>
              {t.icon}
            </span>
            <span>{t.label}</span>
          </button>
        ))}
      </div>
      {/* Equipo IT */}
      {tab === 0 && (
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
          <div className="card-unified p-6 mb-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-1">Equipo IT</h2>
                <p className="text-gray-600">Gestiona los miembros del equipo</p>
              </div>
              <button 
                className="btn-primary flex items-center gap-2"
                onClick={() => handleOpenMember()}
              >
                <Add className="w-4 h-4" />
                Agregar Miembro
              </button>
            </div>
            <Dialog open={openMember} onClose={() => setOpenMember(false)} maxWidth="sm" fullWidth>
              <div className="modal-content">
                <DialogTitle className="text-xl font-bold text-gray-900 p-6 pb-0">
                  {editMemberId ? "Editar miembro del equipo" : "Registrar miembro del equipo"}
                </DialogTitle>
                <DialogContent className="p-6">
                  <form onSubmit={handleAdd} className="space-y-4 mt-2">
                  <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Nombre</label>
                      <input
                        type="text"
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        className="input-field"
                        required
                    />
                  </div>
                  <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Rol</label>
                      <input
                        type="text"
                        name="rol"
                        value={form.rol}
                        onChange={handleChange}
                        className="input-field"
                        required
                    />
                  </div>
                  <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Contacto</label>
                      <input
                        type="text"
                        name="contact"
                        value={form.contact}
                        onChange={handleChange}
                        className="input-field"
                        required
                    />
                  </div>
                    <div className="flex gap-3 mt-6">
                      <button type="submit" className="btn-primary flex items-center gap-2">
                        <Save className="w-4 h-4" />
                        {editMemberId ? "Actualizar" : "Registrar"}
                      </button>
                      <button 
                        type="button"
                        onClick={() => setOpenMember(false)} 
                        className="btn-secondary"
                      >
                        Cancelar
                      </button>
                </div>
                  </form>
                </DialogContent>
              </div>
            </Dialog>
            <div className="mt-8 overflow-x-auto bg-white dark:bg-muted rounded-xl shadow">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-muted">
                  <tr>
                    <th className="px-3 py-2 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Nombre</th>
                    <th className="px-3 py-2 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Rol</th>
                    <th className="px-3 py-2 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Contacto</th>
                    <th className="px-3 py-2 text-center text-xs font-semibold text-muted-foreground uppercase tracking-wider">Acciones</th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-muted divide-y divide-gray-100 dark:divide-gray-800">
                  {loading ? (
                    <tr><td colSpan={4} className="px-3 py-2 text-center text-gray-500">Cargando...</td></tr>
                  ) : error ? (
                    <tr><td colSpan={4} className="px-3 py-2 text-center text-red-500">{error}</td></tr>
                  ) : members.length === 0 ? (
                    <tr><td colSpan={4} className="px-3 py-2 text-center text-gray-500">No hay miembros registrados aún.</td></tr>
                  ) : (
                    members.map((m) => (
                      <tr key={m.id} className="hover:bg-blue-50/40 dark:hover:bg-blue-900/20 transition">
                        <td className="px-3 py-2 font-medium text-sm text-foreground">{m.name}</td>
                        <td className="px-3 py-2">
                          <span className="inline-block px-2 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-600">
                            {m.rol}
                          </span>
                        </td>
                        <td className="px-3 py-2 text-sm text-foreground">{m.contact}</td>
                        <td className="px-3 py-2 text-center">
                          <button 
                            className="text-blue-500 hover:text-blue-700 p-2" 
                            title="Editar"
                            onClick={() => handleOpenMember(m)}
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button 
                            className="text-red-500 hover:text-red-700 p-2" 
                            title="Eliminar"
                            onClick={() => handleDelete(m.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                          <button className="text-green-500 hover:text-green-700 p-2" title="Ver detalles">
                            <Eye className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
              </div>
        </motion.div>
      )}
      {/* Incidencias */}
      {tab === 1 && (
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
          <div className="card-unified p-6 mb-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-1">Tipos de Ticket</h2>
                <p className="text-gray-600">Gestiona los tipos de incidencias</p>
              </div>
              <button 
                className="btn-primary flex items-center gap-2"
                onClick={() => handleOpenIncidencia()}
              >
                <Add className="w-4 h-4" />
                Agregar Tipo de Incidencia
              </button>
            </div>
            <Dialog open={openIncidencia} onClose={() => setOpenIncidencia(false)} maxWidth="sm" fullWidth>
              <div className="modal-content">
                <DialogTitle className="text-xl font-bold text-gray-900 p-6 pb-0">
                  {editIncidenciaId ? "Editar tipo de incidencia" : "Registrar tipo de incidencia"}
                </DialogTitle>
                <DialogContent className="p-6">
                  <form onSubmit={handleAddIncidencia} className="space-y-4 mt-2">
              <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Tipo de Incidencia</label>
                      <input
                        type="text"
                        name="name"
                        value={incidenciaForm.name}
                        onChange={handleIncidenciaChange}
                        className="input-field"
                        required
                />
              </div>
              <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Nivel de Prioridad</label>
                      <select
                        name="priority"
                        value={incidenciaForm.priority}
                        onChange={handleIncidenciaChange}
                        className="input-field"
                        required
                      >
                        <option value="">Seleccionar prioridad</option>
                        <option value="Alta">Alta</option>
                        <option value="Media">Media</option>
                        <option value="Baja">Baja</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Tiempo de Respuesta (horas)</label>
                      <input
                        type="number"
                        name="replytime"
                        value={incidenciaForm.replytime}
                        onChange={handleIncidenciaChange}
                        className="input-field"
                        required
                />
              </div>
                    <div className="flex gap-3 mt-6">
                      <button type="submit" className="btn-primary flex items-center gap-2">
                        <Save className="w-4 h-4" />
                        {editIncidenciaId ? "Actualizar" : "Registrar"}
                      </button>
                      <button 
                        type="button"
                        onClick={() => setOpenIncidencia(false)} 
                        className="btn-secondary"
                      >
                        Cancelar
                      </button>
                </div>
                  </form>
                </DialogContent>
              </div>
            </Dialog>
            <div className="mt-8 overflow-x-auto bg-white dark:bg-muted rounded-xl shadow">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-muted">
                  <tr>
                    <th className="px-3 py-2 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Nombre</th>
                    <th className="px-3 py-2 text-center text-xs font-semibold text-muted-foreground uppercase tracking-wider">Prioridad</th>
                    <th className="px-3 py-2 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Tiempo de Respuesta</th>
                    <th className="px-3 py-2 text-center text-xs font-semibold text-muted-foreground uppercase tracking-wider">Acciones</th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-muted divide-y divide-gray-100 dark:divide-gray-800">
                  {loadingIncidencias ? (
                    <tr><td colSpan={4} className="px-3 py-2 text-center text-gray-500">Cargando...</td></tr>
                  ) : errorIncidencias ? (
                    <tr><td colSpan={4} className="px-3 py-2 text-center text-red-500">{errorIncidencias}</td></tr>
                  ) : ticketTypes.length === 0 ? (
                    <tr><td colSpan={4} className="px-3 py-2 text-center text-gray-500">No hay tipos de incidencia registrados aún.</td></tr>
                  ) : (
                    ticketTypes.map((t) => (
                      <tr key={t.id} className="hover:bg-blue-50/40 dark:hover:bg-blue-900/20 transition">
                        <td className="px-3 py-2 font-medium text-sm text-foreground">{t.name}</td>
                        <td className="px-3 py-2 text-center">
                          <span className={`inline-block px-2 py-1 rounded-full text-xs font-semibold ${
                            t.priority === 'Alta' ? 'bg-red-100 text-red-600' :
                            t.priority === 'Media' ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-600'
                          }`}>
                            {t.priority}
                          </span>
                        </td>
                        <td className="px-3 py-2 text-sm text-foreground">{t.replytime} h</td>
                        <td className="px-3 py-2 text-center">
                          <button 
                            className="text-blue-500 hover:text-blue-700 p-2" 
                            title="Editar"
                            onClick={() => handleOpenIncidencia(t)}
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button 
                            className="text-red-500 hover:text-red-700 p-2"
                            title="Eliminar" 
                            onClick={() => handleDeleteIncidencia(t.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                          <button className="text-green-500 hover:text-green-700 p-2" title="Ver configuración">
                            <Eye className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </motion.div>
      )}
      {/* Compras */}
      {tab === 2 && (
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
          <div className="card-unified p-6 mb-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-1">Tipos de Compra</h2>
                <p className="text-gray-600">Gestiona los tipos de compra</p>
              </div>
              <button 
                className="btn-primary flex items-center gap-2"
                onClick={() => handleOpenCompra()}
              >
                <Add className="w-4 h-4" />
                Agregar Tipo de Compra
              </button>
            </div>
            <Dialog open={openCompra} onClose={() => setOpenCompra(false)} maxWidth="sm" fullWidth>
              <div className="modal-content">
                <DialogTitle className="text-xl font-bold text-gray-900 p-6 pb-0">
                  {editCompraId ? "Editar tipo de compra" : "Registrar tipo de compra"}
                </DialogTitle>
                <DialogContent className="p-6">
                  <form onSubmit={handleAddCompra} className="space-y-4 mt-2">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Tipo de Compra</label>
                      <input
                        type="text"
                        name="name"
                        value={compraForm.name}
                        onChange={handleCompraChange}
                        className="input-field"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Descripción</label>
                      <textarea
                        name="description"
                        value={compraForm.description}
                        onChange={handleCompraChange}
                        rows={3}
                        className="input-field resize-none"
                        placeholder="Descripción del tipo de compra"
                      />
                    </div>
                    <div className="flex gap-3 mt-6">
                      <button type="submit" className="btn-primary flex items-center gap-2">
                        <Save className="w-4 h-4" />
                        {editCompraId ? "Actualizar" : "Registrar"}
                      </button>
                      <button 
                        type="button"
                        onClick={() => setOpenCompra(false)} 
                        className="btn-secondary"
                      >
                        Cancelar
                      </button>
                    </div>
                  </form>
                </DialogContent>
              </div>
            </Dialog>
            <div className="mt-8 overflow-x-auto bg-white dark:bg-muted rounded-xl shadow">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-muted">
                  <tr>
                    <th className="px-3 py-2 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Nombre</th>
                    <th className="px-3 py-2 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider max-w-[200px]">Descripción</th>
                    <th className="px-3 py-2 text-center text-xs font-semibold text-muted-foreground uppercase tracking-wider">Acciones</th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-muted divide-y divide-gray-100 dark:divide-gray-800">
                  {loadingCompras ? (
                    <tr><td colSpan={3} className="px-3 py-2 text-center text-gray-500">Cargando...</td></tr>
                  ) : errorCompras ? (
                    <tr><td colSpan={3} className="px-3 py-2 text-center text-red-500">{errorCompras}</td></tr>
                  ) : salesTypes.length === 0 ? (
                    <tr><td colSpan={3} className="px-3 py-2 text-center text-gray-500">No hay tipos de compra registrados aún.</td></tr>
                  ) : (
                    salesTypes.map((s) => (
                      <tr key={s.id} className="hover:bg-blue-50/40 dark:hover:bg-blue-900/20 transition">
                        <td className="px-3 py-2 font-medium text-sm text-foreground">{s.name}</td>
                        <td className="px-3 py-2 text-sm text-muted-foreground max-w-[200px] truncate" title={s.description}>
                          {parseHTMLDescription(s.description) || '-'}
                        </td>
                        <td className="px-3 py-2 text-center">
                          <button 
                            className="text-blue-500 hover:text-blue-700 p-2" 
                            title="Editar"
                            onClick={() => handleOpenCompra(s)}
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button 
                            className="text-red-500 hover:text-red-700 p-2"
                            title="Eliminar"
                            onClick={() => handleDeleteCompra(s.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                          <button className="text-green-500 hover:text-green-700 p-2" title="Ver categoría">
                            <Eye className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </motion.div>
      )}
      {/* General */}
      {tab === 3 && (
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
          <div className="card-unified p-6 mb-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-1">General</h2>
                <p className="text-gray-600">Configuraciones generales del sistema</p>
              </div>
              <div className="flex gap-3">
                <button className="btn-outline flex items-center gap-2">
                  <Brightness7 className="w-4 h-4" />
                  Tema Claro
                </button>
                <button className="btn-outline flex items-center gap-2">
                  <Brightness4 className="w-4 h-4" />
                  Tema Oscuro
                </button>
              </div>
            </div>
            <div className="text-gray-600">(Aquí puedes agregar más configuraciones globales...)</div>
          </div>
        </motion.div>
      )}
    </div>
  )
}

export default Configuracion

