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
});
