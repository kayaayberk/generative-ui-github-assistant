'use client'

import { nanoid } from 'nanoid'
import { useActions, useUIState } from 'ai/rsc'
import { AI } from '@/lib/chat/actions'
import { Input } from './ui/input'
import { Button } from './ui/button'
import { ArrowElbowDownLeft } from '@phosphor-icons/react'
import { UserMessage } from './assistant/Message'

export function PromptForm({
  input,
  setInput,
}: {
  input: string
  setInput: (value: string) => void
}) {
  const [_, setMessages] = useUIState<typeof AI>()
  const { submitUserMessage } = useActions()
  return (
    <form
      onSubmit={async (e: any) => {
        e.preventDefault()

        // Blur focus on mobile
        if (window.innerWidth < 600) {
          e.target['message']?.blur()
        }

        const value = input.trim()
        setInput('')
        if (!value) return

        // Optimistically add user message UI
        setMessages((currentMessages) => [
          ...currentMessages,
          {
            id: nanoid(),
            display: <UserMessage>{value}</UserMessage>,
          },
        ])

        // Submit and get response message
        const responseMessage = await submitUserMessage(value)
        setMessages((currentMessages) => [...currentMessages, responseMessage])
      }}
      className='absolute w-full bottom-0'
    >
      <div className='relative bottom-0 border w-full p-1 mb-8 rounded-md shadow-xl max-w-2xl mx-auto'>
        <Input
          className='bottom-0 w-full border-none focus-visible:ring-0'
          value={input}
          placeholder='Say something...'
          onChange={(e) => setInput(e.target.value)}
        />
        <Button
          className='absolute bottom-1 right-1'
          type='submit'
          size='icon'
          disabled={input === ''}
        >
          <ArrowElbowDownLeft />
        </Button>
      </div>
    </form>
  )
}
