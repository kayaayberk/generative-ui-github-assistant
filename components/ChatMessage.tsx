'use client'

import { Message } from 'ai/react'
import { Sparkle, User } from '@phosphor-icons/react'
import { useKindeBrowserClient } from '@kinde-oss/kinde-auth-nextjs'

function ChatMessage({
  m,
  error,
  isLoading,
}: {
  m: Message
  isLoading: boolean
  error: undefined | Error
}) {
  return (
    <div
      key={m.id}
      className='whitespace-pre-wrap flex items-start gap-2 mb-10'
    >
      {m.role === 'user' ? (
        <div className='flex items-start'>
          <div className='flex items-start'>
            <div className='h-full rounded-full border p-0.5'>
              <User size={20} />
            </div>
          </div>
        </div>
      ) : (
        <div className='flex items-start'>
          <div className='flex items-start'>
            <div className='h-full rounded-full border p-0.5'>
              <Sparkle size={20} />
            </div>
          </div>
        </div>
      )}
      <div>
        <div className='font-semibold'>
          {m.role === 'user' ? 'You' : 'GitHub Assistant'}
        </div>
        <div className='font-light'>{error ? error.message : m.content}</div>
      </div>
    </div>
  )
}

export default ChatMessage