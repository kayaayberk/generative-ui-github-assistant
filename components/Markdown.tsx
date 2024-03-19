import { FC, memo } from 'react'
import ReactMarkDown, { Options } from 'react-markdown'

/**
 * This code snippet is creating a memoized version of the ReactMarkDown component using the memo function from React.
 * https://github.com/vercel/ai-chatbot/blob/main/components/markdown.tsx#L4
 */
export const MemoizedReactMarkdown: FC<Options> = memo(
  ReactMarkDown,
  (prevProps, nextProps) =>
    prevProps.children === nextProps.children &&
    prevProps.className === nextProps.className,
)
