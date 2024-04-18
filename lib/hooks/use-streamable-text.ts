import { StreamableValue, readStreamableValue } from 'ai/rsc'
import { useEffect, useState } from 'react'

/**
 * The useStreamableText hook is used to handle streaming text content, updating the raw content state
 * based on the provided string or StreamableValue.
 * @param {string | StreamableValue<string>} content - The `content` parameter in the
 * `useStreamableText` custom hook can be either a string or a `StreamableValue<string>`. If it is a
 * string, it is directly set as the initial `rawContent` state. If it is a `StreamableValue<string>`,
 * the
 * @returns The `useStreamableText` custom hook returns the `rawContent` state value, which is either
 * the initial `content` string or the accumulated value from reading a `StreamableValue<string>`
 * object asynchronously.
 * Custom hook by Vercel see here: https://github.com/vercel/ai-chatbot/blob/main/lib/hooks/use-streamable-text.ts#L4
 */
export const useStreamableText = (
  content: string | StreamableValue<string>,
) => {
  const [rawContent, setRawContent] = useState(
    typeof content === 'string' ? content : '',
  )

  const [isLoading, setIsLoading] = useState(typeof content === 'object')

  useEffect(() => {
    ;(async () => {
      if (typeof content === 'object') {
        let value = ''
        for await (const delta of readStreamableValue(content)) {
          if (typeof delta === 'string') {
            setRawContent((value = value + delta))
          }
        }
        setIsLoading(false)
      }
    })()
  }, [content])
  return { rawContent, isLoading }
}
