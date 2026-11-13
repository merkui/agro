'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Pencil } from 'lucide-react'

interface QuoteListItem {
  id: string
  quote_number: number
  status: string
  created_at: string
  total: number
  customer: { full_name: string; email: string } | null
  item_count: number
}

const STATUS_CONFIG: Record<string, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline'; className: string }> = {
  pending:  { label: 'Pendiente',  variant: 'outline',     className: 'border-amber-300 bg-amber-50 text-amber-700' },
  quoted:   { label: 'Cotizado',   variant: 'outline',     className: 'border-blue-300 bg-blue-50 text-blue-700' },
  sent:     { label: 'Enviado',    variant: 'outline',     className: 'border-indigo-300 bg-indigo-50 text-indigo-700' },
  approved: { label: 'Aprobado',   variant: 'outline',     className: 'border-emerald-300 bg-emerald-50 text-emerald-700' },
  rejected: { label: 'Rechazado',  variant: 'destructive', className: '' },
}

function formatDate(iso: string) {
  return new Intl.DateTimeFormat('es-AR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' }).format(new Date(iso))
}

export function PresupuestosTable() {
  const router = useRouter()
  const [quotes, setQuotes] = useState<QuoteListItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetch('/api/admin/quotes')
      .then(async (r) => {
        if (!r.ok) throw new Error(await r.text())
        return r.json()
      })
      .then(setQuotes)
      .catch((e) => setError(e instanceof Error ? e.message : 'Error al cargar presupuestos.'))
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="rounded-3xl border border-border bg-card p-12 text-center text-muted-foreground">
        Cargando presupuestos...
      </div>
    )
  }

  if (error) {
    return (
      <div className="rounded-3xl border border-destructive bg-destructive/10 p-8 text-center text-destructive">
        {error}
      </div>
    )
  }

  if (quotes.length === 0) {
    return (
      <div className="rounded-3xl border border-dashed border-border bg-secondary/50 p-12 text-center">
        <p className="text-lg font-semibold text-foreground">No hay presupuestos aún.</p>
      </div>
    )
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-card">
      {/* Header tabla */}
      <div className="hidden grid-cols-[80px_160px_1fr_1fr_90px_120px_80px] items-center gap-4 border-b border-border bg-muted/50 px-5 py-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground lg:grid">
        <span>N°</span>
        <span>Fecha</span>
        <span>Cliente</span>
        <span>Email</span>
        <span className="text-center">Productos</span>
        <span>Estado</span>
        <span></span>
      </div>

      <div className="divide-y divide-border">
        {quotes.map((q) => {
          const statusCfg = STATUS_CONFIG[q.status] ?? { label: q.status, variant: 'outline' as const, className: '' }
          return (
            <div
              key={q.id}
              className="grid gap-3 px-5 py-4 lg:grid-cols-[80px_160px_1fr_1fr_90px_120px_80px] lg:items-center"
            >
              <span className="font-mono text-sm font-semibold text-foreground">
                #{q.quote_number}
              </span>
              <span className="text-sm text-muted-foreground">{formatDate(q.created_at)}</span>
              <span className="font-medium text-foreground">{q.customer?.full_name ?? '—'}</span>
              <span className="text-sm text-muted-foreground">{q.customer?.email ?? '—'}</span>
              <span className="text-center text-sm font-medium text-foreground">{q.item_count}</span>
              <span>
                <Badge variant={statusCfg.variant} className={statusCfg.className}>
                  {statusCfg.label}
                </Badge>
              </span>
              <span>
                <Button
                  size="sm"
                  variant="outline"
                  className="cursor-pointer gap-1.5"
                  onClick={() => router.push(`/admin/presupuestos/${q.id}`)}
                >
                  <Pencil className="size-3.5" />
                  Editar
                </Button>
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
