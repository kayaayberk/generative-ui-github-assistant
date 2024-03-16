import { drizzle } from 'drizzle-orm/neon-http'
import { migrate } from 'drizzle-orm/neon-http/migrator'
import { NeonQueryFunction, neon } from '@neondatabase/serverless'
import * as dotenv from 'dotenv'

dotenv.config({
  path: '.env.local',
})

const sql: NeonQueryFunction<boolean, boolean> = neon(
  process.env.DATABASE_URL as string,
)

const db = drizzle(sql)

const main = async () => {
  try {
    await migrate(db, {
      migrationsFolder: './db/migrations',
    })
    console.log('Migration completed successfully.')
  } catch (e) {
    console.error('Migration error:', e)
    process.exit(1)
  }
}

main()
