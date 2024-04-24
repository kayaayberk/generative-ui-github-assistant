import { Metadata, Viewport } from 'next'
import { ChatHistory } from '@/components/ChatHistory'
import SidebarMobile from '@/components/SidebarMobile'
import SidebarToggle from '@/components/SidebarToggle'
import SidebarDesktop from '@/components/SidebarDesktop'

interface ChatLayoutProps {
  children: React.ReactNode
}

const title = 'GitHub Assistant'
const description =
  'An experimental chatbot app that provides easier GitHub search through generative UI elements.'

export const metadata: Metadata = {
  metadataBase: new URL('https://githubassistant.vercel.app/'),
  title,
  description,
  openGraph: {
    title,
    description,
  },
  twitter: {
    title,
    description,
    card: 'summary_large_image',
    creator: '@kayaayberkk',
  },
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
