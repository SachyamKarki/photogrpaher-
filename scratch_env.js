const { spawnSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const ROOT = __dirname;
const WEB_ENVS = ['production', 'preview', 'development'];
const STUDIO_ENVS = ['production', 'preview', 'development'];

function parseEnvFile(filePath) {
  return fs
    .readFileSync(filePath, 'utf-8')
    .split('\n')
    .filter((line) => line.trim() && !line.trim().startsWith('#'))
    .map((line) => {
      const [key, ...rest] = line.split('=');
      return { key: key?.trim(), value: rest.join('=').trim() };
    })
    .filter(({ key, value }) => key && value);
}

function hasVercelLink(cwd) {
  return fs.existsSync(path.join(cwd, '.vercel', 'project.json'));
}

function runVercel(args, options = {}) {
  const result = spawnSync('npx', ['vercel', ...args], {
    cwd: options.cwd || ROOT,
    input: options.input,
    encoding: 'utf-8',
    stdio: ['pipe', 'pipe', 'pipe'],
  });

  return {
    ok: result.status === 0,
    stdout: result.stdout || '',
    stderr: result.stderr || '',
    status: result.status,
  };
}

function upsertEnv({ cwd, key, value, environment }) {
  const removeResult = runVercel(['env', 'rm', key, environment, '--yes'], { cwd });
  if (!removeResult.ok) {
    const combined = `${removeResult.stdout}\n${removeResult.stderr}`;
    const missing = /not found|does not exist|No Environment Variable/i.test(combined);
    if (!missing) {
      console.warn(`[env-sync] Could not remove ${key} from ${environment}: ${combined.trim()}`);
    }
  }

  const addResult = runVercel(['env', 'add', key, environment], { cwd, input: value });
  if (!addResult.ok) {
    throw new Error(
      `[env-sync] Failed to set ${key} for ${environment}: ${(addResult.stderr || addResult.stdout).trim()}`,
    );
  }
}

const envFilePath = path.join(ROOT, '.env');
const entries = parseEnvFile(envFilePath);

console.log('Uploading environments to the linked web project...');
for (const { key, value } of entries) {
  if (key.includes('STUDIO')) continue;
  for (const environment of WEB_ENVS) {
    console.log(`Syncing ${key} -> web (${environment})`);
    upsertEnv({ cwd: ROOT, key, value, environment });
  }
}

const studioCwd = path.join(ROOT, 'apps', 'studio');
if (!hasVercelLink(studioCwd)) {
  console.warn('Skipping studio sync because apps/studio is not linked to a Vercel project.');
  process.exit(0);
}

console.log('Uploading environments to the linked studio project...');
for (const { key, value } of entries) {
  if (!key.includes('STUDIO')) continue;
  for (const environment of STUDIO_ENVS) {
    console.log(`Syncing ${key} -> studio (${environment})`);
    upsertEnv({ cwd: studioCwd, key, value, environment });
  }
}
