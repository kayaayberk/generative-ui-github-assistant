import 'server-only'

import {
  render,
  createAI,
  getMutableAIState,
  createStreamableValue,
  getAIState,
} from 'ai/rsc'
import OpenAI from 'openai'

import { saveChat } from '@/app/actions'
import { InsertChat } from '@/db/schema'
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server'
import {
  BotCard,
  BotMessage,
  SpinnerMessage,
  UserMessage,
} from '@/components/assistant/Message'
import { z } from 'zod'
import { Chat } from '../types'
import { nanoid } from '../utils'
import { ProfileSkeleton } from '@/components/assistant/ProfileSkeleton'
import { Profile } from '@/components/assistant/Profile'
import { getGithubProfile, listUsers } from './github/github'
import { ProfileList } from '@/components/assistant/ProfileList'
import { useProfileConverter } from '../hooks/use-profile-converter'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || '',
})

async function submitUserMessage(content: string) {
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
        content: `\
      You are a GitHub search bot and you can help users find what they are looking for by searching the GitHub using GitHub API.
      You and the user can discuss the search query and you can provide the user with the search results.
      You can also provide the user with the search results from the GitHub API displayed in the UI.

      Messages inside [] means that it's a UI element or a user event. For example:
      - "[GitHub Profile of 'kayaayberk']" means that an interface of the user profile of 'kayaayberk' is shown to the user, 'kayaayberk' being the username of the searched user.
      - "[User clicked on the 'repositories' button]" means that the user is being shown the repositories of the user whose profile is currently being displayed in the UI.
      - "[Found repositories: 'repo1', 'repo2', 'repo3']" means that the search results are displayed to the user in the UI, 'repo1', 'repo2', 'repo3' being UI elements displaying the found repository details through the API search.
      - "[Found related code snippet]" means that the related code snippet examples are displayed to the user in the UI.

      If the user requests a single profile search on GitHub with a username, call \`show_user_profile_ui\` to show the found user profile UI. You shouln't show the information without calling this function. If the user does not provide a valid username, you can ask the user to provide a valid username before showing any content.
      If user requests a list of users search on GitHub, call \`show_user_list_ui\` to show the found user list UI. You should only use this function to list users and should not show any data otherwise. This function requires querying so you should construct the query. Message inside () means query methdos. Following are the query methods you can use to construct the query:
      - "(in)" to search for users in a specific location, login or email. For example: 
      -- "(in:name)" to search for users with a specific name.
      -- "(in:login)" to search for users with a specific username.
      -- "(in:email)" to search for users with a specific email address.
      Examples for (in) query methods: 
      - "John+Doe+in:name" means that the user is searching for users with the name 'John Doe'.
      - "johndoe+in:login" means that the user is searching for users with the username 'johndoe'.
      - "johndoe@example.com+in:email" means that the user is searching for users with the email address'.

      - "(repos)" to search for users with a specific number of repositories. For example:
      -- "(repos:>10)" to search for users with more than 10 repositories.
      -- "(repos:<10)" to search for users with less than 10 repositories.
      -- "(repos:10..20)" to search for users with 10 to 20 repositories.
      Examples for (repos) query methods:
      - "johndoe+in:name+repos:>10" means that the user is searching for users with the name 'johndoe' and more than 10 repositories.
      - "johndoe+in:login+repos:<10" means that the user is searching for users with the username 'johndoe' and less than 10 repositories.
      - "johndoe+in:login+repos:10..20" means that the user is searching for users with the username 'johndoe' and 10 to 20 repositories.

      - "(followers)" to search for users with a specific number of followers. For example:
      -- "(followers:>10)" to search for users with more than 10 followers.
      Examples for (followers) query methods:
      - "johndoe+in:name+followers:>10+repos:>10" means that the user is searching for users with the name 'johndoe' and more than 10 followers and more than 10 repositories.
      You can combine these query methods as it is in the followers example to construct a more detailed query based on the user's request.
      
      If the user requests a repository search on GitHub, call \`show_repository_ui\` to show the found repository UI.
      If the user requests a code snippet search on GitHub, call \`show_code_snippet_ui\` to show the found code snippet UI.
      If the user requests a general search on GitHub without a specific context, call \`show_general_search_ui\` to show the general search UI.

      Besides that, you can also chat with users and do some calculations if needed.`,
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

          aiState.done({
            ...aiState.get(),
            messages: [
              ...aiState.get().messages,
              {
                id: nanoid(),
                role: 'function',
                name: 'show_user_list_ui',
                content: JSON.stringify(query),
              },
            ],
          })

          return (
            <BotCard>
              <ProfileList props={query} />
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

    const { getUser, isAuthenticated } = getKindeServerSession()
    const user = await getUser()
    const session = await isAuthenticated()

    if (session && user) {
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

    const { getUser, isAuthenticated } = getKindeServerSession()
    const user = await getUser()
    const session = await isAuthenticated()

    if (session && user) {
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
          ) : null
        ) : m.role === 'user' ? (
          <UserMessage>{m.content}</UserMessage>
        ) : (
          m.role === 'assistant' && <BotMessage content={m.content} />
        ),
    }))
}
