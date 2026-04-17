'use client'

import { useTheme } from 'next-themes'
import { Moon, Sun, Monitor } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useSyncExternalStore } from 'react'

const emptySubscribe = () => () => {}
 
function useMounted() {
  return useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  )
}

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const mounted = useMounted()

  if (!mounted) {
    return <Button variant="ghost" size="icon" className="h-9 w-9 opacity-0" />
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => {
        if (theme === 'light') setTheme('dark')
        else if (theme === 'dark') setTheme('system')
        else setTheme('light')
      }}
      className="h-9 w-9 text-muted-foreground hover:text-foreground"
      aria-label="Toggle theme"
    >
      {theme === 'dark' && <Moon className="h-4 w-4" />}
      {theme === 'light' && <Sun className="h-4 w-4" />}
      {theme === 'system' && <Monitor className="h-4 w-4" />}
    </Button>
  )
}
