import Chat from '@/components/Chat'
import { getChat, getMissingKeys } from '@/app/actions'
import { notFound, redirect } from 'next/navigation'
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server'
import { AI } from '@/lib/chat/actions'

export interface ChatPageProps {
  params: {
    id: string
  }
}
export default async function ChatPage({ params }: ChatPageProps) {
  const { isAuthenticated, getUser } = getKindeServerSession()
  const user = await getUser()
  const missingKeys = await getMissingKeys()

  if (!user) {
    redirect(`/api/auth/login?post_login_redirect_url=/chat/${params.id}`)
  }

  const chat = await getChat(params.id, user.id)

  if (!chat) {
    redirect('/')
  }

  if (chat[0].author !== user?.id) {
    notFound()
  }

  return (
    <div className='flex flex-col size-full pt-16 px-0 mx-auto stretch'>
      <AI initialAIState={{ chatId: chat[0].id, messages: chat[0].messages }}>
        <Chat
          id={chat[0].id}
          initialMessages={chat[0].messages}
          missingKeys={missingKeys}
        />
      </AI>
    </div>
  )
}
