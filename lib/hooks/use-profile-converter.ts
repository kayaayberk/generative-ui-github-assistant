import { useEffect, useState } from 'react'
import { GithubUser } from '../types'
import { getGithubProfile, listUsers } from '../chat/github/github'
import { profile } from 'console'

export function useProfileConverter(query: string): GithubUser[] {
  const [user, setUser] = useState<string[]>([])
  const [profile, setProfile] = useState<GithubUser[]>([])

  useEffect(() => {
    const fetchData = async () => {
      const users = await listUsers(query)
      const userListData = users.items.map((user) => {
        return user.login
      })
      setUser(userListData)
    }
    fetchData()
    const fetchProfileData = async () => {
      const promises = user.map((u) => getGithubProfile(u))
      const profiles = await Promise.all(promises)
      setProfile(profiles)
    }
    fetchProfileData()
  }, [query, user])
  return profile
}
