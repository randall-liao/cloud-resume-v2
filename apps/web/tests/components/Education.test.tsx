import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import Education from '../../src/components/Education';
import { resumeData } from '@cloud-resume-v2/contracts';

describe('Education Component', () => {
  it('renders section title correctly', () => {
    render(<Education />);
    expect(screen.getByRole('heading', { level: 2, name: /Education/i })).toBeInTheDocument();
  });

  it('renders education correctly', () => {
    render(<Education />);

    resumeData.education.forEach(edu => {
      expect(screen.getByRole('heading', { level: 3, name: edu.institution })).toBeInTheDocument();
      expect(screen.getByText(edu.degree)).toBeInTheDocument();
      expect(screen.getByText(edu.graduationDate)).toBeInTheDocument();
    });
  });

  it('tints each education icon with its configured color', () => {
    const { container } = render(<Education />);

    const cards = container.querySelectorAll('.bg-white');
    expect(cards.length).toBe(resumeData.education.length);

    resumeData.education.forEach((edu, idx) => {
      const icon = cards[idx].querySelector('.material-icons') as HTMLElement | null;
      expect(icon).not.toBeNull();
      expect(icon?.textContent).toBe(edu.icon);
      expect(icon).toHaveStyle({ color: edu.color });
    });
  });

  it('applies staggered reveal-on-scroll delay and card hover transitions to education', () => {
    const { container } = render(<Education />);

    const header = container.querySelector('.reveal-on-scroll');
    expect(header).toBeInTheDocument();

    const eduCards = container.querySelectorAll('.bg-white');
    expect(eduCards.length).toBe(resumeData.education.length);

    eduCards.forEach((card, idx) => {
      expect(card).toHaveClass('reveal-on-scroll');
      expect(card).toHaveClass('shadow-card');
      expect(card).toHaveClass('m-transition');
      expect(card).toHaveClass('hover:shadow-hover');
      expect(card).toHaveClass('hover:-translate-y-1');
      expect(card).toHaveStyle({ transitionDelay: `${(idx + 1) * 100}ms` });
    });
  });
});
