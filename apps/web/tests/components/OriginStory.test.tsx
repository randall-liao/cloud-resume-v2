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
});
