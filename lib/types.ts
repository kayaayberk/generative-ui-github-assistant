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

export interface AttributeTypes {
  name: string
  value: string
  role: string
  icon?: React.ReactNode
  status: string
}

export interface RepoFetchProps {
  total_count: number
  incomplete_results: boolean
  items: RepoProps[]
}

export interface RepoProps {
  id: number
  name: string
  full_name: string
  homepage: string
  owner: {
    login: string
    avatar_url: string
    url: string
  }
  html_url: string
  description: string
  language: string
  stargazers_count: number
  open_issues: number
  license: {
    spdx_id: string
  }
  issues_url: string
  tags_url: string
  languages_url: string
  updated_at: string
  topics: string[]
  commits_url: string
}

export interface Readme {
  name: string
  path: string
  url: string
  html_url: string
  content: string
  encoding: string
}

export interface Directory {
  name: string
  path: string
  type: 'file' | 'dir'
  url: string
  html_url: string
  sha: string
  content: string
  _links: {
    git: string
    self: string
    html: string
  }
}