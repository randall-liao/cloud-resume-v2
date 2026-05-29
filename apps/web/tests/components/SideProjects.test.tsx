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

  it('applies scroll animation and staggered transition delay styling to projects', () => {
    const { container } = render(<SideProjects />);
    
    // Header should have reveal-on-scroll class
    const header = container.querySelector('.reveal-on-scroll');
    expect(header).toBeInTheDocument();

    // Each project card should have hover-translation, shadows, and staggered transitionDelay
    const projectCards = container.querySelectorAll('.shadow-md3');
    expect(projectCards.length).toBe(resumeData.sideProjects.length);

    projectCards.forEach((card, idx) => {
      expect(card).toHaveClass('reveal-on-scroll');
      expect(card).toHaveClass('shadow-md3');
      expect(card).toHaveClass('m-transition');
      expect(card).toHaveClass('hover:shadow-hover');
      expect(card).toHaveClass('hover:-translate-y-1');
      expect(card).toHaveStyle({ transitionDelay: `${(idx + 1) * 100}ms` });
    });
  });
});
