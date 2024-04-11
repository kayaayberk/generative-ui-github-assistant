import 'server-only'

import {
  convertUserType,
  getGithubProfile,
  searchRespositories,
} from './github/github'
import {
  BotCard,
  BotMessage,
  SpinnerMessage,
} from '@/components/assistant/Message'
import { z } from 'zod'
import OpenAI from 'openai'
import { AI } from './actions'
import { nanoid } from 'nanoid'
import { systemPrompt } from './system-prompt'
import { Profile } from '@/components/assistant/Profile'
import Repositories from '@/components/assistant/Repositories'
import { ProfileList } from '@/components/assistant/ProfileList'
import { ProfileSkeleton } from '@/components/assistant/ProfileSkeleton'
import { createStreamableValue, getMutableAIState, render } from 'ai/rsc'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || '',
})

export async function submitUserMessage(content: string, attribute: string) {
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
      // {
      //   id: nanoid(),
      //   role: 'system',
      //   content: `[User has changed attribute to ${attribute}]`,
      // },
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

          // aiState.update({
          //   ...aiState.get(),
          //   messages: [
          //     ...aiState.get().messages,
          //     {
          //       id: nanoid(),
          //       role: 'system' as const,
          //       content: `[GitHub Profile of '${profile?.login}']`,
          //     },
          //   ],
          // })

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
          // aiState.update({
          //   ...aiState.get(),
          //   messages: [
          //     ...aiState.get().messages,
          //     {
          //       id: nanoid(),
          //       role: 'system' as const,
          //       content: `[Found ${profiles.length} users with the usernames of '${profiles[0]?.login}', '${profiles[1]?.login}', '${profiles[2]?.login}', '${profiles[3]?.login}']`,
          //     },
          //   ],
          // })

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

          const repositories = await searchRespositories(query)

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
          // aiState.update({
          //   ...aiState.get(),
          //   messages: [
          //     ...aiState.get().messages,
          //     {
          //       id: nanoid(),
          //       role: 'system' as const,
          //       content: `[Found ${repositories} repositories]`,
          //     },
          //   ],
          // })
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
