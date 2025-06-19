import { useState, useEffect } from "react";
import PocketBase from "pocketbase";

const pb = new PocketBase(import.meta.env.VITE_DATA_URL);

export interface Member {
  id: string;
  name: string;
  rol: string;
  contact: string;
}

export function useMembers() {
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Listar miembros
  const fetchMembers = async () => {
    try {
      setLoading(true);
      const records = await pb.collection('members').getFullList();
      setMembers(records);
      setError(null);
    } catch (err) {
      setError('Error al cargar los miembros');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Crear miembro
  const addMember = async (data: Omit<Member, 'id'>) => {
    try {
      await pb.collection('members').create(data);
      await fetchMembers();
      setError(null);
    } catch (err) {
      setError('Error al crear el miembro');
      console.error(err);
      throw err;
    }
  };

  // Actualizar miembro
  const updateMember = async (id: string, data: Omit<Member, 'id'>) => {
    try {
      await pb.collection('members').update(id, data);
      await fetchMembers();
      setError(null);
    } catch (err) {
      setError('Error al actualizar el miembro');
      console.error(err);
      throw err;
    }
  };

  // Eliminar miembro
  const deleteMember = async (id: string) => {
    try {
      await pb.collection('members').delete(id);
      await fetchMembers();
      setError(null);
    } catch (err) {
      setError('Error al eliminar el miembro');
      console.error(err);
      throw err;
    }
  };

  useEffect(() => {
    fetchMembers();
  }, []);

  return {
    members,
    loading,
    error,
    addMember,
    updateMember,
    deleteMember,
    fetchMembers
  };
} 