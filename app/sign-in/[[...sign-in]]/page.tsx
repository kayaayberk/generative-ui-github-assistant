import { SignIn } from '@clerk/nextjs'
import React from 'react'

function SignInPage() {
  return (
    <div className='flex justify-center size-full items-center'>
      <SignIn afterSignInUrl={'/chat'} />
    </div>
  )
}

export default SignInPage
