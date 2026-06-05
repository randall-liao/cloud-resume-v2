import { render } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';

// Force the empty-state branch (`return null`) by mocking the shared contract.
// vi.mock is hoisted above the component import below.
vi.mock('@cloud-resume-v2/contracts', () => ({
  resumeData: { sideProjects: [] },
}));

import SideProjects from '../../src/components/SideProjects';

describe('SideProjects empty state', () => {
  it('renders nothing when there are no side projects', () => {
    const { container } = render(<SideProjects />);
    expect(container.firstChild).toBeNull();
  });
});
