'use client'

import {
  useUser,
  SignedIn,
  SignedOut,
  SignInButton,
  SignOutButton,
} from '@clerk/nextjs'
import {
  DropdownMenu,
  DropdownMenuLabel,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuRadioGroup,
} from '@/components/ui/dropdown-menu'
import React from 'react'
import Image from 'next/image'
import { Button } from './ui/button'
import { Skeleton } from './ui/skeleton'
import { useRouter } from 'next/navigation'
import LoadingSpinner from './LoadingSpinner'
import { Gear, SignOut, User } from '@phosphor-icons/react'
import { DropdownMenuItem } from '@radix-ui/react-dropdown-menu'

function UserBadge() {
  const [position, setPosition] = React.useState('bottom')
  const { isLoaded, user } = useUser()
  const router = useRouter()

  return (
    <>
      <SignedOut>
        <SignInButton afterSignInUrl={'/chat'} />
      </SignedOut>
      <DropdownMenu>
        <SignedIn>
          <DropdownMenuTrigger asChild>
            <Button
              variant='outline'
              className='flex justify-start p-2 h-auto shadow-lg'
            >
              <div className='flex items-start gap-2 w-full'>
                {isLoaded ? (
                  <>
                    <div className='rounded-full size-9 overflow-hidden'>
                      {user ? (
                        <Image
                          src={user.imageUrl ?? ''}
                          alt='user'
                          width={50}
                          height={50}
                        />
                      ) : (
                        <LoadingSpinner />
                      )}
                    </div>
                    <div className='flex flex-col'>
                      <div className='flex items-center gap-1'>
                        <span className='text-sm font-semibold whitespace-nowrap'>
                          {user?.firstName}
                        </span>
                        <span className='text-sm font-semibold whitespace-nowrap'>
                          {user?.lastName}
                        </span>
                      </div>
                      <span className='text-xs font-light whitespace-nowrap'>
                        {user?.emailAddresses[0].emailAddress}
                      </span>
                    </div>
                  </>
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
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent className='w-56'>
            <DropdownMenuLabel>
              <div className='flex items-center justify-between w-full'>
                <div className='rounded-full size-9 overflow-hidden'>
                  {user ? (
                    <Image
                      src={user.imageUrl ?? ''}
                      alt='user'
                      width={50}
                      height={50}
                    />
                  ) : (
                    <LoadingSpinner />
                  )}
                </div>
                <div className='flex flex-col'>
                  <div className='flex items-center gap-1'>
                    <span className='text-sm font-semibold whitespace-nowrap'>
                      {user?.firstName}
                    </span>
                    <span className='text-sm font-semibold whitespace-nowrap'>
                      {user?.lastName}
                    </span>
                  </div>
                  <span className='text-xs font-light whitespace-nowrap'>
                    {user?.emailAddresses[0].emailAddress}
                  </span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuRadioGroup
              value={position}
              onValueChange={setPosition}
              className='flex flex-col gap-1 w-full m-0'
            >
              <DropdownMenuItem className='flex pointer-events-none opacity-50 items-center gap-1 text-sm dark:hover:bg-muted hover:bg-muted py-1 rounded-md px-2 focus:outline-none cursor-pointer'>
                <span>
                  <Gear />
                </span>
                <span className='flex items-center justify-between w-full'>
                  <span>Usage</span>
                  <span className='text-xs'>In progress...</span>
                </span>
              </DropdownMenuItem>
              <DropdownMenuItem className='flex pointer-events-none opacity-50 items-center gap-1 text-sm dark:hover:bg-muted hover:bg-muted py-1 rounded-md px-2 focus:outline-none cursor-pointer'>
                <span>
                  <User />
                </span>
                <span className='flex items-center justify-between w-full'>
                  <span>Profile</span>
                  <span className='text-xs'>In progress...</span>
                </span>
              </DropdownMenuItem>
              <SignOutButton signOutCallback={async () => router.push('/')}>
                <DropdownMenuItem className='flex items-center gap-1 text-sm dark:hover:bg-muted py-1 rounded-md px-2 hover:bg-muted focus:outline-none cursor-pointer'>
                  <span>
                    <SignOut />
                  </span>
                  <span>Sign Out</span>
                </DropdownMenuItem>
              </SignOutButton>
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </SignedIn>
      </DropdownMenu>
    </>
  )
}

export default UserBadge
