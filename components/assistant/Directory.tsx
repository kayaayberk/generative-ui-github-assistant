'use client'

import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from '@/components/ui/accordion'
import { Button } from '../ui/button'
import { Directory as Dir } from '@/lib/types'
import React, { useEffect, useState } from 'react'
import { useDecoder } from '@/lib/hooks/use-decoder'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { useCopyToClipboard } from '@/lib/hooks/use-copy-to-clipboard'
import { Check, Copy, File, FolderSimple } from '@phosphor-icons/react'
import { vscDarkPlus } from 'react-syntax-highlighter/dist/cjs/styles/prism'
import { useGetDirectoryContent } from '@/lib/hooks/use-get-directory-content'

export default function Directory({ props: directory }: { props: Dir[] }) {
  return (
    <Accordion type='single' collapsible className=''>
      <div className='border rounded-md p-2'>
        {Array.isArray(directory) &&
          directory
            .sort((a, b) => {
              if (a.type === 'dir' && b.type === 'file') {
                return -1
              } else if (a.type === 'file' && b.type === 'dir') {
                return 1
              } else {
                return 0
              }
            })
            .map((dir, index) => {
              return dir.type === 'file' ? (
                <AccordionItem
                  value={`item-${index}`}
                  className=' gap-1 w-full text-sm font-semibold last:border-none'
                  key={index}
                >
                  <AccordionTrigger className='p-2 justify-start gap-2 text-sm font-semibold'>
                    <span className='flex items-center gap-1'>
                      <File size={18} color='#c2c2c2' weight='fill' />
                      <span>{dir.name}</span>
                    </span>
                  </AccordionTrigger>
                  <AccordionContent>
                    <DropdownFileContent url={dir.url} />
                  </AccordionContent>
                </AccordionItem>
              ) : (
                <AccordionItem
                  value={`item-${index}`}
                  className='gap-1 w-full text-sm font-semibold last:border-none'
                  key={index}
                >
                  <AccordionTrigger className='p-2 justify-start gap-2 text-sm font-semibold'>
                    <span className='flex items-center gap-1'>
                      <FolderSimple size={18} color='#c2c2c2' weight='fill' />
                      <span>{dir.name}</span>
                    </span>
                  </AccordionTrigger>
                  <AccordionContent>
                    <DropdownContent url={dir._links.self} />
                  </AccordionContent>
                </AccordionItem>
              )
            })}
      </div>
    </Accordion>
  )
}

function DropdownContent({ url }: { url: string }) {
  const data = useGetDirectoryContent(url)
  if (!data) {
    return null
  }
  const { fetchedData, isLoading } = data

  return (
    <Accordion type='single' collapsible className='ml-5'>
      {fetchedData &&
        Array.isArray(fetchedData) &&
        fetchedData
          .sort((a, b) => {
            if (a.type === 'dir' && b.type === 'file') {
              return -1
            } else if (a.type === 'file' && b.type === 'dir') {
              return 1
            } else {
              return 0
            }
          })
          .map((item, index) => {
            return item.type === 'file' ? (
              <AccordionItem
                value={`item-${index}`}
                className='gap-1 w-full p-2 text-sm font-semibold '
                key={index}
              >
                <AccordionTrigger
                  value={`item-${index}`}
                  key={index}
                  className=' p-0 ml-1.5 flex justify-start'
                >
                  <span className='flex items-center gap-1 ml-2'>
                    <File size={18} color='#c2c2c2' weight='fill' />
                    <span>{item.name}</span>
                  </span>
                </AccordionTrigger>
                <AccordionContent>
                  <DropdownFileContent url={item.url} />
                </AccordionContent>
              </AccordionItem>
            ) : (
              <AccordionItem value={`item-${index}`} key={index} className=''>
                <AccordionTrigger className='p-2 justify-start gap-2 text-sm font-semibold ml-1.5'>
                  <span className='flex items-center gap-1'>
                    <FolderSimple size={18} color='#c2c2c2' weight='fill' />
                    <span>{item.name}</span>
                  </span>
                </AccordionTrigger>
                <AccordionContent>
                  <DropdownContent url={item._links.self} />
                </AccordionContent>
              </AccordionItem>
            )
          })}
    </Accordion>
  )
}

function DropdownFileContent({
  url,
  className,
}: {
  url: string
  className?: string
}) {
  const { isCopied, copyToClipboard } = useCopyToClipboard({ timeout: 2000 })
  const data = useDecoder(url)

  if (!data) {
    return null
  }

  const { fetchedData } = data

  const match = /language-(\w+)/.exec(className || '')

  const onCopy = () => {
    if (isCopied) return
    copyToClipboard(fetchedData)
  }

  return (
    <div className='relative md:w-full mt-4 font-sans codeblock bg-zinc-950 rounded-md border'>
      <div className='flex items-center justify-between w-full px-6 py-1 pr-2 rounded-t-md bg-zinc-800 text-zinc-100'>
        <span className='text-xs lowercase'>{(match && match[1]) || ''}</span>
        <div className='flex items-center space-x-1'>
          <Button
            variant='ghost'
            size='icon'
            className='focus-visible:ring-1 focus-visible:ring-slate-700 hover:bg-gray-200 dark:hover:bg-gray-500/20 focus-visible:ring-offset-0'
            onClick={onCopy}
          >
            {isCopied ? <Check size={16} /> : <Copy size={16} />}
          </Button>
        </div>
      </div>
      <SyntaxHighlighter
        language={(match && match[1]) || ''}
        style={vscDarkPlus}
        PreTag='div'
        showLineNumbers
        customStyle={{
          margin: 0,
          width: '100%',
          height: '300px',
          background: 'transparent',
          padding: '1.5rem 1rem',
          overflowX: 'scroll',
          overflowY: 'scroll',
        }}
        lineNumberStyle={{
          userSelect: 'none',
        }}
        codeTagProps={{
          style: {
            fontSize: '0.8rem',
            fontFamily: 'var(--font-mono)',
          },
        }}
      >
        {fetchedData}
      </SyntaxHighlighter>
    </div>
  )
}
