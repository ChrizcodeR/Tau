import { useState, useEffect } from "react";
import PocketBase, { RecordModel } from "pocketbase";

const pb = new PocketBase(import.meta.env.VITE_DATA_URL);

export interface Ticket {
  id: string;
  reference: string;
  name: string;
  status: string;
  description: string;
  datefinished?: string;
  asignatedto: string[]; // IDs de miembros
  createdto: string; // ID de miembro
  type: string; // ID de tipo de incidencia
  created?: string; // Fecha de creación automática de PocketBase
  expand?: {
    type?: { name: string };
    asignatedto?: { id: string; name: string }[];
    createdto?: { id: string; name: string };
  };
}

export function useTickets() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Listar tickets
  const fetchTickets = async () => {
    try {
      setLoading(true);
      const records = await pb.collection('tickets').getFullList({
        expand: 'asignatedto,createdto,type'
      });
      const mapped = records.map((r: RecordModel) => ({
        id: r.id,
        reference: r.reference,
        name: r.name,
        status: r.status,
        description: r.description,
        datefinished: r.datefinished,
        asignatedto: r.asignatedto,
        createdto: r.createdto,
        type: r.type,
        created: r.created, // Campo de fecha de creación de PocketBase
        expand: r.expand
      }));
      setTickets(mapped);
      setError(null);
    } catch (err) {
      setError('Error al cargar los tickets');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Crear ticket
  const addTicket = async (data: Omit<Ticket, 'id'>) => {
    try {
      await pb.collection('tickets').create(data);
      await fetchTickets();
      setError(null);
    } catch (err) {
      setError('Error al crear el ticket');
      console.error(err);
      throw err;
    }
  };

  // Eliminar ticket
  const deleteTicket = async (id: string) => {
    try {
      await pb.collection('tickets').delete(id);
      await fetchTickets();
      setError(null);
    } catch (err) {
      setError('Error al eliminar el ticket');
      console.error(err);
      throw err;
    }
  };

  // Editar ticket
  const updateTicket = async (id: string, data: Partial<Ticket>) => {
    try {
      await pb.collection('tickets').update(id, data)
      await fetchTickets()
      setError(null)
    } catch (err) {
      setError('Error al editar el ticket')
      console.error(err)
      throw err
    }
  }

  useEffect(() => {
    fetchTickets();
  }, []);

  return {
    tickets,
    loading,
    error,
    addTicket,
    deleteTicket,
    fetchTickets,
    updateTicket
  };
} 