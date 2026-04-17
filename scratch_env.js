const { execSync } = require('child_process');
const fs = require('fs');

const envFile = fs.readFileSync('.env', 'utf-8');
const lines = envFile.split('\n').filter(line => line.trim() && !line.startsWith('#'));

console.log("Uploading Environments to Web...");
for (const line of lines) {
  const [key, ...rest] = line.split('=');
  const value = rest.join('=');
  // Pass all keys except STUDIO keys to the Web app
  if (key && value && !key.includes("STUDIO")) {
    try {
      console.log(`Setting ${key} recursively...`);
      execSync(`printf "%s" "${value.replace(/"/g, '\\"')}" | npx vercel env add ${key} production`, { cwd: './apps/web', stdio: 'pipe' });
    } catch(e) {}
  }
}

console.log("Uploading Environments to Studio...");
for (const line of lines) {
  const [key, ...rest] = line.split('=');
  const value = rest.join('=');
  // Pass only STUDIO config variables to the backend
  if (key && value && key.includes("STUDIO")) {
    try {
      console.log(`Setting ${key} recursively...`);
      execSync(`printf "%s" "${value.replace(/"/g, '\\"')}" | npx vercel env add ${key} production`, { cwd: './apps/studio', stdio: 'pipe' });
    } catch(e) {}
  }
}
