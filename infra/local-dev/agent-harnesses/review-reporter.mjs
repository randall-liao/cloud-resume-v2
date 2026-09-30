import { copyFile, mkdir, rm, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { writeCasePackage, writeRunIndex } from './review-packages.mjs';

const mediaEvidence = ['screenshot', 'video', 'trace'];
const extensions = {
  'image/png': '.png',
  'image/jpeg': '.jpg',
  'image/webp': '.webp',
  'video/webm': '.webm',
  'video/mp4': '.mp4',
  'application/zip': '.zip',
  'application/json': '.json',
  'text/plain': '.txt',
};

function slug(value, limit = 70) {
  return value.replace(/[^a-zA-Z0-9._-]+/g, '-').replace(/^[-.]+|[-.]+$/g, '').slice(0, limit) || 'test';
}

function errorText(error) {
  return error.stack || error.message || error.value || JSON.stringify(error);
}

function assertionsFor(result, status, expectedStatus) {
  const assertions = [{
    criterion: 'Playwright test outcome',
    expected: expectedStatus,
    observed: status,
    status,
  }];
  function visit(steps) {
    for (const step of steps) {
      if (step.category === 'expect') {
        assertions.push({
          criterion: step.title,
          expected: 'Assertion passes',
          observed: step.error ? errorText(step.error) : step.duration < 0 ? 'Assertion did not finish' : 'Assertion passed',
          status: step.error ? 'failed' : step.duration < 0 ? 'interrupted' : 'passed',
          location: step.location,
        });
      }
      visit(step.steps || []);
    }
  }
  visit(result?.steps || []);
  for (const error of result?.errors || []) {
    assertions.push({
      criterion: 'Test execution error',
      expected: 'No execution error',
      observed: errorText(error),
      status: 'failed',
    });
  }
  return assertions;
}

async function copyAttachments(directory, attachments) {
  const errors = [];
  if (!attachments.length) return errors;
  const target = path.join(directory, 'attachments');
  await mkdir(target, { recursive: true });
  for (const [index, attachment] of attachments.entries()) {
    const original = attachment.path ? path.basename(attachment.path) : attachment.name;
    let name = slug(original, 150);
    const extension = extensions[attachment.contentType];
    if (extension && !path.extname(name)) name += extension;
    const destination = path.join(target, `${String(index + 1).padStart(4, '0')}-${name}`);
    try {
      if (attachment.path) await copyFile(attachment.path, destination);
      else if (attachment.body !== undefined) await writeFile(destination, attachment.body);
      else throw new Error('Attachment has neither a file path nor a body');
    } catch (error) {
      errors.push(`Unable to copy attachment ${attachment.name}: ${error.message}`);
    }
  }
  return errors;
}

export default class ReviewReporter {
  constructor({ evidenceDir } = {}) {
    if (!evidenceDir) throw new Error('ReviewReporter requires evidenceDir');
    this.evidenceDir = path.resolve(evidenceDir);
    this.entries = new Map();
    this.globalErrors = [];
  }

  printsToStdio() {
    return true;
  }

  onBegin(config, suite) {
    this.config = config;
    for (const test of suite.allTests()) {
      this.entries.set(test, { test, ordinal: this.entries.size + 1, attempts: [] });
    }
  }

  onTestBegin(test, result) {
    this.entries.get(test).attempts.push({ result, completed: false });
  }

  onTestEnd(test, result) {
    const entry = this.entries.get(test);
    let attempt = entry.attempts.find((item) => item.result === result);
    if (!attempt) {
      attempt = { result };
      entry.attempts.push(attempt);
    }
    attempt.completed = true;
    attempt.annotations = test.annotations.map((annotation) => ({ ...annotation }));
    attempt.expectedStatus = test.expectedStatus;
  }

  onError(error) {
    this.globalErrors.push(errorText(error));
  }

  async onEnd(run) {
    // Playwright 1.49 swallows reporter exceptions. Return an explicit failed
    // status, including when a write fails, so missing packages cannot pass CI.
    try {
      // This subtree belongs to the reporter. An explicitly reused run path
      // must not let captures from a previous invocation satisfy this run.
      await rm(path.join(this.evidenceDir, 'cases'), { recursive: true, force: true });
      const cases = [];
      let failed = false;
      for (const entry of this.entries.values()) {
        const { test } = entry;
        if (!entry.attempts.length) entry.attempts.push({ completed: false });
        for (const [attemptIndex, attempt] of entry.attempts.entries()) {
          const result = attempt.result;
          const annotations = attempt.annotations || test.annotations;
          const expectedStatus = attempt.expectedStatus || test.expectedStatus;
          const explicitlySkipped = expectedStatus === 'skipped';
          const status = attempt.completed ? result.status
            : explicitlySkipped ? 'skipped'
              : result || run.status === 'interrupted' ? 'interrupted'
                : run.status === 'timedout' ? 'timedOut' : 'blocked';
          const project = test.parent.project()?.name || 'default';
          const retry = result?.retry ?? 0;
          // Ordinals separate even identical sanitized titles, projects and
          // repeat-each instances; attempt ordinal also prevents retry overlap.
          const caseId = `${String(entry.ordinal).padStart(4, '0')}-${slug(project, 30)}-${slug(test.title)}-retry-${retry}-attempt-${attemptIndex + 1}`;
          const relativeDirectory = `cases/${caseId}`;
          const directory = path.join(this.evidenceDir, relativeDirectory);
          const sourceFile = path.relative(this.config.rootDir, test.location.file).split(path.sep).join('/');
          const source = `${sourceFile}:${test.location.line}:${test.location.column}`;
          const apiOnly = annotations.some(({ type, description }) => type === 'evidence' && description === 'api-only');
          const notes = [];
          if (apiOnly) notes.push('Explicit api-only annotation: browser screenshot, video, and trace are not applicable.');
          if (!attempt.completed) notes.push('No onTestEnd event was received; no completed outcome is inferred.');
          const blocker = !attempt.completed
            ? `Test did not finish. Run status: ${run.status}.${this.globalErrors.length ? ` ${this.globalErrors.join('\n')}` : ''}`
            : status === 'skipped' ? annotations.filter(({ type }) => type === 'skip' || type === 'fixme').map(({ description }) => description).filter(Boolean).join('\n') || 'Playwright skipped this test.'
              : '';
          try {
            const attachmentErrors = await copyAttachments(directory, result?.attachments || []);
            notes.push(...attachmentErrors);
            failed ||= attachmentErrors.length > 0;
            const manifest = await writeCasePackage(directory, {
              caseId,
              title: test.titlePath().filter(Boolean).join(' › '),
              source,
              status,
              project,
              retry,
              repeatEachIndex: test.repeatEachIndex,
              testId: test.id,
              expectedStatus,
              annotations,
              duration: result?.duration,
              errors: result?.errors || [],
              assertions: assertionsFor(result, status, expectedStatus),
              reproduction: [
                `Source: ${source}`,
                `Project: ${project}; repeat index: ${test.repeatEachIndex}; retry: ${retry}`,
                `From the harness directory: npx playwright test ${JSON.stringify(`${sourceFile}:${test.location.line}`)} --project=${JSON.stringify(project)}`,
              ],
              blocker,
              requiredEvidence: apiOnly ? [] : [...mediaEvidence],
              notes,
            });
            failed ||= status === 'passed' && manifest.evidenceStatus === 'incomplete';
            cases.push({ ...manifest, path: relativeDirectory });
          } catch (error) {
            // Continue the other packages and retain the affected case in the
            // index even when its own destination could not be written.
            failed = true;
            const message = `Review package failed for ${caseId}: ${error.message}`;
            console.error(message);
            cases.push({
              caseId,
              title: test.title,
              source,
              status,
              project,
              retry,
              path: relativeDirectory,
              assertions: assertionsFor(result, status, expectedStatus),
              blocker: message,
              artifacts: [],
              requiredEvidence: apiOnly ? [] : [...mediaEvidence],
              missingEvidence: apiOnly ? [] : [...mediaEvidence],
              evidenceStatus: 'incomplete',
              notes: [message],
            });
          }
        }
      }
      await writeRunIndex(this.evidenceDir, {
        runId: path.basename(this.evidenceDir),
        status: failed || this.globalErrors.length ? 'failed' : run.status,
        errors: this.globalErrors,
        cases,
      });
      console.log(`Human review: ${path.join(this.evidenceDir, 'index.html')}`);
      if (failed || this.globalErrors.length) return { status: 'failed' };
    } catch (error) {
      console.error(`Review package reporter failed: ${error.stack || error.message}`);
      return { status: 'failed' };
    }
  }
}
