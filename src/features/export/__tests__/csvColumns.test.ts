import { describe, it, expect, vi, beforeAll, afterEach } from 'vitest';
import { exportHospitals, ALL_COLUMNS, COLUMN_LABELS } from '../useExport';
import type { Hospital } from '../../../types/hospital';

const mockHospital: Hospital = {
  id: '1',
  name: 'Lagos General Hospital',
  address: '1 Hospital Road',
  city: 'Lagos',
  lga: 'Lagos Island',
  phone: '+234 800 000 0001',
  email: 'info@lgh.gov.ng',
  ownership: 'public',
  specialties: ['emergency', 'maternity'],
  visiting_hours: 'Mon–Fri 9am–5pm',
  description: null,
  lat: 6.4531,
  lng: 3.3958,
  rating: 4.2,
  review_count: 15,
};

describe('exportHospitals', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  beforeAll(() => {
    global.URL.createObjectURL = vi.fn(() => 'blob:test');
    global.URL.revokeObjectURL = vi.fn();
    const a = { click: vi.fn(), href: '', download: '' };
    vi.spyOn(document, 'createElement').mockReturnValue(a as unknown as HTMLElement);
  });

  it('includes all selected columns in output', () => {
    const clickSpy = vi.fn();
    const a = { click: clickSpy, href: '', download: '' };
    vi.spyOn(document, 'createElement').mockReturnValueOnce(a as unknown as HTMLElement);

    exportHospitals([mockHospital], ALL_COLUMNS, 'lagos');

    expect(a.download).toMatch(/hospitals-lagos-\d{4}-\d{2}-\d{2}\.csv/);
    expect(a.href).toBe('blob:test');
    expect(clickSpy).toHaveBeenCalledOnce();
  });

  it('uses date-based filename when no query is provided', () => {
    const a = { click: vi.fn(), href: '', download: '' };
    vi.spyOn(document, 'createElement').mockReturnValueOnce(a as unknown as HTMLElement);

    exportHospitals([mockHospital], ALL_COLUMNS, '');

    expect(a.download).toMatch(/hospitals-all-\d{4}-\d{2}-\d{2}\.csv/);
  });

  it('joins specialties as comma-separated string', async () => {
    const Papa = (await import('papaparse')).default;
    const unparseSpy = vi.spyOn(Papa, 'unparse');

    const a = { click: vi.fn(), href: '', download: '' };
    vi.spyOn(document, 'createElement').mockReturnValueOnce(a as unknown as HTMLElement);

    exportHospitals([mockHospital], ['specialties'], 'test');

    const rows = unparseSpy.mock.calls[0][0] as Record<string, string>[];
    expect(rows[0][COLUMN_LABELS.specialties]).toBe('emergency, maternity');
  });

  it('exports only selected columns', async () => {
    const Papa = (await import('papaparse')).default;
    const unparseSpy = vi.spyOn(Papa, 'unparse');

    const a = { click: vi.fn(), href: '', download: '' };
    vi.spyOn(document, 'createElement').mockReturnValueOnce(a as unknown as HTMLElement);

    exportHospitals([mockHospital], ['name', 'phone'], 'test');

    const rows = unparseSpy.mock.calls[0][0] as Record<string, string>[];
    expect(Object.keys(rows[0])).toHaveLength(2);
    expect(rows[0][COLUMN_LABELS.name]).toBe('Lagos General Hospital');
  });
});
