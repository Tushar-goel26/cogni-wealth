'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  ArrowLeftRight,
  Sparkles,
  Bot,
  Target,
  TrendingUp,
  Coins,
  ShieldCheck,
  ChevronLeft,
  ChevronRight,
  BrainCircuit,
  X,
} from 'lucide-react'

export interface NavItem {
  title: string
  href: string
  icon: React.ComponentType<{ className?: string }>
  badge?: string
}

export const NAV_ITEMS: NavItem[] = [
  {
    title: 'Overview',
    href: '/overview',
    icon: LayoutDashboard,
  },
  {
    title: 'Transactions & Apps',
    href: '/transactions',
    icon: ArrowLeftRight,
  },
  {
    title: 'Insights',
    href: '/insights',
    icon: Sparkles,
  },
  {
    title: 'Coach',
    href: '/coach',
    icon: Bot,
    badge: 'AI',
  },
  {
    title: 'Budgets & Goals',
    href: '/budgets',
    icon: Target,
  },
  {
    title: 'Forecast & Simulator',
    href: '/forecast',
    icon: TrendingUp,
  },
  {
    title: 'Invest',
    href: '/invest',
    icon: Coins,
  },
  {
    title: 'Security & Audit',
    href: '/security',
    icon: ShieldCheck,
  },
]

interface SidebarProps {
  collapsed: boolean
  onToggleCollapse: () => void
  mobileOpen: boolean
  onCloseMobile: () => void
}

export function Sidebar({
  collapsed,
  onToggleCollapse,
  mobileOpen,
  onCloseMobile,
}: SidebarProps) {
  const pathname = usePathname()

  const sidebarContent = (
    <div className="flex flex-col h-full bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 transition-all duration-300">
      {/* Brand Header */}
      <div className="flex items-center justify-between h-14 px-4 border-b border-gray-200 dark:border-gray-800 shrink-0">
        <Link
          href="/overview"
          onClick={onCloseMobile}
          className="flex items-center gap-2.5 min-w-0 group"
        >
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-600 to-emerald-500 flex items-center justify-center text-white shrink-0 shadow-xs group-hover:scale-105 transition-transform">
            <BrainCircuit className="w-4 h-4" />
          </div>
          {(!collapsed || mobileOpen) && (
            <div className="flex flex-col min-w-0">
              <span className="font-bold text-sm tracking-tight text-gray-900 dark:text-white truncate">
                Cogni Wealth
              </span>
              <span className="text-[10px] text-gray-500 dark:text-gray-400 truncate -mt-0.5">
                Financial Intelligence
              </span>
            </div>
          )}
        </Link>

        {/* Mobile close button */}
        <button
          type="button"
          onClick={onCloseMobile}
          aria-label="Close menu"
          className="md:hidden p-1.5 rounded-lg text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Navigation List */}
      <nav className="flex-1 overflow-y-auto py-3 px-2 space-y-1 no-scrollbar">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon
          const isActive =
            pathname === item.href ||
            (item.href === '/overview' && pathname === '/')

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onCloseMobile}
              title={collapsed && !mobileOpen ? item.title : undefined}
              className={`group flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs sm:text-sm font-medium transition-all select-none relative ${
                isActive
                  ? 'bg-indigo-600 text-white shadow-xs font-semibold'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800/70'
              } ${collapsed && !mobileOpen ? 'justify-center px-2' : ''}`}
            >
              <Icon
                className={`w-4 h-4 shrink-0 transition-colors ${
                  isActive
                    ? 'text-white'
                    : 'text-gray-500 dark:text-gray-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400'
                }`}
              />

              {(!collapsed || mobileOpen) && (
                <span className="truncate flex-1">{item.title}</span>
              )}

              {(!collapsed || mobileOpen) && item.badge && (
                <span
                  className={`text-[10px] font-semibold px-1.5 py-0.2 rounded-full uppercase shrink-0 ${
                    isActive
                      ? 'bg-white/20 text-white'
                      : 'bg-indigo-500/15 text-indigo-600 dark:text-indigo-400'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </Link>
          )
        })}
      </nav>

      {/* Desktop Collapse Toggle Footer */}
      <div className="hidden md:flex items-center justify-between p-3 border-t border-gray-200 dark:border-gray-800 shrink-0">
        <button
          type="button"
          onClick={onToggleCollapse}
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          className="w-full flex items-center justify-center gap-2 py-2 px-2.5 rounded-xl text-xs font-medium text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        >
          {collapsed ? (
            <ChevronRight className="w-4 h-4" />
          ) : (
            <>
              <ChevronLeft className="w-4 h-4" />
              <span>Collapse sidebar</span>
            </>
          )}
        </button>
      </div>
    </div>
  )

  return (
    <>
      {/* Mobile Drawer Backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-xs md:hidden animate-in fade-in duration-200"
          onClick={onCloseMobile}
          aria-hidden="true"
        />
      )}

      {/* Mobile Drawer (width fits 375px easily) */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 max-w-[85vw] transform transition-transform duration-200 ease-in-out md:hidden ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {sidebarContent}
      </aside>

      {/* Desktop Persistent Sidebar */}
      <aside
        className={`hidden md:block shrink-0 transition-all duration-300 ${
          collapsed ? 'w-16' : 'w-60'
        }`}
      >
        <div
          className={`fixed top-0 bottom-0 left-0 z-20 transition-all duration-300 pt-[33px] ${
            collapsed ? 'w-16' : 'w-60'
          }`}
        >
          {sidebarContent}
        </div>
      </aside>
    </>
  )
}
