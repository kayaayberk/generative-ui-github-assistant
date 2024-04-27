'use client'

import { nanoid } from 'nanoid'
import { UserMessage } from './assistant/Message'
import { useAIState, useActions, useUIState } from 'ai/rsc'
import { AI } from '@/lib/chat/actions'
import { ArrowRight, GithubLogo } from '@phosphor-icons/react'
import Link from 'next/link'
import { useUser } from '@clerk/nextjs'
import { useSidebar } from '@/lib/hooks/use-sidebar'

function ChatPanel() {
  const exampleMessages = [
    {
      heading: 'Search for the username',
      subheading: 'Jaredpalmer',
      message: `Search for the username jaredpalmer`,
    },
    {
      heading: 'Search for repositories',
      subheading: 'with "state management" in description.',
      message:
        'Search for repositories with "state management" in description.',
    },
    {
      heading: 'Search for repository content',
      subheading: 'of shadcn/ui',
      message: `Search for repository content of shadcn-ui/ui.`,
    },
    {
      heading: 'Show README.md of',
      subheading: 'Reduxjs/redux?',
      message: `Show README.md of Reduxjs/redux`,
    },
  ]
  const [aiState] = useAIState()
  const { submitUserMessage } = useActions()
  const [messages, setMessages] = useUIState<typeof AI>()
  const { isSignedIn, user } = useUser()
  const { isSidebarOpen, isLoading, toggleSidebar } = useSidebar()

  return (
    <div
      className={`${messages.length === 0 ? 'block px-2 sm:px-0 mt-10 sm:mt-60' : 'hidden'} ${!isSidebarOpen || !isSignedIn ? '' : 'lg:translate-x-[100px]'} transition-all duration-300 flex flex-col gap-5 h-full items-center justify-center max-w-2xl mx-auto`}
    >
      <div
        className={`${messages.length > 0 ? 'hidden' : 'block'} mx-auto w-full flex flex-col gap-4 z-10 justify-center items-center`}
      >
        <h1 className='text-4xl flex items-center whitespace-nowrap md:text-[65px] font-extrabold tracking-wider leading-none'>
          <GithubLogo />
          <span className='bg-gradient-to-t dark:from-white/50 from-black/50 to-black dark:to-white bg-clip-text text-transparent'>
            GitHub Assistant
          </span>
        </h1>
        <p
          className={`${isSignedIn ? 'hidden' : 'block'} text-xs text-center px-6 md:text-sm tracking-normal text-zinc-600`}
        >
          Actions related to GitHub are tightly rate-limited. Please sign in
          with GitHub not to get rate-limited.
        </p>
      </div>
      <div
        className={`${messages.length > 0 ? 'hidden' : 'block'} mx-auto w-full`}
      >
        <div className='flex flex-col gap-2 px-4'>
          {exampleMessages.map((example, index) => (
            <div
              key={example.heading}
              className={`cursor-pointer rounded-md bg-white p-3 hover:bg-zinc-50 dark:bg-zinc-950 dark:hover:bg-zinc-900 hover:translate-x-3 transition-all duration-300

            `}
              onClick={async () => {
                setMessages((currentMessages) => [
                  ...currentMessages,
                  {
                    id: nanoid(),
                    display: <UserMessage>{example.message}</UserMessage>,
                  },
                ])

                const responseMessage = await submitUserMessage(example.message)

                setMessages((currentMessages) => [
                  ...currentMessages,
                  responseMessage,
                ])
              }}
            >
              <div className='flex items-center gap-2 text-xs md:text-sm font-extralight tracking-wide'>
                <ArrowRight />
                <span className='space-x-1'>
                  <span className='font-medium'>{example.heading}</span>
                  <span className=''>{example.subheading}</span>
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default ChatPanel
