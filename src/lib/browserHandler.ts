// Voice-controlled browser navigation helper
// Handles opening tabs, searching, playing - with safety checks

export function getYouTubeSearchUrl(query: string): string {
  return `https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`;
}

export function getGoogleSearchUrl(query: string): string {
  return `https://www.google.com/search?q=${encodeURIComponent(query)}`;
}

export function getSiteUrl(site: string, query?: string): string {
  const s = site.toLowerCase().trim();
  // Normalize site names
  const siteMap: Record<string, string> = {
    youtube: 'https://www.youtube.com',
    google: 'https://www.google.com',
    wikipedia: 'https://en.wikipedia.org',
    github: 'https://github.com',
    notion: 'https://www.notion.so',
    maps: 'https://www.google.com/maps',
    gmail: 'https://mail.google.com',
    twitter: 'https://twitter.com',
    x: 'https://x.com',
    instagram: 'https://www.instagram.com',
    facebook: 'https://www.facebook.com',
    netflix: 'https://www.netflix.com',
    spotify: 'https://open.spotify.com',
  };
  if (query && s === 'youtube') return getYouTubeSearchUrl(query);
  if (query && s === 'google') return getGoogleSearchUrl(query);
  if (s in siteMap) {
    if (query) return siteMap[s] + '/search?q=' + encodeURIComponent(query);
    return siteMap[s];
  }
  // If site looks like URL, use as is
  if (s.startsWith('http://') || s.startsWith('https://')) return s;
  if (s.includes('.')) return 'https://' + s;
  return 'https://www.google.com/search?q=' + encodeURIComponent(site + (query ? ' ' + query : ''));
}

export function openBrowserTab(url: string, site: string): boolean {
  try {
    // Safety: only allow http/https
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      console.warn('Blocked non-http URL:', url);
      return false;
    }
    const win = window.open(url, '_blank', 'noopener,noreferrer');
    return !!win;
  } catch (e) {
    console.error('Failed to open tab:', e);
    return false;
  }
}

export function isSafeToOpen(site: string): boolean {
  // Block potentially dangerous sites - for now allow all http/https
  const blocked = ['localhost', '127.0.0.1', 'file://'];
  return !blocked.some(b => site.includes(b));
}
