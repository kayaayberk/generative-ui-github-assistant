'use client'

import { useLocalStorage } from '@/lib/hooks/use-local-storage'
import { type Chat } from '@/lib/types'
import { Chat as ChatIcon } from '@phosphor-icons/react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

interface SidebarItemProps {
  index: number
  chat: Chat
  children: React.ReactNode
}

function SidebarItem({ index, chat, children }: SidebarItemProps) {
  const pathname = usePathname()
  const isActive = pathname === chat.path
  const [newChatId, setNewChatId] = useLocalStorage('newChatId', null)

  if (!chat.id) return null

  return (
    <div className='size-full'>
      <Link
        href={chat.path}
        className={`${
          isActive
            ? 'bg-gray-400/40 dark:bg-white/20 font-medium'
            : 'hover:bg-gray-200 dark:text-white/80 dark:hover:bg-gray-500/20'
        } py-1 rounded-md px-2 font-light text-sm tracking-wide flex items-center gap-2 w-full`}
        prefetch={true}
      >
        <ChatIcon />
        {chat.title}
      </Link>
      {/* {isActive && <div className='absolute right-2 top-1'>{children}</div>} */}
    </div>
  )
}

export default SidebarItem
