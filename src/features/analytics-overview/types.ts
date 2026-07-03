export interface CategorySlice {
  name: string
  color: string
  dur: string
  pct: number
}

export interface DomainSlice {
  name: string
  cat: string
  color: string
  dur: string
  pct: number
}

export interface FocusBlock {
  label: string
  range: string
  dur: string
  color: string
}

export interface TrendData {
  week: number[]
  prev: number[]
  max: number
  days: string[]
}

export interface StatCard {
  label: string
  value: string
  delta: string
  tint: string
}

export interface OverviewData {
  totalActive: string
  hasData: boolean
  categories: CategorySlice[]
  topDomains: DomainSlice[]
  focusScore: number
  focusAverage: number
  longestBlocks: FocusBlock[]
  trend: TrendData
  stats: StatCard[]
}
