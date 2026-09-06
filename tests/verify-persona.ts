import { isGreeting, greetingReply, isNavigator, navigatorReply, isBrowserRequest, getBrowserIntent, browserClarificationReply, browserActionReply } from '../lib/ai/persona.js';
import { getSiteUrl } from '../lib/browserHandler.js';
import { toBCP47, isLanguageSupported, SUPPORTED_LOCALES } from '../lib/voice/locale.js';

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

console.log('\n--- 1. Testing Locale and Indian Languages Support ---');
const indianLanguages = ['hi', 'mr', 'ta', 'te', 'bn', 'pa', 'gu', 'kn', 'ml', 'or', 'as', 'gbm', 'bgc'];
for (const lang of indianLanguages) {
  const bcp = toBCP47(lang);
  assert(typeof bcp === 'string' && bcp.length >= 5, `Language "${lang}" resolves to BCP-47 "${bcp}"`);
}
assert(toBCP47('hi-IN') === 'hi-IN', 'Hindi code hi-IN resolves correctly');
assert(toBCP47('mr-IN') === 'mr-IN', 'Marathi code mr-IN resolves correctly');
assert(toBCP47('ta-IN') === 'ta-IN', 'Tamil code ta-IN resolves correctly');

console.log('\n--- 2. Testing Voice Greeting & Navigator Persona in EN & HI ---');
assert(isGreeting('hello') === true, 'isGreeting("hello") is true');
assert(isGreeting('namaste') === true, 'isGreeting("namaste") is true');
assert(isGreeting('नमस्ते') === true, 'isGreeting("नमस्ते") is true');
assert(greetingReply('hi').includes('नमस्ते'), 'Hindi greeting reply contains नमस्ते');
assert(greetingReply('en').includes("Hello! I'm Echo"), 'English greeting reply contains greeting');

assert(isNavigator('help me navigate') === true, 'isNavigator("help me navigate") is true');
assert(isNavigator('रास्ता बताओ') === true, 'isNavigator("रास्ता बताओ") is true');
assert(navigatorReply('hi').includes('रास्ता'), 'Hindi navigator reply gives guidance');

console.log('\n--- 3. Testing Voice-Controlled Browser Navigation ---');
// Ambiguous request -> asks clarification
const amb1 = 'open youtube and play a video';
assert(isBrowserRequest(amb1) === true, `isBrowserRequest("${amb1}") is true`);
const ambIntent = getBrowserIntent(amb1);
assert(ambIntent !== null && ambIntent.needsClarification === true, 'Ambiguous "play a video" requires clarification');
const clarifyReply = browserClarificationReply('youtube', 'en');
assert(clarifyReply.includes('What would you like to watch on youtube?'), 'Clarification prompt asks what video to watch');

// Specific request -> opens and searches
const spec1 = 'play football highlights on youtube';
assert(isBrowserRequest(spec1) === true, `isBrowserRequest("${spec1}") is true`);
const specIntent = getBrowserIntent(spec1);
assert(specIntent !== null && specIntent.needsClarification === false, 'Specific request needs no clarification');
assert(specIntent?.query === 'football highlights', 'Extracted query matches "football highlights"');

const ytUrl = getSiteUrl('youtube', 'football highlights');
assert(ytUrl.includes('youtube.com/results?search_query=football%20highlights'), `YouTube search URL correctly constructed: ${ytUrl}`);

const googleUrl = getSiteUrl('google', 'weather today');
assert(googleUrl.includes('google.com/search?q=weather%20today'), `Google search URL correctly constructed: ${googleUrl}`);

console.log(`\n========================================`);
console.log(`Verification Summary: ${passed} passed, ${failed} failed.`);
if (failed > 0) {
  process.exit(1);
} else {
  console.log('🎉 ALL SUITE VERIFICATIONS PASSED!\n');
}
