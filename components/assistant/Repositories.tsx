'use client'

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
import Link from 'next/link'
import Image from 'next/image'
import { Badge } from '../ui/badge'
import { Button } from '../ui/button'
import License from '../icons/License'
import { AI } from '@/lib/chat/actions'
import { RepoProps } from '@/lib/types'
import { COLOURS } from '@/lib/constants'
import { Sparkle, Star } from '@phosphor-icons/react'
import { useActions, useUIState } from 'ai/rsc'

function Repositories({ props: repos }: { props: RepoProps[] }) {
  const { readmeAction, dirAction } = useActions()
  const [action, setAction] = React.useState('')
  const [messages, setMessages] = useUIState<typeof AI>()
  const [selectedValue, setSelectedValue] = React.useState<string | null>(null)

  function findColour(language: string): string {
    const entry = Object.entries(COLOURS).find(([key]) => key === language)
    if (entry) {
      if (entry[0] !== undefined && entry[0] !== '' && entry[0] === language) {
        return entry[1].color
      }
      return '#000000'
    }
    return '#000000'
  }

  const RepoActions = [
    {
      name: 'Show Readme',
      value: 'show-readme',
      function: async (repo: string, owner: string) => {
        const response = await readmeAction(repo, owner)
        setMessages((currentMessages) => [
          ...currentMessages,
          response.newMessage,
        ])
      },
    },
    {
      name: 'Show Directory',
      value: 'show-directory',
      function: async (repo: string, owner: string) => {
        const response = await dirAction(repo, owner)
        setMessages((currentMessages) => [
          ...currentMessages,
          response.newMessage,
        ])
      },
    },
  ]

  return (
    <>
      {Array.isArray(repos) &&
        repos.map((r, index) => {
          return (
            <div className='w-full border p-3 rounded-md mb-2' key={index}>
              <div className='flex items-start justify-between gap-3'>
                <div className='flex gap-2'>
                  <div className='p-0.5'>
                    <div className='rounded-md size-[25px] overflow-hidden'>
                      <Image
                        src={r.owner.avatar_url}
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
                        href={r.html_url ?? ''}
                        className='font-semibold leading-none text-blue-600 hover:underline'
                      >
                        {r.full_name}
                      </Link>
                    </div>
                    <span className='text-sm'>
                      {r.description ? r.description : '(No description found)'}
                    </span>
                    <div className='flex items-center flex-wrap gap-1'>
                      {r.topics.map((topic, index) => {
                        return (
                          <Badge
                            variant='secondary'
                            className='font-normal'
                            key={index}
                          >
                            {topic}
                          </Badge>
                        )
                      })}
                    </div>

                    <div className='flex items-center gap-1'>
                      <div className='flex items-center gap-1'>
                        <div
                          style={{ backgroundColor: findColour(r.language) }}
                          className={`rounded-full size-2.5`}
                        ></div>
                        <span className='flex items-center gap-1 text-sm font-light text-neutral-500'>
                          {r.language}
                        </span>
                      </div>
                      •
                      <span className='flex items-center text-sm text-neutral-500 font-light gap-0.5'>
                        <span>
                          <Star size={15} />
                        </span>
                        {r.stargazers_count.toString().split('').length > 3 ? (
                          <span> {Math.floor(r.stargazers_count / 1000)}k</span>
                        ) : (
                          <span>{r.stargazers_count}</span>
                        )}
                      </span>
                      •
                      <span className='flex items-center gap-1 text-sm text-neutral-500'>
                        <span>
                          <License />
                        </span>
                        <span className='font-light'>
                          {r?.license?.spdx_id !== null ||
                          r?.license?.spdx_id !== undefined
                            ? r?.license?.spdx_id
                            : 'No License'}
                        </span>
                      </span>
                    </div>
                  </div>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild className='flex justify-end'>
                    <Button
                      variant='ghost'
                      size={'sm'}
                      className='flex text-sm items-center gap-1 font-normal border-b'
                    >
                      <span>
                        <Sparkle />
                      </span>
                      Actions
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuLabel>Choose Action</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuRadioGroup
                      value={action}
                      onValueChange={setAction}
                    >
                      {RepoActions.map((action) => {
                        return (
                          <DropdownMenuRadioItem
                            key={action.value}
                            value={action.value}
                            className='p-2 cursor-pointer'
                            onSelect={async () =>
                              action.value === 'show-readme'
                                ? await action.function(r.name, r.owner.login)
                                : action.value === 'show-directory'
                                  ? await action.function(r.name, r.owner.login)
                                  : null
                            }
                            // onClick={}
                          >
                            {action.name}
                          </DropdownMenuRadioItem>
                        )
                      })}
                    </DropdownMenuRadioGroup>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          )
        })}
    </>
  )
}

export default Repositories
