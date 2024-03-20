'use client'

import { chat } from '@/db/schema'
import { Chat } from '@/lib/types'
import SidebarItem from './SidebarItem'
import SideBarActions from './SideBarActions'

interface SidebarItemsProps {
  chats?: Chat[]
}
function SidebarItems({ chats }: SidebarItemsProps) {
  if (!chats?.length) return null

  return (
    <div className='w-full flex flex-col gap-1 '>
      {chats.map(
        (chat, index) =>
          chat && (
            <div key={chat.id} className='w-full'>
              <SidebarItem index={index} chat={chat}>
                <SideBarActions
                //   chat={chat}
                //   removeChat={removeChat}
                //   shareChat={shareChat}
                />
              </SidebarItem>
            </div>
          ),
      ).reverse()}
    </div>
  )
}

export default SidebarItems
