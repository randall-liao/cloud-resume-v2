import rawResumeData from './resume.json';

export interface SocialLink {
  icon: string;
  url: string;
}

export interface HeaderSection {
  name: string;
  socialLinks: SocialLink[];
}

export interface LinkButton {
  text: string;
  url: string;
}

export interface HeroIdeCode {
  name: string;
  role: string;
  location: string;
  stack: string[];
  status: string;
}

export interface HeroIdeSnippet {
  filename: string;
  code: HeroIdeCode;
}

export interface HeroSection {
  status: string;
  headlinePrefix: string;
  headlineHighlight: string;
  description: string;
  primaryButton: LinkButton;
  secondaryButton: LinkButton;
  ideSnippet: HeroIdeSnippet;
}

export interface OriginStorySection {
  title: string;
  icon: string;
  content: string;
}

export interface ExperienceEntry {
  company: string;
  role: string;
  period: string;
  description: string;
  technologies: string[];
}

export interface EducationEntry {
  institution: string;
  degree: string;
  graduationDate: string;
  icon: string;
  color: string;
}

export interface CertificationEntry {
  name: string;
  subtitle: string;
  validationId: string;
  icon: string;
  color: string;
  url: string;
}

export interface InterestMetric {
  label: string;
  value: string;
}

export interface InterestEntry {
  title: string;
  subtitle: string;
  icon: string;
  description: string;
  metrics: InterestMetric[];
  status: string;
}

export interface FooterSection {
  systemStatus: string;
  region: string;
  latency: string;
}

export interface ResumeDocument {
  header: HeaderSection;
  hero: HeroSection;
  originStory: OriginStorySection;
  experience: ExperienceEntry[];
  education: EducationEntry[];
  certifications: CertificationEntry[];
  interests: InterestEntry[];
  footer: FooterSection;
}

type JsonRecord = Record<string, unknown>;

function expectRecord(value: unknown, context: string): JsonRecord {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    throw new Error(`${context} must be an object.`);
  }

  return value as JsonRecord;
}

function expectString(value: unknown, context: string): string {
  if (typeof value !== 'string') {
    throw new Error(`${context} must be a string.`);
  }

  return value;
}

function expectArray(value: unknown, context: string): unknown[] {
  if (!Array.isArray(value)) {
    throw new Error(`${context} must be an array.`);
  }

  return value;
}

function expectStringArray(value: unknown, context: string): string[] {
  return expectArray(value, context).map((item, index) => expectString(item, `${context}[${index}]`));
}

function expectObjectArray<T>(
  value: unknown,
  context: string,
  parser: (item: unknown, itemContext: string) => T,
): T[] {
  return expectArray(value, context).map((item, index) => parser(item, `${context}[${index}]`));
}

function parseLinkButton(value: unknown, context: string): LinkButton {
  const record = expectRecord(value, context);

  return {
    text: expectString(record.text, `${context}.text`),
    url: expectString(record.url, `${context}.url`),
  };
}

function parseSocialLink(value: unknown, context: string): SocialLink {
  const record = expectRecord(value, context);

  return {
    icon: expectString(record.icon, `${context}.icon`),
    url: expectString(record.url, `${context}.url`),
  };
}

function parseHeaderSection(value: unknown, context: string): HeaderSection {
  const record = expectRecord(value, context);

  return {
    name: expectString(record.name, `${context}.name`),
    socialLinks: expectObjectArray(record.socialLinks, `${context}.socialLinks`, parseSocialLink),
  };
}

function parseHeroIdeSnippet(value: unknown, context: string): HeroIdeSnippet {
  const record = expectRecord(value, context);
  const code = expectRecord(record.code, `${context}.code`);

  return {
    filename: expectString(record.filename, `${context}.filename`),
    code: {
      name: expectString(code.name, `${context}.code.name`),
      role: expectString(code.role, `${context}.code.role`),
      location: expectString(code.location, `${context}.code.location`),
      stack: expectStringArray(code.stack, `${context}.code.stack`),
      status: expectString(code.status, `${context}.code.status`),
    },
  };
}

function parseHeroSection(value: unknown, context: string): HeroSection {
  const record = expectRecord(value, context);

  return {
    status: expectString(record.status, `${context}.status`),
    headlinePrefix: expectString(record.headlinePrefix, `${context}.headlinePrefix`),
    headlineHighlight: expectString(record.headlineHighlight, `${context}.headlineHighlight`),
    description: expectString(record.description, `${context}.description`),
    primaryButton: parseLinkButton(record.primaryButton, `${context}.primaryButton`),
    secondaryButton: parseLinkButton(record.secondaryButton, `${context}.secondaryButton`),
    ideSnippet: parseHeroIdeSnippet(record.ideSnippet, `${context}.ideSnippet`),
  };
}

function parseOriginStorySection(value: unknown, context: string): OriginStorySection {
  const record = expectRecord(value, context);

  return {
    title: expectString(record.title, `${context}.title`),
    icon: expectString(record.icon, `${context}.icon`),
    content: expectString(record.content, `${context}.content`),
  };
}

function parseExperienceEntry(value: unknown, context: string): ExperienceEntry {
  const record = expectRecord(value, context);

  return {
    company: expectString(record.company, `${context}.company`),
    role: expectString(record.role, `${context}.role`),
    period: expectString(record.period, `${context}.period`),
    description: expectString(record.description, `${context}.description`),
    technologies: expectStringArray(record.technologies, `${context}.technologies`),
  };
}

function parseEducationEntry(value: unknown, context: string): EducationEntry {
  const record = expectRecord(value, context);

  return {
    institution: expectString(record.institution, `${context}.institution`),
    degree: expectString(record.degree, `${context}.degree`),
    graduationDate: expectString(record.graduationDate, `${context}.graduationDate`),
    icon: expectString(record.icon, `${context}.icon`),
    color: expectString(record.color, `${context}.color`),
  };
}

function parseCertificationEntry(value: unknown, context: string): CertificationEntry {
  const record = expectRecord(value, context);

  return {
    name: expectString(record.name, `${context}.name`),
    subtitle: expectString(record.subtitle, `${context}.subtitle`),
    validationId: expectString(record.validationId, `${context}.validationId`),
    icon: expectString(record.icon, `${context}.icon`),
    color: expectString(record.color, `${context}.color`),
    url: expectString(record.url, `${context}.url`),
  };
}

function parseInterestMetric(value: unknown, context: string): InterestMetric {
  const record = expectRecord(value, context);

  return {
    label: expectString(record.label, `${context}.label`),
    value: expectString(record.value, `${context}.value`),
  };
}

function parseInterestEntry(value: unknown, context: string): InterestEntry {
  const record = expectRecord(value, context);

  return {
    title: expectString(record.title, `${context}.title`),
    subtitle: expectString(record.subtitle, `${context}.subtitle`),
    icon: expectString(record.icon, `${context}.icon`),
    description: expectString(record.description, `${context}.description`),
    metrics: expectObjectArray(record.metrics, `${context}.metrics`, parseInterestMetric),
    status: expectString(record.status, `${context}.status`),
  };
}

function parseFooterSection(value: unknown, context: string): FooterSection {
  const record = expectRecord(value, context);

  return {
    systemStatus: expectString(record.systemStatus, `${context}.systemStatus`),
    region: expectString(record.region, `${context}.region`),
    latency: expectString(record.latency, `${context}.latency`),
  };
}

export function parseResumeDocument(value: unknown): ResumeDocument {
  const record = expectRecord(value, 'resumeData');

  return {
    header: parseHeaderSection(record.header, 'resumeData.header'),
    hero: parseHeroSection(record.hero, 'resumeData.hero'),
    originStory: parseOriginStorySection(record.originStory, 'resumeData.originStory'),
    experience: expectObjectArray(record.experience, 'resumeData.experience', parseExperienceEntry),
    education: expectObjectArray(record.education, 'resumeData.education', parseEducationEntry),
    certifications: expectObjectArray(
      record.certifications,
      'resumeData.certifications',
      parseCertificationEntry,
    ),
    interests: expectObjectArray(record.interests, 'resumeData.interests', parseInterestEntry),
    footer: parseFooterSection(record.footer, 'resumeData.footer'),
  };
}

export const resumeData = parseResumeDocument(rawResumeData);
