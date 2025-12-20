#!/usr/bin/env node
'use strict';

const path = require('path');
const fs = require('fs/promises');
const { spawnSync } = require('child_process');

const ROOT_DIR = path.resolve(__dirname, '..');
const SRC_DIR = path.join(ROOT_DIR, 'src', 'browser');
const DIST_DIR = path.join(ROOT_DIR, 'dist');

const BROWSERS = [
  { key: 'chromium', manifest: 'manifest.chromium.json', archiveExt: 'zip' },
  { key: 'gecko', manifest: 'manifest.gecko.json', archiveExt: 'xpi' }
];
const MANIFEST_FILES = BROWSERS.map((browser) => browser.manifest);

async function main() {
  try {
    const options = parseCli(process.argv.slice(2));
    await fs.mkdir(DIST_DIR, { recursive: true });

    const results = [];
    for (const key of options.browsers) {
      const browser = BROWSERS.find((item) => item.key === key);
      results.push(await buildBrowser(browser, { skipArchive: options.skipZip }));
    }

    console.log('\nBuild artifacts');
    for (const result of results) {
      console.log(`  • ${result.browser}: ${path.relative(ROOT_DIR, result.directory)}`);
      if (result.archivePath) {
        console.log(`    ↳ package: ${path.relative(ROOT_DIR, result.archivePath)}`);
      }
    }
  } catch (error) {
    console.error(error.message);
    process.exit(1);
  }
}

function parseCli(argv) {
  const output = { browsers: BROWSERS.map((browser) => browser.key), skipZip: false };

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (arg === '--browser' || arg === '-b') {
      const list = argv[index + 1];
      if (!list) {
        throw new Error('Missing value for --browser flag');
      }
      output.browsers = list.split(',').map((value) => value.trim()).filter(Boolean);
      index += 1;
    } else if (arg.startsWith('--browser=')) {
      const list = arg.replace('--browser=', '');
      output.browsers = list.split(',').map((value) => value.trim()).filter(Boolean);
    } else if (arg === '--no-zip') {
      output.skipZip = true;
    }
  }

  output.browsers = [...new Set(output.browsers)];
  const invalid = output.browsers.filter((value) => !BROWSERS.some((browser) => browser.key === value));
  if (invalid.length) {
    throw new Error(`Unknown browser target(s): ${invalid.join(', ')}`);
  }

  return output;
}

async function buildBrowser(browser, options) {
  console.log(`Building ${browser.key} bundle...`);
  const browserDistDir = path.join(DIST_DIR, browser.key);
  await fs.rm(browserDistDir, { recursive: true, force: true });
  await fs.cp(SRC_DIR, browserDistDir, { recursive: true });

  for (const manifest of MANIFEST_FILES) {
    const manifestPath = path.join(browserDistDir, manifest);
    if (manifest === browser.manifest) {
      await fs.rename(manifestPath, path.join(browserDistDir, 'manifest.json'));
    } else {
      await fs.rm(manifestPath, { force: true });
    }
  }

  const manifestContent = await fs.readFile(path.join(browserDistDir, 'manifest.json'), 'utf8');
  const manifestData = JSON.parse(manifestContent);
  const safeName = manifestData.name.replace(/\s+/g, '_');
  const archiveBaseName = `${safeName}-${manifestData.version}-${browser.key}-unsigned`;

  let archivePath = null;
  if (!options.skipArchive) {
    const packagesDir = path.join(DIST_DIR, 'packages');
    await fs.mkdir(packagesDir, { recursive: true });
    archivePath = path.join(packagesDir, `${archiveBaseName}.${browser.archiveExt}`);
    await fs.rm(archivePath, { force: true });
    runZip(browserDistDir, archivePath);
  }

  return { browser: browser.key, directory: browserDistDir, archivePath };
}

function runZip(sourceDir, outputFile) {
  const result = spawnSync('zip', ['-qr', outputFile, '.'], {
    cwd: sourceDir,
    stdio: 'inherit'
  });

  if (result.error) {
    throw new Error(`Failed to start zip command: ${result.error.message}`);
  }

  if (result.status !== 0) {
    throw new Error('zip command failed');
  }
}

main();
