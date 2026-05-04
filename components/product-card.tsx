import Image from 'next/image'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ArrowRight, Beaker } from 'lucide-react'
import type { Producto } from '@/lib/types'
import { AddToBudget } from '@/components/add-to-budget'

interface ProductCardProps {
  producto: Producto
}

export function ProductCard({ producto }: ProductCardProps) {
  const firstImage = producto.image_urls?.[0]

  return (
    <Card className="group overflow-hidden transition-all hover:shadow-md">
      <div className="relative aspect-[4/3] overflow-hidden rounded-t-2xl bg-secondary">
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
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">{producto.producto_nombre}</CardTitle>
        <CardDescription className="line-clamp-2">
          {producto.producto_descripcion || 'Sin descripcion disponible'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <AddToBudget producto={producto} />
          <Button variant="ghost" size="sm" className="group/btn -ml-2 text-primary" asChild>
            <Link href={`/productos/${producto.id}`}>
              Ver detalles
              <ArrowRight className="size-4 transition-transform group-hover/btn:translate-x-1" />
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
