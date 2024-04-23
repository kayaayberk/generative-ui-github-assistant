'use client'

import Image from 'next/image'
import { cn } from '@/lib/utils'
import remarkGfm from 'remark-gfm'
import { Spinner } from './Spinner'
import remarkMath from 'remark-math'
import { useUser } from '@clerk/nextjs'
import { StreamableValue } from 'ai/rsc'
import { Skeleton } from '../ui/skeleton'
import { CodeBlock } from '../ui/code-block'
import { Sparkle, User } from '@phosphor-icons/react'
import { MemoizedReactMarkdown } from '../Markdown'
import { useStreamableText } from '@/lib/hooks/use-streamable-text'
import { useTheme } from 'next-themes'

export function SpinnerMessage() {
  return (
    <div className='group relative flex items-start md:-ml-12'>
      <div className='flex size-[24px] shrink-0 select-none items-center justify-center rounded-md border bg-primary text-primary-foreground shadow-sm'>
        <Sparkle />
      </div>
      <div className='ml-4 h-[24px] flex flex-row items-center flex-1 space-y-2 overflow-hidden px-1'>
        {Spinner}
      </div>
    </div>
  )
}

export function BotMessage({
  content,
  className,
}: {
  content: string | StreamableValue<string>
  className?: string
}) {
  const { rawContent, isLoading } = useStreamableText(content)

  return (
    <div className={cn('group relative flex items-start md:-ml-12', className)}>
      <div className='flex size-[25px] shrink-0 select-none items-center justify-center rounded-md bg-primary text-primary-foreground shadow-sm'>
        <Sparkle />
      </div>
      <div className='ml-4 flex-1 space-y-2 overflow-hidden px-1'>
        <span className='font-semibold'>GitHub Assistant</span>
        <MemoizedReactMarkdown
          className='prose break-words dark:prose-invert prose-p:leading-relaxed prose-pre:p-0'
          remarkPlugins={[remarkGfm, remarkMath]}
          components={{
            p({ children }) {
              return <p className='mb-0.5 last:mb-0'>{children}</p>
            },
            code({ node, inline, className, children, ...props }) {
              if (children && children.length) {
                if (children[0] == '▍') {
                  return (
                    <span className='mt-1 animate-pulse cursor-default'>▍</span>
                  )
                }

                children[0] = (children[0] as string).replace('`▍`', '▍')
              }

              const match = /language-(\w+)/.exec(className || '')

              if (inline) {
                return (
                  <code className={className} {...props}>
                    {children}
                  </code>
                )
              }

              return (
                <CodeBlock
                  key={Math.random()}
                  language={(match && match[1]) || ''}
                  value={String(children).replace(/\n$/, '')}
                  {...props}
                />
              )
            },
          }}
        >
          {rawContent}
        </MemoizedReactMarkdown>
      </div>
    </div>
  )
}

export function UserMessage({ children }: { children: React.ReactNode }) {
  const { isLoaded, isSignedIn, user } = useUser()
  const { theme } = useTheme()

  return (
    <div className='group relative flex items-start md:-ml-12'>
      <div className='flex size-[25px] shrink-0 select-none items-center justify-center bg-black dark:bg-white rounded-md bg-background shadow-sm overflow-hidden'>
        {!user?.imageUrl ? (
          // <Skeleton className='size-9 rounded-full' />
          <User color={theme === 'light' ? 'white' : 'black'} />
        ) : (
          <Image src={user.imageUrl} alt='User Image' width={25} height={25} />
        )}
      </div>
      <div className='ml-4 flex-1 flex flex-col gap-2 overflow-hidden px-1'>
        <span className='font-semibold'>You</span>
        {children}
      </div>
    </div>
  )
}

export function BotCard({
  children,
  showAvatar = true,
}: {
  children: React.ReactNode
  showAvatar?: boolean
}) {
  return (
    <div className='group relative flex items-start md:-ml-12'>
      <div
        className={cn(
          'flex size-[24px] shrink-0 select-none items-center justify-center rounded-md bg-primary text-primary-foreground shadow-sm',
          !showAvatar && 'invisible',
        )}
      >
        <Sparkle />
      </div>
      <div className='ml-4 w-full'>{children}</div>
    </div>
  )
}

export function SystemMessage({ children }: { children: React.ReactNode }) {
  return (
    <div
      className={
        'mt-2 flex items-center justify-center gap-2 text-xs text-gray-500'
      }
    >
      <div className={'max-w-[600px] flex-initial p-2'}>{children}</div>
    </div>
  )
}
