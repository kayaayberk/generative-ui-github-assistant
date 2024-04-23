import Chat from '@/components/Chat'
import { AI } from '@/lib/chat/actions'
import { currentUser } from '@clerk/nextjs'
import { notFound, redirect } from 'next/navigation'
import { getChat, getMissingKeys } from '@/app/actions'

export interface ChatPageProps {
  params: {
    id: string
  }
}
export default async function ChatPage({ params }: ChatPageProps) {
  const user = await currentUser()
  const missingKeys = await getMissingKeys()

  if (!user) {
    redirect(`/api/auth/login?post_login_redirect_url=/chat/${params.id}`)
  }

  const chat = await getChat(params.id, user.id)

  if (!chat) {
    redirect('/chat')
  }

  if (chat[0].author !== user?.id) {
    notFound()
  }

  return (
    <AI initialAIState={{ chatId: chat[0].id, messages: chat[0].messages }}>
      <Chat
        id={chat[0].id}
        initialMessages={chat[0].messages}
        missingKeys={missingKeys}
      />
    </AI>
  )
}
