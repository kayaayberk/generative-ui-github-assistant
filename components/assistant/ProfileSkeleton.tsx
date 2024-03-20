import { Skeleton } from '../ui/skeleton'

export const ProfileSkeleton = () => {
  return (
    <div className='flex items-center p-2 gap-2 w-full border rounded-md'>
      <Skeleton className='size-9 rounded-full' />
      <div className='space-y-2'>
        <Skeleton className='h-2 w-[100px]' />
        <Skeleton className='h-2 w-[150px]' />
        <Skeleton className='h-2 w-[250px]' />
      </div>
    </div>
  )
}
