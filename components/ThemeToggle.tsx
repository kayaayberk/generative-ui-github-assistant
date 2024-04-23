'use client'

import * as React from 'react'
import { Button } from './ui/button'
import { useTheme } from 'next-themes'
import { Moon, Sun } from '@phosphor-icons/react'

function ThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme()
  return (
    <Button
      variant='outline'
      className='px-2'
      onClick={() => {
        setTheme(resolvedTheme === 'light' ? 'dark' : 'light')
      }}
    >
      {resolvedTheme === 'dark' ? (
        <span className='flex items-center justify-between gap-2 w-full'>
          Theme
          <Moon size={18} />
        </span>
      ) : (
        <span className='flex items-center justify-between gap-2 w-full'>
          Theme
          <Sun size={18} />
        </span>
      )}
    </Button>
  )
}

export default ThemeToggle
