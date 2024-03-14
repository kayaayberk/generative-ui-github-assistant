'use client'

import ChatInput from './ChatInput'
import ChatMessage from './ChatMessage'
import { useToast } from './ui/use-toast'
import { useEffect, useRef } from 'react'
import { Message, useChat } from 'ai/react'
import { ScrollArea } from './ui/scroll-area'
import { usePathname } from 'next/navigation'

export interface ChatProps extends React.ComponentProps<'div'> {
  initialMessages?: Message[]
  id?: string
}

function Chat({ id, initialMessages }: ChatProps) {
  const pathname = usePathname()
  const { toast } = useToast()
  const ref = useRef<HTMLDivElement>(null)
  const { messages, input, handleInputChange, handleSubmit, isLoading, error } =
    useChat({
      initialMessages,
      id,
      body: {
        id,
      },
      onResponse(response) {
        if (response.status === 401) {
          toast({
            title: 'Error',
            description: response.statusText,
            variant: 'destructive',
          })
        }
      },
      onFinish() {
        if (!pathname.includes('chat')) {
          window.history.pushState({}, '', `/chat/${id}`)
        }
      },
    })
    console.log(messages)

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

export default Chat
