import { useState, useEffect } from "react";

const PAGE_SIZE = 10;
const API_URL = `${import.meta.env.VITE_DATA_URL}/api/collections/projects/records`;

export function useProjects() {
  const [projects, setProjects] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState({ status: "", partner: "", responsable: "", dateFrom: "", dateTo: "" });

  // Fetch projects from PocketBase
  useEffect(() => {
    fetchProjects();
    // eslint-disable-next-line
  }, [page, search, filters]);

  async function fetchProjects() {
    setLoading(true);
    setError("");
    try {
      const params = new URLSearchParams();
      params.append("page", page.toString());
      params.append("perPage", PAGE_SIZE.toString());
      params.append("expand", "createdto");
      if (search) params.append("filter", `name~\"${search}\" || description~\"${search}\" || partner~\"${search}\"`);
      if (filters.status) params.append("filter", `status='${filters.status}'`);
      if (filters.partner) params.append("filter", `partner~\"${filters.partner}\"`);
      if (filters.responsable) params.append("filter", `createdto='${filters.responsable}'`);
      if (filters.dateFrom) params.append("filter", `datefinished>='${filters.dateFrom}'`);
      if (filters.dateTo) params.append("filter", `datefinished<='${filters.dateTo}'`);
      const res = await fetch(`${API_URL}?${params.toString()}`);
      if (!res.ok) throw new Error("Error al cargar proyectos");
      const data = await res.json();
      setProjects(data.items || []);
      setTotal(data.totalItems || 0);
    } catch (e) {
      setError(e.message || "Error desconocido");
    } finally {
      setLoading(false);
    }
  }

  async function createProject(project) {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(project),
      });
      if (!res.ok) throw new Error("Error al crear proyecto");
      await fetchProjects();
    } catch (e) {
      setError(e.message || "Error desconocido");
    } finally {
      setLoading(false);
    }
  }

  async function updateProject(id, project) {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${API_URL}/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(project),
      });
      if (!res.ok) throw new Error("Error al actualizar proyecto");
      await fetchProjects();
    } catch (e) {
      setError(e.message || "Error desconocido");
    } finally {
      setLoading(false);
    }
  }

  async function deleteProject(id) {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Error al eliminar proyecto");
      await fetchProjects();
    } catch (e) {
      setError(e.message || "Error desconocido");
    } finally {
      setLoading(false);
    }
  }

  function setFilterField(field, value) {
    setFilters((prev) => ({ ...prev, [field]: value }));
    setPage(1);
  }

  function clearFilters() {
    setFilters({ status: "", partner: "", responsable: "", dateFrom: "", dateTo: "" });
    setSearch("");
    setPage(1);
  }

  return {
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
    fetchProjects,
    createProject,
    updateProject,
    deleteProject,
  };
} 