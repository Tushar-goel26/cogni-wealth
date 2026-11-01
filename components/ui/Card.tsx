import React from 'react'

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode
  variant?: 'default' | 'elevated' | 'glass' | 'outline'
  interactive?: boolean
  className?: string
}

export function Card({
  children,
  variant = 'default',
  interactive = false,
  className = '',
  ...props
}: CardProps) {
  const baseStyles = 'rounded-2xl transition-all duration-200'

  const variants = {
    default:
      'bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-sm dark:shadow-none',
    elevated:
      'bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-md hover:shadow-lg dark:shadow-black/40',
    glass:
      'bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border border-gray-200/60 dark:border-gray-800/60 shadow-sm',
    outline:
      'bg-transparent border border-gray-200 dark:border-gray-800',
  }

  const interactiveStyles = interactive
    ? 'cursor-pointer hover:border-gray-300 dark:hover:border-gray-700 hover:shadow-md active:scale-[0.99]'
    : ''

  return (
    <div
      className={`${baseStyles} ${variants[variant]} ${interactiveStyles} ${className}`}
      {...props}
    >
      {children}
    </div>
  )
}

export function CardHeader({
  className = '',
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={`p-5 sm:p-6 pb-2 sm:pb-3 flex flex-col gap-1.5 ${className}`} {...props}>
      {children}
    </div>
  )
}

export function CardTitle({
  className = '',
  children,
  ...props
}: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3
      className={`text-base sm:text-lg font-semibold tracking-tight text-gray-900 dark:text-gray-100 ${className}`}
      {...props}
    >
      {children}
    </h3>
  )
}

export function CardDescription({
  className = '',
  children,
  ...props
}: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p className={`text-xs sm:text-sm text-gray-500 dark:text-gray-400 ${className}`} {...props}>
      {children}
    </p>
  )
}

export function CardContent({
  className = '',
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={`p-5 sm:p-6 pt-3 ${className}`} {...props}>
      {children}
    </div>
  )
}

export function CardFooter({
  className = '',
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={`p-5 sm:p-6 pt-0 flex items-center justify-between border-t border-gray-100 dark:border-gray-800/80 mt-2 ${className}`}
      {...props}
    >
      {children}
    </div>
  )
}
