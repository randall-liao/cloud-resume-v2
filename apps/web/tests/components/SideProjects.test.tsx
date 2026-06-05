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

  it('renders accessible, safe GitHub links for every project', () => {
    render(<SideProjects />);

    resumeData.sideProjects.forEach(project => {
      const link = screen.getByRole('link', { name: `View ${project.title} on GitHub` });
      expect(link).toHaveAttribute('href', project.url);
      expect(link).toHaveAttribute('target', '_blank');
      expect(link).toHaveAttribute('rel', 'noopener noreferrer');
    });
  });

  it('renders an animated-intro launch link only for projects that define introUrl', () => {
    render(<SideProjects />);

    resumeData.sideProjects.forEach(project => {
      const introLink = screen.queryByRole('link', {
        name: `Launch the ${project.title} animated introduction`,
      });

      if (project.introUrl) {
        expect(introLink).not.toBeNull();
        expect(introLink).toHaveAttribute('href', project.introUrl);
      } else {
        expect(introLink).toBeNull();
      }
    });
  });

  it('renders the metric labels for each project', () => {
    render(<SideProjects />);

    resumeData.sideProjects.forEach(project => {
      project.metrics?.forEach(metric => {
        expect(screen.getAllByText(metric.label).length).toBeGreaterThan(0);
      });
    });
  });

  it('renders uptime details with the configured or default status label and progress width', () => {
    const { container } = render(<SideProjects />);

    const cards = container.querySelectorAll('.shadow-md3');

    resumeData.sideProjects.forEach((project, idx) => {
      if (!project.uptime) return;

      const card = cards[idx];
      expect(card).toBeDefined();

      // Uptime value is shown verbatim.
      expect(card.textContent).toContain(project.uptime);

      // statusLabel falls back to "Uptime" when not provided by the data.
      expect(card.textContent).toContain(project.statusLabel || 'Uptime');

      // Progress bar width is driven by statusPercentage, defaulting to 100%.
      const bar = card.querySelector('.bg-primary') as HTMLElement | null;
      expect(bar).not.toBeNull();
      expect(bar).toHaveStyle({ width: `${project.statusPercentage || 100}%` });
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

  it('makes the entire card a link to the intro when available, otherwise to the GitHub repo', () => {
    render(<SideProjects />);

    resumeData.sideProjects.forEach(project => {
      if (project.introUrl) {
        const cardLink = screen.getByRole('link', {
          name: `Open the ${project.title} introduction`,
        });
        expect(cardLink).toHaveAttribute('href', project.introUrl);
        // Internal intro page opens in the same tab.
        expect(cardLink).not.toHaveAttribute('target');
      } else {
        const cardLink = screen.getByRole('link', {
          name: `Open ${project.title} on GitHub`,
        });
        expect(cardLink).toHaveAttribute('href', project.url);
        expect(cardLink).toHaveAttribute('target', '_blank');
        expect(cardLink).toHaveAttribute('rel', 'noopener noreferrer');
      }
    });
  });
});
