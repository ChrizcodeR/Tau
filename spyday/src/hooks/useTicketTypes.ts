import { useState, useEffect } from "react";
import PocketBase from "pocketbase";

const pb = new PocketBase(import.meta.env.VITE_DATA_URL);

export interface TicketType {
  id: string;
  name: string;
  priority: string;
  replytime: number;
}

export function useTicketTypes() {
  const [ticketTypes, setTicketTypes] = useState<TicketType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Listar tipos de incidencia
  const fetchTicketTypes = async () => {
    try {
      setLoading(true);
      const records = await pb.collection('ticketstype').getFullList();
      setTicketTypes(records);
      setError(null);
    } catch (err) {
      setError('Error al cargar los tipos de incidencia');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Crear tipo de incidencia
  const addTicketType = async (data: Omit<TicketType, 'id'>) => {
    try {
      await pb.collection('ticketstype').create(data);
      await fetchTicketTypes();
      setError(null);
    } catch (err) {
      setError('Error al crear el tipo de incidencia');
      console.error(err);
      throw err;
    }
  };

  // Actualizar tipo de incidencia
  const updateTicketType = async (id: string, data: Omit<TicketType, 'id'>) => {
    try {
      await pb.collection('ticketstype').update(id, data);
      await fetchTicketTypes();
      setError(null);
    } catch (err) {
      setError('Error al actualizar el tipo de incidencia');
      console.error(err);
      throw err;
    }
  };

  // Eliminar tipo de incidencia
  const deleteTicketType = async (id: string) => {
    try {
      await pb.collection('ticketstype').delete(id);
      await fetchTicketTypes();
      setError(null);
    } catch (err) {
      setError('Error al eliminar el tipo de incidencia');
      console.error(err);
      throw err;
    }
  };

  useEffect(() => {
    fetchTicketTypes();
  }, []);

  return {
    ticketTypes,
    loading,
    error,
    addTicketType,
    updateTicketType,
    deleteTicketType,
    fetchTicketTypes
  };
} 