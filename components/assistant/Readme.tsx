'use client'

import { cn } from '@/lib/utils'
import rehypeRaw from 'rehype-raw'
import remarkGfm from 'remark-gfm'
import remarkMath from 'remark-math'
import { CodeBlock } from '../ui/code-block'
import { MemoizedReactMarkdown } from '../Markdown'

export function Readme({ props: readme }: { props: string }) {
  return (
    <div className={cn('group flex items-start w-full')}>
      <div className='flex-1 space-y-2 overflow-hidden px-1 w-full'>
        <span className='font-semibold'>GitHub Assistant</span>
        <MemoizedReactMarkdown
          className='prose break-words dark:prose-invert prose-p:leading-relaxed prose-pre:p-0 border rounded-md p-4 text-sm'
          rehypePlugins={[rehypeRaw as any, { allowDangerousHtml: true }]}
          remarkPlugins={[remarkGfm, remarkMath]}
          skipHtml={false}
          components={{
            p({ children }) {
              return <p className='mb-0.5 last:mb-0'>{children}</p>
            },
            br() {
              return <></>
            },
            h1({ children }) {
              return <h1 className='text-xl font-semibold'>{children}</h1>
            },
            h2({ children }) {
              return <h2 className='text-lg font-semibold'>{children}</h2>
            },
            h3({ children }) {
              return <h3 className='text-base font-semibold'>{children}</h3>
            },
            a({ node, href, children, ...props }) {
              let target = ''

              if (href?.startsWith('http')) {
                target = '_blank'
              } else if (href?.startsWith('#')) {
                target = '_self'
              }

              return (
                <a
                  href={href}
                  target={target}
                  rel='noreferrer'
                  className='text-blue-600 hover:underline'
                  {...props}
                >
                  {children}
                </a>
              )
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
                  <code
                    className={cn(
                      'bg-muted-foreground/30 rounded-md px-1',
                      className,
                    )}
                    {...props}
                  >
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
          {typeof readme === 'string' ? readme : JSON.stringify(readme)}
        </MemoizedReactMarkdown>
      </div>
    </div>
  )
}
