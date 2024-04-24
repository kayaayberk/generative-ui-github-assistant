import { Viewport } from 'next'
import { ChatHistory } from '@/components/ChatHistory'
import SidebarMobile from '@/components/SidebarMobile'
import SidebarToggle from '@/components/SidebarToggle'
import SidebarDesktop from '@/components/SidebarDesktop'

interface ChatLayoutProps {
  children: React.ReactNode
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  minimumScale: 1,
  maximumScale: 1,
}

export default async function ChatLayout({ children }: ChatLayoutProps) {
  return (
    <div className='w-full flex h-screen'>
      <SidebarMobile>
        <ChatHistory />
      </SidebarMobile>
      <SidebarToggle />
      <SidebarDesktop />
      {children}
    </div>
  )
}
