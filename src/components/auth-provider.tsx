'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { UserRole, UserProfile } from '@/lib/types'
import type { User } from '@supabase/supabase-js'

interface AuthContextType {
  user: User | null
  profile: UserProfile | null
  role: UserRole
  loading: boolean
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  profile: null,
  role: 'viewer',
  loading: true,
})

export function useAuth() {
  return useContext(AuthContext)
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)

      if (user) {
        const role = (user.user_metadata?.role as UserRole) || 'viewer'
        setProfile({
          id: user.id,
          email: user.email || '',
          role,
          full_name: user.user_metadata?.full_name || 'User',
        })
      }

      setLoading(false)
    }

    getUser()

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      const currentUser = session?.user || null
      setUser(currentUser)

      if (currentUser) {
        const role = (currentUser.user_metadata?.role as UserRole) || 'viewer'
        setProfile({
          id: currentUser.id,
          email: currentUser.email || '',
          role,
          full_name: currentUser.user_metadata?.full_name || 'User',
        })
      } else {
        setProfile(null)
      }
    })

    return () => subscription.unsubscribe()
  }, [supabase])

  const role = profile?.role || 'viewer'

  return (
    <AuthContext.Provider value={{ user, profile, role, loading }}>
      {children}
    </AuthContext.Provider>
  )
}
