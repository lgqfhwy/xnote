'use client'

import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useEffect, useState } from 'react'
import { User } from '@supabase/supabase-js'

export function UserInfo() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const supabase = createClientComponentClient()

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      setUser(user)
      setLoading(false)
    }

    getUser()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null)
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [supabase.auth])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
  }

  if (loading) {
    return <div className="text-sm text-gray-500">Loading...</div>
  }

  if (!user) {
    return <div className="text-sm text-gray-500">Not signed in</div>
  }

  return (
    <div className="flex items-center gap-3">
      <div className="text-sm">
        <div className="font-medium">{user.email}</div>
        <div className="text-xs text-gray-500">Signed in</div>
      </div>
      <button
        onClick={handleSignOut}
        className="rounded-md bg-gray-100 px-3 py-1 text-sm transition-colors hover:bg-gray-200"
      >
        Sign Out
      </button>
    </div>
  )
}
