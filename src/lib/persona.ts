// Navigator persona: greeting + step-by-step guidance intent.
// Voice-optimized copy: short sentences, no markdown, senior-friendly.

const GREETING_PATTERNS = [
  /(hi+|hii+|hello+|helo|hey+|yo|namaste|namaskar|namaskaar)/,
  /good\s?(morning|afternoon|evening|day)/,
  /how are you/,
  /how r u/,
  /kaise ho/,
  /^(hi|hello|hey|namaste)/,
  /नमस्ते/,
  /हेलो/,
  /कैसे हो/,
  /सत श्री अकाल/,
];

const NAVIGATOR_PATTERNS = [
  /help me navigate/,
  /navigate/,
  /guide me/,
  /i am lost/,
  /i'?m lost/,
  /where is/,
  /where.*gate/,
  /how do i (go|get|reach|find)/,
  /give me directions/,
  /directions to/,
  /rasta/,
  /रास्ता/,
  /कहाँ/,
  /मुझे रास्ता/,
];

const BROWSER_PATTERNS = [
  /open\s+(youtube|google|wikipedia|github|notion|facebook|twitter|instagram|netflix|spotify|maps|gmail)/,
  /search\s+(for\s+)?(.+)\s+on\s+(youtube|google)/,
  /play\s+(.+)\s+on\s+youtube/,
  /go\s+to\s+(https?:\/\/\S+|www\.\S+|\S+\.com)/,
  /open\s+(a\s+)?new\s+tab/,
  /play\s+(video|music|song)/,
  /search\s+youtube/,
  /youtube.*play/,
  /open\s+youtube/,
];

const norm = (p: string) => p.toLowerCase().trim();

export function isGreeting(prompt: string): boolean {
  const t = norm(prompt);
  if (t.length > 60) return false;
  return GREETING_PATTERNS.some((re) => re.test(t));
}

export function isNavigator(prompt: string): boolean {
  return NAVIGATOR_PATTERNS.some((re) => re.test(norm(prompt)));
}

export function isBrowserRequest(prompt: string): boolean {
  return BROWSER_PATTERNS.some((re) => re.test(norm(prompt)));
}

export function getBrowserIntent(prompt: string): { site: string; query: string; needsClarification: boolean } | null {
  const t = norm(prompt);
  if (/open\s+youtube/.test(t) && !/play/.test(t) && !/search/.test(t)) {
    if (/play\s+(a\s+)?video/.test(t)) return { site: 'youtube', query: '', needsClarification: true };
    return { site: 'youtube', query: '', needsClarification: false };
  }
  const playMatch = t.match(/play\s+(.+)\s+on\s+youtube/);
  if (playMatch) return { site: 'youtube', query: playMatch[1].trim(), needsClarification: false };
  const searchYT = t.match(/search\s+(?:for\s+)?(.+?)\s+on\s+youtube/);
  if (searchYT) return { site: 'youtube', query: searchYT[1].trim(), needsClarification: false };
  if (/open\s+google/.test(t)) { const q = t.match(/search\s+(?:for\s+)?(.+)/); return { site: 'google', query: q ? q[1].trim() : '', needsClarification: false }; }
  const goMatch = t.match(/go\s+to\s+(\S+)/);
  if (goMatch) return { site: goMatch[1], query: '', needsClarification: false };
  return null;
}

export function greetingReply(language = 'en'): string {
  if (language === 'hi')
    return 'नमस्ते! मैं एको हूँ, आपका सहायक। धीरे-धीरे बताइए, आपको क्या चाहिए?';
  if (language === 'es')
    return '¡Hola! Soy Echo, tu ayudante. Dime despacio qué necesitas y te guiaré paso a paso.';
  return "Hello! I'm Echo, your friendly navigator. Tell me what you need, slowly and clearly. I can guide you step by step, report a problem, or look up information for you.";
}

export function navigatorReply(language = 'en'): string {
  if (language === 'hi')
    return 'बिलकुल, मैं आपको रास्ता बताऊंगा। पहले बताइए, आप अभी कहाँ हैं?';
  if (language === 'es')
    return 'Claro, te guiaré. Dime dónde estás ahora y a dónde quieres ir, una cosa a la vez.';
  return 'Of course, I will guide you. First tell me where you are right now. Then tell me where you want to go. One step at a time. For example: I am at Gate 2 and I want to reach Gate 4.';
}

export function browserClarificationReply(site: string, language = 'en'): string {
  if (language === 'hi') return `जरूर। आप ${site} पर क्या देखना चाहते हैं?`;
  return `Sure. What would you like to watch on ${site}? Please tell me the topic or name.`;
}

export function browserActionReply(site: string, query: string, language = 'en'): string {
  if (query) {
    if (language === 'hi') return `${site} पर "${query}" खोल रहा हूं।`;
    return `Opening ${site} for "${query}" in a new tab. Enjoy!`;
  }
  if (language === 'hi') return `${site} खोल रहा हूं।`;
  return `Opening ${site} in a new tab.`;
}
