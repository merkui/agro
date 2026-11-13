'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { ArrowLeft, Save } from 'lucide-react'

const MAX_CATEGORIES = 3

interface ProductForm {
  name: string
  sku: string
  slug: string
  category_ids: string[]
  short_description: string
  description: string
  formulation: string
  pest_target: string
  brand: string
  unit: string
  image_url: string
  status: string
  is_featured: boolean
}

interface Category { id: string; name: string }

const EMPTY: ProductForm = {
  name: '', sku: '', slug: '', category_ids: [],
  short_description: '', description: '', formulation: '',
  pest_target: '', brand: '', unit: '', image_url: '',
  status: 'active', is_featured: false,
}

function toSlug(text: string) {
  return text.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
}

export function ProductoForm({ productId }: { productId?: string }) {
  const router = useRouter()
  const isEdit = Boolean(productId)
  const [form, setForm] = useState<ProductForm>(EMPTY)
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(isEdit)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null)

  // Cargar categorías
  useEffect(() => {
    fetch('/api/admin/categories')
      .then((r) => r.json())
      .then(setCategories)
      .catch(() => {})
  }, [])

  // Cargar producto si es edición
  useEffect(() => {
    if (!productId) return
    fetch(`/api/admin/products/${productId}`)
      .then(async (r) => { if (!r.ok) throw new Error(await r.text()); return r.json() })
      .then((d) => setForm({
        name: d.name ?? '',
        sku: d.sku ?? '',
        slug: d.slug ?? '',
        category_ids: (d.product_categories ?? []).map((pc: { category_id: string }) => pc.category_id),
        short_description: d.short_description ?? '',
        description: d.description ?? '',
        formulation: d.formulation ?? '',
        pest_target: d.pest_target ?? '',
        brand: d.brand ?? '',
        unit: d.unit ?? '',
        image_url: d.image_url ?? '',
        status: d.status ?? 'active',
        is_featured: d.is_featured ?? false,
      }))
      .catch((e) => setMessage({ text: e.message, type: 'error' }))
      .finally(() => setLoading(false))
  }, [productId])

  const set = (field: keyof ProductForm) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const value = e.target.value
    setForm((prev) => ({
      ...prev,
      [field]: value,
      ...(field === 'name' && !isEdit ? { slug: toSlug(value) } : {}),
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name) { setMessage({ text: 'El nombre es obligatorio.', type: 'error' }); return }
    setSaving(true); setMessage(null)
    try {
      const url = isEdit ? `/api/admin/products/${productId}` : '/api/admin/products'
      const r = await fetch(url, { method: isEdit ? 'PUT' : 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) })
      const data = await r.json()
      if (!r.ok) throw new Error(data.error)
      setMessage({ text: isEdit ? 'Producto actualizado.' : 'Producto creado.', type: 'success' })
      setTimeout(() => router.push('/admin/productos'), 1000)
    } catch (err) {
      setMessage({ text: err instanceof Error ? err.message : 'Error al guardar.', type: 'error' })
    } finally { setSaving(false) }
  }

  if (loading) return <div className="p-8 text-muted-foreground">Cargando producto...</div>

  return (
    <div className="max-w-2xl space-y-6 p-8">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" className="gap-2 cursor-pointer" onClick={() => router.push('/admin/productos')}>
          <ArrowLeft className="size-4" />Volver
        </Button>
        <h1 className="text-2xl font-bold text-foreground">{isEdit ? 'Editar producto' : 'Agregar producto'}</h1>
      </div>

      {message && (
        <div className={`rounded-xl border p-3 text-sm ${message.type === 'success' ? 'border-emerald-200 bg-emerald-50 text-emerald-800' : 'border-destructive bg-destructive/10 text-destructive'}`}>
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Datos principales */}
        <div className="rounded-2xl border border-border bg-card p-6 space-y-4">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">Datos principales</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5 sm:col-span-2">
              <label className="text-sm font-medium text-foreground">Nombre <span className="text-destructive">*</span></label>
              <Input value={form.name} onChange={set('name')} placeholder="Nombre del producto" required />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground">SKU</label>
              <Input value={form.sku} onChange={set('sku')} placeholder="SKU-001" className="font-mono" />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground">Slug</label>
              <Input value={form.slug} onChange={set('slug')} placeholder="nombre-del-producto" className="font-mono" />
            </div>
            <div className="space-y-1.5 sm:col-span-2">
              <label className="text-sm font-medium text-foreground">
                Categorías
                <span className="ml-2 text-xs font-normal text-muted-foreground">
                  ({form.category_ids.length}/{MAX_CATEGORIES} seleccionadas)
                </span>
              </label>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                {categories.map((c) => {
                  const checked = form.category_ids.includes(c.id)
                  const disabled = !checked && form.category_ids.length >= MAX_CATEGORIES
                  return (
                    <label
                      key={c.id}
                      className={`flex cursor-pointer items-center gap-2 rounded-lg border px-3 py-2 text-sm transition-colors ${
                        checked
                          ? 'border-primary bg-primary/10 text-primary font-medium'
                          : disabled
                          ? 'cursor-not-allowed border-border bg-muted/30 text-muted-foreground opacity-50'
                          : 'border-border bg-background text-foreground hover:border-primary/50'
                      }`}
                    >
                      <input
                        type="checkbox"
                        className="sr-only"
                        checked={checked}
                        disabled={disabled}
                        onChange={(e) => {
                          setForm((prev) => ({
                            ...prev,
                            category_ids: e.target.checked
                              ? [...prev.category_ids, c.id]
                              : prev.category_ids.filter((id) => id !== c.id),
                          }))
                        }}
                      />
                      {c.name}
                    </label>
                  )
                })}
              </div>
              {form.category_ids.length >= MAX_CATEGORIES && (
                <p className="text-xs text-muted-foreground">Máximo {MAX_CATEGORIES} categorías por producto.</p>
              )}
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground">Marca</label>
              <Input value={form.brand} onChange={set('brand')} placeholder="Marca" />
            </div>
          </div>
        </div>

        {/* Descripción */}
        <div className="rounded-2xl border border-border bg-card p-6 space-y-4">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">Descripción</h2>
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-foreground">Descripción corta</label>
            <Input value={form.short_description} onChange={set('short_description')} placeholder="Breve descripción del producto" />
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-foreground">Descripción completa</label>
            <Textarea value={form.description} onChange={set('description')} placeholder="Descripción detallada del producto..." rows={4} />
          </div>
        </div>

        {/* Ficha técnica */}
        <div className="rounded-2xl border border-border bg-card p-6 space-y-4">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">Ficha técnica</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground">Formulación</label>
              <Input value={form.formulation} onChange={set('formulation')} placeholder="Ej: Emulsión concentrada" />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground">Plaga objetivo</label>
              <Input value={form.pest_target} onChange={set('pest_target')} placeholder="Ej: Ácaros, pulgones" />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground">Unidad</label>
              <Input value={form.unit} onChange={set('unit')} placeholder="Ej: litro, kg, unidad" />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground">URL de imagen</label>
              <Input value={form.image_url} onChange={set('image_url')} placeholder="https://..." />
            </div>
          </div>
        </div>

        {/* Estado */}
        <div className="rounded-2xl border border-border bg-card p-6 space-y-4">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">Estado</h2>
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-foreground">Estado del producto</label>
            <select value={form.status} onChange={set('status')} className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary">
              <option value="active">Activo</option>
              <option value="inactive">Inactivo</option>
            </select>
          </div>
          <label className="flex cursor-pointer items-center gap-3">
            <input type="checkbox" checked={form.is_featured} onChange={(e) => setForm((p) => ({ ...p, is_featured: e.target.checked }))} className="size-4 rounded border-border accent-primary" />
            <span className="text-sm font-medium text-foreground">Producto destacado</span>
          </label>
        </div>

        <div className="flex gap-3">
          <Button type="submit" disabled={saving} className="cursor-pointer gap-2">
            <Save className="size-4" />{saving ? 'Guardando...' : isEdit ? 'Guardar cambios' : 'Crear producto'}
          </Button>
          <Button type="button" variant="outline" className="cursor-pointer" onClick={() => router.push('/admin/productos')}>Cancelar</Button>
        </div>
      </form>
    </div>
  )
}
