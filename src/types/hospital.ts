export type Ownership = 'public' | 'private';

export interface Hospital {
  id: string;
  name: string;
  address: string;
  city: string | null;
  lga: string | null;
  phone: string;
  email: string | null;
  ownership: Ownership;
  specialties: string[];
  visiting_hours: string | null;
  description: string | null;
  lat: number | null;
  lng: number | null;
  photo_url: string | null;
  rating?: number | null;
  review_count?: number;
}
