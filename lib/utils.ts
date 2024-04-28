import { type ClassValue, clsx } from 'clsx'
import { customAlphabet } from 'nanoid'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const nanoid = customAlphabet(
  '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz',
  7,
)

export const sleep = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms))

export const runAsyncFnWithoutBlocking = (
  fn: (...args: any) => Promise<any>,
) => {
  fn()
}

export const getMediumFont = async () => {
  const response = await fetch(
    new URL('@/assets/fonts/LabilGrotesk-Medium.ttf', import.meta.url),
  )
  const font = await response.arrayBuffer()
  return font
}
