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

  it('exposes accessible, safe external social links', () => {
    render(<Header darkMode={false} setDarkMode={() => {}} />);

    // github -> "Visit my Github", linkedin -> "Visit my Linkedin"
    const expectedLabels = resumeData.header.socialLinks.map((link) => {
      const platform = link.icon.split('fa-')[1] || 'Social Profile';
      return `Visit my ${platform.charAt(0).toUpperCase() + platform.slice(1)}`;
    });

    expectedLabels.forEach((label, idx) => {
      const anchor = screen.getByRole('link', { name: label });
      expect(anchor).toHaveAttribute('href', resumeData.header.socialLinks[idx].url);
      expect(anchor).toHaveAttribute('target', '_blank');
      expect(anchor).toHaveAttribute('rel', 'noopener noreferrer');

      // The icon element should carry the data-driven FontAwesome classes and be hidden from a11y tree.
      const icon = anchor.querySelector('i');
      expect(icon).not.toBeNull();
      resumeData.header.socialLinks[idx].icon.split(' ').forEach((cls) => {
        expect(icon).toHaveClass(cls);
      });
      expect(icon).toHaveAttribute('aria-hidden', 'true');
    });
  });

  it('shows the dark_mode icon while in light mode and toggles to dark', () => {
    const setDarkModeMock = vi.fn();
    render(<Header darkMode={false} setDarkMode={setDarkModeMock} />);

    const toggleButton = screen.getByRole('button', { name: /Toggle theme/i });
    expect(toggleButton).toHaveTextContent('dark_mode');

    fireEvent.click(toggleButton);
    expect(setDarkModeMock).toHaveBeenCalledWith(true);
  });

  it('shows the light_mode icon while in dark mode and toggles to light', () => {
    const setDarkModeMock = vi.fn();
    render(<Header darkMode={true} setDarkMode={setDarkModeMock} />);

    const toggleButton = screen.getByRole('button', { name: /Toggle theme/i });
    expect(toggleButton).toHaveTextContent('light_mode');

    fireEvent.click(toggleButton);
    expect(setDarkModeMock).toHaveBeenCalledWith(false);
  });
});
