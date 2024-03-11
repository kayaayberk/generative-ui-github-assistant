'use client'

import * as React from 'react'
import { Button } from './ui/button'
import { useTheme } from 'next-themes'
import { Moon, Sun } from '@phosphor-icons/react'

function ThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme()
  return (
    <Button
      variant='ghost'
      size='icon'
      onClick={() => {
        setTheme(resolvedTheme === 'light' ? 'dark' : 'light')
      }}
    >
      {resolvedTheme === 'dark' ? <Moon size={18} /> : <Sun size={18} />}
    </Button>
  )
}

export default ThemeToggle
