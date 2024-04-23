import './globals.css'
import Link from 'next/link'
import { Viewport } from 'next'
import { Providers } from './providers'
import { ClerkProvider, auth } from '@clerk/nextjs'
import { Toaster } from '@/components/ui/toaster'
import { SignIn } from '@phosphor-icons/react/dist/ssr'
import Navigation from '@/components/Navigation'
interface RootLayoutProps {
  children: React.ReactNode
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  minimumScale: 1,
  maximumScale: 1,
}

export default function RootLayout({ children }: RootLayoutProps) {
  const { userId } = auth()
  return (
    <ClerkProvider>
      <html lang='en' suppressHydrationWarning>
        <body className='w-full h-screen overflow-hidden'>
          <Providers
            enableSystem
            attribute='class'
            defaultTheme='dark'
            disableTransitionOnChange
          >
            {!userId && (
              <header className='fixed top-0 right-0 z-10 p-4 flex justify-end'>
                <Navigation />
              </header>
            )}
            {children}
            <Toaster />
          </Providers>
        </body>
      </html>
    </ClerkProvider>
  )
}
