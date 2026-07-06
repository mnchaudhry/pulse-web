// Category palette — descriptive, never a verdict (no category rendered as "bad").
// Hand-synced with the design system and pulse-extension.
export const CATEGORY_COLORS = {
  Dev: '#0E7C86',
  Work: '#3B6FB0',
  Social: '#8A5CB0',
  News: '#B0762E',
  Entertainment: '#BA1A1A',
  Reference: '#5B6B87',
  Shopping: '#4E8A5B',
  Browser: '#64748B',
  Uncategorized: '#98A2B3',
} as const

export type Category = keyof typeof CATEGORY_COLORS

export const categoryColor = (category: Category) => CATEGORY_COLORS[category]
