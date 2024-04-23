'use client'

import { Message } from 'ai'
import Link from 'next/link'
import ChatPanel from './ChatPanel'
import { sleep } from '@/lib/utils'
import { useUser } from '@clerk/nextjs'
import { useToast } from './ui/use-toast'
import { PromptForm } from './PromptForm'
import { ChatMessage } from './ChatMessage'
import { ScrollArea } from './ui/scroll-area'
import { GithubLogo, SignIn } from '@phosphor-icons/react'
import { useUIState, useAIState } from 'ai/rsc'
import { useEffect, useRef, useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { useLocalStorage } from '@/lib/hooks/use-local-storage'

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
  console.log(pathname)

  const { toast } = useToast()

  const [_, setNewChatId] = useLocalStorage('newChatId', id)

  useEffect(() => {
    if (isSignedIn) {
      if (!pathname.includes(id) && messages.length >= 1) {
        window.history.replaceState({}, '', `/chat/${id}`)
      }
    }
  }, [id, pathname, user, messages])

  useEffect(() => {
    const messagesLength = aiState.messages?.length
    if (messagesLength >= 3) {
      sleep(1000).then(() => {
        router.refresh()
      })
    }
  }, [aiState.messages, router])

  useEffect(() => {
    setNewChatId(id)
  })

  useEffect(() => {
    missingKeys.map((key) => {
      toast({
        title: 'Error',
        description: `Missing ${key} environment variable!`,
        variant: 'destructive',
      })
    })
  }, [missingKeys])

  // Scroll as the stream comes in
  useEffect(() => {
    if (ref.current === null) return
    ref.current.scrollTo(0, ref.current.scrollHeight)
  }, [messages, ref?.current?.scrollHeight])

  return (
    <>
      <div className={`relative size-full pb-32 pt-10 sm:pb-20 ${messages.length === 0 ? 'px-4 pt-40 sm:pt-60' : 'px-2'}`}>
        <ScrollArea ref={ref} className='size-full'>
          <div className='w-full sm:max-w-2xl mx-auto pb-10 '>
            <ChatMessage messages={messages} />
          </div>
          <ChatPanel />
        </ScrollArea>
        <div
          className={`${messages.length !== 0 || pathname === '/chat' ? 'block' : 'hidden'} w-full mx-auto`}
        >
          <PromptForm input={input} setInput={setInput} />
          <p className='text-xs text-center px-6 md:text-sm  hidden sm:block tracking-normal text-zinc-600 mt-1'>GitHub assistant is a personal and experimental project. Please do not
        abuse it in term of token usage.</p>
        </div>
      </div>
    </>
  )
}

export default Chat
