import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import type { Hospital } from '../../types/hospital';

export function useAdminHospitals() {
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function fetchHospitals() {
    setLoading(true);
    const { data, error: err } = await supabase
      .from('hospitals')
      .select('*')
      .order('name');
    if (err) setError(err.message);
    else setHospitals(data ?? []);
    setLoading(false);
  }

  useEffect(() => {
    fetchHospitals();
  }, []);

  async function deleteHospital(id: string): Promise<void> {
    const { error: err } = await supabase.from('hospitals').delete().eq('id', id);
    if (!err) setHospitals((prev) => prev.filter((h) => h.id !== id));
  }

  return { hospitals, loading, error, deleteHospital, refreshHospitals: fetchHospitals };
}
