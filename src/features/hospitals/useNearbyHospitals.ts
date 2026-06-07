import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import type { Hospital } from '../../types/hospital';

export type HospitalWithDistance = Hospital & { distance_km: number };

export function useNearbyHospitals(
  coords: { lat: number; lng: number } | null,
  radiusKm: number | null,
) {
  const [data, setData] = useState<HospitalWithDistance[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!coords || !radiusKm) {
      setData([]);
      setError(null);
      setLoading(false);
      return;
    }

    let cancelled = false;
    setLoading(true);
    setError(null);

    supabase
      .rpc('nearby_hospitals', { lat: coords.lat, lng: coords.lng, radius_km: radiusKm })
      .then(({ data: rows, error: rpcError }) => {
        if (cancelled) return;
        if (rpcError) {
          setError(rpcError.message);
          setData([]);
        } else {
          setData((rows ?? []) as HospitalWithDistance[]);
        }
        setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [coords?.lat, coords?.lng, radiusKm]);

  return { data, loading, error };
}
