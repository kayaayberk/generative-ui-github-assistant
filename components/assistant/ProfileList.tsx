'use client'

import { GithubUser, ListOfUsers } from '@/lib/types'
import { Profile } from './Profile'
import { useEffect, useState } from 'react'
import { getGithubProfile, listUsers } from '@/lib/chat/github/github'
import { set } from 'zod'
import { useProfileConverter } from '@/lib/hooks/use-profile-converter'

export function ProfileList({ props: query }: { props: string }) {
  const userDataArray = useProfileConverter(query)

  return (
    <div>
      {userDataArray.map((user: GithubUser, index) => {
        return <Profile key={index} props={user} />
      })}
    </div>
  )
}
