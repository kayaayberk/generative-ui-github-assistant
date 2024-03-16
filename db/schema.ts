import { json, pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core'
import { type InferSelectModel, type InferInsertModel } from 'drizzle-orm'

export const user = pgTable('user', {
  id: text('id').notNull().primaryKey(),
  email: text('email').notNull().unique(),
  name: text('name').notNull(),
  surname: text('surname').notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
})

export const chat = pgTable('chat', {
  id: text('id').notNull().primaryKey(),
  title: text('title').notNull(),
  author: text('author')
    .notNull()
    .references(() => user.id),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  path: text('path').notNull(),
  messages: json('messages').$type<string[]>(),
})

export type SelectUser = InferSelectModel<typeof user>
export type InsertUser = InferInsertModel<typeof user>

export type SelectChat = InferSelectModel<typeof chat>
export type InsertChat = InferInsertModel<typeof chat>
