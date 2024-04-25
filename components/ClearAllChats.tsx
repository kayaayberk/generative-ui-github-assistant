'use client'

import {
  AlertDialog,
  AlertDialogTitle,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogTrigger,
  AlertDialogDescription,
} from '@/components/ui/alert-dialog'
import React from 'react'
import { Button } from './ui/button'
import { useToast } from './ui/use-toast'
import { useRouter } from 'next/navigation'
import { clearAllChats } from '@/app/actions'
import LoadingSpinner from './LoadingSpinner'
import { Trash } from '@phosphor-icons/react'

function ClearAllChats({ userId }: { userId: string }) {
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false)
  const [isRemovePending, startRemoveTransition] = React.useTransition()
  const { toast } = useToast()
  const router = useRouter()
  return (
    <>
      <Button
        variant='outline'
        className='flex items-center justify-between px-2 py-1'
        disabled={isRemovePending}
        onClick={() => setDeleteDialogOpen(true)}
      >
        <span>Clear Chat History</span>
        <span>
          <Trash size={18} />
        </span>
      </Button>
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete all of
              your chat history and remove the chat data from our servers.
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
                  const result = await clearAllChats(userId)
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

export default ClearAllChats
