import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import OriginStory from '../../src/components/OriginStory';
import { resumeData } from '@cloud-resume-v2/contracts';

describe('OriginStory Component', () => {
  it('renders correctly', () => {
    render(<OriginStory />);

    expect(screen.getByRole('heading', { level: 2, name: resumeData.originStory.title })).toBeInTheDocument();
    expect(screen.getByText(resumeData.originStory.content)).toBeInTheDocument();
  });

  it('applies scroll animation and hover floating classes', () => {
    const { container } = render(<OriginStory />);
    
    // Section should have reveal-on-scroll class
    const section = container.querySelector('section');
    expect(section).toHaveClass('reveal-on-scroll');

    // Outer card container should have shadow-soft and transit hover classes
    const card = container.querySelector('.border-l-4');
    expect(card).toHaveClass('shadow-soft');
    expect(card).toHaveClass('m-transition');
    expect(card).toHaveClass('hover:shadow-hover');
    expect(card).toHaveClass('hover:-translate-y-1');
  });
});
