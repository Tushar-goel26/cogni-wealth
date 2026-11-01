'use client'

import React, { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import {
  Search,
  Moon,
  Sun,
  Bell,
  Menu,
  User,
  LogOut,
  Shield,
  Sliders,
  CheckCircle2,
  AlertTriangle,
  Info,
} from 'lucide-react'
import { useTheme } from '@/components/theme/ThemeProvider'
import { useAuth } from '@/lib/auth-context'
import { getSupabase } from '@/lib/supabase'

interface TopBarProps {
  onOpenMobileMenu: () => void
}

export function TopBar({ onOpenMobileMenu }: TopBarProps) {
  const router = useRouter()
  const { theme, toggleTheme } = useTheme()
  const { user } = useAuth()

  const [profileOpen, setProfileOpen] = useState(false)
  const [alertsOpen, setAlertsOpen] = useState(false)
  const [searchFocused, setSearchFocused] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [loggingOut, setLoggingOut] = useState(false)

  const profileRef = useRef<HTMLDivElement>(null)
  const alertsRef = useRef<HTMLDivElement>(null)

  // Close dropdowns on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setProfileOpen(false)
      }
      if (alertsRef.current && !alertsRef.current.contains(event.target as Node)) {
        setAlertsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  async function handleLogout() {
    try {
      setLoggingOut(true)
      const supabase = getSupabase()
      await supabase.auth.signOut()
      router.push('/auth/login')
      router.refresh()
    } catch {
      setLoggingOut(false)
    }
  }

  // Simulated alerts
  const alerts = [
    {
      id: 1,
      type: 'info',
      title: 'Demo Environment Active',
      desc: 'Paper portfolio & synthetic accounts active.',
      time: 'Just now',
    },
    {
      id: 2,
      type: 'amber',
      title: 'Financial Twin Baseline',
      desc: 'Drift guard active. Learning normal patterns.',
      time: '1h ago',
    },
    {
      id: 3,
      type: 'emerald',
      title: 'Safe-to-Invest Calculated',
      desc: 'Deterministic waterfall updated for current month.',
      time: '2h ago',
    },
  ]

  const userInitial = user?.email ? user.email.charAt(0).toUpperCase() : 'U'

  return (
    <header className="sticky top-0 z-20 h-14 bg-white/90 dark:bg-gray-900/90 backdrop-blur-md border-b border-gray-200 dark:border-gray-800 transition-colors">
      <div className="flex items-center justify-between h-full px-3 sm:px-4 md:px-6 gap-2 sm:gap-4 max-w-full">
        {/* Left Section: Mobile Menu Button & Search */}
        <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
          <button
            type="button"
            onClick={onOpenMobileMenu}
            aria-label="Open navigation menu"
            className="md:hidden p-1.5 -ml-1 rounded-lg text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none"
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* Search Box */}
          <div className="relative flex-1 max-w-xs sm:max-w-sm md:max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setSearchFocused(false)}
              placeholder="Search transactions, insights..."
              className="w-full h-8.5 sm:h-9 pl-9 pr-8 text-xs sm:text-sm bg-gray-100 dark:bg-gray-800/80 border border-transparent dark:border-gray-700/60 rounded-xl text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:bg-white dark:focus:bg-gray-900 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
            />
            <div className="absolute right-2.5 top-1/2 -translate-y-1/2 hidden sm:flex items-center">
              <kbd className="px-1.5 py-0.5 text-[10px] font-mono text-gray-400 bg-gray-200/60 dark:bg-gray-700/60 rounded">
                ⌘K
              </kbd>
            </div>
          </div>
        </div>

        {/* Right Section: Actions (Theme, Alerts, Profile) */}
        <div className="flex items-center gap-1 sm:gap-2 shrink-0">
          {/* Theme Toggle */}
          <button
            type="button"
            onClick={toggleTheme}
            aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
            title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
            className="p-2 rounded-xl text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors focus:outline-none"
          >
            {theme === 'dark' ? (
              <Sun className="w-4 h-4 text-amber-400" />
            ) : (
              <Moon className="w-4 h-4 text-gray-700" />
            )}
          </button>

          {/* Alerts Bell Placeholder */}
          <div className="relative" ref={alertsRef}>
            <button
              type="button"
              onClick={() => {
                setAlertsOpen(!alertsOpen)
                setProfileOpen(false)
              }}
              aria-label="Alerts"
              className="relative p-2 rounded-xl text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors focus:outline-none"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-white dark:ring-gray-900 animate-pulse" />
            </button>

            {/* Alerts Dropdown Popover */}
            {alertsOpen && (
              <div className="absolute right-0 mt-2 w-72 sm:w-80 rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-xl py-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                <div className="flex items-center justify-between px-4 py-2 border-b border-gray-100 dark:border-gray-800">
                  <span className="text-xs font-semibold text-gray-900 dark:text-white">
                    Simulated Alerts
                  </span>
                  <span className="text-[10px] uppercase font-semibold px-1.5 py-0.5 rounded bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">
                    Live Demo
                  </span>
                </div>
                <div className="max-h-64 overflow-y-auto divide-y divide-gray-100 dark:divide-gray-800/60 no-scrollbar">
                  {alerts.map((alert) => (
                    <div
                      key={alert.id}
                      className="p-3 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                    >
                      <div className="flex items-start gap-2">
                        {alert.type === 'amber' ? (
                          <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                        ) : alert.type === 'emerald' ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                        ) : (
                          <Info className="w-4 h-4 text-indigo-500 shrink-0 mt-0.5" />
                        )}
                        <div className="min-w-0 flex-1">
                          <p className="text-xs font-medium text-gray-900 dark:text-gray-100">
                            {alert.title}
                          </p>
                          <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5 leading-snug">
                            {alert.desc}
                          </p>
                          <span className="text-[10px] text-gray-400 dark:text-gray-500 mt-1 block">
                            {alert.time}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="px-3 pt-2 border-t border-gray-100 dark:border-gray-800">
                  <button
                    type="button"
                    onClick={() => setAlertsOpen(false)}
                    className="w-full py-1 text-center text-xs font-medium text-indigo-600 dark:text-indigo-400 hover:underline"
                  >
                    Close
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Profile Menu */}
          <div className="relative" ref={profileRef}>
            <button
              type="button"
              onClick={() => {
                setProfileOpen(!profileOpen)
                setAlertsOpen(false)
              }}
              aria-label="Profile menu"
              className="flex items-center gap-2 p-1 pl-1.5 sm:pr-2.5 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors focus:outline-none border border-transparent hover:border-gray-200 dark:hover:border-gray-700"
            >
              <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-indigo-600 to-indigo-800 text-white flex items-center justify-center text-xs font-semibold shadow-xs">
                {userInitial}
              </div>
              <span className="hidden sm:inline-block text-xs font-medium text-gray-700 dark:text-gray-300 max-w-[100px] truncate">
                {user?.email ? user.email.split('@')[0] : 'Account'}
              </span>
            </button>

            {/* Profile Dropdown */}
            {profileOpen && (
              <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-xl py-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                <div className="px-4 py-2 border-b border-gray-100 dark:border-gray-800">
                  <p className="text-xs font-semibold text-gray-900 dark:text-white truncate">
                    {user?.email || 'Demo User'}
                  </p>
                  <p className="text-[11px] text-emerald-600 dark:text-emerald-400 mt-0.5">
                    ● Simulated Account
                  </p>
                </div>

                <div className="py-1">
                  <button
                    type="button"
                    onClick={() => {
                      setProfileOpen(false)
                      router.push('/security')
                    }}
                    className="w-full flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                  >
                    <Shield className="w-4 h-4 text-gray-400" />
                    <span>Security &amp; Audit</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setProfileOpen(false)
                      router.push('/onboarding')
                    }}
                    className="w-full flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                  >
                    <Sliders className="w-4 h-4 text-gray-400" />
                    <span>Onboarding Setup</span>
                  </button>
                </div>

                <div className="pt-1 border-t border-gray-100 dark:border-gray-800">
                  <button
                    type="button"
                    disabled={loggingOut}
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors disabled:opacity-50"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>{loggingOut ? 'Signing out…' : 'Sign out'}</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
