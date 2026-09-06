import { allTools, getToolByName } from '../lib/tools/registry.js';
import { SUPPORTED_LOCALES } from '../lib/voice/locale.js';

let passed = 0;
let failed = 0;

function assert(condition: boolean, testName: string) {
  if (condition) {
    console.log(`✅ PASS: ${testName}`);
    passed++;
  } else {
    console.error(`❌ FAIL: ${testName}`);
    failed++;
  }
}

console.log('\n--- 1. Testing Tool Registry & Safety Gates ---');
assert(allTools.length >= 10, `All tools registered: found ${allTools.length} tools`);
const webSearchTool = getToolByName('web_search');
assert(webSearchTool !== undefined, 'Tool "web_search" is registered');

const browserTool = getToolByName('open_website');
assert(browserTool !== undefined, 'Tool "open_website" is registered');

const jiraTool = getToolByName('jira_create_issue');
assert(jiraTool !== undefined, 'Tool "jira_create_issue" is registered');

console.log('\n--- 2. Testing Indian Locales Registration ---');
const indianCodes = ['hi-IN', 'mr-IN', 'ta-IN', 'te-IN', 'bn-IN', 'pa-IN', 'gu-IN', 'kn-IN', 'ml-IN', 'or-IN', 'as-IN'];
for (const code of indianCodes) {
  const found = SUPPORTED_LOCALES.some(l => l.code === code);
  assert(found === true, `Locale ${code} is present in SUPPORTED_LOCALES`);
}

console.log(`\n========================================`);
console.log(`API Verification Summary: ${passed} passed, ${failed} failed.`);
if (failed > 0) {
  process.exit(1);
} else {
  console.log('🎉 ALL API VERIFICATIONS PASSED!\n');
}
