import 'server-only'

import {
  BotCard,
  BotMessage,
  UserMessage,
} from '@/components/assistant/Message'
import { Chat } from '../types'
import { saveChat } from '@/app/actions'
import { currentUser } from '@clerk/nextjs'
import { createAI, getAIState } from 'ai/rsc'
import { submitUserAction } from './submit-user-action'
import { Profile } from '@/components/assistant/Profile'
import { submitUserMessage } from './submit-user-message'
import { nanoid, runAsyncFnWithoutBlocking } from '../utils'
import Repositories from '@/components/assistant/Repositories'
import { ProfileList } from '@/components/assistant/ProfileList'

export interface Message {
  role?: 'user' | 'assistant' | 'system' | 'function' | 'data' | 'tool'
  content?: string
  id: string
  name?: string
}

export type AIState = {
  chatId: string
  messages: {
    role: 'user' | 'assistant' | 'system' | 'function' | 'data' | 'tool'
    content: string
    id: string
    name?: string
  }[]
}

export type UIState = {
  id: string
  display: React.ReactNode
}[]

export const AI = createAI<AIState, UIState>({
  actions: { submitUserMessage, submitUserAction },
  initialAIState: {
    chatId: nanoid(),
    messages: [],
  },
  initialUIState: [],

  unstable_onGetUIState: async () => {
    'use server'

    const user = await currentUser()

    if (user) {
      const aiState = getAIState()

      if (aiState) {
        const uiState = getUIStateFromAIState(aiState)
        return uiState
      }
    } else {
      return
    }
  },

  unstable_onSetAIState: async ({ state }) => {
    'use server'

    const user = await currentUser()

    if (user) {
      const { chatId, messages } = state

      const createdAt = new Date()
      const author = user.id as string
      const path = `/chat/${chatId}`
      const title = messages[1].content.substring(0, 100)

      const savedChat: Chat = {
        id: chatId,
        title: title,
        author: author,
        createdAt: createdAt,
        messages: messages,
        path: path,
      }

      await saveChat(savedChat)
    } else {
      console.log(`unstable_onSetAIState: not authenticated`)
      return
    }
  },
})

// Parses the previously rendered content and returns the UI state.
// (Useful for chat history to rerender the UI components again when switching between the chats)
export const getUIStateFromAIState = (aiState: Chat) => {
  return aiState.messages
    .filter((message) => message.role !== 'system')
    .map((m, index) => ({
      id: `${aiState.id}-${index}`,
      display:
        m.role === 'function' ? (
          m.name === 'show_user_profile_ui' ? (
            <BotCard>
              <Profile props={JSON.parse(m.content)} />
            </BotCard>
          ) : m.name === 'show_user_list_ui' ? (
            <BotCard>
              <ProfileList props={JSON.parse(m.content)} />
            </BotCard>
          ) : m.name === 'show_repository_ui' ? (
            <BotCard>
              <Repositories props={JSON.parse(m.content)} />
            </BotCard>
          ) : null
        ) : m.role === 'user' ? (
          <UserMessage>{m.content}</UserMessage>
        ) : (
          m.role === 'assistant' && <BotMessage content={m.content} />
        ),
    }))
}
