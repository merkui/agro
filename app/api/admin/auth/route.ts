import { createHash, createHmac, timingSafeEqual } from 'crypto'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import { clearFailures, getClientIp, recordFailure, retryAfterSeconds } from '@/lib/login-rate-limit'

const SESSION_COOKIE = 'admin_session'

function generateToken(user: string, password: string): string {
  return createHmac('sha256', password).update(user).digest('hex')
}

// Compares in constant time so response timing does not reveal how much matched.
function safeEqual(a: string, b: string): boolean {
  const ha = createHash('sha256').update(a).digest()
  const hb = createHash('sha256').update(b).digest()
  return timingSafeEqual(ha, hb)
}

function tooManyAttempts(seconds: number) {
  const minutes = Math.ceil(seconds / 60)
  return NextResponse.json(
    { error: `Demasiados intentos fallidos. Probá de nuevo en ${minutes} minuto${minutes === 1 ? '' : 's'}.` },
    { status: 429, headers: { 'Retry-After': String(seconds) } },
  )
}

export async function POST(request: Request) {
  const ip = getClientIp(request)

  const blockedFor = retryAfterSeconds(ip)
  if (blockedFor > 0) return tooManyAttempts(blockedFor)

  try {
    const { user, password } = (await request.json()) as { user?: string; password?: string }

    const adminUser = process.env.ADMIN_USER
    const adminPassword = process.env.ADMIN_PASSWORD

    if (!adminUser || !adminPassword) {
      return NextResponse.json({ error: 'Admin no configurado en el servidor.' }, { status: 500 })
    }

    const userOk = safeEqual(user ?? '', adminUser)
    const passwordOk = safeEqual(password ?? '', adminPassword)

    if (!user || !password || !userOk || !passwordOk) {
      recordFailure(ip)
      const nowBlockedFor = retryAfterSeconds(ip)
      if (nowBlockedFor > 0) return tooManyAttempts(nowBlockedFor)
      return NextResponse.json({ error: 'Usuario o contraseña incorrectos.' }, { status: 401 })
    }

    clearFailures(ip)
    const token = generateToken(user, password)
    const cookieStore = await cookies()

    cookieStore.set(SESSION_COOKIE, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7,
    })

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Error al iniciar sesión.' }, { status: 500 })
  }
}

export async function DELETE() {
  const cookieStore = await cookies()
  cookieStore.delete(SESSION_COOKIE)
  return NextResponse.json({ success: true })
}
