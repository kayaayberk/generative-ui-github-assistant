'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Skeleton } from './ui/skeleton'
import LoadingSpinner from './LoadingSpinner'
import { useKindeBrowserClient } from '@kinde-oss/kinde-auth-nextjs'

function UserBadge() {
  const { user } = useKindeBrowserClient()
  return (
    <div className='flex items-center justify-between'>
      {user ? (
        <Link
          href='/profile'
          className='flex items-center gap-2 p-2 rounded-md dark:hover:bg-muted hover:bg-muted w-full'
        >
          <div className='rounded-full size-9 overflow-hidden'>
            {user?.picture ? (
              <Image
                src={user?.picture ?? ''}
                alt='user'
                width={50}
                height={50}
              />
            ) : (
              <LoadingSpinner />
            )}
          </div>
          <div className='flex flex-col'>
            <span className='text-sm font-semibold whitespace-nowrap'>
              {user?.given_name + ' ' + user?.family_name}
            </span>
            <span className='text-xs font-light whitespace-nowrap'>
              {user?.email}
            </span>
          </div>
        </Link>
      ) : (
        <div className='flex items-center p-2 gap-2'>
          <Skeleton className='size-9 rounded-full' />
          <div className='space-y-2'>
            <Skeleton className='h-2 w-[100px]' />
            <Skeleton className='h-2 w-[150px]' />
          </div>
        </div>
      )}
    </div>
  )
}

export default UserBadge
