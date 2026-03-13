import fs from 'node:fs';
import path from 'node:path';

const repoRoot = process.cwd();
const requiredFiles = [
  'AGENTS.md',
  'AGENT.md',
  'README.md',
  'DESIGN.md',
  'docs/README.md',
  'docs/architecture.md',
  'docs/git_subtree.md',
  'docs/monorepo.md',
  'docs/principles.md',
  'docs/quality.md',
  'docs/quality_standards.md',
  'docs/plans/phase1_foundation.md',
  'docs/plans/agent_gap_analysis.md',
];
const markdownRoots = ['AGENTS.md', 'AGENT.md', 'README.md', 'DESIGN.md', 'docs', '.agent'];
const failures = [];

function toAbsolute(relativePath) {
  return path.join(repoRoot, relativePath);
}

function recordFailure(message) {
  failures.push(message);
}

function walkMarkdown(relativePath) {
  const absolutePath = toAbsolute(relativePath);
  if (!fs.existsSync(absolutePath)) {
    return [];
  }

  const stats = fs.statSync(absolutePath);
  if (stats.isFile()) {
    return path.extname(relativePath) === '.md' ? [relativePath] : [];
  }

  const entries = fs.readdirSync(absolutePath, { withFileTypes: true });
  const markdownFiles = [];

  for (const entry of entries) {
    const entryRelativePath = path.join(relativePath, entry.name);
    if (entry.isDirectory()) {
      markdownFiles.push(...walkMarkdown(entryRelativePath));
      continue;
    }

    if (path.extname(entry.name) === '.md') {
      markdownFiles.push(entryRelativePath);
    }
  }

  return markdownFiles;
}

for (const requiredFile of requiredFiles) {
  if (!fs.existsSync(toAbsolute(requiredFile))) {
    recordFailure(`Missing required file: ${requiredFile}`);
  }
}

if (fs.existsSync(toAbsolute('AGENTS.md'))) {
  const agentsLineCount = fs.readFileSync(toAbsolute('AGENTS.md'), 'utf8').split(/\r?\n/).length;
  if (agentsLineCount > 120) {
    recordFailure(`AGENTS.md should stay concise; found ${agentsLineCount} lines.`);
  }
}

if (fs.existsSync(toAbsolute('AGENT.md'))) {
  const legacyAgentText = fs.readFileSync(toAbsolute('AGENT.md'), 'utf8');
  if (!legacyAgentText.includes('AGENTS.md')) {
    recordFailure('AGENT.md must point agents to AGENTS.md.');
  }
}

const markdownFiles = [...new Set(markdownRoots.flatMap(walkMarkdown))];
const markdownLinkPattern = /\[[^\]]+\]\(([^)]+)\)/g;

for (const markdownFile of markdownFiles) {
  const absoluteFilePath = toAbsolute(markdownFile);
  const contents = fs.readFileSync(absoluteFilePath, 'utf8');
  let match;

  while ((match = markdownLinkPattern.exec(contents)) !== null) {
    const rawTarget = match[1].trim();

    if (
      !rawTarget ||
      rawTarget.startsWith('#') ||
      rawTarget.startsWith('mailto:') ||
      /^[a-z]+:\/\//i.test(rawTarget)
    ) {
      continue;
    }

    const [targetPath] = rawTarget.split('#');
    if (!targetPath) {
      continue;
    }

    const resolvedTarget = path.resolve(path.dirname(absoluteFilePath), targetPath);
    if (!fs.existsSync(resolvedTarget)) {
      recordFailure(`${markdownFile}: broken link target '${rawTarget}'`);
    }
  }
}

if (failures.length > 0) {
  console.error('docs validation failed:\n');
  for (const failure of failures) {
    console.error(`- ${failure}`);
  }
  process.exit(1);
}

console.log(`docs validation passed (${markdownFiles.length} markdown files checked).`);
