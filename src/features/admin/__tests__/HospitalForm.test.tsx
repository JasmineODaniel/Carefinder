import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { HospitalForm } from '../HospitalForm';

vi.mock('../../../lib/supabase', () => ({
  supabase: {
    from: () => ({
      insert: vi.fn().mockResolvedValue({ error: null }),
      update: vi.fn().mockReturnValue({ eq: vi.fn().mockResolvedValue({ error: null }) }),
    }),
  },
}));

vi.mock('@uiw/react-md-editor', () => ({
  default: ({ value, onChange }: { value: string; onChange: (v: string) => void }) => (
    <textarea
      data-testid="md-editor"
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  ),
}));

const onClose = vi.fn();
const onSaved = vi.fn();

describe('HospitalForm', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders the form when open', () => {
    render(
      <HospitalForm open={true} onClose={onClose} hospital={null} onSaved={onSaved} />,
    );
    expect(screen.getByLabelText(/hospital name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/phone/i)).toBeInTheDocument();
  });

  it('shows validation errors for empty required fields', async () => {
    render(
      <HospitalForm open={true} onClose={onClose} hospital={null} onSaved={onSaved} />,
    );
    fireEvent.click(screen.getByRole('button', { name: 'Add hospital' }));
    await waitFor(() => {
      expect(screen.getByText('Hospital name is required')).toBeInTheDocument();
    });
  });

  it('calls onClose when Cancel is clicked', () => {
    render(
      <HospitalForm open={true} onClose={onClose} hospital={null} onSaved={onSaved} />,
    );
    fireEvent.click(screen.getByText('Cancel'));
    expect(onClose).toHaveBeenCalledOnce();
  });

  it('pre-populates fields when editing an existing hospital', () => {
    const hospital = {
      id: '1',
      name: 'Test Hospital',
      address: '1 Test Street',
      city: 'Lagos',
      lga: 'Lagos Island',
      phone: '+234 800 0001',
      email: null,
      ownership: 'public' as const,
      specialties: ['emergency'],
      visiting_hours: null,
      description: null,
      lat: null,
      lng: null,
      photo_url: null,
    };
    render(
      <HospitalForm open={true} onClose={onClose} hospital={hospital} onSaved={onSaved} />,
    );
    expect(screen.getByDisplayValue('Test Hospital')).toBeInTheDocument();
    expect(screen.getByDisplayValue('+234 800 0001')).toBeInTheDocument();
  });
});
