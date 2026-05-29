import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import Interests from '../../src/components/Interests';
import { resumeData } from '@cloud-resume-v2/contracts';

describe('Interests Component', () => {
  it('renders interests correctly', () => {
    render(<Interests />);

    resumeData.interests.forEach(interest => {
      expect(screen.getByRole('heading', { level: 3, name: interest.title })).toBeInTheDocument();
      expect(screen.getByText(interest.subtitle)).toBeInTheDocument();
      expect(screen.getByText(interest.description)).toBeInTheDocument();

      interest.metrics.forEach(metric => {
          expect(screen.getByText(metric.label)).toBeInTheDocument();
          expect(screen.getByText(metric.value)).toBeInTheDocument();
      });

      expect(screen.getByText(interest.status)).toBeInTheDocument();
    });
  });

  it('applies staggered reveal-on-scroll and card hover transitions to interests', () => {
    const { container } = render(<Interests />);

    const interestCards = container.querySelectorAll('.bg-white');
    expect(interestCards.length).toBe(resumeData.interests.length);

    interestCards.forEach((card, idx) => {
      expect(card).toHaveClass('reveal-on-scroll');
      expect(card).toHaveClass('shadow-card');
      expect(card).toHaveClass('m-transition');
      expect(card).toHaveClass('hover:shadow-hover');
      expect(card).toHaveClass('hover:-translate-y-1');

      const expectedDelay = `${(idx + 1 + resumeData.certifications.length) * 100}ms`;
      expect(card).toHaveStyle({ transitionDelay: expectedDelay });
    });

    // Verify pulse dot is pulse-subtle
    const pulseDot = container.querySelector('.animate-pulse-subtle');
    expect(pulseDot).not.toBeNull();
  });
});
