import { fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import gsap from 'gsap';

// Unlike the sibling SpyfallIntro.test.tsx, this suite intentionally uses the REAL
// gsap + @gsap/react so the animation callback actually runs and GSAP resolves its
// selectors against the rendered DOM. That is the only way to catch the regression
// this guards against: the per-step reset block used to call gsap.set() on selectors
// for elements that the current beat does not mount, which makes GSAP log
// "GSAP target <selector> not found" warnings to the console.
import SpyfallIntro from '../../src/spyfall/SpyfallIntro';

describe('SpyfallIntro GSAP target resolution', () => {
  let warnSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
  });

  afterEach(() => {
    warnSpy.mockRestore();
    // Real tweens were created during the test; revert them so timers/inline styles
    // do not leak into other suites.
    gsap.globalTimeline.clear();
    gsap.killTweensOf('*');
  });

  const nullTargetWarnings = (): string[] =>
    warnSpy.mock.calls
      .map((args: unknown[]) => args.map((arg: unknown) => String(arg)).join(' '))
      .filter((message: string) => /not found/i.test(message));

  it('does not emit GSAP "target not found" warnings on the opening beat', () => {
    render(<SpyfallIntro />);

    expect(nullTargetWarnings()).toEqual([]);
  });

  it('does not emit GSAP "target not found" warnings while navigating every beat', () => {
    render(<SpyfallIntro />);

    // Walk the full storyboard via the HUD step dots (step 0..20). The reset block
    // runs on every beat and each beat mounts a different subset of the visuals, so
    // this exercises every reset selector and per-step animation target.
    for (let step = 0; step <= 20; step += 1) {
      fireEvent.click(screen.getByRole('button', { name: new RegExp(`^Step ${step}$`) }));
    }

    expect(nullTargetWarnings()).toEqual([]);
  });
});
