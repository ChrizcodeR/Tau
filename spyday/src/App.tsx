import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import Index from "./pages/Index";
import Tickets from "./pages/Tickets";
import Compras from "./pages/Compras";
import Configuracion from "./pages/Configuracion";
import NotFound from "./pages/NotFound";
import Proyectos from "./pages/Proyectos";
import ProyectosDetalle from "./pages/ProyectosDetalle";
import Avances from "./pages/Avances";
import { ThemeProvider, createTheme, CssBaseline } from "@mui/material";

const queryClient = new QueryClient();
const theme = createTheme({
  palette: {
    mode: "light",
    primary: { main: "#1976d2" },
    secondary: { main: "#9c27b0" },
    background: { default: "#f4f6fa" },
  },
  shape: { borderRadius: 12 },
});

const App = () => (
  <ThemeProvider theme={theme}>
    <CssBaseline />
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <SidebarProvider>
          <div className="min-h-screen flex w-full">
            <AppSidebar />
            <main className="flex-1 overflow-auto">
              <div className="sticky top-0 z-40 bg-background/80 backdrop-blur-sm border-b border-white/10 p-4">
                <SidebarTrigger className="text-white hover:bg-white/10" />
              </div>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/tickets" element={<Tickets />} />
                <Route path="/compras" element={<Compras />} />
                <Route path="/proyectos" element={<Proyectos />} />
                <Route path="/proyectos/:id" element={<ProyectosDetalle />} />
                <Route path="/avances" element={<Avances />} />
                <Route path="/configuracion" element={<Configuracion />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </main>
          </div>
        </SidebarProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
  </ThemeProvider>
);

export default App;
