import Sidebar from '@/components/Sidebar'

interface ChatLayoutProps {
  children: React.ReactNode
}

export default async function ChatLayout({ children }: ChatLayoutProps) {
  return (
    <div className='relative flex w-full h-screen overflow-hidden'>
      <Sidebar />
      <div className='group w-full overflow-auto pl-0 animate-in duration-300 ease-in-out peer-[[data-state=open]]:lg:pl-[250px] peer-[[data-state=open]]:xl:pl-[300px]'>
        {children}
      </div>
    </div>
  )
}
