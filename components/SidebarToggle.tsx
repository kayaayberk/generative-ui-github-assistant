'use client'

import { Button } from './ui/button'
import { useSidebar } from '@/lib/hooks/use-sidebar'
import { CaretLeft, CaretRight, SidebarSimple } from '@phosphor-icons/react'
import { useTheme } from 'next-themes'

type SidebarChildrenProps = {
  children: React.ReactNode
}

function SidebarToggle() {
  const { theme } = useTheme()
  const { isSidebarOpen, isLoading, toggleSidebar } = useSidebar()
  return (
    <Button
      size='icon'
      className={`${isSidebarOpen ? 'translate-x-[275px] transition-all duration-300' : 'transition-all duration-300'} absolute left-0 inset-y-1/2 hidden p-0 lg:flex z-50 hover:bg-transparent bg-transparent shadow-none`}
      onClick={() => toggleSidebar()}
    >
      <CaretLeft
        color={theme === 'dark' ? 'white' : 'black'}
        size={18}
        className={`${isSidebarOpen ? 'duration-300 transition-all' : 'rotate-180 duration-300 transition-all'}`}
      />
    </Button>
  )
}

export default SidebarToggle
