'use client'

import { useState } from 'react'

export const useOnboardingDisclosure = () => {
  const [isConnecting, setIsConnecting] = useState(false)

  const confirm = () => {
    setIsConnecting(true)
    // TODO (US-67/US-02): chrome.runtime.sendMessage(EXTENSION_ID,
    // { type: 'AUTH_SUCCESS', session }) via externally_connectable, then
    // redirect to /overview
  }

  return { confirm, isConnecting }
}
