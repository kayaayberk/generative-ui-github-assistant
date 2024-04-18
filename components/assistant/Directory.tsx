'use client'

import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from '@/components/ui/accordion'
import { Directory as Dir } from '@/lib/types'
import React, { useEffect, useState } from 'react'
import { File, FolderSimple } from '@phosphor-icons/react'

export default function Directory({ props }: { props: Dir[] }) {
  return (
    <Accordion type='single' collapsible className='w-full'>
      <div className='border rounded-md p-2'>
        {Array.isArray(props) &&
          props
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
                  className='flex items-center gap-1 w-full p-2 text-sm font-semibold last:border-none'
                  key={index}
                >
                  <span className='flex ml-6 items-center gap-1'>
                    <File size={18} color='gray' weight='fill' />
                    <span>{dir.name}</span>
                  </span>
                </AccordionItem>
              ) : (
                <AccordionItem
                  value={`item-${index}`}
                  className='text-sm font-semibold'
                  key={index}
                >
                  <AccordionTrigger className='p-2 justify-start gap-2 text-sm font-semibold'>
                    {' '}
                    <span className='flex items-center gap-1'>
                      <FolderSimple size={18} color='gray' weight='fill' />
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
  const [fetchedData, setFetchedData] = useState<any[]>([])

  useEffect(() => {
    fetch(url)
      .then((response) => response.json())
      .then((data) => setFetchedData(data))
  }, [url])

  return (
    <Accordion type='single' collapsible className='ml-5'>
      {fetchedData
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
              className='flex items-center gap-1 w-full p-2 text-sm font-semibold last:border-none last:pb-0'
              key={index}
            >
              <span className='flex items-center gap-1 ml-6'>
                <File size={18} color='gray' weight='fill' />
                <span>{item.name}</span>
              </span>
            </AccordionItem>
          ) : (
            <AccordionItem
              value={`item-${index}`}
              key={index}
              className='last:border-none'
            >
              <AccordionTrigger className='p-2 justify-start gap-2 text-sm font-semibold'>
                {' '}
                <span className='flex items-center gap-1'>
                  <FolderSimple size={18} color='gray' weight='fill' />
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
