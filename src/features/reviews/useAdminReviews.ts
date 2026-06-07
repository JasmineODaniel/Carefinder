import { useEffect, useState, useCallback } from 'react';
import { supabase } from '../../lib/supabase';

export interface AdminReview {
  id: string;
  hospital_id: string;
  user_id: string;
  rating: number;
  text: string | null;
  hidden: boolean;
  created_at: string;
  hospitals: { name: string } | null;
}

export function useAdminReviews() {
  const [reviews, setReviews] = useState<AdminReview[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchReviews = useCallback(async () => {
    setLoading(true);
    const { data, error: err } = await supabase
      .from('reviews')
      .select('*, hospitals(name)')
      .order('created_at', { ascending: false });
    if (err) setError(err.message);
    else setReviews((data ?? []) as AdminReview[]);
    setLoading(false);
  }, []);

  useEffect(() => { fetchReviews(); }, [fetchReviews]);

  async function toggleHidden(id: string, hidden: boolean) {
    await supabase.from('reviews').update({ hidden }).eq('id', id);
    setReviews((prev) => prev.map((r) => (r.id === id ? { ...r, hidden } : r)));
  }

  async function deleteReview(id: string) {
    await supabase.from('reviews').delete().eq('id', id);
    setReviews((prev) => prev.filter((r) => r.id !== id));
  }

  return { reviews, loading, error, toggleHidden, deleteReview, refreshReviews: fetchReviews };
}
