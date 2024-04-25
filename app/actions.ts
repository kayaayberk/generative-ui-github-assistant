'use server'

import { db } from '@/db'
import { eq } from 'drizzle-orm'
import { type Chat } from '@/lib/types'
import { InsertChat, SelectChat, chat } from '@/db/schema'
import { revalidatePath } from 'next/cache'
import { QueryCache } from '@tanstack/react-query'
import { clerkClient, currentUser } from '@clerk/nextjs'

type GetChatResult = SelectChat[] | null
type SetChetResults = InsertChat[]

/**
 * `getChat` function retrieves a chat based on its ID and the logged-in user's ID, ensuring that
 * the user is the author of the chat.
 * @param {string} id - The `id` parameter is a string that represents the unique identifier of the
 * chat you want to retrieve.
 * @param {string} loggedInUserId - The `loggedInUserId` parameter represents
 * the ID of the user who is currently logged in and trying to access the chat. This parameter is used
 * to ensure that only the author of the chat can access and view the chat details. If the
 * `loggedInUserId` does not
 * @returns The `getChat` function is returning a Promise that resolves to a `GetChatResult`. If the
 * `receivedChat` array is empty or the author of the chat is not the same as the `loggedInUserId`, the
 * function returns `null`. Otherwise, it returns the `receivedChat` array.
 */
export async function getChat(id: string, loggedInUserId: string) {
  const receivedChat = await db
    .select({
      id: chat.id,
      title: chat.title,
      author: chat.author,
      path: chat.path,
      messages: chat.messages,
      createdAt: chat.createdAt,
    })
    .from(chat)
    .where(eq(chat.id, id))

  if (!receivedChat.length || receivedChat[0].author !== loggedInUserId) {
    return null
  }
  return receivedChat
}

/**
 * `getChats` function retrieves chats for a specific user ID from a database and returns them as
 * an array of Chat objects.
 * @param {string | null} userId - The `userId` parameter is a string that represents the user for whom
 * we want to retrieve chats. It can also be `null` if the user is not authenticated.
 * @returns The function `getChats` returns a Promise that resolves to a `GetChatResult`, which is an
 * array of `Chat` objects. If the `userId` parameter is null, an empty array is returned. If there is
 * an error during the database query, an empty array is also returned.
 */
export async function getChats(userId?: string | null) {
  if (!userId) {
    return []
  }

  try {
    const receivedChats: SelectChat[] = await db
      .select()
      .from(chat)
      .where(eq(chat.author, userId))

    return receivedChats as Chat[]
  } catch (e) {
    console.error(`getChats error: ${e}`)
    return []
  }
}

/**
 * The function `saveChat` saves a chat object to a database with conflict resolution logic.
 * @param {Chat} savedChat - The `savedChat` parameter is an object of type `Chat` that contains the
 * data to be saved in the database.
 */
export async function saveChat(savedChat: Chat) {
  const user = await currentUser()

  if (user) {
    await db
      .insert(chat)
      .values(savedChat)
      .onConflictDoUpdate({
        target: chat.id,
        set: { id: savedChat.id, messages: savedChat.messages },
      })
  }
}

/**
 * The function `getMissingKeys` returns an array of environment variable keys that are required but
 * not present in the current environment.
 * @returns The `getMissingKeys` function is returning an array of keys that are missing from the
 * `process.env` object. The keys that are missing are those that are listed in the `keysRequired`
 * array but are not found in the `process.env` object.
 * From Vercel, see here: https://github.com/vercel/ai-chatbot/blob/main/app/actions.ts
 */
export async function getMissingKeys() {
  const keysRequired = ['OPENAI_API_KEY']
  return keysRequired
    .map((key) => (process.env[key] ? '' : key))
    .filter((key) => key !== '')
}

export async function removeChat({ id, path }: { id: string; path: string }) {
  const user = await currentUser()

  if (!user) {
    return {
      error: 'Unauthorized',
    }
  }

  if (user) {
    const uid = String(
      await db
        .select({ author: chat.author })
        .from(chat)
        .where(eq(chat.author, user.id)),
    )
  }

  await db.delete(chat).where(eq(chat.id, id))
  await db.delete(chat).where(eq(chat.path, path))
  const queryCache = new QueryCache({
    onError: (error) => {
      console.log(error)
    },
    onSuccess: (data) => {
      console.log(data)
    },
    onSettled: (data, error) => {
      console.log(data, error)
    },
  })
  const query = queryCache.find({ queryKey: ['profiles'] })

  revalidatePath('/')
  return revalidatePath(path)
}

export const getGithubAccessToken = async (userId: string) => {
  if (!userId) {
    throw new Error('userId not found')
  }
  const provider = 'oauth_github'

  const clerkResponse = await clerkClient.users.getUserOauthAccessToken(
    userId,
    provider,
  )

  const accessToken = clerkResponse[0].token
  return accessToken as string
}

export const clearAllChats = async (userId: string) => {
  const user = await currentUser()
  if (!user || !userId) {
    return {
      error: 'Unauthorized',
    }
  }

  if (user) {
    const allChats: Chat[] = await db
      .select()
      .from(chat)
      .where(eq(chat.author, user.id))

    if (allChats.length) {
      await db.delete(chat).where(eq(chat.author, userId))
    }
    return revalidatePath(allChats.map((chat) => chat.path).join(', ')) // Fix: Pass a single string instead of an array of strings
  }
}
