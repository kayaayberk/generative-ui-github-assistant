'use client'

import { Button } from './ui/button'
import { useTheme } from 'next-themes'
import { CaretLeft } from '@phosphor-icons/react'
import { useSidebar } from '@/lib/hooks/use-sidebar'

function SidebarToggle() {
  const { theme } = useTheme()
  const { isSidebarOpen, toggleSidebar } = useSidebar()
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
