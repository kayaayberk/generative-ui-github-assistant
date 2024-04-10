'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Button } from '../ui/button'
import { GithubUser } from '@/lib/types'
import { BookBookmark, MapPin, Users } from '@phosphor-icons/react'
import { useActions, useUIState } from 'ai/rsc'
import { AI } from '@/lib/chat/actions'
import { nanoid } from 'nanoid'
import { UserMessage } from './Message'

export function Profile({ props: username }: { props: GithubUser }) {
  const [messages, setMessages] = useUIState<typeof AI>()
  const { submitUserMessage } = useActions()
  return (
    <div className='w-full border p-3 rounded-md'>
      <div className='flex justify-between'>
        <div className='flex items-start gap-3'>
          <div className='p-0.5'>
            <div className='rounded-full size-[45px] overflow-hidden'>
              <Image
                src={username.avatar_url}
                alt='User Image'
                width={100}
                height={100}
              />
            </div>
          </div>
          <div className='flex flex-col gap-1'>
            <div className='flex items-center gap-1'>
              <Link
                target='_blank'
                href={username?.html_url ?? ''}
                className='font-semibold leading-none text-blue-600 hover:underline '
              >
                {username.name}
              </Link>
              <span className='text-sm font-light text-neutral-500'>
                {username.login}
              </span>
            </div>
            <span className='text-sm'>
              {username.bio ? username.bio : '(No bio found)'}
            </span>

            <div className='flex items-center gap-1'>
              <span className='flex items-center gap-1 text-sm font-light text-neutral-500'>
                {/* <span>
                <MapPin size={15} />
              </span> */}
                {username.location}
              </span>
              •
              <span className='flex items-center gap-1 text-sm text-neutral-500'>
                <span>
                  <BookBookmark size={15} />
                </span>
                {username.public_repos}
              </span>
              •
              <span className='flex items-center gap-1 text-sm text-neutral-500'>
                <span>
                  <Users size={17} />
                </span>
                {username.followers}
              </span>
            </div>
          </div>
        </div>
        <Button
          variant='outline'
          className='text-xs'
          size={'sm'}
          onClick={async () => {
            const response = await submitUserMessage(
              `View ${username.login}'s repositories`,
            )
            setMessages((currentMessages) => [...currentMessages, response])
            console.log(response)
            console.log(username.login)
          }}
        >
          Show Repositories
        </Button>
      </div>
    </div>
  )
}
