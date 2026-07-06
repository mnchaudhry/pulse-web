import type { ChatMessageData } from './components/chat-message'

const STORAGE_KEY_PREFIX = 'pulse:bot-chat'

const storageKey = (deviceId: string) => `${STORAGE_KEY_PREFIX}:${deviceId}`

export interface PersistedBotChat {
  messages: ChatMessageData[]
  draft: string
}

// P3.5: sessionStorage keyed per device scope, so switching scope starts a
// fresh thread instead of showing another scope's answers under a new label.
export const loadBotChat = (deviceId: string): PersistedBotChat | null => {
  try {
    const raw = sessionStorage.getItem(storageKey(deviceId))
    return raw ? JSON.parse(raw) as PersistedBotChat : null
  }
  catch {
    return null
  }
}

export const saveBotChat = (deviceId: string, data: PersistedBotChat) => {
  try {
    sessionStorage.setItem(storageKey(deviceId), JSON.stringify(data))
  }
  catch {
    // sessionStorage unavailable (private mode, quota) — chat just won't persist.
  }
}

export const clearBotChatStorage = () => {
  for (let i = sessionStorage.length - 1; i >= 0; i--) {
    const key = sessionStorage.key(i)
    if (key?.startsWith(STORAGE_KEY_PREFIX))
      sessionStorage.removeItem(key)
  }
}
