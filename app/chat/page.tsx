import Chat from '@/components/Chat'
import { nanoid } from '@/lib/utils'
import { AI } from '@/lib/chat/actions'
import { getMissingKeys } from '../actions'

export default async function IndexPage() {
  const missingKeys = await getMissingKeys()
  const id = nanoid()

  return (
    <div className='flex flex-col size-full pt-16 px-0 mx-auto stretch'>
      <AI initialAIState={{ chatId: id, messages: [] }}>
        <Chat
          id={id}
          // session={session}
          missingKeys={missingKeys}
        />
      </AI>
    </div>
  )
}
