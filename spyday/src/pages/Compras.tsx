import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import { 
  Plus, 
  Search, 
  Filter,
  DollarSign,
  Package,
  Truck,
  CheckCircle2,
  Download
} from "lucide-react"
import { FilterList, UploadFile } from "@mui/icons-material"
import { useSales } from "@/hooks/useSales"
import { useMembers } from "@/hooks/useMembers"
import { Dialog, DialogContent, DialogTitle, IconButton } from "@mui/material"
import { Edit, Delete, Save } from "@mui/icons-material"
import { useState } from "react"
import * as XLSX from "xlsx"
import parse from 'html-react-parser'

const compras = [
  {
    id: "CO-001",
    item: "Laptops Dell Inspiron 15",
    categoria: "Equipos",
    cantidad: 5,
    precioUnitario: 1200,
    total: 6000,
    proveedor: "Dell Technologies",
    estado: "Aprobado",
    fechaSolicitud: "2024-01-15",
    fechaEntregaEstimada: "2024-01-25",
    solicitadoPor: "Carlos Mendoza",
    urgencia: "Alta"
  },
  {
    id: "CO-002",
    item: "Cables UTP Cat 6 - 305m",
    categoria: "Red",
    cantidad: 10,
    precioUnitario: 85,
    total: 850,
    proveedor: "Network Solutions",
    estado: "En tránsito",
    fechaSolicitud: "2024-01-12",
    fechaEntregaEstimada: "2024-01-20",
    solicitadoPor: "Luis Pérez",
    urgencia: "Media"
  },
  {
    id: "CO-003",
    item: "Cámaras IP Hikvision",
    categoria: "Seguridad",
    cantidad: 8,
    precioUnitario: 350,
    total: 2800,
    proveedor: "SecurityTech",
    estado: "Pendiente",
    fechaSolicitud: "2024-01-14",
    fechaEntregaEstimada: "2024-01-28",
    solicitadoPor: "Ana Rodriguez",
    urgencia: "Media"
  },
  {
    id: "CO-004",
    item: "Servidores HP ProLiant",
    categoria: "Infraestructura",
    cantidad: 2,
    precioUnitario: 4500,
    total: 9000,
    proveedor: "HP Enterprise",
    estado: "Cotización",
    fechaSolicitud: "2024-01-16",
    fechaEntregaEstimada: "2024-02-15",
    solicitadoPor: "María García",
    urgencia: "Alta"
  },
  {
    id: "CO-005",
    item: "Impresoras multifuncionales",
    categoria: "Oficina",
    cantidad: 3,
    precioUnitario: 450,
    total: 1350,
    proveedor: "Canon México",
    estado: "Entregado",
    fechaSolicitud: "2024-01-08",
    fechaEntregaEstimada: "2024-01-18",
    solicitadoPor: "Luis Pérez",
    urgencia: "Baja"
  }
]

const getEstadoColor = (estado: string) => {
  switch (estado) {
    case "Entregado": return "bg-green-500/20 text-green-400 border-green-500/50"
    case "Aprobado": return "bg-blue-500/20 text-blue-400 border-blue-500/50"
    case "En tránsito": return "bg-purple-500/20 text-purple-400 border-purple-500/50"
    case "Pendiente": return "bg-orange-500/20 text-orange-400 border-orange-500/50"
    case "Cotización": return "bg-yellow-500/20 text-yellow-400 border-yellow-500/50"
    default: return "bg-gray-500/20 text-gray-400 border-gray-500/50"
  }
}

const getMethodPayColor = (methodPay: string) => {
  if (!methodPay || methodPay === "-") return "bg-gray-500/20 text-gray-400 border-gray-500/50"
  
  const method = methodPay.toLowerCase().trim()
  
  if (method.includes("efectivo") || method.includes("cash")) {
    return "bg-green-500/20 text-green-600 border-green-500/50"
  } else if (method.includes("transferencia") || method.includes("wire") || method.includes("transfer")) {
    return "bg-blue-500/20 text-blue-600 border-blue-500/50"
  } else if (method.includes("tarjeta") || method.includes("card") || method.includes("crédito") || method.includes("débito")) {
    return "bg-purple-500/20 text-purple-600 border-purple-500/50"
  } else if (method.includes("cheque") || method.includes("check")) {
    return "bg-orange-500/20 text-orange-600 border-orange-500/50"
  } else if (method.includes("paypal") || method.includes("digital") || method.includes("online")) {
    return "bg-cyan-500/20 text-cyan-600 border-cyan-500/50"
  } else if (method.includes("financiamiento") || method.includes("crédito") || method.includes("loan")) {
    return "bg-yellow-500/20 text-yellow-600 border-yellow-500/50"
  } else {
    return "bg-indigo-500/20 text-indigo-600 border-indigo-500/50"
  }
}

const getUrgenciaColor = (urgencia: string) => {
  switch (urgencia) {
    case "Alta": return "destructive"
    case "Media": return "default"
    case "Baja": return "secondary"
    default: return "secondary"
  }
}

const getCategoriaIcon = (categoria: string) => {
  switch (categoria) {
    case "Equipos": return "💻"
    case "Red": return "🌐"
    case "Seguridad": return "📹"
    case "Infraestructura": return "🖥️"
    case "Oficina": return "🖨️"
    default: return "📦"
  }
}

const statusOptions = ["Pendiente", "Aprobado", "En tránsito", "Entregado", "Cotización"]

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

const Compras = () => {
  const { sales, loading, error, addSale, updateSale, deleteSale } = useSales()
  const { members } = useMembers()
  const [open, setOpen] = useState(false)
  const [editId, setEditId] = useState<string | null>(null)
  const [form, setForm] = useState({
    name: "",
    price: 0,
    status: "Pendiente",
    description: "",
    quantity: 1,
    datefinished: "",
    persona_sale: "",
    methodpay: "",
    client: ""
  })

  // Filtros y búsqueda
  const [search, setSearch] = useState("")
  const [filtersOpen, setFiltersOpen] = useState(false)
  const [filterStatus, setFilterStatus] = useState("")
  const [filterResponsable, setFilterResponsable] = useState("")
  const [filterDateFrom, setFilterDateFrom] = useState("")
  const [filterDateTo, setFilterDateTo] = useState("")
  const [filterPriceMin, setFilterPriceMin] = useState("")
  const [filterPriceMax, setFilterPriceMax] = useState("")
  const [filterMethodPay, setFilterMethodPay] = useState("")
  const [filterClient, setFilterClient] = useState("")

  // Estado para importación
  const [importOpen, setImportOpen] = useState(false);
  const [importedRows, setImportedRows] = useState([]);
  const [importError, setImportError] = useState("");
  const [importLoading, setImportLoading] = useState(false);

  // Compras filtradas
  const filteredSales = sales.filter(s => {
    const matchesSearch =
      s.name?.toLowerCase().includes(search.toLowerCase()) ||
      s.description?.toLowerCase().includes(search.toLowerCase()) ||
      s.expand?.persona_sale?.name?.toLowerCase().includes(search.toLowerCase()) ||
      s.methodpay?.toLowerCase().includes(search.toLowerCase()) ||
      s.client?.toLowerCase().includes(search.toLowerCase())
    const matchesStatus = filterStatus ? s.status === filterStatus : true
    const matchesResponsable = filterResponsable ? s.persona_sale === filterResponsable : true
    const matchesDateFrom = filterDateFrom ? s.datefinished && s.datefinished >= filterDateFrom : true
    const matchesDateTo = filterDateTo ? s.datefinished && s.datefinished <= filterDateTo : true
    const matchesPriceMin = filterPriceMin ? Number(s.price) >= Number(filterPriceMin) : true
    const matchesPriceMax = filterPriceMax ? Number(s.price) <= Number(filterPriceMax) : true
    const matchesMethodPay = filterMethodPay ? s.methodpay?.toLowerCase().includes(filterMethodPay.toLowerCase()) : true
    const matchesClient = filterClient ? s.client?.toLowerCase().includes(filterClient.toLowerCase()) : true
    return matchesSearch && matchesStatus && matchesResponsable && matchesDateFrom && matchesDateTo && matchesPriceMin && matchesPriceMax && matchesMethodPay && matchesClient
  })

  // Exportar a Excel
  const handleExportExcel = () => {
    const data = filteredSales.map(s => ({
      Nombre: s.name,
      Precio: s.price,
      Estado: s.status,
      Descripción: s.description,
      Cantidad: s.quantity,
      "Fecha Finalización": s.datefinished,
      Responsable: s.expand?.persona_sale?.name,
      "Método de Pago": s.methodpay,
      Cliente: s.client
    }))
    const ws = XLSX.utils.json_to_sheet(data)
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, "Compras")
    XLSX.writeFile(wb, "compras.xlsx")
  }
  // Exportar a CSV
  const handleExportCSV = () => {
    const data = filteredSales.map(s => ({
      Nombre: s.name,
      Precio: s.price,
      Estado: s.status,
      Descripción: s.description,
      Cantidad: s.quantity,
      "Fecha Finalización": s.datefinished,
      Responsable: s.expand?.persona_sale?.name,
      "Método de Pago": s.methodpay,
      Cliente: s.client
    }))
    const ws = XLSX.utils.json_to_sheet(data)
    const csv = XLSX.utils.sheet_to_csv(ws)
    const blob = new Blob([csv], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "compras.csv"
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
        name: "Laptops Dell Inspiron 15",
        price: 1200,
        status: "Pendiente",
        description: "Equipos para desarrollo",
        quantity: 5,
        datefinished: "2024-06-01",
        persona_sale: ejemploResponsable,
        methodpay: "Efectivo",
        client: "Cliente Ejemplo S.A."
      },
      {
        id: "",
        name: "Cables UTP Cat 6",
        price: 85,
        status: "Aprobado",
        description: "Material de red",
        quantity: 10,
        datefinished: "",
        persona_sale: members.length > 1 ? members[1].name : ejemploResponsable,
        methodpay: "Transferencia bancaria",
        client: "Empresa Tecnológica XYZ"
      }
    ];
    const ws = XLSX.utils.json_to_sheet(example);
    
    // Agregar hoja de instrucciones
    const instrucciones = [
      { Campo: "id", Descripción: "Dejar vacío para crear nueva compra, o poner ID existente para actualizar" },
      { Campo: "name", Descripción: "Nombre del producto o servicio" },
      { Campo: "price", Descripción: "Precio unitario (número)" },
      { Campo: "status", Descripción: "Estado: Pendiente, Aprobado, En tránsito, Entregado, o Cotización" },
      { Campo: "description", Descripción: "Descripción del producto o servicio" },
      { Campo: "quantity", Descripción: "Cantidad a adquirir (número)" },
      { Campo: "datefinished", Descripción: "Fecha de finalización (formato: AAAA-MM-DD) o vacío" },
      { Campo: "persona_sale", Descripción: "Nombre del responsable de la compra" },
      { Campo: "methodpay", Descripción: "Nombre del método de pago" },
      { Campo: "client", Descripción: "Nombre del cliente" }
    ];
    const wsInstrucciones = XLSX.utils.json_to_sheet(instrucciones);
    
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Compras");
    XLSX.utils.book_append_sheet(wb, wsInstrucciones, "Instrucciones");
    XLSX.writeFile(wb, "plantilla_compras.xlsx");
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
        if (typeof payload.persona_sale === "string") {
          const miembroResponsable = members.find(m => m.name.toLowerCase() === payload.persona_sale.toLowerCase());
          if (miembroResponsable) {
            payload.persona_sale = miembroResponsable.id;
          } else {
            throw new Error(`No se encontró el responsable: ${payload.persona_sale}`);
          }
        }
        
        // 2. Método de pago y cliente son campos de texto libre, no necesitan conversión
        
        // Convertir price y quantity a números
        if (payload.price) payload.price = Number(payload.price);
        if (payload.quantity) payload.quantity = Number(payload.quantity);
        
        // Si hay id, actualizar; si no, crear
        if (payload.id) {
          await updateSale(payload.id, payload);
        } else {
          await addSale(payload);
        }
      }
      setImportOpen(false);
      setImportedRows([]);
    } catch (err) {
      setImportError(`Error al importar registros: ${err.message || 'Verifica los datos e intenta de nuevo.'}`);
    }
    setImportLoading(false);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleOpen = (sale = null) => {
    if (sale) {
      setForm({
        name: sale.name,
        price: sale.price,
        status: sale.status,
        description: sale.description,
        quantity: sale.quantity,
        datefinished: sale.datefinished || "",
        persona_sale: sale.persona_sale,
        methodpay: sale.methodpay || "",
        client: sale.client || ""
      })
      setEditId(sale.id)
    } else {
      setForm({ name: "", price: 0, status: "Pendiente", description: "", quantity: 1, datefinished: "", persona_sale: "", methodpay: "", client: "" })
      setEditId(null)
    }
    setOpen(true)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.name || !form.status || !form.persona_sale || !form.methodpay || !form.client) return
    try {
      if (editId) {
        await updateSale(editId, form)
      } else {
        await addSale(form)
      }
      setOpen(false)
      setForm({ name: "", price: 0, status: "Pendiente", description: "", quantity: 1, datefinished: "", persona_sale: "", methodpay: "", client: "" })
      setEditId(null)
    } catch (err) { console.error("Error al guardar compra", err) }
  }

  const handleDelete = async (id) => {
    try { await deleteSale(id) } catch (err) { console.error("Error al eliminar compra", err) }
  }

  // Dashboard real
  const totalCompras = sales.reduce((sum, sale) => sum + (Number(sale.price) || 0), 0)
  const comprasAprobadas = sales.filter(s => ["Aprobado", "En tránsito", "Entregado"].includes(s.status)).length
  const comprasPendientes = sales.filter(s => ["Pendiente", "Cotización"].includes(s.status)).length
  const comprasCompletadas = sales.filter(s => s.status === "Entregado").length

  // Estadísticas de métodos de pago más utilizados
  const metodoPagoMasUsado = (() => {
    if (sales.length === 0) return { nombre: "-", cantidad: 0 }
    
    const counts = {}
    sales.forEach(s => {
      const metodoPago = s.methodpay || "Sin método"
      if (metodoPago && metodoPago !== "Sin método" && metodoPago.trim() !== "") {
        const metodoNormalizado = metodoPago.trim()
        counts[metodoNormalizado] = (counts[metodoNormalizado] || 0) + 1
      }
    })
    
    let max = 0
    let metodoMasUsado = "-"
    Object.entries(counts).forEach(([metodo, cantidad]) => {
      if (Number(cantidad) > max) {
        max = Number(cantidad)
        metodoMasUsado = metodo
      }
    })
    
    return { nombre: metodoMasUsado, cantidad: max }
  })()

  // Cliente con más compras
  const clienteMasActivo = (() => {
    if (sales.length === 0) return { nombre: "-", cantidad: 0 }
    
    const counts = {}
    sales.forEach(s => {
      const cliente = s.client || "Sin cliente"
      if (cliente && cliente !== "Sin cliente" && cliente.trim() !== "") {
        const clienteNormalizado = cliente.trim()
        counts[clienteNormalizado] = (counts[clienteNormalizado] || 0) + 1
      }
    })
    
    let max = 0
    let clienteMasComun = "-"
    Object.entries(counts).forEach(([cliente, cantidad]) => {
      if (Number(cantidad) > max) {
        max = Number(cantidad)
        clienteMasComun = cliente
      }
    })
    
    return { nombre: clienteMasComun, cantidad: max }
  })()

  return (
    <div className="p-8 bg-background min-h-screen">
      {/* Encabezado */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
        <div>
          <h1 className="text-4xl font-bold text-foreground">Gestión de Compras</h1>
          <p className="text-muted-foreground">Control de adquisiciones y presupuesto</p>
        </div>
        <button className="flex items-center gap-2 px-5 py-2 rounded-lg bg-green-500 text-white hover:bg-green-600 shadow font-semibold text-base mt-4 md:mt-0" onClick={() => handleOpen()}>
          <Plus className="w-5 h-5" />
          Nueva Compra
        </button>
      </div>

      {/* Tarjetas de resumen */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 mt-8">
        <ResumenCard
          titulo="Presupuesto Total"
          valor={`$${totalCompras.toLocaleString()}`}
          icono={<DollarSign className="w-6 h-6 text-green-500" />}
          extra={<span className="text-green-500 text-sm">Total general</span>}
        />
        <ResumenCard
          titulo="Órdenes Activas"
          valor={comprasAprobadas}
          icono={<Package className="w-6 h-6 text-blue-500" />}
          extra={<span className="text-blue-500 text-sm">En proceso</span>}
        />
        <ResumenCard
          titulo="Pendientes"
          valor={comprasPendientes}
          icono={<Truck className="w-6 h-6 text-orange-500" />}
          extra={<span className="text-orange-500 text-sm">Requieren atención</span>}
        />
        <ResumenCard
          titulo="Completadas"
          valor={comprasCompletadas}
          icono={<CheckCircle2 className="w-6 h-6 text-purple-500" />}
          extra={<span className="text-purple-500 text-sm">Entregadas</span>}
        />
        <ResumenCard
          titulo="Método más usado"
          valor={metodoPagoMasUsado.nombre}
          icono={<DollarSign className="w-6 h-6 text-cyan-500" />}
          extra={<span className="text-cyan-500 text-sm">{metodoPagoMasUsado.cantidad > 0 ? `${metodoPagoMasUsado.cantidad} compras` : "Sin datos"}</span>}
        />
        <ResumenCard
          titulo="Cliente más activo"
          valor={clienteMasActivo.nombre}
          icono={<Package className="w-6 h-6 text-pink-500" />}
          extra={<span className="text-pink-500 text-sm">{clienteMasActivo.cantidad > 0 ? `${clienteMasActivo.cantidad} compras` : "Sin datos"}</span>}
        />
      </div>

      {/* Barra de acciones */}
      <div className="flex flex-col md:flex-row items-center gap-2 mt-8 bg-white dark:bg-muted rounded-xl p-4 shadow">
        <div className="flex-1 flex items-center bg-muted rounded-lg px-3">
          <Search className="text-muted-foreground mr-2" />
          <input
            className="bg-transparent outline-none w-full py-2 text-foreground"
            placeholder="Buscar compras..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <button className="flex items-center gap-2 px-4 py-2 rounded-lg border text-foreground hover:bg-muted" onClick={() => setFiltersOpen(true)}>
          <FilterList className="w-4 h-4" /> Filtros
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
      </div>

      {/* Lista de compras */}
      <div className="mt-6 space-y-4">
        {loading ? (
          <div className="text-center text-muted-foreground py-8">Cargando compras...</div>
        ) : error ? (
          <div className="text-center text-red-500 py-8">{error}</div>
        ) : filteredSales.length === 0 ? (
          <div className="text-center text-muted-foreground py-8">No hay compras registradas aún.</div>
        ) : (
          filteredSales.map((sale, index) => (
            <Card key={sale.id} className="bg-white dark:bg-muted rounded-xl p-6 shadow flex flex-col md:flex-row items-center justify-between animate-slide-up border-0" style={{ animationDelay: `${index * 100}ms` }}>
              <CardContent className="p-0 w-full">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between w-full gap-4">
              <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="outline" className="text-xs border-blue-500/50 text-blue-400">{sale.id}</Badge>
                      <Badge className={`text-xs ${getEstadoColor(sale.status)}`}>{sale.status}</Badge>
                    </div>
                    <div className="font-bold text-lg text-foreground">{sale.name}</div>
                    <div className="text-sm text-muted-foreground">{sale.quantity} unidades</div>
                    <div className="text-sm text-muted-foreground" title={sale.description}>
                      {parseHTMLDescription(sale.description)}
                    </div>
                    <div className="text-sm text-muted-foreground">Asignado a: {sale.expand?.persona_sale?.name || "-"}</div>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-sm text-muted-foreground">Método de pago:</span>
                      <Badge className={`text-xs ${getMethodPayColor(sale.methodpay || "-")}`}>
                        {sale.methodpay || "-"}
                      </Badge>
                    </div>
                    <div className="text-sm text-muted-foreground">Cliente: {sale.client || "-"}</div>
                  </div>
                  <div className="flex flex-col items-end gap-2 mt-4 md:mt-0">
                    <div className="text-2xl font-bold text-foreground">${sale.price?.toLocaleString()}</div>
                    <div className="text-xs text-muted-foreground">Fecha fin: {sale.datefinished ? sale.datefinished.split("T")[0] : "-"}</div>
                    <div className="flex gap-2 mt-2">
                      <IconButton color="primary" onClick={() => handleOpen(sale)}><Edit /></IconButton>
                      <IconButton color="error" onClick={() => handleDelete(sale.id)}><Delete /></IconButton>
              </div>
              </div>
            </div>
          </CardContent>
        </Card>
          ))
        )}
      </div>

      {/* Modal de compra */}
      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
        <div className="modal-content">
          <DialogContent className="p-6">
          <form onSubmit={handleSubmit} className="space-y-4 mt-2">
              <div>
                <label className="block text-sm font-semibold mb-1">Nombre del producto/servicio</label>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="Nombre del producto o servicio"
                  autoFocus
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">Precio</label>
                <input
                  type="number"
                  name="price"
                  value={form.price}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="Precio unitario"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">Cantidad</label>
                <input
                  type="number"
                  name="quantity"
                  value={form.quantity}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="Cantidad a adquirir"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">Descripción</label>
                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  rows={3}
                  className="input-field resize-none"
                  placeholder="Descripción detallada"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">Estado</label>
                <select
                  name="status"
                  value={form.status}
                  onChange={handleChange}
                  className="input-field"
                  required
                >
                {statusOptions.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">Fecha de finalización</label>
                <input
                  type="date"
                  name="datefinished"
                  value={form.datefinished}
                  onChange={handleChange}
                  className="input-field"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">Responsable</label>
                <select
                  name="persona_sale"
                  value={form.persona_sale}
                  onChange={handleChange}
                  className="input-field"
                  required
                >
                  <option value="">Selecciona responsable</option>
                {members.map((m) => (
                    <option key={m.id} value={m.id}>{m.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">Método de pago</label>
                <input
                  type="text"
                  name="methodpay"
                  value={form.methodpay}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="Ej: Efectivo, Transferencia, Tarjeta de crédito"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">Cliente</label>
                <input
                  type="text"
                  name="client"
                  value={form.client}
                  onChange={handleChange}
                  className="input-field"
                  placeholder="Nombre del cliente o empresa"
                  required
                />
              </div>
              <div className="flex gap-3 mt-6 justify-end">
                <button type="submit" className="btn-primary flex items-center gap-2 px-8 py-3 text-base order-1">
                  <Save className="w-5 h-5" />
                  {editId ? "Guardar Cambios" : "Guardar Compra"}
                </button>
                <button type="button" onClick={() => setOpen(false)} className="btn-secondary px-8 py-3 text-base order-2">Cancelar</button>
              </div>
          </form>
        </DialogContent>
        </div>
      </Dialog>

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
                  onChange={e => setFilterStatus(e.target.value)}
                  className="input-field"
                >
                  <option value="">Todos</option>
                  {statusOptions.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Responsable</label>
                <select 
                  value={filterResponsable} 
                  onChange={e => setFilterResponsable(e.target.value)}
                  className="input-field"
                >
                  <option value="">Todos</option>
                  {members.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Método de pago</label>
                <input
                  type="text"
                  value={filterMethodPay} 
                  onChange={e => setFilterMethodPay(e.target.value)}
                  className="input-field"
                  placeholder="Filtrar por método de pago"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Cliente</label>
                <input
                  type="text"
                  value={filterClient} 
                  onChange={e => setFilterClient(e.target.value)}
                  className="input-field"
                  placeholder="Filtrar por cliente"
                />
              </div>
              <div className="flex gap-3">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Precio mínimo</label>
                  <input
                    type="number"
                    value={filterPriceMin}
                    onChange={e => setFilterPriceMin(e.target.value)}
                    className="input-field"
                    placeholder="0"
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Precio máximo</label>
                  <input
                    type="number"
                    value={filterPriceMax}
                    onChange={e => setFilterPriceMax(e.target.value)}
                    className="input-field"
                    placeholder="999999"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Desde</label>
                <input
                  type="date"
                  value={filterDateFrom}
                  onChange={e => setFilterDateFrom(e.target.value)}
                  className="input-field"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Hasta</label>
                <input
                  type="date"
                  value={filterDateTo}
                  onChange={e => setFilterDateTo(e.target.value)}
                  className="input-field"
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
                  setFilterStatus(""); setFilterResponsable(""); setFilterDateFrom(""); setFilterDateTo(""); setFilterPriceMin(""); setFilterPriceMax(""); setFilterMethodPay(""); setFilterClient(""); setFiltersOpen(false)
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
          <DialogTitle className="text-xl font-bold text-gray-900 flex-shrink-0 pb-4">Importar compras desde Excel</DialogTitle>
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
  )
}

// Componente para las tarjetas de resumen
function ResumenCard({ titulo, valor, icono, extra }: { titulo: string; valor: string | number; icono: React.ReactNode; extra: React.ReactNode }) {
  const valorTexto = String(valor)
  const esTextoLargo = valorTexto.length > 12
  
  return (
    <div className="bg-white dark:bg-muted rounded-xl p-6 shadow flex flex-col gap-2 min-h-[120px]">
      <div className="flex justify-between items-start">
        <div className="flex-1 pr-2">
          <div className="text-sm text-muted-foreground mb-2">{titulo}</div>
          <div 
            className={`${esTextoLargo ? 'text-base leading-tight' : 'text-lg'} font-bold text-foreground break-words`}
            style={{
              lineHeight: esTextoLargo ? '1.2' : '1.3',
              wordBreak: 'break-word',
              hyphens: 'auto'
            }}
            title={valorTexto}
          >
            {valor}
          </div>
                </div>
        <div className="bg-green-100 p-2 rounded-full dark:bg-green-900/20 flex items-center justify-center flex-shrink-0">
          {icono}
                </div>
      </div>
      {extra && <div className="mt-auto">{extra}</div>}
    </div>
  )
}

export default Compras
