import 'server-only'
import {
  getDir,
  getReadme,
  checkRateLimit,
  searchRespositories,
} from './github/github'
import { AI } from './actions'
import { nanoid } from 'nanoid'
import { Readme as RM } from '../types'
import RateLimited from '@/components/RateLimited'
import { runAsyncFnWithoutBlocking } from '../utils'
import { Readme } from '@/components/assistant/Readme'
import { BotCard } from '@/components/assistant/Message'
import { Spinner } from '@/components/assistant/Spinner'
import Directory from '@/components/assistant/Directory'
import Repositories from '@/components/assistant/Repositories'
import { createStreamableUI, getMutableAIState } from 'ai/rsc'
import { ProfileSkeleton } from '@/components/assistant/ProfileSkeleton'

export async function repoAction(username: string) {
  'use server'

  const aiState = getMutableAIState<typeof AI>()

  const loadingRepos = createStreamableUI(
    <BotCard>
      <ProfileSkeleton />
    </BotCard>,
  )

  const systemMessage = createStreamableUI(null)

  runAsyncFnWithoutBlocking(async () => {
    loadingRepos.update(
      <BotCard>
        <ProfileSkeleton />
      </BotCard>,
    )
    const rateLimitRemaining = await checkRateLimit()
    const repositories = await searchRespositories(`user:${username}`)

    loadingRepos.done(
      <BotCard>
        <ProfileSkeleton />
      </BotCard>,
    )

    systemMessage.done(
      <BotCard>
        {rateLimitRemaining === 0 ? (
          <RateLimited />
        ) : (
          <>
            <Repositories props={repositories} />
            <p className='text-xs text-center text-zinc-600 space-x-1 font-light mt-2'>
              <span>Query constructed by AI:</span>
              <span className='font-medium'>
                repositories?q=user:{username}
              </span>
            </p>
          </>
        )}
      </BotCard>,
    )

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
        {
          id: nanoid(),
          role: 'system',
          content: `[User has clicked on the 'Show Repositories' button]`,
        },
      ],
    })
  })

  return {
    repoUI: loadingRepos.value,
    newMessage: {
      id: nanoid(),
      display: systemMessage.value,
    },
  }
}

export async function readmeAction(repo: string, owner: string) {
  'use server'

  const aiState = getMutableAIState<typeof AI>()

  const loadingReadme = createStreamableUI(<BotCard>{Spinner}</BotCard>)

  const systemMessage = createStreamableUI(null)

  runAsyncFnWithoutBlocking(async () => {
    loadingReadme.update(
      <BotCard>
        <ProfileSkeleton />
      </BotCard>,
    )
    const rateLimitRemaining = await checkRateLimit()
    const readme: RM = await getReadme(repo, owner)

    loadingReadme.done(
      <BotCard>
        <ProfileSkeleton />
      </BotCard>,
    )

    systemMessage.done(
      <BotCard>
        {rateLimitRemaining === 0 ? (
          <RateLimited />
        ) : (
          <>
            <Readme props={readme.content} />
            <p className='text-xs text-center text-zinc-600 space-x-1 font-light mt-2'>
              <span>Query constructed by AI:</span>
              <span className='font-medium'>
                repos/{owner}/{repo}/contents/README.md
              </span>
            </p>
          </>
        )}
      </BotCard>,
    )

    aiState.done({
      ...aiState.get(),
      messages: [
        ...aiState.get().messages,
        {
          id: nanoid(),
          role: 'function',
          name: 'show_readme_ui',
          content: JSON.stringify(readme.content),
        },
        {
          id: nanoid(),
          role: 'system',
          content: `[User has clicked on the 'Show Readme' button]`,
        },
      ],
    })
  })

  return {
    readmeUI: loadingReadme.value,
    newMessage: {
      id: nanoid(),
      display: systemMessage.value,
    },
  }
}

export async function dirAction(repo: string, owner: string) {
  'use server'

  const aiState = getMutableAIState<typeof AI>()

  const loadingDirectory = createStreamableUI(<BotCard>{Spinner}</BotCard>)

  const systemMessage = createStreamableUI(null)

  runAsyncFnWithoutBlocking(async () => {
    loadingDirectory.update(
      <BotCard>
        <ProfileSkeleton />
      </BotCard>,
    )
    const rateLimitRemaining = await checkRateLimit()
    const directory = await getDir({ repo, owner })

    loadingDirectory.done(
      <BotCard>
        <ProfileSkeleton />
      </BotCard>,
    )

    systemMessage.done(
      <BotCard>
        {rateLimitRemaining === 0 ? (
          <RateLimited />
        ) : (
          <>
            <Directory props={directory} />
            <p className='text-xs text-center text-zinc-600 space-x-1 font-light mt-2'>
              <span>Query constructed by AI:</span>
              <span className='font-medium'>
                repos/{owner}/{repo}/contents/
              </span>
            </p>
          </>
        )}
      </BotCard>,
    )

    aiState.done({
      ...aiState.get(),
      messages: [
        ...aiState.get().messages,
        {
          id: nanoid(),
          role: 'function',
          name: 'show_directory_ui',
          content: JSON.stringify(directory),
        },
        {
          id: nanoid(),
          role: 'system',
          content: `[User has clicked on the 'Show Directory' button]`,
        },
      ],
    })
  })

  return {
    directoryUI: loadingDirectory.value,
    newMessage: {
      id: nanoid(),
      display: systemMessage.value,
    },
  }
}
