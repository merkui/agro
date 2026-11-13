import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const SESSION_COOKIE = 'admin_session'

async function generateToken(user: string, password: string): Promise<string> {
  const enc = new TextEncoder()
  const key = await crypto.subtle.importKey(
    'raw',
    enc.encode(password),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign'],
  )
  const sig = await crypto.subtle.sign('HMAC', key, enc.encode(user))
  return Array.from(new Uint8Array(sig))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  if (pathname === '/admin/login' || pathname === '/api/admin/auth') {
    return NextResponse.next()
  }

  const isApiRoute = pathname.startsWith('/api/')

  const token = request.cookies.get(SESSION_COOKIE)?.value
  const user = process.env.ADMIN_USER
  const password = process.env.ADMIN_PASSWORD

  if (!token || !user || !password) {
    return NextResponse.redirect(new URL('/admin/login', request.url))
  }

  const expected = await generateToken(user, password)

  if (token !== expected) {
    if (isApiRoute) {
      return NextResponse.json({ error: 'No autorizado.' }, { status: 401 })
    }
    return NextResponse.redirect(new URL('/admin/login', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*', '/api/admin/:path*'],
}
