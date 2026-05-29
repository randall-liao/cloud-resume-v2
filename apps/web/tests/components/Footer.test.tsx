import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest';
import { resumeData } from '@cloud-resume-v2/contracts';
import { FEATURES } from '../../src/config/features';
import Footer from '../../src/components/Footer';

describe('Footer', () => {
  const scrollY = 0;
  const innerHeight = 1000;
  const scrollHeight = 2000;

  beforeEach(() => {
    // Mock window properties
    Object.defineProperty(window, 'scrollY', {
      writable: true,
      value: scrollY,
    });
    Object.defineProperty(window, 'innerHeight', {
      writable: true,
      value: innerHeight,
    });

    // Mock document element properties
    Object.defineProperty(document.documentElement, 'scrollHeight', {
      writable: true,
      value: scrollHeight,
    });

    // Mock requestAnimationFrame to execute synchronously in tests
    vi.spyOn(window, 'requestAnimationFrame').mockImplementation((cb) => {
      cb(0);
      return 0;
    });

    // Set environment variable for testing
    import.meta.env.VITE_VISITOR_API_URL = 'https://example.com/api/count';

    // Mock global fetch for visitor counter
    globalThis.fetch = vi.fn().mockImplementation(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ count: 843 }),
      } as Response)
    );
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('renders footer content correctly with visitor counter disabled by default', () => {
    FEATURES.enableVisitorCounter = false;
    render(<Footer />);

    // Verify key elements from resumeData are rendered
    expect(screen.getByText('System:')).toBeInTheDocument();
    expect(screen.getByText(resumeData.footer.systemStatus)).toBeInTheDocument();
    expect(screen.getByText(resumeData.footer.region)).toBeInTheDocument();

    // Check that visitor counter is NOT rendered
    expect(screen.queryByText('Visitors:')).not.toBeInTheDocument();
    expect(screen.queryByText('843')).not.toBeInTheDocument();
    expect(screen.queryByText('DynamoDB Live Count')).not.toBeInTheDocument();
  });

  it('renders visitor counter when the feature flag is enabled', async () => {
    FEATURES.enableVisitorCounter = true;
    render(<Footer />);

    // Check that visitor counter IS rendered and displays fetched count
    expect(screen.getByText('Visitors:')).toBeInTheDocument();
    await waitFor(() => {
      expect(screen.getByText('843')).toBeInTheDocument();
    });
    expect(screen.getByText('DynamoDB Live Count')).toBeInTheDocument();
  });

  it('is visible when at the top of the page', () => {
    window.scrollY = 0; // Top of the page

    const { container } = render(<Footer />);

    const footerElement = container.querySelector('footer');
    expect(footerElement).not.toBeNull();
    // Initially, it should be visible ('translate-y-0')
    expect(footerElement?.className).toContain('translate-y-0');
    expect(footerElement?.className).not.toContain('translate-y-full');
  });

  it('becomes hidden when scrolling down past the top threshold', () => {
    window.scrollY = 0;
    const { container } = render(<Footer />);

    const footerElement = container.querySelector('footer');
    expect(footerElement?.className).toContain('translate-y-0');

    // Simulate scrolling down
    window.scrollY = 500;
    fireEvent.scroll(window);

    // After scroll event, it should be hidden
    expect(footerElement?.className).toContain('translate-y-full');
    expect(footerElement?.className).not.toContain('translate-y-0');
  });

  it('becomes visible again when scrolling to the bottom', () => {
    // Start scrolled down (hidden)
    window.scrollY = 500;
    const { container } = render(<Footer />);

    const footerElement = container.querySelector('footer');
    expect(footerElement?.className).toContain('translate-y-full');

    // Simulate scrolling to bottom (scrollY + innerHeight >= scrollHeight)
    // 1000 + 1000 = 2000 >= 2000
    window.scrollY = 1000;
    fireEvent.scroll(window);

    // Should become visible again
    expect(footerElement?.className).toContain('translate-y-0');
    expect(footerElement?.className).not.toContain('translate-y-full');
  });
});
