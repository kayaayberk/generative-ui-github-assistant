'use client'

import { SidebarSimple } from '@phosphor-icons/react'
import Sidebar from './Sidebar'
import { Button } from './ui/button'
import { Sheet, SheetContent, SheetTrigger } from './ui/sheet'
import { useTheme } from 'next-themes'
import { useSidebar } from '@/lib/hooks/use-sidebar'

interface SidebarMobileProps {
  children: React.ReactNode
}

function SidebarMobile({ children }: SidebarMobileProps) {
  const { theme } = useTheme()
  const { isSidebarOpen, isLoading, toggleSidebar } = useSidebar()
  return (
    <Sheet>
      <SheetTrigger className={`ml-1 mt-1 top-0 left-0 absolute z-30`}>
        <Button
          size='icon'
          className={`p-0 flex lg:hidden hover:bg-transparent bg-transparent shadow-none focus:bg-transparent focus:ring-0 focus-within:ring-0`}
        >
          <SidebarSimple
            color={theme === 'dark' ? 'white' : 'black'}
            size={16}
          />
        </Button>
      </SheetTrigger>
      <SheetContent
        side='left'
        className='inset-y-0 flex h-auto w-[270px] flex-col p-0'
      >
        <Sidebar className='flex'>{children}</Sidebar>
      </SheetContent>
    </Sheet>
  )
}

export default SidebarMobile
