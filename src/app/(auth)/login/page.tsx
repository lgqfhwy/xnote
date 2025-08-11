'use client'

import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Auth } from '@supabase/auth-ui-react'
import { ThemeSupa } from '@supabase/auth-ui-shared'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

// Disable static generation for this page since it uses client-side authentication
export const dynamic = 'force-dynamic'

export default function LoginPage() {
  const supabase = createClientComponentClient()
  const router = useRouter()
  const [redirectUrl, setRedirectUrl] = useState('/auth/callback')

  useEffect(() => {
    // Set the full redirect URL on the client side
    setRedirectUrl(`${window.location.origin}/auth/callback`)

    // Listen for auth state changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session) {
        // Redirect to home page after successful sign in
        router.push('/')
      }
    })

    // Check if user is already signed in
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        router.push('/')
      }
    })

    return () => subscription.unsubscribe()
  }, [supabase.auth, router])

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
            Welcome to XNote
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Sign in to your account or create a new one
          </p>
        </div>
        <div className="mt-8 space-y-6">
          <Auth
            supabaseClient={supabase}
            view="sign_in"
            appearance={{
              theme: ThemeSupa,
              variables: {
                default: {
                  colors: {
                    brand: '#3b82f6',
                    brandAccent: '#1d4ed8',
                  },
                },
              },
            }}
            theme="light"
            showLinks={true}
            providers={['github', 'google']}
            redirectTo={redirectUrl}
            socialLayout="horizontal"
          />
        </div>
      </div>
    </div>
  )
}
