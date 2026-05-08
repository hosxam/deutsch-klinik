/**
 * validate-lint.cjs
 *
 * Validates the Phase 11 Supabase auth integration.
 * Checks that all required files exist and contain expected content.
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');

const REQUIRED_FILES = [
  { path: 'src/utils/localStorageAdapter.js', label: 'localStorageAdapter', mustExport: ['localStorageAdapter'] },
  { path: 'src/utils/cloudStorageAdapter.js', label: 'cloudStorageAdapter', mustExport: ['cloudStorageAdapter'] },
  { path: 'src/utils/progressStorage.js', label: 'progressStorage', mustExport: ['getStorageAdapter', 'isCloudAuthenticated', 'getCurrentUser'] },
  { path: 'src/utils/supabaseSync.js', label: 'supabaseSync', mustExport: ['migrateLocalToCloud', 'syncFromCloud', 'hasSyncBackup'] },
  { path: 'src/lib/supabaseClient.js', label: 'supabaseClient', mustExport: ['getSupabase', 'isSupabaseConfigured', 'supabase', 'isSupabaseEnabled'] },
  { path: 'src/components/AuthPanel.jsx', label: 'AuthPanel', mustExport: [] },
  { path: 'src/pages/AccountPage.jsx', label: 'AccountPage', mustExport: [] },
  { path: 'supabase/schema.sql', label: 'schema.sql', mustContain: ['create table', 'user_settings', 'user_progress', 'lesson_progress', 'daily_sessions', 'mistakes', 'flashcards'] },
  { path: 'supabase/rls_policies.sql', label: 'rls_policies.sql', mustContain: ['enable row level security', 'auth.uid()', 'policy'] },
  { path: 'docs/SUPABASE_SETUP.md', label: 'SUPABASE_SETUP.md', mustContain: ['VITE_SUPABASE_URL', 'VITE_SUPABASE_ANON_KEY'] },
  { path: 'tests/auth-smoke.spec.cjs', label: 'auth smoke test', mustContain: ['@playwright/test', 'test.describe'] },
];

const ERRORS = [];
const WARNINGS = [];

console.log('=== Phase 11 Lint Validator ===\n');

for (const file of REQUIRED_FILES) {
  const fullPath = path.join(ROOT, file.path);
  if (!fs.existsSync(fullPath)) {
    ERRORS.push('MISSING: ' + file.path + ' (' + file.label + ')');
    continue;
  }

  const content = fs.readFileSync(fullPath, 'utf8');
  console.log('OK: ' + file.path + ' (' + content.length + ' bytes)');

  if (file.mustContain) {
    for (const keyword of file.mustContain) {
      if (!content.includes(keyword)) {
        ERRORS.push(file.path + ': missing keyword "' + keyword + '"');
      }
    }
  }

  if (file.mustExport && file.mustExport.length > 0) {
    for (const exp of file.mustExport) {
      if (content.includes('export ') && !content.includes(exp)) {
        WARNINGS.push(file.path + ': export "' + exp + '" not found via string match');
      }
    }
  }
}

// Check @supabase/supabase-js is installed
try {
  require.resolve('@supabase/supabase-js');
  console.log('OK: @supabase/supabase-js (installed)');
} catch {
  ERRORS.push('@supabase/supabase-js is not installed in package.json');
}

// Check App.jsx imports AccountPage
const appJsx = fs.readFileSync(path.join(ROOT, 'src', 'App.jsx'), 'utf8');
if (appJsx.includes('AccountPage')) {
  console.log('OK: App.jsx imports AccountPage');
} else {
  ERRORS.push('App.jsx does not import AccountPage');
}

if (appJsx.includes('settings/account')) {
  console.log('OK: App.jsx has /settings/account route');
} else {
  ERRORS.push('App.jsx missing /settings/account route');
}

// Check SettingsPage links to account
const settingsPage = fs.readFileSync(path.join(ROOT, 'src', 'pages', 'SettingsPage.jsx'), 'utf8');
if (settingsPage.includes('settings/account')) {
  console.log('OK: SettingsPage links to account');
} else {
  WARNINGS.push('SettingsPage does not link to /settings/account');
}

// Check package.json for @supabase/supabase-js
const pkg = JSON.parse(fs.readFileSync(path.join(ROOT, 'package.json'), 'utf8'));
const deps = { ...pkg.dependencies, ...pkg.devDependencies };
if (deps['@supabase/supabase-js']) {
  console.log('OK: @supabase/supabase-js in package.json (' + deps['@supabase/supabase-js'] + ')');
} else {
  ERRORS.push('@supabase/supabase-js not in package.json');
}

console.log('\n=== Results ===');
console.log('Errors: ' + ERRORS.length);
console.log('Warnings: ' + WARNINGS.length);

if (ERRORS.length > 0) {
  console.log('\nErrors:');
  ERRORS.forEach(e => console.log('  [ERROR] ' + e));
}
if (WARNINGS.length > 0) {
  console.log('\nWarnings:');
  WARNINGS.forEach(w => console.log('  [WARN] ' + w));
}

process.exit(ERRORS.length > 0 ? 1 : 0);
