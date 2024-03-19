import Session from './Session'
import UserBadge from './UserBadge'
import ThemeToggle from './ThemeToggle'
import {
  LogoutLink,
  getKindeServerSession,
} from '@kinde-oss/kinde-auth-nextjs/server'
import { SignOut } from '@phosphor-icons/react/dist/ssr'
import { db } from '@/db'
import { user, InsertUser } from '@/db/schema'
import { eq, sql } from 'drizzle-orm'
import { ChatHistory } from './ChatHistory'

async function Sidebar() {
  const { isAuthenticated, getUser } = getKindeServerSession()
  const loggedInUser = await getUser()

  if (!loggedInUser)
    return (
      <div className='sticky left-0 hidden p-2 overflow-scroll border-r lg:flex lg:w-[270px] lg:flex-col xl:w-72 justify-between'>
        <div className='flex flex-col gap-1'>
          <ThemeToggle />
          {(await isAuthenticated()) ? (
            <>
              <LogoutLink className='flex items-center gap-2 p-2 rounded-md dark:hover:bg-muted hover:bg-muted w-full whitespace-nowrap text-sm'>
                <SignOut size={16} />
                Log out
              </LogoutLink>
              <UserBadge />
            </>
          ) : (
            <Session />
          )}
        </div>
      </div>
    )

  if (loggedInUser) {
    const existingUser = await db
      .select({ id: user.id })
      .from(user)
      .where(eq(user.id, loggedInUser.id))

    if (!existingUser.length) {
      const newUser: InsertUser = {
        id: loggedInUser.id,
        email: loggedInUser.email ?? '',
        name: loggedInUser.given_name ?? '',
        surname: loggedInUser.family_name ?? '',
        createdAt: new Date(),
      }
      await db.insert(user).values(newUser)
    }
  }
  return (
    <div className='sticky left-0 gap-4 hidden p-3 overflow-scroll border-r lg:flex lg:w-[270px] lg:flex-col xl:w-72 justify-between'>
      <div className='px-2 font-light text-sm tracking-wide'>Chat History</div>
      <ChatHistory userId={loggedInUser?.id} />
      <div className='flex flex-col gap-1'>
        <ThemeToggle />
        {(await isAuthenticated()) ? (
          <>
            <LogoutLink className='flex items-center gap-2 p-2 rounded-md dark:hover:bg-muted hover:bg-muted w-full whitespace-nowrap text-sm'>
              <SignOut size={16} />
              Log out
            </LogoutLink>
            <UserBadge />
          </>
        ) : (
          <Session />
        )}
      </div>
    </div>
  )
}

export default Sidebar
