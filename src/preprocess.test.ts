import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import { describe, test, expect } from 'vitest';

import magic_preprocess from './preprocess.js';

const __dirname = resolve(fileURLToPath(import.meta.url), '..');

const readInputFile = (filename: string) =>
  readFileSync(resolve(__dirname, 'test-input', filename), {
    encoding: 'utf8',
    flag: 'r'
  });

const snippets = [
  'simple.svelte'
];

describe('preprocess snapshots', () => {
    snippets.forEach((snippet) => {
        test(snippet, () => {
          expect(
            magic_preprocess().markup({ content: readInputFile(snippet), filename: snippet })
          ).toMatchSnapshot()
        })
      });
});

// TODO: Write better tests instead of snapshots:
//  Check that it switched the correct places of definitions