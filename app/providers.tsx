'use client'

import { SidebarProvider } from '@/lib/hooks/use-sidebar'
import { ThemeProvider } from 'next-themes'
import { ThemeProviderProps } from 'next-themes/dist/types'

export function Providers({ children, ...props }: ThemeProviderProps) {
  return (
    <ThemeProvider {...props}>
      <SidebarProvider>{children}</SidebarProvider>
    </ThemeProvider>
  )
}
