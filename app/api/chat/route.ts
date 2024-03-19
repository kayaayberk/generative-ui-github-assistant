// import { db } from '@/db'
// import OpenAI from 'openai'
// import { nanoid } from 'nanoid'
// import { OpenAIStream, StreamingTextResponse } from 'ai'
// import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server'
// import { InsertChat, chat } from '@/db/schema'

// // Create an Edge friendly OpenAI API client
// const openai = new OpenAI({
//   apiKey: process.env.OPENAI_API_KEY,
// })

// export const runtime = 'edge'

// export async function POST(req: Request) {
//   const json = await req.json()
//   const { messages } = json
//   const { getUser } = getKindeServerSession()
//   const userId = (await getUser())?.id

//   if (!userId) {
//     return new Response('Unauthorized', { status: 401 })
//   }

//   // Ask OpenAI for a streaming chat completion given the prompt
//   const res = await openai.chat.completions.create({
//     model: 'gpt-3.5-turbo',
//     stream: true,
//     temperature: 0.7,
//     messages,
//   })

//   const stream = OpenAIStream(res, {
//     async onCompletion(completion) {
//       const title = json.messages[0].content.substring(0, 100)
//       const id = json.id ?? nanoid()
//       const createdAt = new Date()
//       const path = `/chat/${id}`
//       const payload: InsertChat = {
//         id: id,
//         title: title,
//         author: userId,
//         createdAt,
//         path,
//         messages: [
//           ...messages,
//           {
//             role: 'assistant',
//             content: completion,
//           },
//         ],
//       }
//       await db.insert(chat).values(payload)
//     },
//   })

//   return new StreamingTextResponse(stream)
// }
