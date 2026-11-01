import React from 'react'

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'text' | 'circular' | 'rectangular' | 'rounded'
  width?: string | number
  height?: string | number
  className?: string
}

export function Skeleton({
  variant = 'rounded',
  width,
  height,
  className = '',
  style,
  ...props
}: SkeletonProps) {
  const baseStyles = 'animate-pulse bg-gray-200 dark:bg-gray-800'

  const variantStyles = {
    text: 'h-4 rounded-md',
    circular: 'rounded-full',
    rectangular: 'rounded-none',
    rounded: 'rounded-xl',
  }

  const customStyle: React.CSSProperties = {
    ...style,
    width: width !== undefined ? width : undefined,
    height: height !== undefined ? height : undefined,
  }

  return (
    <div
      className={`${baseStyles} ${variantStyles[variant]} ${className}`}
      style={customStyle}
      {...props}
    />
  )
}

/**
 * Convenient preset for Card loading skeleton
 */
export function CardSkeleton({ className = '' }: { className?: string }) {
  return (
    <div className={`p-6 rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 space-y-4 ${className}`}>
      <div className="flex items-center justify-between">
        <Skeleton variant="text" className="w-1/3 h-4" />
        <Skeleton variant="circular" className="w-8 h-8" />
      </div>
      <Skeleton variant="text" className="w-2/3 h-8" />
      <div className="flex gap-2">
        <Skeleton variant="text" className="w-16 h-4" />
        <Skeleton variant="text" className="w-24 h-4" />
      </div>
    </div>
  )
}
