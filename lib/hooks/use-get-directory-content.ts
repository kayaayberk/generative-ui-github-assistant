import { useEffect, useState } from 'react'
import { getDirContent } from '../chat/github/github'
import { Directory } from '../types'
import { useAuth } from '@clerk/nextjs'

export function useGetDirectoryContent(url: string) {
  const [fetchedData, setFetchedData] = useState<Directory[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const { userId } = useAuth()

  useEffect(() => {
    ;(async () => {
      setIsLoading(true)
      const data = await getDirContent(url, userId ? userId : null)
      setFetchedData(data)
    })()

    setIsLoading(false)
  }, [url, userId])
  if (!fetchedData) {
    return null
  }
  return { fetchedData, isLoading }
}
