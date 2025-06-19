import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { 
  Users, 
  CheckCircle2, 
  Clock, 
  AlertTriangle,
  TrendingUp,
  Server,
  Wifi,
  Monitor,
  Ticket
} from "lucide-react"

const statsCards = [
  {
    title: "Tickets Abiertos",
    value: "23",
    change: "+5 esta semana",
    icon: Clock,
    color: "text-orange-400",
    bgGradient: "from-orange-500/20 to-red-500/20"
  },
  {
    title: "Tickets Resueltos",
    value: "156",
    change: "+12 esta semana",
    icon: CheckCircle2,
    color: "text-green-400",
    bgGradient: "from-green-500/20 to-emerald-500/20"
  },
  {
    title: "Equipos Activos",
    value: "89",
    change: "+3 nuevos",
    icon: Monitor,
    color: "text-blue-400",
    bgGradient: "from-blue-500/20 to-cyan-500/20"
  },
  {
    title: "Compras Pendientes",
    value: "7",
    change: "$15,230 total",
    icon: AlertTriangle,
    color: "text-purple-400",
    bgGradient: "from-purple-500/20 to-pink-500/20"
  }
]

const recentTickets = [
  {
    id: "TK-001",
    title: "Problema con ERP - Módulo de Inventario",
    priority: "Alta",
    status: "En progreso",
    assignee: "Carlos M.",
    time: "Hace 2h"
  },
  {
    id: "TK-002", 
    title: "Instalación de cámaras - Piso 3",
    priority: "Media",
    status: "Pendiente",
    assignee: "Ana R.",
    time: "Hace 4h"
  },
  {
    id: "TK-003",
    title: "Cableado de red - Oficinas nuevas",
    priority: "Baja",
    status: "Completado",
    assignee: "Luis P.",
    time: "Hace 1d"
  }
]

const systemStatus = [
  { name: "Servidor Principal", status: "online", uptime: "99.9%" },
  { name: "Red Corporativa", status: "online", uptime: "98.5%" },
  { name: "Sistema ERP", status: "warning", uptime: "95.2%" },
  { name: "Cámaras Seguridad", status: "online", uptime: "97.8%" }
]

export function Dashboard() {
  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Dashboard IT</h1>
          <p className="text-muted-foreground">Resumen general del sistema</p>
        </div>
        <div className="glass rounded-lg px-4 py-2">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse-soft"></div>
            <span className="text-sm text-muted-foreground">Sistema Operativo</span>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsCards.map((stat, index) => (
          <Card key={stat.title} className={`glass hover-lift animate-slide-up border-0`} 
                style={{ animationDelay: `${index * 100}ms` }}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{stat.title}</p>
                  <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                  <p className="text-xs text-muted-foreground mt-1">{stat.change}</p>
                </div>
                <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${stat.bgGradient} flex items-center justify-center float-element`}>
                  <stat.icon className={`w-6 h-6 ${stat.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Tickets */}
        <Card className="glass border-0 lg:col-span-2 animate-slide-up" style={{ animationDelay: '400ms' }}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-foreground">
              <Ticket className="w-5 h-5 text-blue-400" />
              Tickets Recientes
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentTickets.map((ticket, index) => (
              <div key={ticket.id} className="flex items-center justify-between p-4 rounded-lg bg-white/5 hover:bg-white/10 transition-all duration-300 hover-lift">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <Badge variant="outline" className="text-xs border-blue-500/50 text-blue-400">
                      {ticket.id}
                    </Badge>
                    <Badge 
                      variant={ticket.priority === 'Alta' ? 'destructive' : ticket.priority === 'Media' ? 'default' : 'secondary'}
                      className="text-xs"
                    >
                      {ticket.priority}
                    </Badge>
                  </div>
                  <h4 className="font-medium text-foreground text-sm">{ticket.title}</h4>
                  <p className="text-xs text-muted-foreground mt-1">
                    {ticket.assignee} • {ticket.time}
                  </p>
                </div>
                <Badge 
                  variant={ticket.status === 'Completado' ? 'default' : 'secondary'}
                  className={`ml-4 ${ticket.status === 'Completado' ? 'bg-green-500/20 text-green-400' : ''}`}
                >
                  {ticket.status}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* System Status */}
        <Card className="glass border-0 animate-slide-up" style={{ animationDelay: '500ms' }}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-foreground">
              <Server className="w-5 h-5 text-green-400" />
              Estado del Sistema
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {systemStatus.map((system, index) => (
              <div key={system.name} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-foreground">{system.name}</span>
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${
                      system.status === 'online' ? 'bg-green-400' : 
                      system.status === 'warning' ? 'bg-orange-400' : 'bg-red-400'
                    } ${system.status === 'online' ? 'animate-pulse-soft' : ''}`}></div>
                    <span className="text-xs text-muted-foreground">{system.uptime}</span>
                  </div>
                </div>
                <Progress 
                  value={parseFloat(system.uptime)} 
                  className="h-2"
                />
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Performance Overview */}
      <Card className="glass border-0 animate-slide-up" style={{ animationDelay: '600ms' }}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-foreground">
            <TrendingUp className="w-5 h-5 text-purple-400" />
            Resumen de Performance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-4 rounded-lg bg-gradient-to-br from-blue-500/10 to-purple-500/10">
              <div className="text-2xl font-bold text-foreground">94%</div>
              <div className="text-sm text-muted-foreground">Satisfacción Cliente</div>
            </div>
            <div className="text-center p-4 rounded-lg bg-gradient-to-br from-green-500/10 to-emerald-500/10">
              <div className="text-2xl font-bold text-foreground">2.3h</div>
              <div className="text-sm text-muted-foreground">Tiempo Promedio Resolución</div>
            </div>
            <div className="text-center p-4 rounded-lg bg-gradient-to-br from-orange-500/10 to-red-500/10">
              <div className="text-2xl font-bold text-foreground">12</div>
              <div className="text-sm text-muted-foreground">Equipos Instalados Esta Semana</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
