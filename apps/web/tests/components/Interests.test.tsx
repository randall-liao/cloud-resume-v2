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
});
