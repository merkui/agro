'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export default function AdminLoginPage() {
  const router = useRouter()
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (password === '1234') {
      window.localStorage.setItem('admin-auth', 'true')
      router.push('/admin/presupuestos')
      return
    }

    setError('Contraseña incorrecta. Intenta de nuevo.')
  }

  return (
    <div className="mx-auto max-w-3xl px-6 py-12 lg:px-8">
      <div className="rounded-3xl border border-border bg-card p-8 shadow-sm">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Admin Login</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Ingresa la contraseña del administrador para ver los presupuestos.
        </p>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="grid gap-2">
            <label htmlFor="admin-password" className="text-sm font-medium text-foreground">
              Contraseña
            </label>
            <Input
              id="admin-password"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Admin password"
              autoComplete="current-password"
            />
          </div>

          {error ? (
            <div className="rounded-xl border border-destructive bg-destructive/10 p-3 text-sm text-destructive">
              {error}
            </div>
          ) : null}

          <Button type="submit">Entrar</Button>
        </form>

        <div className="mt-6 rounded-2xl border border-border bg-background/80 p-4 text-sm text-muted-foreground">
          Contraseña de prueba: <span className="font-semibold text-foreground">1234</span>
        </div>
      </div>
    </div>
  )
}
