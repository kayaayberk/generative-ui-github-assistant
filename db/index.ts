import { NeonQueryFunction, neon } from '@neondatabase/serverless'
import { drizzle } from 'drizzle-orm/neon-http'

const sql: NeonQueryFunction<boolean, boolean> = neon(process.env.DATABASE_URL!)
export const db = drizzle(sql)
