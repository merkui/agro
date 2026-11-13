import { createHmac } from 'crypto'
import { cookies } from 'next/headers'

const SESSION_COOKIE = 'admin_session'

export function generateToken(user: string, password: string): string {
  return createHmac('sha256', password).update(user).digest('hex')
}

export async function validateAdminSession(): Promise<boolean> {
  const cookieStore = await cookies()
  const token = cookieStore.get(SESSION_COOKIE)?.value
  const user = process.env.ADMIN_USER
  const password = process.env.ADMIN_PASSWORD

  if (!token || !user || !password) return false
  return token === generateToken(user, password)
}
