'use server'

import { db } from '@/db'
import { SelectChat, chat } from '@/db/schema'
import { Chat } from '@/lib/types'
import { eq } from 'drizzle-orm'

type GetChatResult = SelectChat[] | null

export async function getChat(
  id: string,
  loggedInUserId: string,
): Promise<GetChatResult> {
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
  console.log(receivedChat)
  if (!receivedChat.length || receivedChat[0].author !== loggedInUserId) {
    return null
  }
  return receivedChat
}
