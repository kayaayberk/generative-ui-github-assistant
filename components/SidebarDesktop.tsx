import Sidebar from './Sidebar'
import { ChatHistory } from './ChatHistory'

async function SidebarDesktop() {
  return (
    <Sidebar className='peer absolute inset-y-0 z-30 hidden -translate-x-full duration-300 ease-in-out data-[state=open]:translate-x-0 lg:flex lg:w-[270px]'>
      <ChatHistory />
    </Sidebar>
  )
}

export default SidebarDesktop
