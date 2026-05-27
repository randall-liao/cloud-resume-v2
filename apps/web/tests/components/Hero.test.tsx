import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { resumeData } from '@cloud-resume-v2/contracts';
import Hero from '../../src/components/Hero';

describe('Hero', () => {
  it('renders correctly', () => {
    const { container } = render(<Hero />);

    // Verify key text elements
    expect(screen.getByText(resumeData.hero.status)).toBeInTheDocument();
    expect(screen.getByText(resumeData.hero.headlinePrefix)).toBeInTheDocument();
    expect(screen.getByText(resumeData.hero.headlineHighlight)).toBeInTheDocument();
    expect(screen.getByText(resumeData.hero.description)).toBeInTheDocument();

    // Verify profile.json filename tab is shown
    expect(screen.getByText('profile.json')).toBeInTheDocument();

    // Verify the IDE block renders valid JSON fields with double quotes
    const codeContainer = container.querySelector('.p-6.font-mono');
    expect(codeContainer).not.toBeNull();
    const textContent = codeContainer?.textContent || '';

    // Verify JSON brackets
    expect(textContent).toContain('{');
    expect(textContent).toContain('}');

    // Verify keys have double quotes
    expect(textContent).toContain('"name"');
    expect(textContent).toContain('"role"');
    expect(textContent).toContain('"location"');
    expect(textContent).toContain('"stack"');
    expect(textContent).toContain('"status"');

    // Verify values are in quotes and match data
    expect(textContent).toContain(`"${resumeData.hero.ideSnippet.code.name}"`);
    expect(textContent).toContain(`"${resumeData.hero.ideSnippet.code.role}"`);
    expect(textContent).toContain(`"${resumeData.hero.ideSnippet.code.location}"`);
    expect(textContent).toContain(`"${resumeData.hero.ideSnippet.code.status}"`);

    // Verify stack items are listed in the code snippet
    resumeData.hero.ideSnippet.code.stack.forEach((item) => {
      expect(textContent).toContain(`"${item}"`);
    });

    // Verify execute function has been removed (was part of JS layout previously)
    expect(textContent).not.toContain('execute');
    expect(textContent).not.toContain('async function');
  });

  it('renders correct dynamic line numbers in the gutter', () => {
    const { container } = render(<Hero />);

    const gutter = container.querySelector('.text-right.text-slate-400');
    expect(gutter).not.toBeNull();

    // Expected number of lines is: 8 + stack items length (which is 4, total 12)
    const expectedLineCount = 8 + resumeData.hero.ideSnippet.code.stack.length;
    
    // Check the spans inside the gutter
    const lineSpans = gutter?.querySelectorAll('span');
    expect(lineSpans?.length).toBe(expectedLineCount);

    // Verify first and last line number text
    expect(lineSpans?.[0].textContent).toBe('1');
    expect(lineSpans?.[lineSpans.length - 1].textContent).toBe(String(expectedLineCount));
  });
});
