import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { HospitalCard } from '../HospitalCard';
import type { Hospital } from '../../../types/hospital';

const hospital: Hospital = {
  id: '1',
  name: 'Eko Hospital',
  address: '1 Marina Road',
  city: 'Lagos',
  lga: 'Lagos Island',
  phone: '+234 800 0001',
  email: null,
  ownership: 'private',
  specialties: ['emergency', 'maternity', 'dental', 'cardiology'],
  visiting_hours: null,
  description: null,
  lat: 6.4,
  lng: 3.4,
};

describe('HospitalCard', () => {
  it('renders hospital name', () => {
    render(<HospitalCard hospital={hospital} />);
    expect(screen.getByText('Eko Hospital')).toBeInTheDocument();
  });

  it('renders location with LGA and city', () => {
    render(<HospitalCard hospital={hospital} />);
    expect(screen.getByText('Lagos Island, Lagos')).toBeInTheDocument();
  });

  it('shows max 3 specialties with overflow count', () => {
    render(<HospitalCard hospital={hospital} />);
    expect(screen.getByText('emergency')).toBeInTheDocument();
    expect(screen.getByText('+1 more')).toBeInTheDocument();
  });

  it('calls onSelect when clicked', () => {
    const onSelect = vi.fn();
    render(<HospitalCard hospital={hospital} onSelect={onSelect} />);
    fireEvent.click(screen.getByRole('article'));
    expect(onSelect).toHaveBeenCalledWith(hospital);
  });

  it('shows distance badge when distanceKm is provided', () => {
    render(<HospitalCard hospital={hospital} distanceKm={3.7} />);
    expect(screen.getByText('3.7 km')).toBeInTheDocument();
  });

  it('shows "No reviews yet" when rating is null', () => {
    render(<HospitalCard hospital={hospital} rating={null} />);
    expect(screen.getByText('No reviews yet')).toBeInTheDocument();
  });
});
