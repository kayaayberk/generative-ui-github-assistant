import Chat from '@/components/Chat'
import { nanoid } from '@/lib/utils'
import { AI } from '@/lib/chat/actions'
import { redirect } from 'next/navigation'
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server'
import { Session } from '@/lib/types'
import { getMissingKeys } from '../actions'

export default async function IndexPage() {
  const id = nanoid()
  const { getUser } = getKindeServerSession()
  // const session = await getUser()
  const missingKeys = await getMissingKeys()

  return (
    <AI initialAIState={{ chatId: id, messages: [] }}>
      <Chat
        id={id}
        // session={session}
        missingKeys={missingKeys}
      />
    </AI>
  )
}
