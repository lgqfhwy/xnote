import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextRequest, NextResponse } from 'next/server'

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req, res })

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const isAuthPage =
    req.nextUrl.pathname.startsWith('/login') ||
    req.nextUrl.pathname.startsWith('/auth/')
  const isProtectedRoute =
    req.nextUrl.pathname === '/' || req.nextUrl.pathname.startsWith('/app')

  // If user is not authenticated and trying to access protected route
  if (!user && isProtectedRoute) {
    return NextResponse.redirect(new URL('/login', req.url))
  }

  // If user is authenticated and trying to access auth pages, redirect to home
  if (
    user &&
    isAuthPage &&
    !req.nextUrl.pathname.startsWith('/auth/callback')
  ) {
    return NextResponse.redirect(new URL('/', req.url))
  }

  return res
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|public/).*)',
  ],
}
