'use client'

import { Chat } from '@/lib/types'
import SidebarItem from './SidebarItem'
import { removeChat } from '@/app/actions'
import SideBarActions from './SideBarActions'

interface SidebarItemsProps {
  chats?: Chat[]
}
function SidebarItems({ chats }: SidebarItemsProps) {
  if (!chats?.length) return null

  return (
    <div className='w-full flex flex-col gap-1 '>
      {chats
        .sort(
          (a, b) =>
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
        )
        .map(
          (chat, index) =>
            chat && (
              <div key={chat.id} className='w-full'>
                <SidebarItem index={index} chat={chat}>
                  <SideBarActions
                    chat={chat}
                    removeChat={removeChat}
                    // shareChat={shareChat}
                  />
                </SidebarItem>
              </div>
            ),
        )
        .reverse()}
    </div>
  )
}

export default SidebarItems
