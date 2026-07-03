import type { ReactNode } from 'react'
import { AppSidebar } from '@/components/app-sidebar'

const DashboardLayout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="flex min-h-screen w-full bg-surface">
      <AppSidebar />
      <main className="flex min-w-0 flex-1 flex-col">{children}</main>
    </div>
  )
}

export default DashboardLayout
