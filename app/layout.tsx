import './globals.css'
import { Viewport } from 'next'
import { Providers } from './providers'
import Navigation from '@/components/Navigation'
import { Toaster } from '@/components/ui/toaster'
import { ClerkProvider, auth } from '@clerk/nextjs'
import { checkRateLimit } from '@/lib/chat/github/github'
interface RootLayoutProps {
  children: React.ReactNode
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  minimumScale: 1,
  maximumScale: 1,
}

const fetchedData = async () => {
  const rateLimitRemaining = await checkRateLimit()
  return rateLimitRemaining
}

export default async function RootLayout({ children }: RootLayoutProps) {
  const rateLimitRemaining = await fetchedData()
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
              <header className='fixed top-0 right-0 z-10 p-4 flex justify-between w-full items-center'>
                <p className='text-xs font-medium'>
                  <span>Rate limit remaining: </span>
                  <span>{rateLimitRemaining}</span>
                </p>
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
