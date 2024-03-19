'use client'

import Image from 'next/image'
import { Message } from 'ai/react'
import { Sparkle, User } from '@phosphor-icons/react'
import { useKindeBrowserClient } from '@kinde-oss/kinde-auth-nextjs'
import { useAIState, useUIState } from 'ai/rsc'
import { BotMessage, UserMessage } from './assistant/Message'
import { UIState } from '@/lib/chat/actions'
import { Separator } from './ui/seperator'

export interface ChatList {
  messages: UIState
  // isShared: boolean
}

export function ChatMessage({ messages }: ChatList) {
  const session = useKindeBrowserClient()

  if (!messages.length) {
    return null
  }

  return (
    <div className='whitespace-pre-wrap flex flex-col items-start size-full gap-2 mb-10'>
      {messages &&
        messages.map((message, index) => (
          <div key={message.id} className='w-full'>
            {message.display}
            {index < messages.length - 1 && <Separator className='my-4' />}
          </div>
        ))}
    </div>
  )
}
