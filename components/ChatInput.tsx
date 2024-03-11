'use client'

import { Input } from './ui/input'
import { Button } from './ui/button'
import { type UseChatHelpers } from 'ai/react'
import { ArrowUp, StopCircle } from '@phosphor-icons/react'

type ChatInputProps = Pick<
  UseChatHelpers,
  'input' | 'handleInputChange' | 'isLoading' | 'handleSubmit'
>

function ChatInput({
  input,
  handleInputChange,
  handleSubmit,
  isLoading,
}: ChatInputProps) {
  return (
    <form onSubmit={handleSubmit} className='absolute w-full bottom-0'>
      <div className='relative bottom-0 border w-full p-1 mb-8 rounded-md shadow-xl max-w-2xl mx-auto'>
        <Input
          className='bottom-0 w-full border-none focus-visible:ring-0'
          value={input}
          placeholder='Say something...'
          onChange={handleInputChange}
        />
        <Button
          className='absolute bottom-1 right-1'
          type='submit'
          size='icon'
          disabled={isLoading}
        >
          {isLoading ? <StopCircle size={18} /> : <ArrowUp size={18} />}
        </Button>
      </div>
    </form>
  )
}

export default ChatInput
