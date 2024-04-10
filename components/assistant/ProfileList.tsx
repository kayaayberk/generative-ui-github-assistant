'use client'

import { Profile } from './Profile'
import { GithubUser } from '@/lib/types'

export function ProfileList({ props: profiles }: { props: GithubUser[] }) {
  if (!Array.isArray(profiles)) {
    return []
  }
  if (profiles.length === 0) {
    return []
  }
  return (
    <div className='flex flex-col gap-2'>
      {profiles.map((user: GithubUser, index) => {
        return <Profile key={index} props={user} />
      })}
    </div>
  )
}
