'use client'

import { useEffect } from 'react'
import { useUser } from '@clerk/nextjs'
import { UIState } from '@/lib/chat/actions'
import { usePathname } from 'next/navigation'

export interface ChatList {
  messages: UIState
  id: string
}

export function ChatMessage({ messages, id }: ChatList) {
  const pathname = usePathname()
  const { isSignedIn } = useUser()

  useEffect(() => {
    if (isSignedIn) {
      if (!pathname.includes(id) && messages.length === 1) {
        window.history.replaceState({}, '', `/chat/${id}`)
      }
    }
  }, [pathname, isSignedIn, messages])

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
