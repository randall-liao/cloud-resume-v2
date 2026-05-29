import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import CommitHistory from '../../src/components/CommitHistory';
import { resumeData } from '@cloud-resume-v2/contracts';

describe('CommitHistory Component', () => {
  it('renders section title correctly', () => {
    render(<CommitHistory />);
    expect(screen.getByRole('heading', { level: 2, name: /Commit History/i })).toBeInTheDocument();
  });

  it('renders experience correctly', () => {
    render(<CommitHistory />);

    resumeData.experience.forEach(job => {
      expect(screen.getByRole('heading', { level: 3, name: job.company })).toBeInTheDocument();
      expect(screen.getByText(job.role)).toBeInTheDocument();
      expect(screen.getByText(job.period)).toBeInTheDocument();
      expect(screen.getByText(job.description)).toBeInTheDocument();

      job.technologies.forEach(tech => {
        expect(screen.getAllByText(tech).length).toBeGreaterThan(0);
      });
    });
  });

  it('applies staggered transitionDelay styling to timeline jobs', () => {
    const { container } = render(<CommitHistory />);
    
    const header = container.querySelector('.reveal-on-scroll');
    expect(header).toBeInTheDocument();

    const jobs = container.querySelectorAll('.relative.group');
    expect(jobs.length).toBe(resumeData.experience.length);

    jobs.forEach((job, idx) => {
      expect(job).toHaveClass('reveal-on-scroll');
      expect(job).toHaveStyle({ transitionDelay: `${(idx + 1) * 100}ms` });

      const card = job.querySelector('.shadow-card');
      expect(card).toHaveClass('shadow-card');
      expect(card).toHaveClass('m-transition');
      expect(card).toHaveClass('hover:shadow-hover');
      expect(card).toHaveClass('hover:-translate-y-1');
    });
  });
});
