import { type Message } from 'ai'

export interface Chat extends Record<string, any> {
  id: string
  title: string
  author: string
  createdAt: Date
  path: string
  messages: Message[]
  sharedPath?: string
}

export type ServerActionResult<Result> = Promise<
  | Result
  | {
      error: string
    }
>

export interface Session {
  id: string
  email: string
  family_name: string
  given_name: string
  createdAt: Date
}

export interface GithubUser {
  name?: string
  avatar_url: string
  login: string
  html_url: string
  company?: string
  blog?: string
  location?: string
  email?: string
  bio?: string
  twitter_username?: string
  followers: number
  following: number
  created_at: Date
  public_repos: number
}

export interface ListOfUsers {
  incomplete_results: boolean
  items: GithubUser[]
  total_count: number
}
