import Sidebar from '@/components/Sidebar'
import { Viewport } from 'next'

interface ChatLayoutProps {
  children: React.ReactNode
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  minimumScale: 1,
  maximumScale: 1,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: 'white' },
    { media: '(prefers-color-scheme: dark)', color: 'black' },
  ],
}

export default async function ChatLayout({ children }: ChatLayoutProps) {
  return (
    <div className='w-full flex h-screen'>
      <Sidebar />
      {children}
    </div>
  )
}
