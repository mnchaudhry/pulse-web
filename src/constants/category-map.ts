// Static domain→category table — shared source of truth, HAND-KEPT IDENTICAL
// with pulse-extension/src/constants/category-map.ts (tech-stack §5).
// Keys are bare hostnames (no www). Unknown domains resolve to "Uncategorized"
// (US-16/17). User overrides always win over this map (US-34).
export const categoryMap: Record<string, string> = {
  // Dev
  'github.com': 'Dev',
  'gitlab.com': 'Dev',
  'bitbucket.org': 'Dev',
  'stackoverflow.com': 'Dev',
  'stackexchange.com': 'Dev',
  'localhost': 'Dev',
  'vercel.com': 'Dev',
  'npmjs.com': 'Dev',
  'codepen.io': 'Dev',
  'codesandbox.io': 'Dev',
  'replit.com': 'Dev',
  'developer.mozilla.org': 'Dev',
  'supabase.com': 'Dev',

  // Work
  'figma.com': 'Work',
  'notion.so': 'Work',
  'slack.com': 'Work',
  'linear.app': 'Work',
  'atlassian.net': 'Work',
  'jira.com': 'Work',
  'trello.com': 'Work',
  'asana.com': 'Work',
  'mail.google.com': 'Work',
  'calendar.google.com': 'Work',
  'docs.google.com': 'Work',
  'drive.google.com': 'Work',
  'zoom.us': 'Work',
  'meet.google.com': 'Work',

  // Social
  'x.com': 'Social',
  'twitter.com': 'Social',
  'facebook.com': 'Social',
  'instagram.com': 'Social',
  'linkedin.com': 'Social',
  'reddit.com': 'Social',
  'threads.net': 'Social',
  'bsky.app': 'Social',
  'discord.com': 'Social',
  'whatsapp.com': 'Social',

  // News
  'news.ycombinator.com': 'News',
  'nytimes.com': 'News',
  'theguardian.com': 'News',
  'bbc.com': 'News',
  'cnn.com': 'News',
  'techcrunch.com': 'News',
  'theverge.com': 'News',
  'arstechnica.com': 'News',

  // Entertainment
  'youtube.com': 'Entertainment',
  'netflix.com': 'Entertainment',
  'twitch.tv': 'Entertainment',
  'spotify.com': 'Entertainment',
  'hulu.com': 'Entertainment',
  'disneyplus.com': 'Entertainment',

  // Reference
  'wikipedia.org': 'Reference',
  'arxiv.org': 'Reference',
  'scholar.google.com': 'Reference',
  'medium.com': 'Reference',

  // Shopping
  'amazon.com': 'Shopping',
  'ebay.com': 'Shopping',
  'etsy.com': 'Shopping',
  'aliexpress.com': 'Shopping',
}
