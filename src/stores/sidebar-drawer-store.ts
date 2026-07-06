import { create } from 'zustand'

// P2.2: off-canvas sidebar state below the `lg` breakpoint — the hamburger in
// AppTopBar and the drawer in AppSidebar are siblings, so this is the only
// way for one to toggle the other without prop drilling through layout.tsx.
interface SidebarDrawerState {
  open: boolean
  toggle: () => void
  close: () => void
}

export const useSidebarDrawerStore = create<SidebarDrawerState>(set => ({
  open: false,
  toggle: () => set(s => ({ open: !s.open })),
  close: () => set({ open: false }),
}))
