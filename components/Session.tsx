'use client'

import {
  LoginLink,
  LogoutLink,
  RegisterLink,
} from '@kinde-oss/kinde-auth-nextjs'
import { SignOut } from '@phosphor-icons/react/dist/ssr'

function Session() {
  return (
    <>
      <LogoutLink className='flex items-center gap-1.5 p-2 whitespace-nowrap text-sm rounded-md dark:hover:bg-muted'>
        <SignOut size={16} />
        Log out
      </LogoutLink>

      <LoginLink className='whitespace-nowrap'>Log in</LoginLink>
      <RegisterLink className='whitespace-nowrap'>Sign up</RegisterLink>
    </>
  )
}

export default Session
