import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';

export interface Review {
  id: string;
  hospital_id: string;
  user_id: string;
  rating: number;
  text: string | null;
  created_at: string;
  hidden: boolean;
}

export function useReviews(hospitalId: string) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function fetchReviews() {
    const { data, error: err } = await supabase
      .from('reviews')
      .select('*')
      .eq('hospital_id', hospitalId)
      .eq('hidden', false)
      .order('created_at', { ascending: false });
    if (err) setError(err.message);
    else setReviews(data ?? []);
    setLoading(false);
  }

  useEffect(() => {
    fetchReviews();
  }, [hospitalId]);

  async function addReview(rating: number, text: string): Promise<void> {
    const { error: err } = await supabase.from('reviews').insert({
      hospital_id: hospitalId,
      rating,
      text: text.trim() || null,
    });
    if (err) throw new Error(err.message);
    await fetchReviews();
  }

  return { reviews, loading, error, addReview };
}
