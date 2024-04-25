import Link from 'next/link'
import { SidebarList } from './SidebarList'
import { db } from '@/db'
import { eq } from 'drizzle-orm'
import UserBadge from './UserBadge'
import ThemeToggle from './ThemeToggle'
import { currentUser } from '@clerk/nextjs'
import { InsertUser, user } from '@/db/schema'
import { Plus } from '@phosphor-icons/react/dist/ssr'
import ClearAllChats from './ClearAllChats'

export async function ChatHistory() {
  const loggedInUser = await currentUser()
  if (!loggedInUser) {
    return null
  }

  if (loggedInUser) {
    const existingUser = await db
      .select({ id: user.id })
      .from(user)
      .where(eq(user.id, loggedInUser.id))

    if (!existingUser.length) {
      const newUser: InsertUser = {
        id: loggedInUser.id,
        email: loggedInUser.emailAddresses[0].emailAddress ?? '',
        name: loggedInUser.firstName ?? '',
        surname: loggedInUser.lastName ?? '',
        createdAt: new Date(),
      }
      await db
        .insert(user)
        .values(newUser)
        .onConflictDoUpdate({
          target: user.email,
          set: { email: newUser.email },
        })
    }
  }
  return (
    <div className='gap-4 p-3 overflow-scroll border-r flex flex-col h-full justify-between'>
      <div className='px-2 font-light text-sm tracking-wide'>Chat History</div>
      <Link
        href='/chat'
        // prefetch={true}
        className='flex items-center gap-2 py-1 px-2 border rounded-md hover:bg-gray-200 dark:text-white/80 dark:hover:bg-gray-500/20'
      >
        <Plus /> <span>New Chat</span>
      </Link>

      <div className='size-full'>
        <SidebarList userId={loggedInUser ? loggedInUser.id : ''} />
      </div>

      <div className='flex flex-col gap-2'>
        <ClearAllChats userId={loggedInUser.id} />
        <ThemeToggle />
        <UserBadge />
      </div>
    </div>
  )
}
