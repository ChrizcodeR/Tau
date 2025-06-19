import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
} from "@/components/ui/sidebar"
import { 
  LayoutDashboard, 
  Ticket, 
  ShoppingCart,
  Settings,
  Building2,
  FolderKanban
} from "lucide-react"
import { Link, useLocation } from "react-router-dom"

const menuItems = [
  {
    title: "Dashboard",
    url: "/",
    icon: LayoutDashboard,
  },
  {
    title: "Tickets",
    url: "/tickets",
    icon: Ticket,
  },
  {
    title: "Compras",
    url: "/compras",
    icon: ShoppingCart,
  },
  {
    title: "Proyectos",
    url: "/proyectos",
    icon: FolderKanban,
  },
  {
    title: "Configuración",
    url: "/configuracion",
    icon: Settings,
  },
]

export function AppSidebar() {
  const location = useLocation()

  return (
    <Sidebar className="border-r border-gray-200 shadow-md">
      <SidebarHeader className="p-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center float-element">
            <Building2 className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-foreground">Spyday App</h1>
            <p className="text-sm text-muted-foreground">Control Center</p>
          </div>
        </div>
      </SidebarHeader>
      
      <SidebarContent className="px-4">
        <SidebarMenu className="flex flex-col gap-y-2">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.url
            return (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton asChild className={`
                  group relative overflow-hidden rounded-lg transition-all duration-300
                  ${isActive 
                    ? 'bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-white shadow-lg' 
                    : 'hover:bg-white/5 text-muted-foreground hover:text-white'
                  }
                `}>
                  <Link to={item.url} className="flex items-center gap-4 py-4 px-3 text-lg">
                    <item.icon className={`w-7 h-7 transition-all duration-300 ${
                      isActive ? 'text-blue-400' : 'group-hover:text-blue-400'
                    }`} />
                    <span className="text-lg">{item.title}</span>
                    {isActive && (
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 animate-pulse-soft" />
                    )}
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            )
          })}
        </SidebarMenu>
      </SidebarContent>
      
      <SidebarFooter className="p-4">
        <div className="glass rounded-lg p-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-400 to-blue-500 flex items-center justify-center">
              <span className="text-xs font-bold text-foreground">SD</span>
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">Equipo IT</p>
              <p className="text-xs text-muted-foreground">En línea</p>
            </div>
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}
