import { existsSync, readFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';

const root = new URL('..', import.meta.url).pathname;
const checks = [];

function hasVariable(file, name) {
  if (!existsSync(file)) return false;
  return readFileSync(file, 'utf8')
    .split(/\r?\n/)
    .some((line) => line.startsWith(`${name}=`) && line.slice(name.length + 1).trim());
}

function check(name, passed, detail) {
  checks.push({ name, passed, detail });
}

check(
  'Web Supabase environment',
  hasVariable(`${root}apps/web/.env.local`, 'NEXT_PUBLIC_SUPABASE_URL') &&
    hasVariable(`${root}apps/web/.env.local`, 'NEXT_PUBLIC_SUPABASE_ANON_KEY'),
  'apps/web/.env.local contains the Supabase URL and anon key',
);
check(
  'API Supabase environment',
  hasVariable(`${root}apps/api/.env`, 'SUPABASE_URL') &&
    hasVariable(`${root}apps/api/.env`, 'SUPABASE_ANON_KEY'),
  'apps/api/.env contains the Supabase URL and anon key',
);
check(
  'API database environment',
  hasVariable(`${root}apps/api/.env`, 'DATABASE_URL'),
  'apps/api/.env contains DATABASE_URL',
);
check(
  'GitHub workflows',
  ['test.yml', 'build.yml', 'deploy.yml'].every((file) =>
    existsSync(`${root}.github/workflows/${file}`),
  ),
  '.github/workflows contains test, build, and deploy workflows',
);

try {
  execFileSync('docker', ['info'], { stdio: 'ignore' });
  check('Docker daemon', true, 'Docker is available and running');
} catch {
  check(
    'Docker daemon',
    false,
    'Start Docker Desktop before running database migrations',
  );
}

const failures = checks.filter(({ passed }) => !passed);
for (const { name, passed, detail } of checks) {
  console.log(`${passed ? 'PASS' : 'BLOCKED'} ${name}: ${detail}`);
}

if (failures.length > 0) {
  process.exitCode = 1;
}
