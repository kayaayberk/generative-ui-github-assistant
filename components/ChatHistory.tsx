import { cache } from 'react'
import { Sidebar } from '@phosphor-icons/react/dist/ssr'
import { SidebarList } from './SidebarList'

interface ChatHistoryProps {
  userId: string
}

export async function ChatHistory({ userId }: ChatHistoryProps) {
  return (
    <div className='size-full'>
      <SidebarList userId={userId} />
    </div>
  )
}
