import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import Header from '../../src/components/Header';
import { resumeData } from '@cloud-resume-v2/contracts';

describe('Header Component', () => {
  it('renders branding text correctly', () => {
    render(<Header darkMode={false} setDarkMode={() => {}} />);
    expect(screen.getByText(new RegExp(`<${resumeData.header.name}`))).toBeInTheDocument();
  });

  it('renders social links correctly', () => {
    render(<Header darkMode={false} setDarkMode={() => {}} />);
    const links = screen.getAllByRole('link');
    expect(links.length).toBe(resumeData.header.socialLinks.length);
    resumeData.header.socialLinks.forEach((link, idx) => {
      expect(links[idx]).toHaveAttribute('href', link.url);
    });
  });

  it('toggles dark mode when button is clicked', () => {
    const setDarkModeMock = vi.fn();
    render(<Header darkMode={false} setDarkMode={setDarkModeMock} />);

    const toggleButton = screen.getByRole('button', { name: /Toggle theme/i });
    fireEvent.click(toggleButton);

    expect(setDarkModeMock).toHaveBeenCalledWith(true);
  });

  it('toggles light mode when button is clicked', () => {
    const setDarkModeMock = vi.fn();
    render(<Header darkMode={true} setDarkMode={setDarkModeMock} />);

    const toggleButton = screen.getByRole('button', { name: /Toggle theme/i });
    fireEvent.click(toggleButton);

    expect(setDarkModeMock).toHaveBeenCalledWith(false);
  });
});
