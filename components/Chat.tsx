'use client'

import { Message } from 'ai'
import ChatPanel from './ChatPanel'
import { sleep } from '@/lib/utils'
import { useUser } from '@clerk/nextjs'
import { useToast } from './ui/use-toast'
import { PromptForm } from './PromptForm'
import { ChatMessage } from './ChatMessage'
import { ScrollArea } from './ui/scroll-area'
import { useUIState, useAIState } from 'ai/rsc'
import { useEffect, useRef, useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { useLocalStorage } from '@/lib/hooks/use-local-storage'
import { useSidebar } from '@/lib/hooks/use-sidebar'

export interface ChatProps extends React.ComponentProps<'div'> {
  initialMessages?: Message[]
  id: string
  missingKeys: string[]
}

function Chat({ id, missingKeys }: ChatProps) {
  const ref = useRef<HTMLDivElement>(null)
  const { isSignedIn, user } = useUser()

  const [input, setInput] = useState('')
  const [messages] = useUIState()
  const [aiState] = useAIState()

  const router = useRouter()
  const pathname = usePathname()

  const { toast } = useToast()

  const [_, setNewChatId] = useLocalStorage('newChatId', id)
  const { isSidebarOpen, isLoading, toggleSidebar } = useSidebar()

  useEffect(() => {
    if (isSignedIn) {
      if (!pathname.includes(id) && messages.length === 1) {
        window.history.replaceState({}, '', `/chat/${id}`)
      }
    }
  }, [pathname, isSignedIn, messages])

  useEffect(() => {
    const messagesLength = aiState.messages?.length
    if (messagesLength === 3) {
      sleep(500).then(() => {
        ref.current?.scrollTo(0, ref.current.scrollHeight)
        router.refresh()
      })
    }
  }, [aiState.messages, router])

  useEffect(() => {
    setNewChatId(id)
  }, [])

  useEffect(() => {
    missingKeys.map((key) => {
      toast({
        title: 'Error',
        description: `Missing ${key} environment variable!`,
        variant: 'destructive',
      })
    })
  }, [missingKeys])

  return (
    <div className={`size-full`}>
      <ScrollArea className='size-full'>
        <div
          ref={ref}
          className={`w-full sm:max-w-2xl mx-auto sm:pt-0 pt-14 pb-36 sm:pb-28 ${isSidebarOpen && isSignedIn ? 'lg:translate-x-[100px]' : ''} transition-all duration-300 ${messages.length !== 0 && 'px-3'}`}
        >
          <ChatMessage messages={messages} />
        </div>
        <ChatPanel />
      </ScrollArea>
      <div
        className={`${messages.length !== 0 || pathname === '/chat' || pathname === '/' ? 'block' : 'hidden'} ${isSidebarOpen && isSignedIn ? 'lg:translate-x-[100px]' : ''} w-full mx-auto transition-all duration-300 fixed bottom-0 bg-gradient-to-t from-background to-transparent via-background`}
      >
        <PromptForm input={input} setInput={setInput} />
        <p className='text-xs text-center px-6 mb-2 hidden sm:block tracking-normal text-zinc-600 mt-1'>
          GitHub assistant is a personal and experimental project. Please do not
          abuse it in term of token usage.
        </p>
      </div>
    </div>
  )
}

export default Chat
