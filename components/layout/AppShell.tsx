'use client'

import React, { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { Sidebar } from './Sidebar'
import { TopBar } from './TopBar'
import { DemoBanner } from '@/components/ui/DemoBanner'

interface AppShellProps {
  children: React.ReactNode
}

export function AppShell({ children }: AppShellProps) {
  const pathname = usePathname()
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  // Load desktop sidebar collapsed preference from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem('cogni-sidebar-collapsed')
      if (saved !== null) {
        setCollapsed(saved === 'true')
      }
    } catch {
      // Ignore
    }
  }, [])

  function handleToggleCollapse() {
    setCollapsed((prev) => {
      const next = !prev
      try {
        localStorage.setItem('cogni-sidebar-collapsed', String(next))
      } catch {
        // Ignore
      }
      return next
    })
  }

  // Auth pages & onboarding should be distraction-free without dashboard shell
  const isExcludedPage =
    pathname.startsWith('/auth') || pathname.startsWith('/onboarding')

  if (isExcludedPage) {
    return <>{children}</>
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100 transition-colors">
      {/* Persistent Demo Data / Simulated Banner */}
      <DemoBanner />

      <div className="flex flex-1 relative overflow-x-hidden">
        {/* Collapsible Sidebar (Desktop + Mobile Drawer) */}
        <Sidebar
          collapsed={collapsed}
          onToggleCollapse={handleToggleCollapse}
          mobileOpen={mobileOpen}
          onCloseMobile={() => setMobileOpen(false)}
        />

        {/* Main Content Area */}
        <div
          className={`flex flex-col flex-1 min-w-0 transition-all duration-300`}
        >
          {/* Compact Top Bar */}
          <TopBar onOpenMobileMenu={() => setMobileOpen(true)} />

          {/* Scrollable Page Body */}
          <main className="flex-1 p-3.5 sm:p-6 md:p-8 max-w-7xl w-full mx-auto overflow-y-auto">
            {children}
          </main>
        </div>
      </div>
    </div>
  )
}
