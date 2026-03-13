import { describe, expect, it } from 'vitest';
import { parseResumeDocument } from './resume';
import validResumeData from './resume.json';

describe('parseResumeDocument', () => {
  it('parses valid resume data correctly', () => {
    const parsedData = parseResumeDocument(validResumeData);

    // Check some key fields to ensure it parsed
    expect(parsedData.header.name).toBe(validResumeData.header.name);
    expect(parsedData.hero.status).toBe(validResumeData.hero.status);
    expect(parsedData.experience.length).toBe(validResumeData.experience.length);
  });

  it('throws an error if resume data is not an object', () => {
    expect(() => parseResumeDocument(null)).toThrow('resumeData must be an object.');
    expect(() => parseResumeDocument('string')).toThrow('resumeData must be an object.');
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
});
