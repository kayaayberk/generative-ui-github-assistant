'use client'

import { UIState } from '@/lib/chat/actions'

export interface ChatList {
  messages: UIState
}

export function ChatMessage({ messages }: ChatList) {
  if (!messages.length) {
    return null
  }
  return (
    <div className='whitespace-pre-wrap flex pt-10 flex-col items-start size-full gap-5'>
      {messages.map((message, index) => (
        <div key={message.id || index} className='w-full'>
          {message.display}
        </div>
      ))}
    </div>
  )
}
