import Papa from 'papaparse';
import type { Hospital } from '../../types/hospital';

export type ExportColumn =
  | 'name'
  | 'address'
  | 'phone'
  | 'email'
  | 'specialties'
  | 'ownership'
  | 'city'
  | 'lga'
  | 'rating';

export const ALL_COLUMNS: ExportColumn[] = [
  'name',
  'address',
  'phone',
  'email',
  'specialties',
  'ownership',
  'city',
  'lga',
  'rating',
];

export const COLUMN_LABELS: Record<ExportColumn, string> = {
  name: 'Name',
  address: 'Address',
  phone: 'Phone',
  email: 'Email',
  specialties: 'Specialties',
  ownership: 'Ownership',
  city: 'City',
  lga: 'LGA',
  rating: 'Rating',
};

export function exportHospitals(
  hospitals: Hospital[],
  columns: ExportColumn[],
  query: string,
): void {
  const rows = hospitals.map((h) => {
    const row: Record<string, string> = {};
    columns.forEach((col) => {
      if (col === 'specialties') {
        row[COLUMN_LABELS[col]] = h.specialties?.join(', ') ?? '';
      } else if (col === 'rating') {
        row[COLUMN_LABELS[col]] = h.rating != null ? String(h.rating) : '';
      } else {
        row[COLUMN_LABELS[col]] = String((h as Record<string, unknown>)[col] ?? '');
      }
    });
    return row;
  });

  const csv = Papa.unparse(rows);
  const date = new Date().toISOString().split('T')[0];
  const slug = query.trim() ? query.trim().toLowerCase().replace(/\s+/g, '-') : 'all';
  const filename = `hospitals-${slug}-${date}.csv`;

  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
