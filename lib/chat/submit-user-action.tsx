import 'server-only'
import { AI } from './actions'
import { nanoid } from 'nanoid'
import { runAsyncFnWithoutBlocking } from '../utils'
import { getReadme, searchRespositories } from './github/github'
import { BotCard, BotMessage } from '@/components/assistant/Message'
import Repositories from '@/components/assistant/Repositories'
import { createStreamableUI, getMutableAIState } from 'ai/rsc'
import { ProfileSkeleton } from '@/components/assistant/ProfileSkeleton'
import { Spinner } from '@/components/assistant/Spinner'

export async function submitUserAction(
  actionType: string,
  username: string,
  repo: string,
  owner: string,
) {
  'use server'

  const aiState = getMutableAIState<typeof AI>()

  if (actionType === 'getReposUI' && username !== undefined) {
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
        <>
          <BotCard>
            <Repositories props={repositories} />
          </BotCard>
        </>,
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

  console.log(`Repo: ${repo}, Owner: ${owner}`);
  if (
    actionType === 'getReadmeUI' &&
    repo !== undefined &&
    owner !== undefined
  ) {
    const loadingReadme = createStreamableUI(<BotCard>{Spinner}</BotCard>)

    const systemMessage = createStreamableUI(null)

    runAsyncFnWithoutBlocking(async () => {
      loadingReadme.update(<BotCard>{Spinner}</BotCard>)

      const readme = await getReadme(repo, owner)

      loadingReadme.done(<BotCard>{Spinner}</BotCard>)

      systemMessage.done(
        <BotCard>
          <BotMessage content={readme} />
        </BotCard>,
      )

      aiState.done({
        ...aiState.get(),
        messages: [
          ...aiState.get().messages,
          {
            id: nanoid(),
            role: 'assistant',
            content: JSON.stringify(readme),
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
}
