import { nanoid } from '@/lib/utils'
import Chat from '@/components/Chat'
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server'
import { redirect } from 'next/navigation'

export default async function IndexPage() {
  const id = nanoid()
  const { isAuthenticated } = getKindeServerSession()
  const session = await isAuthenticated()

  if (!session) {
    redirect('/api/auth/login')
  }

  return (
    <>
      <p>hi</p>
      <Chat
      // id={id}
      />
    </>
  )
}
