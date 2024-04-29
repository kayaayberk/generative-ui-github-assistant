import { cache } from 'react'
import { getChats } from '@/app/actions'
import SidebarItems from './SidebarItems'

interface SidebarListProps {
  userId: string
  children?: React.ReactNode
}

const loadChats = cache(async (userId: string) => {
  return await getChats(userId)
})

export async function SidebarList({ userId }: SidebarListProps) {
  const chats = await loadChats(userId)
  return (
    <div className='size-full'>
      {chats?.length ? (
        <SidebarItems chats={chats} />
      ) : (
        <div className='p-8 text-center'>
          <p className='text-sm text-muted-foreground'>No chat history</p>
        </div>
      )}
    </div>
  )
}
