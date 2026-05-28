import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import SideProjects from '../../src/components/SideProjects';
import { resumeData } from '@cloud-resume-v2/contracts';

describe('SideProjects Component', () => {
  it('renders section title correctly', () => {
    render(<SideProjects />);
    expect(screen.getByRole('heading', { level: 2, name: /Side Projects/i })).toBeInTheDocument();
  });

  it('renders projects correctly', () => {
    render(<SideProjects />);

    // Check if projects from mock data are rendered
    resumeData.sideProjects.forEach(project => {
      expect(screen.getByRole('heading', { level: 3, name: project.title })).toBeInTheDocument();
      expect(screen.getByText(project.description)).toBeInTheDocument();
    });
  });
});
