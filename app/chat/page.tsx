import ChatArea from '@/components/ChatArea'
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server'

export default async function Chat() {
  const { isAuthenticated } = getKindeServerSession()
  console.log(await isAuthenticated())
  return (await isAuthenticated()) ? (
    <div className='flex flex-col size-full pt-16 px-0 mx-auto stretch'>
      <ChatArea />
    </div>
  ) : (
    <p>This page is protected</p>
  )
}
