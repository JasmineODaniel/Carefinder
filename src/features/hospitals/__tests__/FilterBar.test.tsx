import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { FilterBar } from '../FilterBar';

const defaultProps = {
  specialties: ['maternity', 'emergency', 'dental'],
  selectedSpecialties: [],
  onToggleSpecialty: vi.fn(),
  ownership: 'all' as const,
  onOwnershipChange: vi.fn(),
  nearMe: false,
  onToggleNearMe: vi.fn(),
  locating: false,
  locationError: null,
  radiusKm: 10,
  onRadiusChange: vi.fn(),
  hasActiveFilters: false,
  onClear: vi.fn(),
};

describe('FilterBar', () => {
  it('renders all ownership options', () => {
    render(<FilterBar {...defaultProps} />);
    expect(screen.getByText('All')).toBeInTheDocument();
    expect(screen.getByText('Public')).toBeInTheDocument();
    expect(screen.getByText('Private')).toBeInTheDocument();
  });

  it('renders specialty chips', () => {
    render(<FilterBar {...defaultProps} />);
    expect(screen.getByText('maternity')).toBeInTheDocument();
    expect(screen.getByText('emergency')).toBeInTheDocument();
  });

  it('calls onToggleSpecialty when a specialty chip is clicked', () => {
    const onToggleSpecialty = vi.fn();
    render(<FilterBar {...defaultProps} onToggleSpecialty={onToggleSpecialty} />);
    fireEvent.click(screen.getByText('maternity'));
    expect(onToggleSpecialty).toHaveBeenCalledWith('maternity');
  });

  it('shows "Clear all" only when hasActiveFilters is true', () => {
    const { rerender } = render(<FilterBar {...defaultProps} />);
    expect(screen.queryByText('Clear all')).not.toBeInTheDocument();

    rerender(<FilterBar {...defaultProps} hasActiveFilters={true} />);
    expect(screen.getByText('Clear all')).toBeInTheDocument();
  });

  it('shows location error when provided', () => {
    render(
      <FilterBar {...defaultProps} locationError="Geolocation not supported." />,
    );
    expect(screen.getByRole('alert')).toHaveTextContent('Geolocation not supported.');
  });
});
