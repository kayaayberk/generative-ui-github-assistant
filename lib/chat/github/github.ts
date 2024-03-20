import { GithubUser, ListOfUsers } from '@/lib/types'

export const getGithubProfile = async (username: string) => {
  const res = await fetch(`https://api.github.com/users/${username}`, {
    method: 'GET',
    headers: {
      Accept: 'application/vnd.github+json',
      Authorization: `Bearer ${process.env.GITHUB_API_KEY}`,
      'X-GitHub-Api-Version': '2022-11-28',
    },
  })

  if (!res.ok)
    throw new Error(
      `Failed to fetch Profile endpoint at github.ts. Status: ${res.status}`,
    )
  const githubUserData: GithubUser = await res.json()
  return githubUserData as GithubUser
}

export const listUsers = async (query: string) => {
  const res = await fetch(
    `https://api.github.com/search/users?q=${query}&per_page=4&page=1`,
    {
      method: 'GET',
      headers: {
        Accept: 'application/vnd.github+json',
        Authorization: `Bearer ${process.env.GITHUB_API_KEY}`,
        'X-GitHub-Api-Version': '2022-11-28',
      },
    },
  )

  if (!res.ok)
    throw new Error(
      `Failed to fetch Profile endpoint at github.ts. Status: ${res.status}`,
    )
  const githubUserList: ListOfUsers = await res.json()
  return githubUserList as ListOfUsers
}
