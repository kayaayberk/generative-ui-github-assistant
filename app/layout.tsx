import './globals.css'
import { Providers } from './providers'
import Sidebar from '@/components/Sidebar'

export const viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: 'white' },
    { media: '(prefers-color-scheme: dark)', color: 'black' },
  ],
}
interface RootLayoutProps {
  children: React.ReactNode
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang='en' suppressHydrationWarning>
      <body className='w-full h-screen overflow-hidden'>
        <Providers
          enableSystem
          attribute='class'
          defaultTheme='system'
          disableTransitionOnChange
        >
          <main className='w-full h-screen flex-1 lg:flex'>
            <Sidebar />
            {children}
          </main>
        </Providers>
      </body>
    </html>
  )
}
