import Image from 'next/image'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ArrowRight, Beaker } from 'lucide-react'
import type { Producto } from '@/lib/types'
import { AddToBudget } from '@/components/add-to-budget'
import { getProductUrl } from '@/lib/product-data'

interface ProductCardProps {
  producto: Producto
}

export function ProductCard({ producto }: ProductCardProps) {
  const firstImage = producto.image_urls?.[0]
  const productUrl = getProductUrl(producto)

  return (
    <Card className="group gap-0 overflow-hidden py-0 transition-all hover:shadow-md">
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
      <CardHeader className="pt-6 pb-2">
        <CardTitle className="text-lg">{producto.producto_nombre}</CardTitle>
        <CardDescription className="line-clamp-2">
          {producto.producto_descripcion || 'Sin descripción disponible'}
        </CardDescription>
      </CardHeader>
      <CardContent className="pb-6">
        <div className="space-y-4">
          <AddToBudget producto={producto} />
          <Button variant="ghost" size="sm" className="group/btn -ml-2 text-primary" asChild>
            <Link href={productUrl}>
              Ver detalles
              <ArrowRight className="size-4 transition-transform group-hover/btn:translate-x-1" />
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
