import { db } from '@/db'
import Link from 'next/link'
import UserBadge from './UserBadge'
import { eq, sql } from 'drizzle-orm'
import ThemeToggle from './ThemeToggle'
import { ChatHistory } from './ChatHistory'
import { user, InsertUser } from '@/db/schema'
import { Plus } from '@phosphor-icons/react/dist/ssr'
import { currentUser } from '@clerk/nextjs'

async function Sidebar() {
  const loggedInUser = await currentUser()

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
    <div className='sticky left-0 gap-4 hidden p-3 overflow-scroll border-r lg:flex lg:w-[270px] lg:flex-col xl:w-72 justify-between'>
      <div className='px-2 font-light text-sm tracking-wide'>Chat History</div>
      <Link
        href='/chat'
        // prefetch={true}
        className='flex items-center gap-2 py-1 px-2 border rounded-md hover:bg-gray-200 dark:text-white/80 dark:hover:bg-gray-500/20'
      >
        <Plus /> <span>New Chat</span>
      </Link>
      <ChatHistory userId={loggedInUser ? loggedInUser.id : ''} />
      <div className='flex flex-col gap-2'>
        <ThemeToggle />
        <UserBadge />
      </div>
    </div>
  )
}

export default Sidebar
