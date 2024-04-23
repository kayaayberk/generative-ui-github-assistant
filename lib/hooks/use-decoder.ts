import { useEffect, useState } from 'react'
import { useAuth } from '@clerk/nextjs'
import { decodeContent } from '../chat/github/github'

export function useDecoder(url: string) {
  const [fetchedData, setFetchedData] = useState<string>()
  const [isLoading, setIsLoading] = useState(false)
  const { userId } = useAuth()

  useEffect(() => {
    ;(async () => {
      const data = await decodeContent(url, userId ? userId : null)
      if (!data) {
        return
      }
      setFetchedData(Buffer.from(data, 'base64').toString('utf8'))
    })()
  }, [url])
  if (!fetchedData) {
    return null
  }
  return {
    fetchedData,
  }
}
