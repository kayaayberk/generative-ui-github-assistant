'use client'

import { FC, memo } from 'react'
import { Button } from '@/components/ui/button'
import { Check, Copy, Download } from '@phosphor-icons/react'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { vscDarkPlus } from 'react-syntax-highlighter/dist/cjs/styles/prism'
import { useCopyToClipboard } from '@/lib/hooks/use-copy-to-clipboard'

interface Props {
  language: string
  value: string
}

interface languageMap {
  [key: string]: string | undefined
}

export const programmingLanguages: languageMap = {
  javascript: '.js',
  python: '.py',
  java: '.java',
  c: '.c',
  cpp: '.cpp',
  'c++': '.cpp',
  'c#': '.cs',
  ruby: '.rb',
  php: '.php',
  swift: '.swift',
  'objective-c': '.m',
  kotlin: '.kt',
  typescript: '.ts',
  go: '.go',
  perl: '.pl',
  rust: '.rs',
  scala: '.scala',
  haskell: '.hs',
  lua: '.lua',
  shell: '.sh',
  sql: '.sql',
  html: '.html',
  css: '.css',
  // add more file extensions here, make sure the key is same as language prop in CodeBlock.tsx component
}

export const generateRandomString = (length: number, lowercase = false) => {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXY3456789' // excluding similar looking characters like Z, 2, I, 1, O, 0
  let result = ''
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return lowercase ? result.toLowerCase() : result
}

const CodeBlock: FC<Props> = memo(({ language, value }) => {
  const { isCopied, copyToClipboard } = useCopyToClipboard({ timeout: 2000 })

  const onCopy = () => {
    if (isCopied) return
    copyToClipboard(value)
  }

  return (
    <div className='relative w-full font-sans codeblock bg-zinc-950 rounded-md border'>
      <div className='flex items-center justify-between w-full px-6 py-1 pr-2 rounded-t-md bg-zinc-800 text-zinc-100'>
        <span className='text-xs lowercase'>{language}</span>
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
        language={language}
        style={vscDarkPlus}
        PreTag='div'
        showLineNumbers
        customStyle={{
          margin: 0,
          width: 'auto',
          height: 'auto' ,
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
            fontSize: '0.9rem',
            fontFamily: 'var(--font-mono)',
          },
        }}
      >
        {value}
      </SyntaxHighlighter>
    </div>
  )
})
CodeBlock.displayName = 'CodeBlock'

export { CodeBlock }
