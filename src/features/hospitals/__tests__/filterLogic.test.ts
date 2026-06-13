import { describe, it, expect } from 'vitest';
import type { Hospital } from '../../../types/hospital';

function applyFilters(
  hospitals: Hospital[],
  query: string,
  ownership: 'all' | 'public' | 'private',
  specialties: string[],
): Hospital[] {
  const q = query.trim().toLowerCase();
  return hospitals.filter((h) => {
    const matchesText =
      !q || [h.name, h.city, h.lga].filter(Boolean).some((f) => f!.toLowerCase().includes(q));
    const matchesOwnership = ownership === 'all' || h.ownership === ownership;
    const matchesSpecialty =
      specialties.length === 0 || specialties.some((s) => h.specialties?.includes(s));
    return matchesText && matchesOwnership && matchesSpecialty;
  });
}

const hospitals: Hospital[] = [
  {
    id: '1',
    name: 'Eko Hospital',
    address: '1 Marina',
    city: 'Lagos',
    lga: 'Lagos Island',
    phone: '080',
    email: null,
    ownership: 'private',
    specialties: ['emergency', 'cardiology'],
    visiting_hours: null,
    description: null,
    lat: 6.4,
    lng: 3.4,
    photo_url: null,
  },
  {
    id: '2',
    name: 'Abuja Teaching Hospital',
    address: '2 Central',
    city: 'Abuja',
    lga: 'Garki',
    phone: '081',
    email: null,
    ownership: 'public',
    specialties: ['maternity', 'pediatric'],
    visiting_hours: null,
    description: null,
    lat: 9.0,
    lng: 7.5,
    photo_url: null,
  },
];

describe('applyFilters', () => {
  it('returns all hospitals when no filters are active', () => {
    expect(applyFilters(hospitals, '', 'all', [])).toHaveLength(2);
  });

  it('filters by name query case-insensitively', () => {
    const result = applyFilters(hospitals, 'eko', 'all', []);
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe('1');
  });

  it('filters by city', () => {
    const result = applyFilters(hospitals, 'abuja', 'all', []);
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe('2');
  });

  it('filters by ownership type', () => {
    expect(applyFilters(hospitals, '', 'public', [])).toHaveLength(1);
    expect(applyFilters(hospitals, '', 'private', [])).toHaveLength(1);
  });

  it('filters by specialty', () => {
    const result = applyFilters(hospitals, '', 'all', ['maternity']);
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe('2');
  });

  it('returns empty array when no hospitals match', () => {
    expect(applyFilters(hospitals, 'nonexistent', 'all', [])).toHaveLength(0);
  });
});
