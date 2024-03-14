'use client'

import { LoginLink, RegisterLink } from '@kinde-oss/kinde-auth-nextjs'

function Session() {
  return (
    <>
      <LoginLink className='whitespace-nowrap'>Log in</LoginLink>
      <RegisterLink className='whitespace-nowrap'>Sign up</RegisterLink>
    </>
  )
}

export default Session
