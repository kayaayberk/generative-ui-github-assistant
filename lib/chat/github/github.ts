import { auth } from '@clerk/nextjs'
import { getGithubAccessToken } from '@/app/actions'
import {
  Directory,
  GithubUser,
  ListOfUsers,
  Readme,
  RepoFetchProps,
  RepoProps,
} from '@/lib/types'

/**
 * This TypeScript function fetches and returns a GitHub user's profile data using the GitHub API.
 * @param {string} username - The `username` parameter in the `getGithubProfile` function is a string
 * that represents the GitHub username of the user whose profile you want to retrieve.
 * @returns The function `getGithubProfile` returns a Promise that resolves to a `GithubUser` object
 * fetched from the GitHub API for the specified `username`.
 */
export const getGithubProfile = async (username: string) => {
  const { userId } = auth()
  if (!userId) {
    throw new Error('userId not found')
  }
  const accessToken = await getGithubAccessToken(userId)
  const res = await fetch(`https://api.github.com/users/${username}`, {
    method: 'GET',
    headers: {
      Accept: 'application/vnd.github+json',
      Authorization: `Bearer ${accessToken}`,
      'X-GitHub-Api-Version': '2022-11-28',
    },
  })

  const githubUserData: GithubUser = await res.json()
  return githubUserData as GithubUser
}

/**
 * The function `listUsers` fetches a list of GitHub users based on a query string using the GitHub API
 * with authentication.
 * @param {string} query - The `query` parameter in the `listUsers` function is provided by the AI and is a string that
 * represents the search query used to find users on GitHub. This query is used to search for users
 * based on specific criteria such as username, location, programming language, etc.
 * @returns The `listUsers` function is returning a list of GitHub users based on the provided query
 * string. The function makes a request to the GitHub API to search for users matching the query, with
 * a limit of 4 users per page. The response is then parsed as a `ListOfUsers` type and returned from
 * the function.
 */
export const listUsers = async (query: string) => {
  const { userId } = auth()
  if (!userId) {
    throw new Error('userId not found')
  }
  const accessToken = await getGithubAccessToken(userId)
  const res = await fetch(
    `https://api.github.com/search/users?q=${query}&per_page=4&page=1`,
    {
      method: 'GET',
      headers: {
        Accept: 'application/vnd.github+json',
        Authorization: `Bearer ${accessToken}`,
        'X-GitHub-Api-Version': '2022-11-28',
      },
    },
  )

  const githubUserList: ListOfUsers = await res.json()
  return githubUserList as ListOfUsers
}

/**
 * The function `convertUserType` takes a query string, retrieves a list of users matching the query,
 * fetches their GitHub profiles, and returns an array of profiles.
 * @param {string} query - The `query` parameter in the `convertUserType` function is provided by the AI and is a string that is
 * used to search for users.
 * @returns The `convertUserType` function is returning an array of GitHub profiles for users based on
 * the query provided. The function first fetches a list of users using the `listUsers` function, then
 * maps over the list to fetch the GitHub profile for each user using the `getGithubProfile` function.
 * Finally, it returns an array of profiles for all the users fetched.
 */
type UserList = {
  login: string
}

export const convertUserType = async (query: string) => {
  const userList = await listUsers(query)

  const promises = userList.items.map(async (user: UserList) => {
    const profile = await getGithubProfile(user.login)
    return profile
  })

  const profiles = await Promise.all(promises)
  return profiles
}

/**
 * The function `searchRepositories` in TypeScript fetches GitHub repositories based on a query string
 * using an access token.
 * @param {string} query - The `query` parameter in the `searchRespositories` function is a string that
 * represents the search query used to search for repositories on GitHub. This query is used to filter
 * the repositories based on specific criteria such as keywords, language, topics, etc.
 * @returns The function `searchRespositories` is returning an array of `RepoProps` objects.
 */
export const searchRespositories = async (query: string) => {
  const { userId } = auth()
  if (!userId) {
    throw new Error('userId not found')
  }
  const accessToken = await getGithubAccessToken(userId)
  const res = await fetch(
    `https://api.github.com/search/repositories?q=${query}&per_page=4&page=1`,
    {
      method: 'GET',
      headers: {
        Accept: 'application/vnd.github+json',
        Authorization: `Bearer ${accessToken}`,
        'X-GitHub-Api-Version': '2022-11-28',
      },
    },
  )

  const githubRepositories: RepoFetchProps = await res.json()
  const { items } = githubRepositories

  return items as RepoProps[]
}

export const getReadme = async (
  repo: string,
  owner: string,
): Promise<Readme> => {
  const { userId } = auth()
  if (!userId) {
    throw new Error('userId not found')
  }
  const accessToken = await getGithubAccessToken(userId)
  const res = await fetch(
    `https://api.github.com/repos/${owner}/${repo}/contents/README.md`,
    {
      method: 'GET',
      headers: {
        Accept: 'application/vnd.github.json',
        Authorization: `Bearer ${accessToken}`,
        'X-GitHub-Api-Version': '2022-11-28',
      },
    },
  )
  const readme: Readme = await res.json()

  // Decode the content from base64
  readme.content = Buffer.from(readme.content, 'base64').toString('utf8')
  return readme
}

export const getDir = async ({
  repo,
  owner,
}: {
  repo: string
  owner: string
}): Promise<Directory[]> => {
  const { userId } = auth()
  if (!userId) {
    throw new Error('userId not found')
  }
  const accessToken = await getGithubAccessToken(userId)

  const res = await fetch(
    `https://api.github.com/repos/${owner}/${repo}/contents/`,
    {
      method: 'GET',
      headers: {
        Accept: 'application/vnd.github+json',
        Authorization: `Bearer ${accessToken}`,
        'X-GitHub-Api-Version': '2022-11-28',
      },
    },
  )
  const dir = await res.json()
  // console.log('dir:', dir) // Debugging line
  return dir
}
// getDir({user: 'kayaayberk', repo: 'generative-ui-github-assistant'})
