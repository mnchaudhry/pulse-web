'use client'

import { useSearchParams } from 'next/navigation'
import { useEffect, useRef } from 'react'
import 'driver.js/dist/driver.css'

const TOUR_KEY = 'pulse:toured'

const STEPS = [
  {
    el: '[data-tour="sidebar"]',
    title: 'Move around Pulse',
    description: 'Overview, Insights, the Bot, your Devices and Settings all live here.',
  },
  {
    el: '[data-tour="range"]',
    title: 'Pick a range',
    description: 'See Today, this Week, or this Month at a glance.',
  },
  {
    el: '[data-tour="scope"]',
    title: 'One device or all',
    description: 'Blend every device (Combined), or focus on just one.',
  },
  {
    el: '[data-tour="stats"]',
    title: 'Your day, measured',
    description: 'Active time, focus score, longest block, and your top category.',
  },
  {
    el: '[data-tour="nav-bot"]',
    title: 'Ask the Bot',
    description: 'Ask plain questions about your data — it answers with the real numbers behind them.',
  },
]

// Guided first-run tour (driver.js). Triggers on ?tour=1 (set after onboarding)
// or the first dashboard visit — but never while the onboarding modal is open.
export const ProductTour = () => {
  const params = useSearchParams()
  const started = useRef(false)

  useEffect(() => {
    if (started.current)
      return
    // Don't run behind the onboarding modal.
    if (params.get('connect') === '1')
      return
    const force = params.get('tour') === '1'
    if (!force && localStorage.getItem(TOUR_KEY))
      return

    started.current = true
    let cancelled = false

    const timer = setTimeout(async () => {
      if (cancelled)
        return
      const { driver } = await import('driver.js')
      const steps = STEPS
        .filter(step => document.querySelector(step.el))
        .map(step => ({ element: step.el, popover: { title: step.title, description: step.description } }))
      if (steps.length === 0) {
        started.current = false
        return
      }

      localStorage.setItem(TOUR_KEY, '1')
      driver({
        showProgress: true,
        popoverClass: 'pulse-tour',
        nextBtnText: 'Next',
        prevBtnText: 'Back',
        doneBtnText: 'Done',
        steps,
      }).drive()
    }, 700)

    return () => {
      cancelled = true
      clearTimeout(timer)
    }
  }, [params])

  return null
}
