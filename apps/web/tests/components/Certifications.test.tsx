import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import Certifications from '../../src/components/Certifications';
import { resumeData } from '@cloud-resume-v2/contracts';

describe('Certifications Component', () => {
  it('renders certifications correctly', () => {
    render(<Certifications />);

    resumeData.certifications.forEach(cert => {
      expect(screen.getByRole('heading', { level: 3, name: cert.name })).toBeInTheDocument();
      expect(screen.getByText(cert.subtitle)).toBeInTheDocument();
      expect(screen.getByText(cert.validationId, { exact: false })).toBeInTheDocument();
    });
  });

  it('renders the certifications section heading correctly', () => {
    render(<Certifications />);
    expect(screen.getByRole('heading', { level: 2, name: /Certifications/i })).toBeInTheDocument();
  });

  it('renders a safe external "Verify Badge" link tinted with the certification color', () => {
    const { container } = render(<Certifications />);

    const cards = container.querySelectorAll('.bg-white');

    resumeData.certifications.forEach((cert, idx) => {
      const link = screen.getByRole('link', { name: /Verify Badge/i });
      expect(link).toHaveAttribute('href', cert.url);
      expect(link).toHaveAttribute('target', '_blank');
      expect(link).toHaveAttribute('rel', 'noopener noreferrer');
      expect(link).toHaveStyle({ color: cert.color });

      // The badge icon carries the data-driven color and is hidden from assistive tech.
      const icon = cards[idx].querySelector('i');
      expect(icon).not.toBeNull();
      expect(icon).toHaveStyle({ color: cert.color });
      expect(icon).toHaveAttribute('aria-hidden', 'true');
    });
  });

  it('applies staggered reveal-on-scroll and hover floating transition styling to certifications', () => {
    const { container } = render(<Certifications />);

    const certCards = container.querySelectorAll('.bg-white');
    expect(certCards.length).toBe(resumeData.certifications.length);

    certCards.forEach((card, idx) => {
      expect(card).toHaveClass('reveal-on-scroll');
      expect(card).toHaveClass('shadow-card');
      expect(card).toHaveClass('m-transition');
      expect(card).toHaveClass('hover:shadow-hover');
      expect(card).toHaveClass('hover:-translate-y-1');
      expect(card).toHaveStyle({ transitionDelay: `${(idx + 1) * 100}ms` });
    });
  });

  it('makes the entire certification card a safe external link to its verification url', () => {
    render(<Certifications />);

    resumeData.certifications.forEach(cert => {
      const cardLink = screen.getByRole('link', {
        name: `Open the ${cert.name} certification`,
      });
      expect(cardLink).toHaveAttribute('href', cert.url);
      expect(cardLink).toHaveAttribute('target', '_blank');
      expect(cardLink).toHaveAttribute('rel', 'noopener noreferrer');
    });
  });
});
