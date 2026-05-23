import React from 'react'

export interface AvatarProps {
  name: string
  url?: string | null
  size?: 'sm' | 'md' | 'lg' | 'xl'
  className?: string
  children?: React.ReactNode
}

const sizeClasses = {
  sm: 'h-8 w-8 text-xs',
  md: 'h-10 w-10 text-sm',
  lg: 'h-16 w-16 text-xl',
  xl: 'h-24 w-24 text-3xl',
}

export function Avatar({ name, url, size = 'md', className = '', children }: AvatarProps) {
  const sizeClass = sizeClasses[size]
  const initial = name ? name[0].toUpperCase() : '?'

  return (
    <div className={`relative flex items-center justify-center shrink-0 rounded-full ${sizeClass} ${className}`}>
      {url ? (
        <img
          src={url}
          alt={name}
          className="h-full w-full rounded-full object-cover ring-2 ring-border"
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center rounded-full bg-brand font-bold text-white shadow-sm">
          {initial}
        </div>
      )}
      {children}
    </div>
  )
}
