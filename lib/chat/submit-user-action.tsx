import 'server-only'
import { AI } from './actions'
import { nanoid } from 'nanoid'
import { runAsyncFnWithoutBlocking } from '../utils'
import { getDir, getReadme, searchRespositories } from './github/github'
import { BotCard } from '@/components/assistant/Message'
import Repositories from '@/components/assistant/Repositories'
import { createStreamableUI, getMutableAIState } from 'ai/rsc'
import { ProfileSkeleton } from '@/components/assistant/ProfileSkeleton'
import { Spinner } from '@/components/assistant/Spinner'
import { Readme } from '@/components/assistant/Readme'
import Directory from '@/components/assistant/Directory'
import { Readme as RM } from '../types'

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
    const repositories = await searchRespositories(`user:${username}`)

    loadingRepos.done(
      <BotCard>
        <ProfileSkeleton />
      </BotCard>,
    )

    systemMessage.done(
      <BotCard>
        <Repositories props={repositories} />
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

    const readme: RM = await getReadme(repo, owner)

    loadingReadme.done(
      <BotCard>
        <ProfileSkeleton />
      </BotCard>,
    )

    systemMessage.done(
      <BotCard>
        <Readme props={readme.content} />
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

    const directory = await getDir({ repo, owner })
    console.log('directory:', directory)

    loadingDirectory.done(
      <BotCard>
        <ProfileSkeleton />
      </BotCard>,
    )

    systemMessage.done(
      <BotCard>
        <Directory props={directory} />
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
