import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
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

  it('composes every major resume section', () => {
    window.localStorage.setItem('theme-preference', 'light');

    render(<App />);

    expect(screen.getByRole('banner')).toBeInTheDocument(); // Header
    expect(screen.getByRole('contentinfo')).toBeInTheDocument(); // Footer
    expect(screen.getByRole('heading', { level: 2, name: resumeData.originStory.title })).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 2, name: /Side Projects/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 2, name: /Commit History/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 2, name: /Education/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 2, name: /Certifications/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 2, name: /Interests/i })).toBeInTheDocument();
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

  it('initializes dark mode from a stored preference even when the system prefers light', async () => {
    // The shared setup mock makes matchMedia('(prefers-color-scheme: dark)') truthy,
    // so force a light system preference to prove the stored value is what wins.
    const matchMediaSpy = vi
      .spyOn(window, 'matchMedia')
      .mockImplementation((query: string) => ({
        matches: false,
        media: query,
        onchange: null,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        addListener: vi.fn(),
        removeListener: vi.fn(),
        dispatchEvent: vi.fn(),
      }) as unknown as MediaQueryList);
    window.localStorage.setItem('theme-preference', 'dark');

    render(<App />);

    await waitFor(() => {
      expect(document.documentElement).toHaveClass('dark');
    });

    matchMediaSpy.mockRestore();
  });

  it('keeps light mode when a stored light preference disagrees with the system', async () => {
    // matchMedia reports a dark system preference here; the stored "light" value must win.
    window.localStorage.setItem('theme-preference', 'light');

    render(<App />);

    await waitFor(() => {
      expect(document.title).toBe(`${resumeData.header.name} | Cloud Architect Dashboard`);
    });
    expect(document.documentElement).not.toHaveClass('dark');
  });
});

describe('App scroll-reveal behavior', () => {
  const ioDescriptor = Object.getOwnPropertyDescriptor(window, 'IntersectionObserver');

  afterEach(() => {
    if (ioDescriptor) {
      Object.defineProperty(window, 'IntersectionObserver', ioDescriptor);
    } else {
      delete (window as unknown as { IntersectionObserver?: unknown }).IntersectionObserver;
    }
  });

  it('reveals all scroll elements immediately when IntersectionObserver is unavailable', () => {
    delete (window as unknown as { IntersectionObserver?: unknown }).IntersectionObserver;
    window.localStorage.setItem('theme-preference', 'light');

    const { container } = render(<App />);

    const revealElements = container.querySelectorAll('.reveal-on-scroll');
    expect(revealElements.length).toBeGreaterThan(0);
    revealElements.forEach((el) => {
      expect(el).toHaveClass('is-visible');
    });
  });

  it('observes scroll elements and reveals them as they intersect, then cleans up on unmount', () => {
    const observed: Element[] = [];
    const unobserve = vi.fn();
    const disconnect = vi.fn();
    let capturedCallback: IntersectionObserverCallback | null = null;

    class MockIntersectionObserver {
      constructor(callback: IntersectionObserverCallback) {
        capturedCallback = callback;
      }
      observe = (el: Element) => {
        observed.push(el);
      };
      unobserve = unobserve;
      disconnect = disconnect;
      takeRecords = () => [];
      root = null;
      rootMargin = '';
      thresholds = [];
    }

    Object.defineProperty(window, 'IntersectionObserver', {
      writable: true,
      configurable: true,
      value: MockIntersectionObserver,
    });
    window.localStorage.setItem('theme-preference', 'light');

    const { container, unmount } = render(<App />);

    // Every reveal-on-scroll node should be registered with the observer and not yet visible.
    expect(observed.length).toBe(container.querySelectorAll('.reveal-on-scroll').length);
    observed.forEach((el) => {
      expect(el).not.toHaveClass('is-visible');
    });

    expect(capturedCallback).not.toBeNull();
    const entries = observed.map((target) => ({ isIntersecting: true, target })) as unknown as IntersectionObserverEntry[];
    capturedCallback!(entries, {} as IntersectionObserver);

    observed.forEach((el) => {
      expect(el).toHaveClass('is-visible');
    });

    unmount();
    expect(unobserve).toHaveBeenCalledTimes(observed.length);
    expect(disconnect).toHaveBeenCalled();
  });
});
