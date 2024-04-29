'use client'

import {
  AlertDialog,
  AlertDialogTitle,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogDescription,
} from '@/components/ui/alert-dialog'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import * as React from 'react'
import { useToast } from './ui/use-toast'
import { useRouter } from 'next/navigation'
import LoadingSpinner from './LoadingSpinner'
import { Trash } from '@phosphor-icons/react'
import { Button } from '@/components/ui/button'
import { Chat, ServerActionResult } from '@/lib/types'

interface SidebarActionsProps {
  chat: Chat
  removeChat: (args: { id: string; path: string }) => ServerActionResult<void>
}

function SideBarActions({ chat, removeChat }: SidebarActionsProps) {
  const { toast } = useToast()
  const router = useRouter()
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false)
  const [isRemovePending, startRemoveTransition] = React.useTransition()

  return (
    <>
      <div className=''>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant='ghost'
              className='size-7 p-0 hover:bg-background'
              disabled={isRemovePending}
              onClick={() => setDeleteDialogOpen(true)}
            >
              <Trash />
              <span className='sr-only'>Delete</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>Delete chat</TooltipContent>
        </Tooltip>
      </div>
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your
              chat and remove the chat data from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isRemovePending}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              disabled={isRemovePending}
              onClick={(e) => {
                e.preventDefault()
                startRemoveTransition(async () => {
                  const result = await removeChat({
                    id: chat.id,
                    path: chat.path,
                  })
                  if (result && 'error' in result) {
                    toast({
                      title: 'Error',
                      description: result.error,
                      variant: 'destructive',
                    })
                    return
                  }
                  setDeleteDialogOpen(false)
                  router.refresh()
                  router.push('/chat')
                  toast({
                    title: 'Chat deleted',
                    description: 'Your chat has been successfully deleted.',
                    className: 'bg-green-500 text-white',
                  })
                })
              }}
              className='flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white'
            >
              {isRemovePending && <LoadingSpinner />}
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}

export default SideBarActions
