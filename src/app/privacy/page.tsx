import type { Metadata } from 'next'
import { Logo } from '@/components/logo'

export const metadata: Metadata = {
  title: 'Privacy policy — Pulse',
}

const SECTIONS = [
  {
    heading: 'What Pulse is',
    body: 'Pulse is a private, personal browsing-analytics tool. It shows you where your attention went across the day. It is not a monitoring or productivity-scoring product, and there is no manager, team, or admin view.',
  },
  {
    heading: 'What is collected',
    body: 'For each tab you actively use in the foreground of a focused Chrome window, Pulse records the domain, page title, referrer domain, start and end timestamps, and the number of seconds the tab was genuinely focused — including New Tab and browser pages like Settings and Extensions (chrome://…), not just third-party websites. Time is never inferred from mouse/keyboard idle: a static cursor on a long video still counts while that tab stays focused. Each record is tagged with the device/profile it came from.',
  },
  {
    heading: 'What is never collected',
    body: 'Pulse never captures page content, the text of articles, form inputs, or screenshots. It requests no host permissions and injects no code into the pages you visit — all timing comes from browser tab, window, and idle events alone. Background tabs are never counted, even if playing audio.',
  },
  {
    heading: 'Exclude-list, pause and Incognito',
    body: 'You can exclude any domain; excluded activity is dropped on-device before it is ever buffered or synced. Excluding a domain also excludes all of its subdomains — excluding chase.com also excludes secure.chase.com. A one-click pause stops all capture instantly. Incognito windows are excluded by default and require no configuration.',
  },
  {
    heading: 'Personal use only',
    body: 'A Pulse account is for one person. Don’t share login credentials across people — Combined analytics, insights, and the bot all assume a single individual using the account, and results will be misleading if more than one person browses under the same account at once.',
  },
  {
    heading: 'Where your data lives',
    body: 'Activity is stored in your own account on Supabase (Postgres) and is isolated by row-level security. The bot uses Google Gemini as a processor over aggregated figures only. Neither is permitted to sell or share your data.',
  },
  {
    heading: 'Retention, export and deletion',
    body: 'Raw events are kept about 90 days, then reduced to aggregates. You can export everything as JSON or CSV at any time, and deleting your account permanently removes every device, event, aggregate and insight tied to it.',
  },
]

// US-68: public, no auth required — linked from the Chrome Web Store listing.
const PrivacyPage = () => {
  return (
    <div className="min-h-screen bg-surface">
      <div className="mx-auto max-w-[720px] px-[34px] pb-20 pt-12">
        <div className="mb-9">
          <Logo size={30} />
        </div>
        <h1 className="mb-2 text-[30px] font-semibold tracking-[-.5px]">Privacy policy</h1>
        <p className="mono mb-10 text-[13px] text-ink-3">Last updated July 6, 2026 · public, no login required</p>
        {SECTIONS.map(section => (
          <div key={section.heading} className="mb-8">
            <h2 className="mb-2.5 text-base font-semibold text-ink">{section.heading}</h2>
            <p className="text-sm leading-[1.7] text-ink-2">{section.body}</p>
          </div>
        ))}
        <div className="mt-2 grid grid-cols-1 gap-3.5 sm:grid-cols-2">
          <div className="rounded-xl border border-[#cfe6d5] bg-[#eaf3ec] p-[18px]">
            <div className="mb-2.5 text-xs font-semibold uppercase tracking-[.05em] text-good">Collected</div>
            <div className="text-[13px] leading-[1.7] text-ink-2">Domain · page title · referrer domain · timestamps · active seconds</div>
          </div>
          <div className="rounded-xl border border-danger-edge bg-danger-bg p-[18px]">
            <div className="mb-2.5 text-xs font-semibold uppercase tracking-[.05em] text-danger">Never collected</div>
            <div className="text-[13px] leading-[1.7] text-ink-2">Page content · screenshots · form data · anything in Incognito</div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PrivacyPage
