import { describe, it, expect } from 'vitest';

function haversineKm(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number,
): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

describe('haversineKm', () => {
  it('returns 0 for identical coordinates', () => {
    expect(haversineKm(6.5244, 3.3792, 6.5244, 3.3792)).toBe(0);
  });

  it('calculates correct distance between Lagos and Abuja (~476 km)', () => {
    const dist = haversineKm(6.5244, 3.3792, 9.0579, 7.4951);
    expect(dist).toBeGreaterThan(460);
    expect(dist).toBeLessThan(500);
  });

  it('is symmetric — distance(A, B) equals distance(B, A)', () => {
    const d1 = haversineKm(6.5244, 3.3792, 9.0579, 7.4951);
    const d2 = haversineKm(9.0579, 7.4951, 6.5244, 3.3792);
    expect(Math.abs(d1 - d2)).toBeLessThan(0.001);
  });

  it('stays within 10 km radius for nearby coordinates', () => {
    const dist = haversineKm(6.5244, 3.3792, 6.53, 3.39);
    expect(dist).toBeLessThan(10);
  });
});
