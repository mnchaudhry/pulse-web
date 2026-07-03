import { create } from 'zustand'

// TODO: chat panel open/closed, draft input
interface BotPanelState {
  isOpen: boolean
  setIsOpen: (isOpen: boolean) => void
}

export const useBotPanelStore = create<BotPanelState>(set => ({
  isOpen: false,
  setIsOpen: isOpen => set({ isOpen }),
}))
