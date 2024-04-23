import { nanoid } from '@/lib/utils'
import Chat from '@/components/Chat'
import { AI } from '@/lib/chat/actions'
import { getMissingKeys } from './actions'

async function HomePage() {
  const missingKeys = await getMissingKeys()
  const id = nanoid()
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

export default HomePage
