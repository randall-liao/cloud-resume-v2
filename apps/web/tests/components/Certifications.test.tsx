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
});
