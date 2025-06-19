import { useState } from "react";
import PocketBase from "pocketbase";

const API_URL = `${import.meta.env.VITE_DATA_URL}/api/collections/progressprojects/records`;
const pb = new PocketBase(import.meta.env.VITE_DATA_URL);

export function useProgressProjects(projectId: string) {
  const [progress, setProgress] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Listar avances por proyecto
  async function fetchProgress() {
    setLoading(true);
    setError("");
    try {
      console.log("Consultando avances para proyecto:", projectId);
      
      // Obtener avances
      const records = await pb.collection('progressprojects').getFullList({
        filter: `project='${projectId}'`,
        expand: 'createdto',
        sort: '-created',
      });
      
      console.log("Avances recibidos:", records.length, "registros");
      
      if (records.length === 0) {
        setProgress([]);
        return;
      }
      
      // Verificar si el expand funcionó
      const firstRecord = records[0];
      const hasExpand = firstRecord.expand?.createdto?.name;
      
      console.log("Primer registro - ID:", firstRecord.id);
      console.log("CreatedTo ID:", firstRecord.createdto);
      console.log("Expand funcionó:", hasExpand ? "SÍ" : "NO");
      
      if (hasExpand) {
        console.log("Nombre del responsable:", firstRecord.expand.createdto.name);
        setProgress(records);
      } else {
        console.log("Haciendo consulta manual de miembros...");
        
        // Obtener IDs únicos
        const memberIds = [...new Set(records.map(r => r.createdto).filter(Boolean))];
        console.log("IDs a buscar:", memberIds);
        
        if (memberIds.length === 0) {
          setProgress(records);
          return;
        }
        
        // Consultar miembros
        const members = await pb.collection('members').getFullList();
        console.log("Total miembros:", members.length);
        
        // Crear mapa de ID → Nombre
        const memberMap = {};
        members.forEach(member => {
          memberMap[member.id] = member;
          console.log(`Miembro: ${member.id} → ${member.name}`);
        });
        
        // Aplicar mapeo
        const recordsWithNames = records.map(record => ({
          ...record,
          expand: {
            ...record.expand,
            createdto: memberMap[record.createdto] || null
          }
        }));
        
        console.log("Mapeo completado");
        setProgress(recordsWithNames);
      }
    } catch (e) {
      console.error("Error al cargar avances:", e);
      setError(`Error: ${e.message}`);
    } finally {
      setLoading(false);
    }
  }

  // Crear avance
  async function createProgress(data) {
    setLoading(true);
    setError("");
    try {
      console.log("Enviando datos al API:", data);
      const record = await pb.collection('progressprojects').create(data);
      console.log("Avance creado exitosamente:", record);
      await fetchProgress();
    } catch (e) {
      console.error("Error completo:", e);
      setError(e.message || "Error desconocido");
    } finally {
      setLoading(false);
    }
  }

  // Eliminar avance
  async function deleteProgress(id) {
    setLoading(true);
    setError("");
    try {
      await pb.collection('progressprojects').delete(id);
      await fetchProgress();
    } catch (e) {
      setError(e.message || "Error desconocido");
    } finally {
      setLoading(false);
    }
  }

  // Actualizar avance
  async function updateProgress(id, data) {
    setLoading(true);
    setError("");
    try {
      await pb.collection('progressprojects').update(id, data);
      await fetchProgress();
    } catch (e) {
      setError(e.message || "Error desconocido");
    } finally {
      setLoading(false);
    }
  }

  return {
    progress,
    loading,
    error,
    fetchProgress,
    createProgress,
    deleteProgress,
    updateProgress,
  };
}

export async function getAllProgress() {
  try {
    console.log("Obteniendo TODOS los avances para cálculo de promedios...");
    
    // Obtener todos los avances
    const records = await pb.collection('progressprojects').getFullList({
      expand: 'createdto',
      sort: '-created',
    });
    
    console.log("Total avances obtenidos:", records.length);
    
    if (records.length === 0) {
      return [];
    }
    
    // Verificar si el expand funcionó
    const hasExpand = records[0]?.expand?.createdto?.name;
    console.log("Expand funcionó en getAllProgress:", hasExpand ? "SÍ" : "NO");
    
    if (hasExpand) {
      console.log("Usando datos con expand automático");
      return records;
    } else {
      console.log("Aplicando expand manual en getAllProgress...");
      
      // Obtener IDs únicos de createdto
      const memberIds = [...new Set(records.map(r => r.createdto).filter(Boolean))];
      
      if (memberIds.length === 0) {
        return records;
      }
      
      // Obtener todos los miembros
      const members = await pb.collection('members').getFullList();
      console.log("Miembros obtenidos para expand manual:", members.length);
      
      // Crear mapa
      const memberMap = {};
      members.forEach(member => {
        memberMap[member.id] = member;
      });
      
      // Aplicar mapeo
      const recordsWithNames = records.map(record => ({
        ...record,
        expand: {
          ...record.expand,
          createdto: memberMap[record.createdto] || null
        }
      }));
      
      console.log("Expand manual completado en getAllProgress");
      return recordsWithNames;
    }
  } catch (error) {
    console.error("Error en getAllProgress:", error);
    return [];
  }
} 