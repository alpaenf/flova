'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useAuth } from '@/components/auth-provider'
import { createClient } from '@/lib/supabase/client'
import { useState, useEffect } from 'react'
import {
  LayoutDashboard,
  ClipboardEdit,
  BarChart3,
  History,
  Settings,
  LogOut,
  ChevronRight,
} from 'lucide-react'
import Image from 'next/image'

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, roles: ['admin', 'staff', 'viewer'] },
  { href: '/input', label: 'Input', icon: ClipboardEdit, roles: ['admin', 'staff'] },
  { href: '/analytics', label: 'Analytics', icon: BarChart3, roles: ['admin', 'viewer'] },
  { href: '/history', label: 'History', icon: History, roles: ['admin', 'staff'] },
  { href: '/settings', label: 'Pengaturan', icon: Settings, roles: ['admin'] },
]

export default function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const { profile, role, loading } = useAuth()
  const supabase = createClient()
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
    router.refresh()
  }

  const filteredNavItems = navItems.filter((item) => item.roles.includes(role))

  const roleLabels: Record<string, string> = {
    admin: 'Administrator',
    staff: 'Staff',
    viewer: 'Viewer',
  }

  const roleBadgeColors: Record<string, string> = {
    admin: 'bg-primary-50 text-primary',
    staff: 'bg-success-50 text-success',
    viewer: 'bg-warning-50 text-warning',
  }

  // Prevent hydration mismatch by rendering placeholder until mounted
  if (!isMounted || loading) {
    return (
      <aside className="hidden md:flex flex-col w-64 bg-surface border-r border-border h-screen sticky top-0 flex-shrink-0 z-40 p-4">
         <div className="h-10 w-32 bg-surface-alt rounded animate-pulse" />
      </aside>
    )
  }

  const UserProfile = () => (
    <div className="flex items-center gap-3">
      <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0">
        <span className="text-primary font-bold text-sm">
          {profile?.full_name?.charAt(0)?.toUpperCase() || 'U'}
        </span>
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-text truncate">
          {profile?.full_name || 'User'}
        </p>
        <span className={`inline-block text-[10px] font-medium px-2 py-0.5 mt-0.5 rounded-full ${roleBadgeColors[role] || ''}`}>
          {roleLabels[role] || role}
        </span>
      </div>
    </div>
  )

  return (
    <>
      {/* =========================================
          MOBILE TOP NAVBAR 
          ========================================= */}
      <header className="md:hidden fixed top-0 left-0 w-full bg-surface border-b border-border z-40 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
            <Image src="/logo.png" alt="FLOVA" width={90} height={28} className="h-7 w-auto object-contain" />
          </div>

        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-primary-50 rounded-full flex items-center justify-center font-bold text-primary text-xs">
            {profile?.full_name?.charAt(0)?.toUpperCase() || 'U'}
          </div>
          <button
            onClick={handleLogout}
            className="p-2 text-text-muted hover:text-danger rounded-lg bg-surface-alt cursor-pointer"
            aria-label="Logout"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </header>

      <nav className="md:hidden fixed bottom-0 left-0 w-full bg-surface/95 backdrop-blur-md border-t border-border z-50 px-2 py-2 shadow-t-lg bottom-nav-enter">
        <div className="flex items-center justify-around">
          {filteredNavItems.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`relative flex flex-col items-center justify-center w-full py-2 gap-1 rounded-xl transition-all duration-200 ${
                  isActive ? 'text-primary' : 'text-text-muted hover:text-text'
                }`}
              >
                {isActive && (
                  <span className="absolute top-1 inset-x-2 h-0.5 bg-primary rounded-full" />
                )}
                <item.icon
                  className={`w-5 h-5 transition-all duration-200 ${
                    isActive ? 'text-primary nav-icon-active scale-110' : ''
                  }`}
                />
                <span className={`text-[10px] font-medium w-full text-center truncate px-1 ${
                  isActive ? 'font-bold text-primary' : ''
                }`}>
                  {item.label}
                </span>
              </Link>
            )
          })}
        </div>
      </nav>

      {/* =========================================
          DESKTOP SIDEBAR 
          ========================================= */}
      <aside className="hidden md:flex flex-col w-64 bg-surface border-r border-border h-screen sticky top-0 flex-shrink-0 z-40">
        {/* Logo */}
        <div className="px-6 py-6 border-b border-border">
          <div className="flex items-center gap-3">
            <Image src="/logo.png" alt="FLOVA" width={100} height={32} className="h-8 w-auto object-contain" />
          </div>
        </div>

        {/* Navigation */}
        <div className="flex-1 overflow-y-auto px-4 py-6 space-y-1.5 custom-scrollbar">
          {filteredNavItems.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium group transition-all duration-200 ${
                  isActive
                    ? 'bg-primary text-white shadow-md shadow-primary/20 scale-[1.02]'
                    : 'text-text-secondary hover:bg-surface-hover hover:text-text hover:translate-x-1'
                }`}
              >
                <item.icon className={`w-5 h-5 transition-colors ${isActive ? 'text-white' : 'text-text-muted group-hover:text-primary'}`} />
                {item.label}
                {isActive && (
                  <ChevronRight className="w-4 h-4 ml-auto text-white/50" />
                )}
              </Link>
            )
          })}
        </div>

        {/* User Card */}
        <div className="p-4 border-t border-border">
          <div className="bg-surface-alt rounded-2xl p-4 border border-border">
            <UserProfile />
            <button
              onClick={handleLogout}
              className="mt-4 w-full flex items-center justify-center gap-2 text-sm text-text-muted hover:text-danger hover:bg-danger-50 py-2.5 rounded-xl transition-colors cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
              Keluar
            </button>
          </div>
        </div>
      </aside>
    </>
  )
}
