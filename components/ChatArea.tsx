'use client'

import { useEffect, useRef } from 'react'
import ChatMessage from './ChatMessage'
import { ScrollArea } from './ui/scroll-area'
import ChatInput from './ChatInput'
import { useChat } from 'ai/react'

function ChatArea() {
  const ref = useRef<HTMLDivElement>(null)
  const { messages, input, handleInputChange, handleSubmit, isLoading, error } =
    useChat()

  useEffect(() => {
    if (ref.current === null) return
    ref.current.scrollTo(0, ref.current.scrollHeight)
  }, [messages])
  return (
    <div className='relative size-full pb-20'>
      <ScrollArea ref={ref} className='size-full'>
        <div className='max-w-2xl mx-auto px-5'>
          {messages.map((m) => (
            <ChatMessage key={m.id} m={m} error={error} isLoading={isLoading} />
          ))}
        </div>
      </ScrollArea>
      <ChatInput
        input={input}
        handleInputChange={handleInputChange}
        handleSubmit={handleSubmit}
        isLoading={isLoading}
      />
    </div>
  )
}

export default ChatArea
