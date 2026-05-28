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
});
