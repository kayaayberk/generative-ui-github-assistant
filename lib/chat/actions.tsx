import 'server-only'

import {
  render,
  createAI,
  getAIState,
  getMutableAIState,
  createStreamableValue,
} from 'ai/rsc'

import {
  BotCard,
  BotMessage,
  SpinnerMessage,
  UserMessage,
} from '@/components/assistant/Message'
import { z } from 'zod'
import OpenAI from 'openai'
import { Chat } from '../types'
import { nanoid } from '../utils'
import { saveChat } from '@/app/actions'
import { currentUser } from '@clerk/nextjs'
import { systemPrompt } from './system-prompt'
import { Profile } from '@/components/assistant/Profile'
import { ProfileList } from '@/components/assistant/ProfileList'
import {
  convertUserType,
  getGithubProfile,
  searchRespositories,
} from './github/github'
import { ProfileSkeleton } from '@/components/assistant/ProfileSkeleton'
import Repositories from '@/components/assistant/Repositories'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || '',
})

async function submitUserMessage(content: string, attribute: string) {
  'use server'

  const aiState = getMutableAIState<typeof AI>()

  aiState.update({
    ...aiState.get(),
    messages: [
      ...aiState.get().messages,
      {
        id: nanoid(),
        role: 'user',
        content,
      },
      {
        id: nanoid(),
        role: 'system',
        content: `[User has changed attribute to ${attribute}]`,
      },
    ],
  })

  let textStream: undefined | ReturnType<typeof createStreamableValue<string>>
  let textNode: undefined | React.ReactNode
  const ui = render({
    model: 'gpt-3.5-turbo',
    provider: openai,
    initial: <SpinnerMessage />,
    messages: [
      {
        role: 'system',
        content: systemPrompt,
      },
      ...aiState.get().messages.map((message: any) => ({
        role: message.role,
        content: message.content,
        name: message.name,
      })),
    ],
    text: ({ content, done, delta }) => {
      if (!textStream) {
        textStream = createStreamableValue('')
        textNode = <BotMessage content={textStream.value} />
      }

      if (done) {
        textStream.done()
        aiState.done({
          ...aiState.get(),
          messages: [
            ...aiState.get().messages,
            {
              id: nanoid(),
              role: 'assistant',
              content,
            },
          ],
        })
      } else {
        textStream.update(delta)
      }
      return textNode
    },

    functions: {
      show_user_profile_ui: {
        description: 'Show the found user profile UI',
        parameters: z.object({
          username: z
            .string()
            .describe('The username of the user to search for'),
        }),
        render: async function* ({ username }) {
          yield (
            <BotCard>
              <ProfileSkeleton />
            </BotCard>
          )
          const profile = await getGithubProfile(username)

          aiState.done({
            ...aiState.get(),
            messages: [
              ...aiState.get().messages,
              {
                id: nanoid(),
                role: 'function',
                name: 'show_user_profile_ui',
                content: JSON.stringify(profile),
              },
            ],
          })

          aiState.update({
            ...aiState.get(),
            messages: [
              ...aiState.get().messages,
              {
                id: nanoid(),
                role: 'system' as const,
                content: `[GitHub Profile of '${profile?.login}']`,
              },
            ],
          })

          return (
            <BotCard>
              <Profile props={profile} />
            </BotCard>
          )
        },
      },
      show_user_list_ui: {
        description: 'Show the found user list UI',
        parameters: z.object({
          query: z.string().describe('The query to search for users'),
        }),
        render: async function* ({ query }) {
          yield (
            <BotCard>
              <ProfileSkeleton />
            </BotCard>
          )

          const profiles = await convertUserType(query)
          aiState.done({
            ...aiState.get(),
            messages: [
              ...aiState.get().messages,
              {
                id: nanoid(),
                role: 'function',
                name: 'show_user_list_ui',
                content: JSON.stringify(profiles),
              },
            ],
          })
          aiState.update({
            ...aiState.get(),
            messages: [
              ...aiState.get().messages,
              {
                id: nanoid(),
                role: 'system' as const,
                content: `[Found ${profiles.length} users with the usernames of '${profiles[0]?.login}', '${profiles[1]?.login}', '${profiles[2]?.login}', '${profiles[3]?.login}']`,
              },
            ],
          })

          return (
            <BotCard>
              <ProfileList props={profiles} />
            </BotCard>
          )
        },
      },
      show_repository_ui: {
        description: 'Show the found repositories UI',
        parameters: z.object({
          query: z.string().describe('The query to search for users'),
        }),
        render: async function* ({ query }) {
          yield (
            <BotCard>
              <ProfileSkeleton />
            </BotCard>
          )

          const repositories = await (
            await searchRespositories(query)
          ).map((r) => {
            return r
          })
          console.log(repositories)
          aiState.done({
            ...aiState.get(),
            messages: [
              ...aiState.get().messages,
              {
                id: nanoid(),
                role: 'function',
                name: 'show_repository_ui',
                content: JSON.stringify(repositories),
              },
            ],
          })
          aiState.update({
            ...aiState.get(),
            messages: [
              ...aiState.get().messages,
              {
                id: nanoid(),
                role: 'system' as const,
                content: `[Found ${repositories} repositories]`,
              },
            ],
          })
          return (
            <BotCard>
              <Repositories props={repositories} />
            </BotCard>
          )
        },
      },
    },
  })

  return {
    id: nanoid(),
    display: ui,
  }
}

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
  actions: { submitUserMessage },
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
      const title = messages[0].content.substring(0, 100)

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

export const forceRole = (role: string) => {}
