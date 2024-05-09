import AssistantDisplay from '../AssistantDisplay'
import { Skeleton } from '../ui/skeleton'

export const ProfileSkeleton = () => {
  return (
    <AssistantDisplay>
      <div className='flex items-center p-2 gap-2 w-full border rounded-md'>
        <Skeleton className='size-11 animate-pulse rounded-full' />
        <div className='space-y-3'>
          <Skeleton className='h-2 w-[100px] animate-pulse' />
          <Skeleton className='h-2 w-[150px] animate-pulse' />
          <Skeleton className='h-2 w-[225px] animate-pulse' />
          <Skeleton className='h-2 w-[250px] animate-pulse' />
        </div>
      </div>
    </AssistantDisplay>
  )
}

export const ProfileListSkeleton = () => {
  return (
    <AssistantDisplay>
      <div className='flex items-center p-2 gap-2 w-full border rounded-md'>
        <Skeleton className='size-11 animate-pulse rounded-full' />
        <div className='space-y-3'>
          <Skeleton className='h-2 w-[100px] animate-pulse' />
          <Skeleton className='h-2 w-[150px] animate-pulse' />
          <Skeleton className='h-2 w-[225px] animate-pulse' />
          <Skeleton className='h-2 w-[250px] animate-pulse' />
        </div>
      </div>
      <div className='flex items-center border rounded-md p-2 gap-2'>
        <Skeleton className='size-11 animate-pulse rounded-full' />
        <div className='space-y-3'>
          <Skeleton className='h-2 w-[100px] animate-pulse' />
          <Skeleton className='h-2 w-[150px] animate-pulse' />
          <Skeleton className='h-2 w-[225px] animate-pulse' />
          <Skeleton className='h-2 w-[250px] animate-pulse' />
        </div>
      </div>
      <div className='flex items-center border rounded-md p-2 gap-2'>
        <Skeleton className='size-11 animate-pulse rounded-full' />
        <div className='space-y-3'>
          <Skeleton className='h-2 w-[100px] animate-pulse' />
          <Skeleton className='h-2 w-[150px] animate-pulse' />
          <Skeleton className='h-2 w-[225px] animate-pulse' />
          <Skeleton className='h-2 w-[250px] animate-pulse' />
        </div>
      </div>
      <div className='flex items-center border rounded-md p-2 gap-2'>
        <Skeleton className='size-11 animate-pulse rounded-full' />
        <div className='space-y-3'>
          <Skeleton className='h-2 w-[100px] animate-pulse' />
          <Skeleton className='h-2 w-[150px] animate-pulse' />
          <Skeleton className='h-2 w-[225px] animate-pulse' />
          <Skeleton className='h-2 w-[250px] animate-pulse' />
        </div>
      </div>
    </AssistantDisplay>
  )
}
