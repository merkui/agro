'use client'

import { useEffect, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Pencil, Plus, Search, X } from 'lucide-react'

interface Customer {
  id: string
  full_name: string
  email: string
  phone: string | null
  company: string | null
  city: string | null
  province: string | null
  is_active: boolean
  created_at: string
}

export function ClientesList() {
  const router = useRouter()
  const [customers, setCustomers] = useState<Customer[]>([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const fetchCustomers = useCallback(async (q: string) => {
    setLoading(true)
    try {
      const url = q ? `/api/admin/customers?search=${encodeURIComponent(q)}` : '/api/admin/customers'
      const r = await fetch(url)
      if (!r.ok) throw new Error(await r.text())
      setCustomers(await r.json())
      setError('')
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Error al cargar clientes.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchCustomers('')
  }, [fetchCustomers])

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => fetchCustomers(search), 350)
    return () => clearTimeout(timer)
  }, [search, fetchCustomers])

  return (
    <div className="space-y-4">
      {/* Header con filtro y botón agregar */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-52">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Buscar por nombre, email, empresa o ciudad..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 pr-9"
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X className="size-4" />
            </button>
          )}
        </div>
        <Button
          className="cursor-pointer gap-2 shrink-0"
          onClick={() => router.push('/admin/clientes/nuevo')}
        >
          <Plus className="size-4" />
          Agregar cliente
        </Button>
      </div>

      {/* Tabla */}
      {loading ? (
        <div className="rounded-2xl border border-border bg-card p-10 text-center text-muted-foreground">
          Cargando clientes...
        </div>
      ) : error ? (
        <div className="rounded-2xl border border-destructive bg-destructive/10 p-8 text-center text-destructive">
          {error}
        </div>
      ) : customers.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border bg-secondary/50 p-12 text-center">
          <p className="text-lg font-semibold text-foreground">
            {search ? 'Sin resultados para esa búsqueda.' : 'No hay clientes registrados aún.'}
          </p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-border bg-card">
          {/* Header columnas */}
          <div className="hidden grid-cols-[1fr_1fr_120px_1fr_1fr_80px_72px] items-center gap-4 border-b border-border bg-muted/50 px-5 py-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground lg:grid">
            <span>Nombre</span>
            <span>Email</span>
            <span>Teléfono</span>
            <span>Empresa</span>
            <span>Localidad</span>
            <span className="text-center">Estado</span>
            <span></span>
          </div>

          <div className="divide-y divide-border">
            {customers.map((c) => (
              <div
                key={c.id}
                className="grid gap-2 px-5 py-4 lg:grid-cols-[1fr_1fr_120px_1fr_1fr_80px_72px] lg:items-center"
              >
                <span className="font-medium text-foreground">{c.full_name}</span>
                <span className="text-sm text-muted-foreground">{c.email}</span>
                <span className="text-sm text-muted-foreground">{c.phone ?? '—'}</span>
                <span className="text-sm text-muted-foreground">{c.company ?? '—'}</span>
                <span className="text-sm text-muted-foreground">
                  {[c.city, c.province].filter(Boolean).join(', ') || '—'}
                </span>
                <span className="flex lg:justify-center">
                  <Badge
                    variant="outline"
                    className={c.is_active
                      ? 'border-emerald-300 bg-emerald-50 text-emerald-700'
                      : 'border-zinc-300 bg-zinc-50 text-zinc-500'}
                  >
                    {c.is_active ? 'Activo' : 'Inactivo'}
                  </Badge>
                </span>
                <span>
                  <Button
                    size="sm"
                    variant="outline"
                    className="cursor-pointer gap-1.5"
                    onClick={() => router.push(`/admin/clientes/${c.id}`)}
                  >
                    <Pencil className="size-3.5" />
                    Editar
                  </Button>
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
