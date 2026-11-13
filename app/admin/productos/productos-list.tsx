'use client'

import { useEffect, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Pencil, Plus, Search, X, Star } from 'lucide-react'
import Image from 'next/image'

interface Product {
  id: string
  name: string
  sku: string | null
  status: string
  is_featured: boolean
  image_url: string | null
  brand: string | null
  product_categories: { categories: { id: string; name: string } | null }[] | null
}

const STATUS_CONFIG: Record<string, { label: string; className: string }> = {
  active:   { label: 'Activo',   className: 'border-emerald-300 bg-emerald-50 text-emerald-700' },
  inactive: { label: 'Inactivo', className: 'border-zinc-300 bg-zinc-50 text-zinc-500' },
}

export function ProductosList() {
  const router = useRouter()
  const [products, setProducts] = useState<Product[]>([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const fetchProducts = useCallback(async (q: string) => {
    setLoading(true)
    try {
      const url = q ? `/api/admin/products?search=${encodeURIComponent(q)}` : '/api/admin/products'
      const r = await fetch(url)
      if (!r.ok) throw new Error(await r.text())
      setProducts(await r.json())
      setError('')
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Error al cargar productos.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchProducts('') }, [fetchProducts])

  useEffect(() => {
    const t = setTimeout(() => fetchProducts(search), 350)
    return () => clearTimeout(t)
  }, [search, fetchProducts])

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-52">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Buscar por nombre, SKU o marca..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 pr-9"
          />
          {search && (
            <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
              <X className="size-4" />
            </button>
          )}
        </div>
        <Button className="cursor-pointer gap-2 shrink-0" onClick={() => router.push('/admin/productos/nuevo')}>
          <Plus className="size-4" />
          Agregar producto
        </Button>
      </div>

      {loading ? (
        <div className="rounded-2xl border border-border bg-card p-10 text-center text-muted-foreground">Cargando productos...</div>
      ) : error ? (
        <div className="rounded-2xl border border-destructive bg-destructive/10 p-8 text-center text-destructive">{error}</div>
      ) : products.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border bg-secondary/50 p-12 text-center">
          <p className="text-lg font-semibold text-foreground">{search ? 'Sin resultados para esa búsqueda.' : 'No hay productos registrados.'}</p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-border bg-card">
          <div className="hidden grid-cols-[48px_2fr_100px_1fr_1fr_90px_48px_72px] items-center gap-4 border-b border-border bg-muted/50 px-5 py-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground lg:grid">
            <span></span>
            <span>Nombre</span>
            <span>SKU</span>
            <span>Categoría</span>
            <span>Marca</span>
            <span>Estado</span>
            <span className="text-center" title="Destacado"><Star className="size-3.5 mx-auto" /></span>
            <span></span>
          </div>
          <div className="divide-y divide-border">
            {products.map((p) => {
              const statusCfg = STATUS_CONFIG[p.status] ?? { label: p.status, className: 'border-zinc-300 bg-zinc-50 text-zinc-500' }
              const catNames = (p.product_categories ?? []).map((pc) => pc.categories?.name).filter(Boolean)
              return (
                <div key={p.id} className="grid gap-2 px-5 py-3 lg:grid-cols-[48px_2fr_100px_1fr_1fr_90px_48px_72px] lg:items-center">
                  <div className="size-10 overflow-hidden rounded-lg border border-border bg-muted shrink-0">
                    {p.image_url ? (
                      <Image src={p.image_url} alt={p.name} width={40} height={40} className="size-full object-cover" />
                    ) : (
                      <div className="size-full bg-muted" />
                    )}
                  </div>
                  <span className="font-medium text-foreground">{p.name}</span>
                  <span className="font-mono text-sm text-muted-foreground">{p.sku ?? '—'}</span>
                  <span className="text-sm text-muted-foreground">
                    {catNames.length > 0 ? catNames.join(', ') : '—'}
                  </span>
                  <span className="text-sm text-muted-foreground">{p.brand ?? '—'}</span>
                  <Badge variant="outline" className={statusCfg.className}>{statusCfg.label}</Badge>
                  <span className="flex lg:justify-center">
                    {p.is_featured && <Star className="size-4 fill-amber-400 text-amber-400" />}
                  </span>
                  <Button size="sm" variant="outline" className="cursor-pointer gap-1.5" onClick={() => router.push(`/admin/productos/${p.id}`)}>
                    <Pencil className="size-3.5" />
                    Editar
                  </Button>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
