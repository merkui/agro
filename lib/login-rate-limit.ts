// Limits failed admin login attempts per IP address.
// Kept in memory: fine for a single Node.js process (SiteGround). It resets
// when the app restarts, which only gives an attacker a fresh 5 attempts.

const MAX_FAILURES = 5
const WINDOW_MS = 15 * 60 * 1000

interface Entry {
  failures: number
  firstFailureAt: number
}

const attempts = new Map<string, Entry>()

export function getClientIp(request: Request): string {
  // x-real-ip is set by the hosting proxy. In x-forwarded-for the proxy appends
  // the real address at the end; earlier entries can be faked by the client.
  const realIp = request.headers.get('x-real-ip')?.trim()
  if (realIp) return realIp
  const forwarded = request.headers.get('x-forwarded-for')
  const last = forwarded?.split(',').pop()?.trim()
  return last || 'unknown'
}

function getEntry(ip: string, now: number): Entry | undefined {
  const entry = attempts.get(ip)
  if (entry && now - entry.firstFailureAt > WINDOW_MS) {
    attempts.delete(ip)
    return undefined
  }
  return entry
}

/** Seconds until this IP may try again, or 0 if it is not blocked. */
export function retryAfterSeconds(ip: string, now = Date.now()): number {
  const entry = getEntry(ip, now)
  if (!entry || entry.failures < MAX_FAILURES) return 0
  return Math.ceil((entry.firstFailureAt + WINDOW_MS - now) / 1000)
}

export function recordFailure(ip: string, now = Date.now()): void {
  const entry = getEntry(ip, now)
  if (entry) {
    entry.failures += 1
  } else {
    attempts.set(ip, { failures: 1, firstFailureAt: now })
  }
  // Drop expired entries so the map cannot grow without bound.
  if (attempts.size > 1000) {
    for (const [key, value] of attempts) {
      if (now - value.firstFailureAt > WINDOW_MS) attempts.delete(key)
    }
  }
}

export function clearFailures(ip: string): void {
  attempts.delete(ip)
}
