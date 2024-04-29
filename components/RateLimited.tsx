'use client'

import { Warning } from '@phosphor-icons/react'
import Link from 'next/link'

function RateLimited() {
  return (
    <div className='w-full rounded-md border p-4'>
      <h1 className='flex items-center text-3xl text-orange-400 font-semibold'>
        Too many actions... <Warning />
      </h1>
      <p className='font-light text-muted-foreground'>
        Your IP address has been rate-limted by{' '}
        <span className='font-semibold'>GitHub</span>. Please{' '}
        <Link
          href='/sign-in'
          className='border border-orange-400 hover:border-transparent rounded-md p-2 font-semibold text-sm text-white bg-zinc-800 hover:bg-zinc-600'
        >
          Sign-in
        </Link>{' '}
        to continue or come back later.
      </p>
    </div>
  )
}

export default RateLimited
