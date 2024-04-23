'use client'

function LoadingSpinner() {
  return (
    <div className='grid h-screen w-full place-content-center'>
      <div
        className='inline-block size-4 animate-spin rounded-full border-[2px] border-current border-t-transparent text-white'
        role='status'
        aria-label='loading'
      >
        <span className='sr-only'>Loading...</span>
      </div>
    </div>
  )
}

export default LoadingSpinner
