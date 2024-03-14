import Chat from '@/components/Chat'
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/dist/types/server'
import { redirect } from 'next/navigation'

export interface ChatPageProps {
  params: {
    id: string
  }
}
export default async function ChatPage({ params }: ChatPageProps) {
  const { isAuthenticated } = getKindeServerSession()
  const session = await isAuthenticated()

  if (!session) {
    redirect(`/api/auth/login?post_login_redirect_url=/chat/${params.id}`)
  }

  // get chat from the database

  // check if the chat exists

  // check if chat and session exists
  return (
    <div className='flex flex-col size-full pt-16 px-0 mx-auto stretch'>
      <Chat
      // id={id}
      />
    </div>
  )
}
