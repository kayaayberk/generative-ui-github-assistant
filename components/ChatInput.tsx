import * as React from 'react'
import { Input } from './ui/input'
import { Button } from './ui/button'
import { AI } from '@/lib/chat/actions'
import { ArrowUp, StopCircle } from '@phosphor-icons/react'
import { useAIState, useActions, useUIState } from 'ai/rsc'
import { PromptForm } from './PromptForm'

export interface ChatPanelProps {
  id?: string
  title?: string
  input: string
  setInput: (value: string) => void
}
function ChatInput({ id, title, input, setInput }: ChatPanelProps) {
  const [aiState] = useAIState()
  const [messages, setMessages] = useUIState<typeof AI>()
  const { submitUserMessage } = useActions()
  const [shareDialogOpen, setShareDialogOpen] = React.useState(false)

  return <PromptForm input={input} setInput={setInput} />
}

export default ChatInput
