import OpenAI from 'openai'
import { OpenAIStream, StreamingTextResponse } from 'ai'
import { NextResponse } from 'next/server'
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server'
import { nanoid } from 'nanoid'

// Create an Edge friendly OpenAI API client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export const runtime = 'edge'

export async function POST(req: Request) {
  const json = await req.json()
  const { messages } = json
  const { getUser } = getKindeServerSession()
  const userId = (await getUser())?.id

  if (!userId) {
    return new Response('Unauthorized', { status: 401 })
  }

  // Ask OpenAI for a streaming chat completion given the prompt
  const res = await openai.chat.completions.create({
    model: 'gpt-3.5-turbo',
    stream: true,
    temperature: 0.7,
    messages,
  })

  const stream = OpenAIStream(res, {
    async onCompletion(completion) {
      const title = json.messages[0].content.substring(0, 100)
      const id = json.id ?? nanoid()
      const createdAt = Date.now()
      const path = `/chat/${id}`
      const payload = {
        id,
        title,
        userId,
        createdAt,
        path,
        messages: [
          ...messages,
          {
            content: completion,
            role: 'assistant',
          },
        ],
      }
      // await
    },
  })

  return new StreamingTextResponse(stream)
}
//   try {
//     if (!process.env.OPENAI_API_KEY) {
//       return new NextResponse('Missing OpenAI API key', { status: 400 })
//     }
//     const { messages } = await req.json()

//     // Convert the response into text-stream
//     const stream = OpenAIStream(response)
//     // Respond with the stream
//     return new StreamingTextResponse(stream)
//   } catch (error) {
//     if (error instanceof OpenAI.APIError) {
//       const { name, status, headers, message } = error
//       return NextResponse.json({ name, status, headers, message }, { status })
//     } else {
//       throw error
//     }
//   }
// }
