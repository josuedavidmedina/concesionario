import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface TabsProps {
  value: string
  onValueChange: (value: string) => void
  children: ReactNode
  className?: string
}

function Tabs({ value, onValueChange, children, className }: TabsProps) {
  return <div className={cn('w-full', className)} data-value={value}>{children}</div>
}

interface TabsListProps {
  children: ReactNode
  className?: string
}

function TabsList({ children, className }: TabsListProps) {
  return <div className={cn('inline-flex h-9 items-center justify-center rounded-lg bg-muted p-1 text-muted-foreground', className)}>{children}</div>
}

interface TabsTriggerProps {
  value: string
  children: ReactNode
  className?: string
  onClick?: () => void
}

function TabsTrigger({ value, children, className, onClick }: TabsTriggerProps) {
  const parent = document.querySelector(`[data-value="${value}"]`)
  const isActive = parent?.getAttribute('data-value') === value
  return (
    <button
      className={cn(
        'inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1 text-sm font-medium transition-all cursor-pointer',
        isActive ? 'bg-background text-foreground shadow' : 'hover:text-foreground',
        className
      )}
      onClick={onClick}
    >
      {children}
    </button>
  )
}

interface TabsContentProps {
  value: string
  children: ReactNode
  className?: string
}

function TabsContent({ value, children, className }: TabsContentProps) {
  return <div className={cn('mt-2', className)}>{children}</div>
}

export { Tabs, TabsList, TabsTrigger, TabsContent }
