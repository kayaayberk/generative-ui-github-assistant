import Chat from '@/components/Chat'
import { nanoid } from '@/lib/utils'
import { AI } from '@/lib/chat/actions'
import { redirect } from 'next/navigation'
import { getMissingKeys } from '../actions'
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server'

export default async function IndexPage() {
  const id = nanoid()
  const { getUser } = getKindeServerSession()
  // const session = await getUser()
  const missingKeys = await getMissingKeys()

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
