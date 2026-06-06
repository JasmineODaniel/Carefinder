import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { RatingWidget } from '../RatingWidget';

describe('RatingWidget', () => {
  it('shows no-review message when rating is null', () => {
    render(<RatingWidget rating={null} />);
    expect(
      screen.getByText(/no reviews yet/i),
    ).toBeInTheDocument();
  });

  it('displays numeric rating value', () => {
    render(<RatingWidget rating={4.2} count={10} />);
    expect(screen.getByText('4.2')).toBeInTheDocument();
  });

  it('shows review count when provided', () => {
    render(<RatingWidget rating={3.5} count={7} />);
    expect(screen.getByText('(7 reviews)')).toBeInTheDocument();
  });

  it('uses singular "review" for count of 1', () => {
    render(<RatingWidget rating={5} count={1} />);
    expect(screen.getByText('(1 review)')).toBeInTheDocument();
  });

  it('provides accessible aria-label for stars', () => {
    render(<RatingWidget rating={4.0} />);
    expect(
      screen.getByLabelText('4.0 out of 5 stars'),
    ).toBeInTheDocument();
  });
});
