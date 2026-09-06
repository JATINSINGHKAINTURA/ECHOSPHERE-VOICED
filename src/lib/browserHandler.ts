// Voice-controlled browser navigation helper
// Handles opening tabs, searching, playing - with intelligent site resolution

export function getYouTubeSearchUrl(query: string): string {
  return `https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`;
}

export function getGoogleSearchUrl(query: string): string {
  return `https://www.google.com/search?q=${encodeURIComponent(query)}`;
}

const KNOWN_SITE_MAP: Record<string, string> = {
  // Messaging & Social
  whatsapp: 'https://web.whatsapp.com',
  'whatsapp web': 'https://web.whatsapp.com',
  'wa web': 'https://web.whatsapp.com',
  telegram: 'https://web.telegram.org',
  twitter: 'https://x.com',
  x: 'https://x.com',
  instagram: 'https://www.instagram.com',
  facebook: 'https://www.facebook.com',
  fb: 'https://www.facebook.com',
  linkedin: 'https://www.linkedin.com',
  reddit: 'https://www.reddit.com',
  discord: 'https://discord.com',
  threads: 'https://www.threads.net',
  pinterest: 'https://www.pinterest.com',

  // Google & Productivity
  gmail: 'https://mail.google.com',
  'google mail': 'https://mail.google.com',
  mail: 'https://mail.google.com',
  google: 'https://www.google.com',
  maps: 'https://maps.google.com',
  'google maps': 'https://maps.google.com',
  drive: 'https://drive.google.com',
  'google drive': 'https://drive.google.com',
  calendar: 'https://calendar.google.com',
  'google calendar': 'https://calendar.google.com',
  translate: 'https://translate.google.com',
  'google translate': 'https://translate.google.com',
  docs: 'https://docs.google.com',
  'google docs': 'https://docs.google.com',
  sheets: 'https://sheets.google.com',
  'google sheets': 'https://sheets.google.com',
  meet: 'https://meet.google.com',
  'google meet': 'https://meet.google.com',
  notion: 'https://www.notion.so',
  github: 'https://github.com',
  gitlab: 'https://gitlab.com',

  // Media & Video & Music
  youtube: 'https://www.youtube.com',
  yt: 'https://www.youtube.com',
  netflix: 'https://www.netflix.com',
  spotify: 'https://open.spotify.com',
  hotstar: 'https://www.hotstar.com',
  'disney hotstar': 'https://www.hotstar.com',
  'prime video': 'https://www.primevideo.com',
  'amazon prime': 'https://www.primevideo.com',
  jiocinema: 'https://www.jiocinema.com',
  twitch: 'https://www.twitch.tv',
  soundcloud: 'https://soundcloud.com',

  // News & Information (Hindi / Indian / Global)
  'dainik jagran': 'https://www.jagran.com',
  jagran: 'https://www.jagran.com',
  'aaj tak': 'https://www.aajtak.in',
  aajtak: 'https://www.aajtak.in',
  ndtv: 'https://www.ndtv.com',
  'times of india': 'https://timesofindia.indiatimes.com',
  toi: 'https://timesofindia.indiatimes.com',
  'hindustan times': 'https://www.hindustantimes.com',
  hindustan: 'https://www.livehindustan.com',
  'live hindustan': 'https://www.livehindustan.com',
  'amar ujala': 'https://www.amarujala.com',
  amarujala: 'https://www.amarujala.com',
  'navbharat times': 'https://navbharattimes.indiatimes.com',
  bbc: 'https://www.bbc.com',
  'bbc hindi': 'https://www.bbc.com/hindi',
  'the hindu': 'https://www.thehindu.com',
  cricbuzz: 'https://www.cricbuzz.com',
  espncricinfo: 'https://www.espncricinfo.com',
  wikipedia: 'https://en.wikipedia.org',
  wiki: 'https://en.wikipedia.org',

  // Shopping & Services
  amazon: 'https://www.amazon.in',
  flipkart: 'https://www.flipkart.com',
  myntra: 'https://www.myntra.com',
  swiggy: 'https://www.swiggy.com',
  zomato: 'https://www.zomato.com',
  paytm: 'https://paytm.com',
  irctc: 'https://www.irctc.co.in',
  makemytrip: 'https://www.makemytrip.com',
  bookmyshow: 'https://in.bookmyshow.com',
  weather: 'https://weather.com',
  accuweather: 'https://www.accuweather.com',

  // AI & Tools
  chatgpt: 'https://chatgpt.com',
  openai: 'https://chatgpt.com',
  claude: 'https://claude.ai',
  gemini: 'https://gemini.google.com',
  canva: 'https://www.canva.com',
  medium: 'https://medium.com',
  substack: 'https://substack.com',
  quora: 'https://www.quora.com',
  stackoverflow: 'https://stackoverflow.com',
};

export function getSiteUrl(site: string, query?: string): string {
  const s = site.toLowerCase().trim();

  if (query && (s === 'youtube' || s === 'yt')) return getYouTubeSearchUrl(query);
  if (query && (s === 'google' || s === 'search')) return getGoogleSearchUrl(query);

  if (s in KNOWN_SITE_MAP) {
    const base = KNOWN_SITE_MAP[s];
    if (query) {
      if (s === 'wikipedia' || s === 'wiki') return `https://en.wikipedia.org/wiki/Special:Search?search=${encodeURIComponent(query)}`;
      if (s === 'amazon') return `https://www.amazon.in/s?k=${encodeURIComponent(query)}`;
      if (s === 'flipkart') return `https://www.flipkart.com/search?q=${encodeURIComponent(query)}`;
      if (s === 'cricbuzz') return `https://www.cricbuzz.com/search?q=${encodeURIComponent(query)}`;
      return `${base}/search?q=${encodeURIComponent(query)}`;
    }
    return base;
  }

  // If site contains standard protocol
  if (s.startsWith('http://') || s.startsWith('https://')) return s;

  // If site looks like a domain name (e.g., example.org, nytimes.com, jagran.com)
  if (/^[a-z0-9-]+(\.[a-z0-9-]+)+/i.test(s)) {
    return 'https://' + s;
  }

  // Intelligent fallback: standard brand name (e.g., "coursera" -> "https://www.coursera.org" or search)
  const cleanName = s.replace(/[^a-z0-9]/g, '');
  if (cleanName && cleanName.length >= 2 && !query) {
    return `https://www.${cleanName}.com`;
  }

  return getGoogleSearchUrl(site + (query ? ' ' + query : ''));
}

export function openBrowserTab(url: string, siteName?: string): boolean {
  try {
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      console.warn('Blocked non-http URL:', url);
      return false;
    }
    // Standard legitimate browser navigation to target website
    const win = window.open(url, '_blank', 'noopener,noreferrer');
    return !!win;
  } catch (e) {
    console.error('Failed to open browser tab:', e);
    return false;
  }
}

export function isSafeToOpen(site: string): boolean {
  const blocked = ['localhost', '127.0.0.1', 'file://', 'javascript:'];
  return !blocked.some((b) => site.toLowerCase().includes(b));
}
