import { getChat } from '@/app/actions'
import Chat from '@/components/Chat'
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/dist/types/server'
import { notFound, redirect } from 'next/navigation'

export interface ChatPageProps {
  params: {
    id: string
  }
}
export default async function ChatPage({ params }: ChatPageProps) {
  const { isAuthenticated, getUser } = getKindeServerSession()
  const user = await getUser()

  if (!user) {
    redirect(`/api/auth/login?post_login_redirect_url=/chat/${params.id}`)
  }

  const chat = await getChat(params.id, user.id)

  if (!chat) {
    notFound()
  }

  if (chat[0].author !== user?.id) {
    notFound()
  }

  return (
    <div className='flex flex-col size-full pt-16 px-0 mx-auto stretch'>
      <Chat id={chat[0].id} initialMessages={chat[0].messages} />
    </div>
  )
}
