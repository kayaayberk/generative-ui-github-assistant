'use client'

import Link from 'next/link'
import * as React from 'react'
import { cn } from '@/lib/utils'
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  NavigationMenuContent,
  navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu'
import {
  Globe,
  SignIn,
  GithubLogo,
  LinkSimple,
  LinkedinLogo,
} from '@phosphor-icons/react'
import { useUser } from '@clerk/nextjs'

const components: { title: string; href: string; icon: any }[] = [
  {
    title: 'Aybrk.dev',
    href: 'https://aybrk.dev',
    icon: <Globe size={18} />,
  },
  {
    title: 'GitHub',
    href: 'https://github.com/kayaayberk',
    icon: <GithubLogo size={18} />,
  },
  {
    title: 'LinkedIn',
    href: 'https://www.linkedin.com/in/kayaayberk/',
    icon: <LinkedinLogo size={18} />,
  },
]

export default function Navigation() {
  return (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <Link href='/sign-in' legacyBehavior passHref>
            <NavigationMenuLink className={navigationMenuTriggerStyle()}>
              <span className='flex items-center space-x-1.5'>
                <span>
                  <SignIn size={18} />
                </span>
                <span className='text-xs'>Login</span>
              </span>
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>

        <NavigationMenuItem>
          <NavigationMenuTrigger>
            <span className='flex items-center space-x-1.5'>
              <span>
                <LinkSimple size={18} />
              </span>
              <span className='text-xs'>Links</span>
            </span>
          </NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className='gap-1 flex flex-col items-start p-2 w-full'>
              {components.map((component) => (
                <ListItem
                  key={component.title}
                  href={component.href}
                  target='_blank'
                  className='flex items-center gap-2 py-1 px-2 w-full'
                  title={component.title}
                >
                  <span>{component.icon}</span>
                </ListItem>
              ))}
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  )
}

const ListItem = React.forwardRef<
  React.ElementRef<'a'>,
  React.ComponentPropsWithoutRef<'a'>
>(({ className, title, children, ...props }, ref) => {
  return (
    <li className='w-full'>
      <NavigationMenuLink className='w-full' asChild>
        <a
          ref={ref}
          className={cn(
            'flex select-none w-full items-start rounded-md no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground',
            className,
          )}
          {...props}
        >
          <p className='text-xs text-muted-foreground'>{children}</p>
          <div className='text-xs font-medium '>{title}</div>
        </a>
      </NavigationMenuLink>
    </li>
  )
})
ListItem.displayName = 'ListItem'
