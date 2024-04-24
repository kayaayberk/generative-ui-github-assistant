'use client'

import {
  User,
  Code,
  Sparkle,
  BookBookmark,
  ArrowElbowDownLeft,
  Plus,
} from '@phosphor-icons/react'
import {
  DropdownMenu,
  DropdownMenuLabel,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuRadioGroup,
} from '@/components/ui/dropdown-menu'
import * as React from 'react'
import { nanoid } from 'nanoid'
import { Button } from './ui/button'
import { AI } from '@/lib/chat/actions'
import { Textarea } from './ui/textarea'
import { AttributeTypes } from '@/lib/types'
import { UserMessage } from './assistant/Message'
import { useAIState, useActions, useUIState } from 'ai/rsc'
import { useEnterSubmit } from '@/lib/hooks/use-enter-submit'
import { usePathname } from 'next/navigation'
import Link from 'next/link'

const ChatFilters = [
  {
    name: 'General',
    value: 'general',
    role: 'assistant',
    icon: <Sparkle />,
    status: 'active',
  },
  {
    name: 'User Search',
    value: 'user-search',
    role: 'function',
    icon: <User />,
    status: 'active',
  },
  {
    name: 'Repository Search',
    value: 'repository-search',
    role: 'function',
    icon: <BookBookmark />,
    status: 'active',
  },
  {
    name: 'Code Search',
    value: 'code-search',
    role: 'function',
    icon: <Code />,
    status: 'disabled',
  },
]

export function PromptForm({
  input,
  setInput,
}: {
  input: string
  setInput: (value: string) => void
}) {
  const [_, setMessages] = useUIState<typeof AI>()
  const [aiState, setAIState] = useAIState<typeof AI>()
  const { submitUserMessage } = useActions()
  const [attribute, setAttribute] = React.useState('general')
  // Unique identifier for this UI component.
  const id = React.useId()
  const { formRef, onKeyDown } = useEnterSubmit()
  const inputRef = React.useRef<HTMLTextAreaElement>(null)
  const pathname = usePathname()

  // Set the initial attribute to general
  const message = {
    role: 'system' as const,
    content: `[User has changed the attribute to general]`,

    // Identifier of this UI component, so we don't insert it many times.
    id,
  }
  if (!aiState.messages.length) {
    setAIState({ ...aiState, messages: [...aiState.messages, message] })
  }

  // Whenever the attribute changes, we need to update the local value state and the history
  // so LLM also knows what's going on.
  function onAttributeChange(e: any) {
    const newValue = e

    // Insert a hidden history info to the list.
    const message = {
      role: 'system' as const,
      content: `[User has changed the attribute to ${newValue}]`,

      // Identifier of this UI component, so we don't insert it many times.
      id,
    }

    // If last history state is already this info, update it. This is to avoid
    // adding every attribute change to the history.
    if (aiState.messages[aiState.messages.length - 1]?.id === id) {
      setAIState({
        ...aiState,
        messages: [...aiState.messages.slice(0, -1), message],
      })

      return
    }
    // If it doesn't exist, append it to history.
    setAIState({ ...aiState, messages: [...aiState.messages, message] })
  }

  React.useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus()
    }
  }, [])

  return (
    <form
      ref={formRef}
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

        // Force attributes
        // Submit and get response message
        const responseMessage = await submitUserMessage(value)
        setMessages((currentMessages) => [...currentMessages, responseMessage])
      }}
      className='w-full max-w-2xl mx-auto flex items-center'
    >
      <div className='relative bottom-0 border w-full p-1 bg-background rounded-md shadow-xl mx-auto'>
        <DropdownMenu>
          <DropdownMenuTrigger asChild className='absolute bottom-1 right-11'>
            <Button
              variant='outline'
              className='flex items-center gap-1 font-normal'
            >
              {ChatFilters.find((f) => f.value === attribute)?.icon}
              {ChatFilters.find((f) => f.value === attribute)?.name}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className='w-56'>
            <DropdownMenuLabel>Choose Attribute</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuRadioGroup
              value={attribute}
              onValueChange={setAttribute}
            >
              {ChatFilters.map((attribute: AttributeTypes) => {
                return (
                  <DropdownMenuRadioItem
                    key={attribute.value}
                    disabled={attribute.status === 'disabled'}
                    value={attribute.value}
                    className='flex items-center gap-1'
                    onSelect={() => onAttributeChange(attribute.value)}
                  >
                    <span className='absolute left-2 flex size-3.5 items-center justify-center'>
                      <span>{attribute.icon && attribute.icon}</span>
                    </span>
                    <span>{attribute.name}</span>
                  </DropdownMenuRadioItem>
                )
              })}
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>
        <Textarea
          ref={inputRef}
          tabIndex={0}
          onKeyDown={onKeyDown}
          placeholder='Send a message.'
          className='min-h-[30px] w-full resize-none border-none px-4 focus-visible:ring-0 focus-within:outline-none sm:text-sm'
          autoFocus
          spellCheck={false}
          autoComplete='off'
          autoCorrect='off'
          name='message'
          rows={1}
          value={input}
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
      {pathname === '/' && (
        <Button onClick={() => window.location.reload()} size='icon'>
          <Plus />
        </Button>
      )}
    </form>
  )
}
