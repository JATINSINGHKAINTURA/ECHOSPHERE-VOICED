// Voice-controlled browser navigation helper
export function getYouTubeSearchUrl(query: string): string {
  return `https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`;
}

export function getGoogleSearchUrl(query: string): string {
  return `https://www.google.com/search?q=${encodeURIComponent(query)}`;
}

export function getSiteUrl(site: string, query?: string): string {
  const s = site.toLowerCase().trim();
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
    facebook: 'https://facebook.com',
    netflix: 'https://www.netflix.com',
    spotify: 'https://open.spotify.com',
  };
  if (query && s === 'youtube') return getYouTubeSearchUrl(query);
  if (query && s === 'google') return getGoogleSearchUrl(query);
  if (s in siteMap) {
    if (query) return siteMap[s] + '/search?q=' + encodeURIComponent(query);
    return siteMap[s];
  }
  if (s.startsWith('http://') || s.startsWith('https://')) return s;
  if (s.includes('.')) return 'https://' + s;
  return 'https://www.google.com/search?q=' + encodeURIComponent(site + (query ? ' ' + query : ''));
}
