import { useState, useEffect } from "react";
import PocketBase, { RecordModel } from "pocketbase";

const pb = new PocketBase(import.meta.env.VITE_DATA_URL);

export interface Sale {
  id: string;
  name: string;
  price: number;
  status: string;
  description: string;
  quantity: number;
  datefinished?: string;
  persona_sale: string; // ID de miembro
  methodpay: string; // Método de pago (texto libre)
  client: string; // Cliente (texto libre)
  expand?: {
    persona_sale?: { id: string; name: string };
  };
}

export function useSales() {
  const [sales, setSales] = useState<Sale[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Listar compras
  const fetchSales = async () => {
    try {
      setLoading(true);
      const records = await pb.collection('sales').getFullList({
        expand: 'persona_sale'
      });
      const mapped = records.map((r: RecordModel) => ({
        id: r.id,
        name: r.name,
        price: r.price,
        status: r.status,
        description: r.description,
        quantity: r.quantity,
        datefinished: r.datefinished,
        persona_sale: r.persona_sale,
        methodpay: r.methodpay,
        client: r.client,
        expand: r.expand
      }));
      setSales(mapped);
      setError(null);
    } catch (err) {
      setError('Error al cargar las compras');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Crear compra
  const addSale = async (data: Omit<Sale, 'id' | 'expand'>) => {
    try {
      await pb.collection('sales').create(data);
      await fetchSales();
      setError(null);
    } catch (err) {
      setError('Error al crear la compra');
      console.error(err);
      throw err;
    }
  };

  // Editar compra
  const updateSale = async (id: string, data: Partial<Sale>) => {
    try {
      await pb.collection('sales').update(id, data);
      await fetchSales();
      setError(null);
    } catch (err) {
      setError('Error al editar la compra');
      console.error(err);
      throw err;
    }
  };

  // Eliminar compra
  const deleteSale = async (id: string) => {
    try {
      await pb.collection('sales').delete(id);
      await fetchSales();
      setError(null);
    } catch (err) {
      setError('Error al eliminar la compra');
      console.error(err);
      throw err;
    }
  };

  useEffect(() => {
    fetchSales();
  }, []);

  return {
    sales,
    loading,
    error,
    addSale,
    updateSale,
    deleteSale,
    fetchSales
  };
} 