import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import type { Hospital } from '../../types/hospital';

export function useHospitals() {
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    supabase
      .from('hospitals')
      .select('*')
      .order('name')
      .then(({ data, error: err }) => {
        if (cancelled) return;
        if (err) setError(err.message);
        else setHospitals(data ?? []);
        setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return { hospitals, loading, error };
}
