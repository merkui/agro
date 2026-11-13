'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { ArrowLeft, Save } from 'lucide-react'

interface CategoryForm {
  name: string
  slug: string
  description: string
  is_active: boolean
}

const EMPTY: CategoryForm = { name: '', slug: '', description: '', is_active: true }

function toSlug(text: string) {
  return text.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
}

export function CategoriaForm({ categoryId }: { categoryId?: string }) {
  const router = useRouter()
  const isEdit = Boolean(categoryId)
  const [form, setForm] = useState<CategoryForm>(EMPTY)
  const [loading, setLoading] = useState(isEdit)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null)

  useEffect(() => {
    if (!categoryId) return
    fetch(`/api/admin/categories/${categoryId}`)
      .then(async (r) => { if (!r.ok) throw new Error(await r.text()); return r.json() })
      .then((d) => setForm({ name: d.name ?? '', slug: d.slug ?? '', description: d.description ?? '', is_active: d.is_active ?? true }))
      .catch((e) => setMessage({ text: e.message, type: 'error' }))
      .finally(() => setLoading(false))
  }, [categoryId])

  const set = (field: keyof CategoryForm) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const value = e.target.value
    setForm((prev) => ({
      ...prev,
      [field]: value,
      ...(field === 'name' && !isEdit ? { slug: toSlug(value) } : {}),
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name || !form.slug) { setMessage({ text: 'Nombre y slug son obligatorios.', type: 'error' }); return }
    setSaving(true); setMessage(null)
    try {
      const url = isEdit ? `/api/admin/categories/${categoryId}` : '/api/admin/categories'
      const r = await fetch(url, { method: isEdit ? 'PUT' : 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) })
      const data = await r.json()
      if (!r.ok) throw new Error(data.error)
      setMessage({ text: isEdit ? 'Categoría actualizada.' : 'Categoría creada.', type: 'success' })
      setTimeout(() => router.push('/admin/categorias'), 1000)
    } catch (err) {
      setMessage({ text: err instanceof Error ? err.message : 'Error al guardar.', type: 'error' })
    } finally { setSaving(false) }
  }

  if (loading) return <div className="p-8 text-muted-foreground">Cargando categoría...</div>

  return (
    <div className="max-w-xl space-y-6 p-8">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" className="gap-2 cursor-pointer" onClick={() => router.push('/admin/categorias')}>
          <ArrowLeft className="size-4" />Volver
        </Button>
        <h1 className="text-2xl font-bold text-foreground">{isEdit ? 'Editar categoría' : 'Agregar categoría'}</h1>
      </div>

      {message && (
        <div className={`rounded-xl border p-3 text-sm ${message.type === 'success' ? 'border-emerald-200 bg-emerald-50 text-emerald-800' : 'border-destructive bg-destructive/10 text-destructive'}`}>
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="rounded-2xl border border-border bg-card p-6 space-y-4">
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-foreground">Nombre <span className="text-destructive">*</span></label>
            <Input value={form.name} onChange={set('name')} placeholder="Insecticidas" required />
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-foreground">Slug <span className="text-destructive">*</span></label>
            <Input value={form.slug} onChange={set('slug')} placeholder="insecticidas" required className="font-mono" />
            <p className="text-xs text-muted-foreground">Identificador único en minúsculas sin espacios. Se genera automáticamente.</p>
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-foreground">Descripción</label>
            <Textarea value={form.description} onChange={set('description')} placeholder="Descripción de la categoría..." rows={3} />
          </div>
          <label className="flex cursor-pointer items-center gap-3">
            <input type="checkbox" checked={form.is_active} onChange={(e) => setForm((p) => ({ ...p, is_active: e.target.checked }))} className="size-4 rounded border-border accent-primary" />
            <span className="text-sm font-medium text-foreground">Categoría activa</span>
          </label>
        </div>

        <div className="flex gap-3">
          <Button type="submit" disabled={saving} className="cursor-pointer gap-2">
            <Save className="size-4" />{saving ? 'Guardando...' : isEdit ? 'Guardar cambios' : 'Crear categoría'}
          </Button>
          <Button type="button" variant="outline" className="cursor-pointer" onClick={() => router.push('/admin/categorias')}>Cancelar</Button>
        </div>
      </form>
    </div>
  )
}
