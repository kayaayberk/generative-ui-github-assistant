'use client'

import { cn } from '@/lib/utils'

type AssistantDisplayProps = {
  children: React.ReactNode
}

function AssistantDisplay({ children }: AssistantDisplayProps) {
  return (
    <div className={cn('group flex items-start w-full')}>
      <div className='flex-1 space-y-2 overflow-hidden px-1 w-full'>
        <span className='font-semibold'>GitHub Assistant</span>
        {children}
      </div>
    </div>
  )
}

export default AssistantDisplay
