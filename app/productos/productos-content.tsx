'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { CATEGORIAS, type Producto } from '@/lib/types'
import { ArrowRight, Beaker, Filter } from 'lucide-react'
import { getProductUrl } from '@/lib/product-data'
import { AddToBudget } from '@/components/add-to-budget'

interface ProductosContentProps {
  productos: Producto[]
  selectedCategoria?: string
  selectedEstado?: string
}

const ESTADOS = [
  { value: 'destacado', label: 'Destacados' },
  { value: 'nuevo', label: 'Nuevos' },
  { value: 'oferta', label: 'En oferta' },
]

export function ProductosContent({ productos, selectedCategoria, selectedEstado }: ProductosContentProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const updateFilter = (key: string, value: string | null) => {
    const params = new URLSearchParams(searchParams.toString())
    
    if (value) {
      params.set(key, value)
    } else {
      params.delete(key)
    }
    
    router.push(`/productos?${params.toString()}`)
  }

  const clearFilters = () => {
    router.push('/productos')
  }

  return (
    <div className="flex flex-col gap-8 lg:flex-row">
      {/* Sidebar Filters */}
      <aside className="w-full shrink-0 lg:w-64">
        <Card>
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Filter className="size-5" />
              Filtros
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Categorías */}
            <div>
              <h3 className="mb-3 text-sm font-medium text-foreground">Categoría</h3>
              <div className="space-y-2">
                {CATEGORIAS.map((categoria) => (
                  <Button
                    key={categoria.value}
                    variant={selectedCategoria === categoria.value ? 'default' : 'ghost'}
                    size="sm"
                    className="w-full justify-start"
                    onClick={() => updateFilter('categoria', selectedCategoria === categoria.value ? null : categoria.value)}
                  >
                    {categoria.label}
                  </Button>
                ))}
              </div>
            </div>

            {/* Estados */}
            <div>
              <h3 className="mb-3 text-sm font-medium text-foreground">Estado</h3>
              <div className="space-y-2">
                {ESTADOS.map((estado) => (
                  <Button
                    key={estado.value}
                    variant={selectedEstado === estado.value ? 'default' : 'ghost'}
                    size="sm"
                    className="w-full justify-start"
                    onClick={() => updateFilter('estado', selectedEstado === estado.value ? null : estado.value)}
                  >
                    {estado.label}
                  </Button>
                ))}
              </div>
            </div>

            {/* Clear Filters */}
            {(selectedCategoria || selectedEstado) && (
              <Button variant="outline" size="sm" className="w-full" onClick={clearFilters}>
                Limpiar filtros
              </Button>
            )}
          </CardContent>
        </Card>
      </aside>

      {/* Products Grid */}
      <div className="flex-1">
        {productos.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {productos.map((producto) => {
              const firstImage = producto.image_urls?.[0]
              const productUrl = getProductUrl(producto)

              return (
                <Card key={producto.id} className="group gap-0 overflow-hidden py-0 transition-all hover:shadow-md">
                  <div className="relative aspect-[4/3] overflow-hidden rounded-t-xl bg-secondary">
                    {firstImage ? (
                      <Image
                        src={firstImage}
                        alt={producto.producto_nombre}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, 33vw"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center">
                        <Beaker className="size-16 text-primary/40" />
                      </div>
                    )}
                  </div>
                  <CardHeader className="pt-6">
                    <CardTitle className="text-lg">
                      <Link 
                        href={productUrl}
                        className="transition-colors hover:text-primary"
                      >
                        {producto.producto_nombre}
                      </Link>
                    </CardTitle>
                    <CardDescription className="line-clamp-3">
                      {producto.producto_descripcion || 'Sin descripción disponible'}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="flex flex-1 flex-col justify-between gap-4 pb-6">
                    <div className="mt-auto space-y-4">
                      <div className="flex flex-wrap gap-2">
                        <span className="inline-flex items-center rounded-full bg-primary/10 px-2 py-1 text-xs font-medium text-primary">
                          {producto.categoria}
                        </span>
                        <span className="inline-flex items-center rounded-full bg-secondary px-2 py-1 text-xs font-medium text-muted-foreground">
                          {producto.estado}
                        </span>
                      </div>
                      <Button variant="ghost" size="sm" className="group/btn -ml-2 text-primary" asChild>
                        <Link href={productUrl}>
                          Ver producto
                          <ArrowRight className="size-4 transition-transform group-hover/btn:translate-x-1" />
                        </Link>
                      </Button>
                      <AddToBudget producto={producto} buttonClassName="lg:text-[0.775rem]" />
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border bg-secondary/50 p-12 text-center">
            <Beaker className="size-12 text-muted-foreground/50" />
            <h3 className="mt-4 text-lg font-semibold text-foreground">No hay productos</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              No se encontraron productos con los filtros seleccionados.
            </p>
            {(selectedCategoria || selectedEstado) && (
              <Button variant="outline" size="sm" className="mt-4" onClick={clearFilters}>
                Limpiar filtros
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
