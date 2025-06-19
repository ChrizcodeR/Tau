import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, PlusCircle } from "lucide-react";
import { useProgressProjects } from "@/hooks/useProgressProjects";
import { useMembers } from "@/hooks/useMembers";

const ProyectosDetalle = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { progress, loading, error, fetchProgress, createProgress, deleteProgress } = useProgressProjects(id);
  const { members, loading: loadingMembers } = useMembers();
  const [form, setForm] = useState({ hito: "", commit: "", percent: "", createdto: [] });
  const [proyecto, setProyecto] = useState(null);

  // Cargar datos del proyecto (puedes adaptar a tu hook real de proyectos)
  useEffect(() => {
    fetchProgress();
    // Simulación: puedes reemplazar por fetch real del proyecto
    fetch(`/api/collections/projects/records/${id}?expand=createdto`).then(r => r.json()).then(data => setProyecto(data));
  }, [id]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
  const handleChecklist = (e) => {
    const value = e.target.value;
    setForm((f) => ({ ...f, createdto: Array.from(e.target.selectedOptions, (option) => option.value) }));
  };
  const handleAddAvance = async (e) => {
    e.preventDefault();
    if (!form.hito || !form.commit || !form.percent || form.createdto.length === 0) return;
    await createProgress({
      project: id,
      hito: form.hito,
      commit: form.commit,
      percent: Number(form.percent),
      dateregister: new Date().toISOString(),
      createdto: form.createdto
    });
    setForm({ hito: "", commit: "", percent: "", createdto: [] });
    fetchProgress();
  };
  const handleDelete = async (pid) => {
    await deleteProgress(pid);
    fetchProgress();
  };
  // Porcentaje de avance: el mayor percent registrado
  const avanceTotal = progress.length > 0 ? Math.max(...progress.map(a => a.percent || 0)) : 0;

  if (!proyecto) return <div className="p-6">Proyecto no encontrado.</div>;

  return (
    <div className="space-y-6 p-6">
      <Button variant="ghost" className="mb-2" onClick={() => navigate(-1)}>
        <ArrowLeft className="w-4 h-4 mr-2" /> Volver a proyectos
      </Button>
      <Card className="glass border-0">
        <CardHeader>
          <CardTitle className="text-foreground">Detalle del Proyecto</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <Label className="text-foreground">Nombre</Label>
              <div className="text-foreground font-semibold">{proyecto.name}</div>
            </div>
            <div>
              <Label className="text-foreground">Responsable</Label>
              <div className="text-foreground">{proyecto.expand?.createdto?.name || '-'}</div>
            </div>
            <div>
              <Label className="text-foreground">Estado</Label>
              <div className="text-foreground">{proyecto.status}</div>
            </div>
            <div>
              <Label className="text-foreground">Fecha fin</Label>
              <div className="text-foreground">{proyecto.datefinished}</div>
            </div>
            <div className="md:col-span-3">
              <Label className="text-foreground">Descripción</Label>
              <div className="text-foreground">{proyecto.description}</div>
            </div>
          </div>
          <div className="mt-4">
            <Label className="text-foreground">Progreso total</Label>
            <div className="w-full bg-gray-200 rounded-full h-4 mt-1">
              <div className="bg-green-500 h-4 rounded-full transition-all" style={{ width: `${avanceTotal}%` }} />
            </div>
            <div className="text-xs text-muted-foreground mt-1">{avanceTotal}% completado</div>
          </div>
        </CardContent>
      </Card>
      <Card className="glass border-0">
        <CardHeader>
          <CardTitle className="text-foreground flex items-center gap-2">
            <PlusCircle className="w-5 h-5 text-green-400" /> Registrar avance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form className="grid grid-cols-1 md:grid-cols-3 gap-4" onSubmit={handleAddAvance}>
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
                multiple
                required
              >
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
            <div className="md:col-span-3">
              <Button type="submit" className="w-full">Agregar avance</Button>
            </div>
          </form>
        </CardContent>
      </Card>
      <Card className="glass border-0">
        <CardHeader>
          <CardTitle className="text-foreground">Avances registrados</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center text-muted-foreground py-8">Cargando avances...</div>
          ) : error ? (
            <div className="text-center text-red-500 py-8">{error}</div>
          ) : progress.length === 0 ? (
            <div className="text-center text-muted-foreground py-8">No hay avances registrados aún.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm text-left">
                <thead>
                  <tr className="border-b border-border text-foreground">
                    <th className="py-2 px-3 font-semibold">Fecha</th>
                    <th className="py-2 px-3 font-semibold">Hito</th>
                    <th className="py-2 px-3 font-semibold">Porcentaje</th>
                    <th className="py-2 px-3 font-semibold">Comentario</th>
                    <th className="py-2 px-3 font-semibold">Responsables</th>
                    <th className="py-2 px-3 font-semibold">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {progress.map((a) => (
                    <tr key={a.id} className="border-b border-border hover:bg-accent/20 transition">
                      <td className="py-2 px-3">{a.dateregister ? new Date(a.dateregister).toLocaleString() : "-"}</td>
                      <td className="py-2 px-3">{a.hito}</td>
                      <td className="py-2 px-3">{a.percent}%</td>
                      <td className="py-2 px-3">{a.commit}</td>
                      <td className="py-2 px-3">
                        {a.expand?.createdto?.length > 0
                          ? a.expand.createdto.map((m) => (
                              <span key={m.id} className="inline-block bg-blue-100 text-blue-600 rounded-full px-2 py-1 text-xs font-semibold mr-1 mb-1">
                                {m.name}
                              </span>
                            ))
                          : "-"}
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
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ProyectosDetalle; 