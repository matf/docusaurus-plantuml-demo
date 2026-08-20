#!/usr/bin/env node
/**
 * Fails the build unless the PlantUML runtime was emitted into `build/`.
 *
 * The whole point of this site is that the engine is served from this origin — no CDN. If the
 * plugin's copy step ever silently stops running, every diagram breaks in a visitor's browser
 * and nothing else notices. This is checked on every pull request and again before deploying,
 * so a dependency update that breaks the copy is caught before it reaches Pages.
 */
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const assets = path.join(root, 'build', 'assets');
const REQUIRED = ['viz-global.js', 'plantuml.js'];

function fail(message) {
  console.error(`Runtime asset check failed: ${message}`);
  process.exit(1);
}

if (!fs.existsSync(assets)) {
  fail(`${path.relative(root, assets)} does not exist. Did \`npm run build\` run?`);
}

const dirs = fs
  .readdirSync(assets, {withFileTypes: true})
  .filter((entry) => entry.isDirectory() && entry.name.startsWith('plantuml-client-'))
  .map((entry) => path.join(assets, entry.name));

if (dirs.length === 0) {
  fail('no build/assets/plantuml-client-* directory was produced.');
}

for (const dir of dirs) {
  for (const name of REQUIRED) {
    const file = path.join(dir, name);
    let size;
    try {
      size = fs.statSync(file).size;
    } catch {
      fail(`missing: ${path.relative(root, file)}`);
    }
    if (size === 0) fail(`empty: ${path.relative(root, file)}`);
  }
  const listing = fs
    .readdirSync(dir)
    .map((name) => `  ${name} (${fs.statSync(path.join(dir, name)).size} bytes)`)
    .join('\n');
  console.log(`Runtime assets present in ${path.relative(root, dir)}:\n${listing}`);
}
