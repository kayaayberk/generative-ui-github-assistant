import { GithubUser } from '../types'
import { cache, useEffect, useState } from 'react'
import { getGithubProfile, listUsers } from '../chat/github/github'
import { QueryCache, useQuery } from '@tanstack/react-query'

type UserList = {
  login: string
}
type ProfileList = {
  profiles: GithubUser[] | undefined
  isLoading: boolean
  isError: boolean
  error: Error | null
}
/**
 * The `useProfileConverter` custom hook fetches a list of users based on a query, retrieves
 * their Github profiles, and returns an array of converted GithubUser objects. Since the type of profile data that comes from the endpoint
 * `/users/{query}` is different from the type of profile data that comes from the endpoint `/users/{username}`, the `useProfileConverter`
 * function helps to convert incoming user data to the `GithubUser` type.
 * @param {string} query - The `query` parameter in the `useProfileConverter` function is a string that
 * is used to search for Github users. This query string is constructed by the ai and passed to the `listUsers` function to fetch
 * a list of users matching the query.
 * @returns The `useProfileConverter` function returns an array of `GithubUser` objects. This array is
 * populated with user profiles fetched from the GitHub API based on the provided query string to be used on client side.
 */
export function useProfileConverter(query: string): ProfileList {
  const fetchListData = async () => {
    const userList = await listUsers(query)

    const promises = userList.items.map(async (user: UserList) => {
      const profile = await getGithubProfile(user.login)
      return profile
    })
    const profiles = await Promise.all(promises)
    return profiles
  }

  const {
    data: profiles = [],
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ['profiles', query],
    queryFn: () => fetchListData(),
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    refetchOnMount: false,
    staleTime: Infinity,
  })
  return {
    profiles,
    isLoading,
    isError,
    error,
  }
}
