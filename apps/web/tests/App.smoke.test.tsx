import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { resumeData } from '@cloud-resume-v2/contracts';
import App from '../src/App';

describe('App smoke', () => {
  it('renders key resume content from the shared contracts package', async () => {
    window.localStorage.setItem('theme-preference', 'light');

    render(<App />);

    expect(screen.getByText(resumeData.hero.status)).toBeInTheDocument();
    expect(screen.getByText(resumeData.originStory.title)).toBeInTheDocument();

    await waitFor(() => {
      expect(document.title).toBe(`${resumeData.header.name} | Cloud Architect Dashboard`);
    });
  });

  it('toggles dark mode from the header control and persists the preference', async () => {
    window.localStorage.setItem('theme-preference', 'light');

    render(<App />);

    const toggleButton = screen.getByRole('button', { name: /toggle theme/i });
    expect(document.documentElement).not.toHaveClass('dark');

    fireEvent.click(toggleButton);

    await waitFor(() => {
      expect(document.documentElement).toHaveClass('dark');
      expect(window.localStorage.getItem('theme-preference')).toBe('dark');
    });
  });
});
