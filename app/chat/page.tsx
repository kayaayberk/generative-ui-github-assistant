import Chat from '@/components/Chat'
import { nanoid } from '@/lib/utils'
import { AI } from '@/lib/chat/actions'
import { getMissingKeys } from '../actions'

export default async function IndexPage() {
  const missingKeys = await getMissingKeys()
  const id = nanoid()

  return (
    <AI initialAIState={{ chatId: id, messages: [] }}>
      <Chat
        id={id}
        missingKeys={missingKeys}
      />
    </AI>
  )
}
