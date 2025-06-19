import { useState, useEffect } from "react";
import PocketBase from "pocketbase";

const pb = new PocketBase(import.meta.env.VITE_DATA_URL);

export interface SalesType {
  id: string;
  name: string;
  description: string;
}

export function useSalesTypes() {
  const [salesTypes, setSalesTypes] = useState<SalesType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Listar tipos de compra
  const fetchSalesTypes = async () => {
    try {
      setLoading(true);
      const records = await pb.collection('salestype').getFullList();
      setSalesTypes(records);
      setError(null);
    } catch (err) {
      setError('Error al cargar los tipos de compra');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Crear tipo de compra
  const addSalesType = async (data: Omit<SalesType, 'id'>) => {
    try {
      await pb.collection('salestype').create(data);
      await fetchSalesTypes();
      setError(null);
    } catch (err) {
      setError('Error al crear el tipo de compra');
      console.error(err);
      throw err;
    }
  };

  // Actualizar tipo de compra
  const updateSalesType = async (id: string, data: Omit<SalesType, 'id'>) => {
    try {
      await pb.collection('salestype').update(id, data);
      await fetchSalesTypes();
      setError(null);
    } catch (err) {
      setError('Error al actualizar el tipo de compra');
      console.error(err);
      throw err;
    }
  };

  // Eliminar tipo de compra
  const deleteSalesType = async (id: string) => {
    try {
      await pb.collection('salestype').delete(id);
      await fetchSalesTypes();
      setError(null);
    } catch (err) {
      setError('Error al eliminar el tipo de compra');
      console.error(err);
      throw err;
    }
  };

  useEffect(() => {
    fetchSalesTypes();
  }, []);

  return {
    salesTypes,
    loading,
    error,
    addSalesType,
    updateSalesType,
    deleteSalesType,
    fetchSalesTypes
  };
} 