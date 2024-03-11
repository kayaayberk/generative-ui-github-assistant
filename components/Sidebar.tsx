import Session from './Session'
import UserBadge from './UserBadge'
import ThemeToggle from './ThemeToggle'
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server'

async function Sidebar() {
  const { isAuthenticated, getUser } = getKindeServerSession()
  const user = await getUser()
  // console.log(await getUser())
  return (
    <div className='sticky left-0 hidden p-2 overflow-scroll border-r lg:flex lg:w-[270px] lg:flex-col xl:w-72 justify-between'>
      <div>Chat list</div>
      <div className='flex flex-col gap-1'>
        <ThemeToggle />
        {(await isAuthenticated()) ? <UserBadge /> : <Session />}
      </div>
    </div>
  )
}

export default Sidebar
