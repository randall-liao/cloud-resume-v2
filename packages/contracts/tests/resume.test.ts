import { describe, expect, it } from 'vitest';
import { parseResumeDocument, resumeData } from '../src/resume';
import validResumeData from '../src/resume.json';

describe('parseResumeDocument', () => {
  it('parses valid resume data correctly', () => {
    const parsedData = parseResumeDocument(validResumeData);

    // Check some key fields to ensure it parsed
    expect(parsedData.header.name).toBe(validResumeData.header.name);
    expect(parsedData.hero.status).toBe(validResumeData.hero.status);
    expect(parsedData.experience.length).toBe(validResumeData.experience.length);
  });

  it('produces a structure that round-trips against the source JSON', () => {
    // toEqual (not toStrictEqual) so that optional fields explicitly set to undefined
    // are treated as equivalent to absent keys in the raw JSON.
    expect(parseResumeDocument(validResumeData)).toEqual(validResumeData);
  });

  it('exposes a pre-parsed resumeData export matching the source JSON', () => {
    expect(resumeData).toEqual(validResumeData);
  });

  it('throws an error if resume data is not an object', () => {
    expect(() => parseResumeDocument(null)).toThrow('resumeData must be an object.');
    expect(() => parseResumeDocument('string')).toThrow('resumeData must be an object.');
    expect(() => parseResumeDocument([])).toThrow('resumeData must be an object.');
  });

  it('throws an error if a required string field is missing or invalid', () => {
    const invalidData = {
      ...validResumeData,
      header: {
        ...validResumeData.header,
        name: 123, // Invalid type
      },
    };

    expect(() => parseResumeDocument(invalidData)).toThrow('resumeData.header.name must be a string.');
  });

  it('throws an error if an array field is not an array', () => {
    const invalidData = {
      ...validResumeData,
      experience: 'not an array',
    };

    expect(() => parseResumeDocument(invalidData)).toThrow('resumeData.experience must be an array.');
  });

  it('reports the offending index for an invalid nested object-array entry', () => {
    const invalidData = {
      ...validResumeData,
      header: {
        ...validResumeData.header,
        socialLinks: [
          validResumeData.header.socialLinks[0],
          { icon: 'fab fa-linkedin' }, // missing url
        ],
      },
    };

    expect(() => parseResumeDocument(invalidData)).toThrow(
      'resumeData.header.socialLinks[1].url must be a string.',
    );
  });

  it('reports the offending index for an invalid string-array element', () => {
    const invalidData = {
      ...validResumeData,
      hero: {
        ...validResumeData.hero,
        ideSnippet: {
          ...validResumeData.hero.ideSnippet,
          code: {
            ...validResumeData.hero.ideSnippet.code,
            stack: ['Python', 42], // second element is not a string
          },
        },
      },
    };

    expect(() => parseResumeDocument(invalidData)).toThrow(
      'resumeData.hero.ideSnippet.code.stack[1] must be a string.',
    );
  });

  it('accepts side projects that omit their optional fields', () => {
    const minimalProject = {
      title: 'Minimal',
      icon: 'bolt',
      url: 'https://example.com',
      description: 'No optional fields here.',
      metrics: [],
    };
    const data = {
      ...validResumeData,
      sideProjects: [minimalProject],
    };

    const parsed = parseResumeDocument(data);

    expect(parsed.sideProjects[0].uptime).toBeUndefined();
    expect(parsed.sideProjects[0].statusLabel).toBeUndefined();
    expect(parsed.sideProjects[0].statusPercentage).toBeUndefined();
  });

  it('validates the type of an optional numeric side-project field when present', () => {
    const data = {
      ...validResumeData,
      sideProjects: [
        {
          ...validResumeData.sideProjects[0],
          statusPercentage: '100', // should be a number
        },
      ],
    };

    expect(() => parseResumeDocument(data)).toThrow(
      'resumeData.sideProjects[0].statusPercentage must be a number.',
    );
  });

  it('validates the type of an optional string side-project field when present', () => {
    const data = {
      ...validResumeData,
      sideProjects: [
        {
          ...validResumeData.sideProjects[0],
          statusLabel: 99, // should be a string
        },
      ],
    };

    expect(() => parseResumeDocument(data)).toThrow(
      'resumeData.sideProjects[0].statusLabel must be a string.',
    );
  });

  it('accepts interests that omit the optional url field', () => {
    const data = {
      ...validResumeData,
      interests: [
        {
          ...validResumeData.interests[0],
          url: undefined,
        },
      ],
    };

    const parsed = parseResumeDocument(data);

    expect(parsed.interests[0].url).toBeUndefined();
  });

  it('validates the type of the optional interest url when present', () => {
    const data = {
      ...validResumeData,
      interests: [
        {
          ...validResumeData.interests[0],
          url: 42, // should be a string
        },
      ],
    };

    expect(() => parseResumeDocument(data)).toThrow(
      'resumeData.interests[0].url must be a string.',
    );
  });
});
