'use client'

import { useChat } from 'ai/react'
import { ArrowUp, StopCircle } from '@phosphor-icons/react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import ChatMessage from '@/components/ChatMessage'
import { ScrollArea } from '@/components/ui/scroll-area'
import { useEffect, useRef } from 'react'

export default function Chat() {
  const ref = useRef<HTMLDivElement>(null)
  const { messages, input, handleInputChange, handleSubmit, isLoading, error } =
    useChat()

  useEffect(() => {
    if (ref.current === null) return
    ref.current.scrollTo(0, ref.current.scrollHeight)
  }, [messages])
  return (
    <div className='flex flex-col size-full pt-16 px-0 mx-auto stretch'>
      <div className='relative size-full pb-20'>
        <ScrollArea ref={ref} className='size-full'>
          <div className='max-w-2xl overflow-scroll mx-auto px-5'>
            {messages.map((m) => (
              <ChatMessage
                key={m.id}
                m={m}
                error={error}
                isLoading={isLoading}
              />
            ))}
          </div>
        </ScrollArea>
        <form onSubmit={handleSubmit} className='absolute w-full bottom-0'>
          <div className='relative bottom-0 border w-full p-1 mb-8 rounded-md shadow-xl max-w-2xl mx-auto'>
            <Input
              className='bottom-0 w-full border-none focus-visible:ring-0'
              value={input}
              placeholder='Say something...'
              onChange={handleInputChange}
            />
            <Button
              className='absolute bottom-1 right-1 px-2'
              type='submit'
              disabled={isLoading}
            >
              {isLoading ? <StopCircle size={18} /> : <ArrowUp size={18} />}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
