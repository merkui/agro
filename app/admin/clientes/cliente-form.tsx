'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { ArrowLeft, Save } from 'lucide-react'

interface CustomerForm {
  full_name: string
  email: string
  phone: string
  company: string
  address: string
  city: string
  province: string
  notes: string
  is_active: boolean
}

const EMPTY_FORM: CustomerForm = {
  full_name: '',
  email: '',
  phone: '',
  company: '',
  address: '',
  city: '',
  province: '',
  notes: '',
  is_active: true,
}

interface Props {
  customerId?: string
}

export function ClienteForm({ customerId }: Props) {
  const router = useRouter()
  const isEdit = Boolean(customerId)

  const [form, setForm] = useState<CustomerForm>(EMPTY_FORM)
  const [loading, setLoading] = useState(isEdit)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null)

  useEffect(() => {
    if (!customerId) return
    fetch(`/api/admin/customers/${customerId}`)
      .then(async (r) => {
        if (!r.ok) throw new Error(await r.text())
        return r.json()
      })
      .then((data) => {
        setForm({
          full_name: data.full_name ?? '',
          email: data.email ?? '',
          phone: data.phone ?? '',
          company: data.company ?? '',
          address: data.address ?? '',
          city: data.city ?? '',
          province: data.province ?? '',
          notes: data.notes ?? '',
          is_active: data.is_active ?? true,
        })
      })
      .catch((e) => setMessage({ text: e.message, type: 'error' }))
      .finally(() => setLoading(false))
  }, [customerId])

  const set = (field: keyof CustomerForm) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => setForm((prev) => ({ ...prev, [field]: e.target.value }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.full_name || !form.email) {
      setMessage({ text: 'Nombre y email son obligatorios.', type: 'error' })
      return
    }
    setSaving(true)
    setMessage(null)
    try {
      const url = isEdit ? `/api/admin/customers/${customerId}` : '/api/admin/customers'
      const method = isEdit ? 'PUT' : 'POST'
      const r = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await r.json()
      if (!r.ok) throw new Error(data.error)
      setMessage({ text: isEdit ? 'Cliente actualizado correctamente.' : 'Cliente creado correctamente.', type: 'success' })
      setTimeout(() => router.push('/admin/clientes'), 1000)
    } catch (err) {
      setMessage({ text: err instanceof Error ? err.message : 'Error al guardar.', type: 'error' })
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return <div className="p-8 text-muted-foreground">Cargando datos del cliente...</div>
  }

  return (
    <div className="max-w-2xl space-y-6 p-8">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" className="gap-2 cursor-pointer" onClick={() => router.push('/admin/clientes')}>
          <ArrowLeft className="size-4" />
          Volver
        </Button>
        <h1 className="text-2xl font-bold text-foreground">
          {isEdit ? 'Editar cliente' : 'Agregar cliente'}
        </h1>
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

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Datos principales */}
        <div className="rounded-2xl border border-border bg-card p-6 space-y-4">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">Datos principales</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground">Nombre completo <span className="text-destructive">*</span></label>
              <Input value={form.full_name} onChange={set('full_name')} placeholder="Juan Pérez" required />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground">Email <span className="text-destructive">*</span></label>
              <Input type="email" value={form.email} onChange={set('email')} placeholder="juan@empresa.com" required />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground">Teléfono</label>
              <Input value={form.phone} onChange={set('phone')} placeholder="+54 9 11 1234-5678" />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground">Empresa</label>
              <Input value={form.company} onChange={set('company')} placeholder="Nombre de empresa" />
            </div>
          </div>
        </div>

        {/* Dirección */}
        <div className="rounded-2xl border border-border bg-card p-6 space-y-4">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">Dirección</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5 sm:col-span-2">
              <label className="text-sm font-medium text-foreground">Dirección</label>
              <Input value={form.address} onChange={set('address')} placeholder="Calle 123, Piso 2" />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground">Ciudad</label>
              <Input value={form.city} onChange={set('city')} placeholder="Buenos Aires" />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground">Provincia</label>
              <Input value={form.province} onChange={set('province')} placeholder="Buenos Aires" />
            </div>
          </div>
        </div>

        {/* Notas y estado */}
        <div className="rounded-2xl border border-border bg-card p-6 space-y-4">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">Notas y estado</h2>
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-foreground">Notas internas</label>
            <Textarea value={form.notes} onChange={set('notes')} placeholder="Observaciones sobre el cliente..." rows={3} />
          </div>
          <label className="flex cursor-pointer items-center gap-3">
            <input
              type="checkbox"
              checked={form.is_active}
              onChange={(e) => setForm((prev) => ({ ...prev, is_active: e.target.checked }))}
              className="size-4 rounded border-border accent-primary"
            />
            <span className="text-sm font-medium text-foreground">Cliente activo</span>
          </label>
        </div>

        <div className="flex gap-3">
          <Button type="submit" disabled={saving} className="cursor-pointer gap-2">
            <Save className="size-4" />
            {saving ? 'Guardando...' : isEdit ? 'Guardar cambios' : 'Crear cliente'}
          </Button>
          <Button type="button" variant="outline" className="cursor-pointer" onClick={() => router.push('/admin/clientes')}>
            Cancelar
          </Button>
        </div>
      </form>
    </div>
  )
}
