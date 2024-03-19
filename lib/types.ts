import { KindeUser } from '@kinde-oss/kinde-auth-nextjs/dist/types'
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
