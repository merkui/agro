'use client'

import { useEffect, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft, Save, Send } from 'lucide-react'

interface Product {
  id: string
  name: string
  sku: string | null
}

interface QuoteItem {
  id: string
  quantity: number
  unit_price: number
  subtotal: number
  product_name_snapshot: string | null
  product_sku_snapshot: string | null
  products: Product | null
}

interface Customer {
  id: string
  full_name: string
  email: string
  phone: string | null
  company: string | null
  city: string | null
  province: string | null
}

interface Quote {
  id: string
  quote_number: number
  status: string
  created_at: string
  sent_at: string | null
  approved_at: string | null
  rejected_at: string | null
  total: number
  customer_notes: string | null
  customers: Customer | null
  quote_items: QuoteItem[]
}

const STATUS_OPTIONS = [
  { value: 'pending',  label: 'Pendiente' },
  { value: 'quoted',   label: 'Cotizado' },
  { value: 'sent',     label: 'Enviado' },
  { value: 'approved', label: 'Aprobado' },
  { value: 'rejected', label: 'Rechazado' },
]

const STATUS_CONFIG: Record<string, string> = {
  pending:  'border-amber-300 bg-amber-50 text-amber-700',
  quoted:   'border-blue-300 bg-blue-50 text-blue-700',
  sent:     'border-indigo-300 bg-indigo-50 text-indigo-700',
  approved: 'border-emerald-300 bg-emerald-50 text-emerald-700',
  rejected: 'border-red-300 bg-red-50 text-red-700',
}

const formatMoney = (value: number) =>
  new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', minimumFractionDigits: 2 }).format(value)

const formatDate = (iso: string | null) =>
  iso ? new Intl.DateTimeFormat('es-AR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' }).format(new Date(iso)) : '—'

export function PresupuestoEdit({ id }: { id: string }) {
  const router = useRouter()
  const [quote, setQuote] = useState<Quote | null>(null)
  const [items, setItems] = useState<QuoteItem[]>([])
  const [status, setStatus] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [sending, setSending] = useState(false)
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null)

  const load = useCallback(async () => {
    try {
      const r = await fetch(`/api/admin/quotes/${id}`)
      if (!r.ok) throw new Error(await r.text())
      const data = (await r.json()) as Quote
      setQuote(data)
      setStatus(data.status)
      setItems(data.quote_items ?? [])
    } catch (e) {
      setMessage({ text: e instanceof Error ? e.message : 'Error al cargar.', type: 'error' })
    } finally {
      setLoading(false)
    }
  }, [id])

  useEffect(() => { load() }, [load])

  const total = items.reduce((acc, item) => acc + (item.unit_price ?? 0) * item.quantity, 0)

  const handlePriceChange = (itemId: string, value: string) => {
    const price = value === '' ? 0 : Math.max(0, Number(value))
    setItems((prev) =>
      prev.map((item) =>
        item.id === itemId
          ? { ...item, unit_price: price, subtotal: price * item.quantity }
          : item,
      ),
    )
  }

  const handleSave = async () => {
    setSaving(true)
    setMessage(null)
    try {
      const r = await fetch(`/api/admin/quotes/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status,
          items: items.map((item) => ({
            id: item.id,
            unit_price: item.unit_price,
            subtotal: item.unit_price * item.quantity,
          })),
          total,
        }),
      })
      if (!r.ok) {
        const data = await r.json()
        throw new Error(data.error)
      }
      setMessage({ text: 'Presupuesto guardado correctamente.', type: 'success' })
    } catch (e) {
      setMessage({ text: e instanceof Error ? e.message : 'Error al guardar.', type: 'error' })
    } finally {
      setSaving(false)
    }
  }

  const handleSend = async () => {
    setSending(true)
    setMessage(null)
    try {
      const r = await fetch(`/api/admin/quotes/${id}/send`, { method: 'POST' })
      if (!r.ok) {
        const data = await r.json()
        throw new Error(data.error)
      }
      setStatus('sent')
      setMessage({ text: `Presupuesto enviado al cliente correctamente.`, type: 'success' })
    } catch (e) {
      setMessage({ text: e instanceof Error ? e.message : 'Error al enviar.', type: 'error' })
    } finally {
      setSending(false)
    }
  }

  if (loading) {
    return <div className="p-8 text-muted-foreground">Cargando presupuesto...</div>
  }

  if (!quote) {
    return <div className="p-8 text-destructive">Presupuesto no encontrado.</div>
  }

  const customer = quote.customers

  return (
    <div className="p-8 space-y-6 max-w-4xl">
      {/* Header */}
      <div className="flex flex-wrap items-center gap-4">
        <Button variant="ghost" size="sm" className="gap-2 cursor-pointer" onClick={() => router.push('/admin/presupuestos')}>
          <ArrowLeft className="size-4" />
          Volver
        </Button>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-foreground">
            Presupuesto #{quote.quote_number}
          </h1>
        </div>
        <Badge variant="outline" className={STATUS_CONFIG[status] ?? ''}>
          {STATUS_OPTIONS.find((s) => s.value === status)?.label ?? status}
        </Badge>
      </div>

      {message && (
        <div className={`rounded-xl border p-3 text-sm ${
          message.type === 'success'
            ? 'border-emerald-200 bg-emerald-50 text-emerald-800'
            : 'border-destructive bg-destructive/10 text-destructive'
        }`}>
          {message.text}
        </div>
      )}

      {/* Datos cliente + fechas */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-2xl border border-border bg-card p-5 space-y-3">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">Cliente</h2>
          <div className="space-y-1">
            <p className="font-semibold text-foreground">{customer?.full_name ?? '—'}</p>
            <p className="text-sm text-muted-foreground">{customer?.email ?? '—'}</p>
            {customer?.phone && <p className="text-sm text-muted-foreground">{customer.phone}</p>}
            {customer?.company && <p className="text-sm text-muted-foreground">{customer.company}</p>}
            {(customer?.city || customer?.province) && (
              <p className="text-sm text-muted-foreground">
                {[customer.city, customer.province].filter(Boolean).join(', ')}
              </p>
            )}
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-card p-5 space-y-3">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">Fechas y estado</h2>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Creado</span>
              <span className="font-medium text-foreground">{formatDate(quote.created_at)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Enviado</span>
              <span className="font-medium text-foreground">{formatDate(quote.sent_at)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Aprobado</span>
              <span className="font-medium text-foreground">{formatDate(quote.approved_at)}</span>
            </div>
            <div className="mt-3 flex items-center gap-2">
              <span className="text-muted-foreground text-sm">Estado</span>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="ml-auto rounded-lg border border-border bg-background px-3 py-1.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              >
                {STATUS_OPTIONS.map((s) => (
                  <option key={s.value} value={s.value}>{s.label}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Observación cliente */}
      {quote.customer_notes && (
        <div className="rounded-2xl border border-border bg-card p-5">
          <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-muted-foreground">Observación del cliente</h2>
          <p className="text-sm text-foreground">{quote.customer_notes}</p>
        </div>
      )}

      {/* Productos */}
      <div className="overflow-hidden rounded-2xl border border-border bg-card">
        <div className="border-b border-border bg-muted/50 px-5 py-3">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">Productos</h2>
        </div>

        {/* Header columnas */}
        <div className="hidden grid-cols-[1fr_80px_160px_140px] gap-4 border-b border-border px-5 py-3 text-xs font-semibold text-muted-foreground md:grid">
          <span>Producto</span>
          <span className="text-center">Cantidad</span>
          <span className="text-right">Precio unitario</span>
          <span className="text-right">Subtotal</span>
        </div>

        <div className="divide-y divide-border">
          {items.map((item) => {
            const name = item.product_name_snapshot ?? item.products?.name ?? 'Producto'
            const sku = item.product_sku_snapshot ?? item.products?.sku
            const subtotal = (item.unit_price ?? 0) * item.quantity

            return (
              <div key={item.id} className="grid gap-3 px-5 py-4 md:grid-cols-[1fr_80px_160px_140px] md:items-center">
                <div>
                  <p className="font-medium text-foreground">{name}</p>
                  {sku && <p className="text-xs text-muted-foreground">SKU: {sku}</p>}
                </div>
                <p className="text-center text-sm font-medium text-foreground">
                  <span className="text-muted-foreground md:hidden">Cant: </span>
                  {item.quantity}
                </p>
                <div>
                  <label className="mb-1 block text-xs text-muted-foreground md:hidden">Precio unitario</label>
                  <Input
                    type="number"
                    min="0"
                    step="0.01"
                    inputMode="decimal"
                    value={item.unit_price === 0 ? '' : item.unit_price}
                    placeholder="0.00"
                    onChange={(e) => handlePriceChange(item.id, e.target.value)}
                    className="text-right"
                  />
                </div>
                <p className="text-right text-sm font-semibold text-foreground">
                  <span className="text-muted-foreground md:hidden">Subtotal: </span>
                  {formatMoney(subtotal)}
                </p>
              </div>
            )
          })}
        </div>

        {/* Total */}
        <div className="flex items-center justify-end border-t border-border bg-muted/30 px-5 py-4 gap-4">
          <span className="text-sm font-semibold text-muted-foreground">Total general</span>
          <span className="text-2xl font-bold text-foreground">{formatMoney(total)}</span>
        </div>
      </div>

      {/* Acciones */}
      <div className="flex flex-wrap gap-3">
        <Button onClick={handleSave} disabled={saving} className="cursor-pointer gap-2">
          <Save className="size-4" />
          {saving ? 'Guardando...' : 'Guardar presupuesto'}
        </Button>
        <Button variant="outline" onClick={handleSend} disabled={sending} className="cursor-pointer gap-2">
          <Send className="size-4" />
          {sending ? 'Enviando...' : 'Enviar presupuesto'}
        </Button>
      </div>
    </div>
  )
}
