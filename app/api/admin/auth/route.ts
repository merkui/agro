import { createHmac } from 'crypto'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

const SESSION_COOKIE = 'admin_session'

function generateToken(user: string, password: string): string {
  return createHmac('sha256', password).update(user).digest('hex')
}

export async function POST(request: Request) {
  try {
    const { user, password } = (await request.json()) as { user?: string; password?: string }

    const adminUser = process.env.ADMIN_USER
    const adminPassword = process.env.ADMIN_PASSWORD

    if (!adminUser || !adminPassword) {
      return NextResponse.json({ error: 'Admin no configurado en el servidor.' }, { status: 500 })
    }

    if (!user || !password || user !== adminUser || password !== adminPassword) {
      return NextResponse.json({ error: 'Usuario o contraseña incorrectos.' }, { status: 401 })
    }

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
