// Navigator persona: greeting + language switching + step-by-step guidance + voice-controlled browser navigation.
// Voice-optimized copy: short sentences, no markdown, senior-friendly, natural Hindi & English.

const GREETING_PATTERNS = [
  /\b(hi+|hii+|hello+|helo|hey+|yo|namaste|namaskar|namaskaar)\b/i,
  /\bgood\s?(morning|afternoon|evening|day)\b/i,
  /\bhow are you\b/i,
  /\bhow r u\b/i,
  /\bkaise ho\b/i,
  /^(hi|hello|hey|namaste)/i,
  /नमस्ते/,
  /हेलो/,
  /कैसे हो/,
  /सत श्री अकाल/,
];

const NAVIGATOR_PATTERNS = [
  /\bhelp me navigate\b/i,
  /\bnavigate\b/i,
  /\bguide me\b/i,
  /\bi am lost\b/i,
  /\bi'?m lost\b/i,
  /\bwhere is\b/i,
  /\bwhere.*gate\b/i,
  /\bhow do i (go|get|reach|find)\b/i,
  /\bgive me directions\b/i,
  /\bdirections to\b/i,
  /\brasta\b/i,
  /रास्ता/,
  /कहाँ/,
  /मुझे रास्ता/,
];

const HINDI_SWITCH_PATTERNS = [
  /\bhindi\s+(?:mein|me|mai)\s+(?:baat|bolo|karo|boli)\b/i,
  /\b(?:speak|talk|switch)\s+(?:in|to)?\s*hindi\b/i,
  /\b(?:talk|speak)\s+hindi\b/i,
  /\bहिंदी\s*(?:में)?\s*(?:बात|बोलो|करो|बताओ)\b/i,
  /\bhindi\s+bolo\b/i,
];

const ENGLISH_SWITCH_PATTERNS = [
  /\benglish\s+(?:mein|me|mai)\s+(?:baat|bolo|karo)\b/i,
  /\b(?:speak|talk|switch)\s+(?:in|to)?\s*english\b/i,
  /\b(?:talk|speak)\s+english\b/i,
  /\bअंग्रेजी\s*(?:में)?\s*(?:बात|बोलो|करो)\b/i,
  /\benglish\s+please\b/i,
];

const norm = (p: string) => p.toLowerCase().trim();

export function isLanguageSwitchRequest(prompt: string): { isSwitch: boolean; lang?: 'hi-IN' | 'en-US'; reply?: string } {
  const t = norm(prompt);
  if (HINDI_SWITCH_PATTERNS.some((re) => re.test(t))) {
    return {
      isSwitch: true,
      lang: 'hi-IN',
      reply: 'नमस्ते! अब मैं आपसे हिंदी में बात करूंगा। बताइए, मैं आपकी क्या सहायता कर सकता हूँ?',
    };
  }
  if (ENGLISH_SWITCH_PATTERNS.some((re) => re.test(t))) {
    return {
      isSwitch: true,
      lang: 'en-US',
      reply: 'Sure! I am now speaking in English. How can I assist you today?',
    };
  }
  return { isSwitch: false };
}

export function isGreeting(prompt: string): boolean {
  const t = norm(prompt);
  if (t.length > 60) return false;
  return GREETING_PATTERNS.some((re) => re.test(t));
}

export function isNavigator(prompt: string): boolean {
  return NAVIGATOR_PATTERNS.some((re) => re.test(norm(prompt)));
}

export function isBrowserRequest(prompt: string): boolean {
  const t = norm(prompt);
  if (isLanguageSwitchRequest(t).isSwitch) return false;

  // Patterns for website commands
  const browserTriggers = [
    /\bopen\s+([a-z0-9.\s-]+)/i,
    /\bgo\s+to\s+([a-z0-9.\s-]+)/i,
    /\blaunch\s+([a-z0-9.\s-]+)/i,
    /\bvisit\s+([a-z0-9.\s-]+)/i,
    /\bplay\s+(.+?)(?:\s+on\s+youtube|$)/i,
    /\bsearch\s+(?:for\s+)?(.+?)\s+on\s+(youtube|google)/i,
    /([a-z0-9\s-]+)\s+(?:kholo|khol do|chalao|open karo|kholiye)/i,
    /(?:वेबसाइट|साइट)?\s*([a-z0-9\s-]+)\s*(?:खोलो|खोलिए)/i,
  ];

  return browserTriggers.some((re) => re.test(t));
}

export function getBrowserIntent(prompt: string): { site: string; query: string; needsClarification: boolean } | null {
  const t = norm(prompt);

  // YouTube clarification / search
  if (/youtube/i.test(t)) {
    if (/play\s+(?:a\s+)?(?:video|song|music)$/i.test(t) || t === 'open youtube and play a video') {
      return { site: 'youtube', query: '', needsClarification: true };
    }
    const playOnYT = t.match(/play\s+(.+?)(?:\s+on\s+youtube|$)/i);
    if (playOnYT && !/^(a\s+)?(video|song|music)$/i.test(playOnYT[1].trim())) {
      const q = playOnYT[1].trim().replace(/\s+on\s+youtube$/i, '').trim();
      return { site: 'youtube', query: q, needsClarification: false };
    }
    const searchYT = t.match(/search\s+(?:for\s+)?(.+?)(?:\s+on\s+youtube|$)/i);
    if (searchYT) {
      return { site: 'youtube', query: searchYT[1].trim().replace(/\s+on\s+youtube$/i, ''), needsClarification: false };
    }
    return { site: 'youtube', query: '', needsClarification: false };
  }

  // Google Search
  if (/open\s+google/i.test(t) || /^google$/i.test(t) || /google\s+search/i.test(t)) {
    const q = t.match(/search\s+(?:for\s+)?(.+)/i);
    return { site: 'google', query: q ? q[1].trim() : '', needsClarification: false };
  }

  // Hindi: "<site> kholo" / "<site> open karo" / "<site> chalao"
  const hindiMatch = t.match(/([a-z0-9\s]+)\s+(?:kholo|khol do|chalao|open karo|kholiye)/i);
  if (hindiMatch) {
    const rawSite = hindiMatch[1].replace(/\b(website|site|app|page)\b/gi, '').trim();
    if (rawSite) return { site: rawSite, query: '', needsClarification: false };
  }

  // "open <site>" or "open website <site>"
  const openMatch = t.match(/\bopen\s+(?:website\s+|web\s+|app\s+|page\s+|tab\s+)?([a-z0-9.\s-]+?)(?:\s+in\s+a?\s*new\s*tab|\s+please|\.|\!|$)/i);
  if (openMatch) {
    const rawSite = openMatch[1].trim();
    // Guard against generic words
    if (rawSite && !['the', 'a', 'an', 'settings', 'mic', 'camera', 'chat'].includes(rawSite)) {
      return { site: rawSite, query: '', needsClarification: false };
    }
  }

  // "go to <site>" / "launch <site>" / "visit <site>"
  const goMatch = t.match(/\b(?:go\s+to|launch|visit)\s+([a-z0-9.\s-]+?)(?:\s+in\s+a?\s*new\s*tab|\s+please|\.|\!|$)/i);
  if (goMatch) {
    return { site: goMatch[1].trim(), query: '', needsClarification: false };
  }

  return null;
}

export function greetingReply(language = 'en'): string {
  if (language === 'hi' || language.startsWith('hi'))
    return 'नमस्ते! मैं एको हूँ, आपका सहायक। धीरे-धीरे बताइए, आपको क्या चाहिए?';
  if (language === 'es')
    return '¡Hola! Soy Echo, tu ayudante. Dime despacio qué necesitas y te guiaré paso a paso.';
  return "Hello! I'm Echo, your friendly navigator. Tell me what you need, slowly and clearly. I can open websites, guide you step by step, or look up information for you.";
}

export function navigatorReply(language = 'en'): string {
  if (language === 'hi' || language.startsWith('hi'))
    return 'बिलकुल, मैं आपको रास्ता बताऊंगा। पहले बताइए, आप अभी कहाँ हैं?';
  if (language === 'es')
    return 'Claro, te guiaré. Dime dónde estás ahora y a dónde quieres ir, una cosa a la vez.';
  return 'Of course, I will guide you. First tell me where you are right now, and where you want to reach. One step at a time.';
}

export function browserClarificationReply(site: string, language = 'en'): string {
  if (language === 'hi' || language.startsWith('hi')) return `जरूर। आप ${site} पर क्या देखना या सुनना चाहते हैं?`;
  return `Sure. What would you like to watch on ${site}? Please tell me the topic or title.`;
}

export function browserActionReply(site: string, query: string, language = 'en'): string {
  // Format clean brand title for speech
  const cleanTitle = site
    .split(' ')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');

  if (query) {
    if (language === 'hi' || language.startsWith('hi')) return `${cleanTitle} पर "${query}" खोज रहा हूँ।`;
    return `Opening ${cleanTitle} for "${query}" in a new tab.`;
  }
  if (language === 'hi' || language.startsWith('hi')) return `${cleanTitle} खोल रहा हूँ।`;
  return `Opening ${cleanTitle} in a new browser tab.`;
}
