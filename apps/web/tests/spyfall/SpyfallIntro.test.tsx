import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

// GSAP is animation-only and relies on real layout that jsdom does not provide.
// Mock it so the component's React state/navigation can be tested deterministically:
// useGSAP becomes a no-op (its animation callback never runs) and the gsap methods
// invoked outside that callback (registerPlugin, the FAB ripple tween) are inert.
vi.mock('@gsap/react', () => ({
  useGSAP: vi.fn(),
}));

vi.mock('gsap', () => {
  const timeline = {
    to: vi.fn(() => timeline),
    fromTo: vi.fn(() => timeline),
    set: vi.fn(() => timeline),
  };
  return {
    default: {
      registerPlugin: vi.fn(),
      killTweensOf: vi.fn(),
      set: vi.fn(),
      to: vi.fn(),
      fromTo: vi.fn(),
      timeline: vi.fn(() => timeline),
    },
  };
});

import SpyfallIntro from '../../src/spyfall/SpyfallIntro';

describe('SpyfallIntro', () => {
  it('renders the opening beat and the navigation HUD', () => {
    render(<SpyfallIntro />);

    // HUD branding + opening narrative.
    expect(screen.getByText('Spyfall Arena')).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 1, name: 'The Lie Problem' })).toBeInTheDocument();

    // One navigation dot per storyboard beat (21 beats: step 0..20).
    expect(screen.getByRole('button', { name: 'Step 0' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Step 20' })).toBeInTheDocument();

    // Next-step FAB is available on the first beat.
    expect(screen.getByRole('button', { name: 'Next step' })).toBeInTheDocument();
  });

  it('advances and rewinds through beats with the FAB and the back control', () => {
    render(<SpyfallIntro />);

    expect(screen.getByRole('heading', { level: 1, name: 'The Lie Problem' })).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Next step' }));
    expect(screen.getByRole('heading', { level: 1, name: 'One Card Is Blind' })).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: /Previous Step/i }));
    expect(screen.getByRole('heading', { level: 1, name: 'The Lie Problem' })).toBeInTheDocument();
  });

  it('jumps directly to a beat when a HUD step dot is clicked', () => {
    render(<SpyfallIntro />);

    fireEvent.click(screen.getByRole('button', { name: /^Step 5$/ }));
    expect(
      screen.getByRole('heading', { level: 1, name: 'The Models Take Their Seats' }),
    ).toBeInTheDocument();
  });

  it('reaches the final beat and hides the FAB at the end of the storyboard', () => {
    render(<SpyfallIntro />);

    fireEvent.click(screen.getByRole('button', { name: /^Step 20$/ }));
    expect(screen.getByRole('heading', { level: 1, name: 'Final Transition' })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Next step' })).toBeNull();
  });

  it('links back to the source repository from the HUD', () => {
    const { container } = render(<SpyfallIntro />);

    const repoLink = container.querySelector(
      'a[href="https://github.com/randall-liao/spyfall-arena"]',
    );
    expect(repoLink).not.toBeNull();
    expect(repoLink).toHaveAttribute('rel', 'noopener noreferrer');
  });

  it('offers a back-to-resume control in the HUD that links to the resume root', () => {
    render(<SpyfallIntro />);

    const backLink = screen.getByRole('link', { name: 'Back to resume' });
    expect(backLink).toHaveAttribute('href', '/');
  });
});
