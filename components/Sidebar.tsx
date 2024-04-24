'use client'

import { cn } from '@/lib/utils'
import { useSidebar } from '@/lib/hooks/use-sidebar'

export interface SidebarProps extends React.ComponentProps<'div'> {}

function Sidebar({ className, children }: SidebarProps) {
  const { isSidebarOpen, isLoading } = useSidebar()
  return (
    <div
      data-state={isSidebarOpen && !isLoading ? 'open' : 'closed'}
      className={cn(className, 'h-full flex-col w-full dark:bg-zinc-950')}
    >
      {children}
    </div>
  )
}

export default Sidebar
