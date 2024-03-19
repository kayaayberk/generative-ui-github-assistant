'use client'

import ChatInput from './ChatInput'
import { useToast } from './ui/use-toast'
import { useEffect, useRef, useState } from 'react'
import { useChat } from 'ai/react'
import { useUIState, useAIState } from 'ai/rsc'

import { ScrollArea } from './ui/scroll-area'
import { usePathname, useRouter } from 'next/navigation'
import { KindeUser } from '@kinde-oss/kinde-auth-nextjs/dist/types'
import { useLocalStorage } from '@/lib/hooks/use-local-storage'
import { useKindeBrowserClient } from '@kinde-oss/kinde-auth-nextjs'
import { Message } from 'ai'
import { ChatMessage } from './ChatMessage'

export interface ChatProps extends React.ComponentProps<'div'> {
  initialMessages?: Message[]
  id: string
  // session?: KindeUser | null
  missingKeys: string[]
  // m: Message
}

function Chat({ id, missingKeys }: ChatProps) {
  const ref = useRef<HTMLDivElement>(null)
  const { user } = useKindeBrowserClient()

  const [input, setInput] = useState('')
  const [messages] = useUIState()
  const [aiState] = useAIState()

  const router = useRouter()
  const pathname = usePathname()

  const { toast } = useToast()

  const [_, setNewChatId] = useLocalStorage('newChatId', id)

  useEffect(() => {
    if (user) {
      if (pathname.includes('chat') && messages.length === 1) {
        window.history.replaceState({}, '', `/chat/${id}`)
      }
    }
  }, [id, pathname, user, messages])

  useEffect(() => {
    const messagesLength = aiState.messages?.length

    if (messagesLength === 2) {
      router.refresh()
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
  }, [messages])

  return (
    <div className='relative size-full pb-20'>
      <ScrollArea ref={ref} className='size-full'>
        <div className='max-w-2xl mx-auto px-5'>
          <ChatMessage messages={messages} />
        </div>
      </ScrollArea>
      <ChatInput input={input} setInput={setInput} />
    </div>
  )
}

export default Chat
