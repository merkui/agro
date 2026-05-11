import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getProductBySlug, getProductUrl } from '@/lib/product-data'
import { ProductGallery } from '@/components/product-gallery'
import { AddToBudget } from '@/components/add-to-budget'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft, Beaker, Bug, Leaf, FlaskConical } from 'lucide-react'
import type { Producto } from '@/lib/types'

interface ProductPageProps {
  params: Promise<{ categoria: string; slug: string }>
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { categoria, slug } = await params
  const producto = getProductBySlug(categoria, slug)

  if (!producto) {
    notFound()
  }

  const typedProducto = producto as Producto

  const getCategoryIcon = (categoria: string) => {
    switch (categoria) {
      case 'insecticidas':
        return <Bug className="size-5" />
      case 'herbicidas':
        return <Leaf className="size-5" />
      case 'fungicidas':
        return <FlaskConical className="size-5" />
      default:
        return <Beaker className="size-5" />
    }
  }

  const getCategoryLabel = (categoria: string) => {
    switch (categoria) {
      case 'insecticidas':
        return 'Insecticida'
      case 'herbicidas':
        return 'Herbicida'
      case 'fungicidas':
        return 'Fungicida'
      default:
        return 'Producto'
    }
  }

  const getEstadoBadgeVariant = (estado: string) => {
    switch (estado) {
      case 'destacado':
        return 'default'
      case 'nuevo':
        return 'secondary'
      case 'oferta':
        return 'destructive'
      default:
        return 'outline'
    }
  }

  const getEstadoLabel = (estado: string) => {
    switch (estado) {
      case 'destacado':
        return 'Destacado'
      case 'nuevo':
        return 'Nuevo'
      case 'oferta':
        return 'Oferta'
      default:
        return estado
    }
  }

  const plagas = typedProducto.producto_plaga
    ? typedProducto.producto_plaga.split(',').map((p) => p.trim())
    : []
  const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || 'https://agroproductos.com').replace(/\/$/, '')
  const productPath = getProductUrl(typedProducto)
  const productUrl = `${siteUrl}${productPath}`
  const productImages = (typedProducto.image_urls || []).map((imageUrl) =>
    imageUrl.startsWith('http') ? imageUrl : `${siteUrl}${imageUrl}`,
  )
  const schemaMarkup = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Product',
        '@id': `${productUrl}#product`,
        name: typedProducto.producto_nombre,
        description: typedProducto.producto_descripcion || undefined,
        image: productImages.length > 0 ? productImages : undefined,
        sku: typedProducto.id,
        category: getCategoryLabel(typedProducto.categoria),
        url: productUrl,
        brand: {
          '@type': 'Brand',
          name: 'AgroProductos',
        },
        additionalProperty: [
          typedProducto.producto_formulacion
            ? {
                '@type': 'PropertyValue',
                name: 'Formulación',
                value: typedProducto.producto_formulacion,
              }
            : null,
          typedProducto.producto_presentacion
            ? {
                '@type': 'PropertyValue',
                name: 'Presentación',
                value: typedProducto.producto_presentacion,
              }
            : null,
          typedProducto.producto_plaga
            ? {
                '@type': 'PropertyValue',
                name: 'Plagas, malezas o enfermedades',
                value: typedProducto.producto_plaga,
              }
            : null,
        ].filter(Boolean),
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            item: {
              '@id': siteUrl,
              name: 'Inicio',
            },
          },
          {
            '@type': 'ListItem',
            position: 2,
            item: {
              '@id': `${siteUrl}/productos`,
              name: 'Productos',
            },
          },
          {
            '@type': 'ListItem',
            position: 3,
            item: {
              '@id': `${siteUrl}/productos?categoria=${typedProducto.categoria}`,
              name: getCategoryLabel(typedProducto.categoria),
            },
          },
          {
            '@type': 'ListItem',
            position: 4,
            item: {
              '@id': productUrl,
              name: typedProducto.producto_nombre,
            },
          },
        ],
      },
    ],
  }

  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(schemaMarkup).replace(/</g, '\\u003c'),
        }}
      />

      <Button variant="ghost" size="sm" className="-ml-2 mb-6 text-muted-foreground" asChild>
        <Link href="/productos">
          <ArrowLeft className="size-4" />
          Volver a productos
        </Link>
      </Button>

      <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
        <div>
          <ProductGallery
            images={typedProducto.image_urls || []}
            productName={typedProducto.producto_nombre}
          />
        </div>

        <div className="flex flex-col gap-6">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="outline" className="gap-1.5 text-sm">
              {getCategoryIcon(typedProducto.categoria)}
              {getCategoryLabel(typedProducto.categoria)}
            </Badge>
            <Badge variant={getEstadoBadgeVariant(typedProducto.estado)}>
              {getEstadoLabel(typedProducto.estado)}
            </Badge>
          </div>

          <h1 className="text-balance text-3xl font-bold tracking-tight md:text-4xl">
            {typedProducto.producto_nombre}
          </h1>

          {typedProducto.producto_descripcion && (
            <div className="space-y-2">
              <h2 className="text-lg font-semibold text-foreground">Descripción</h2>
              <p className="text-pretty leading-relaxed text-muted-foreground">
                {typedProducto.producto_descripcion}
              </p>
            </div>
          )}

          {typedProducto.producto_formulacion && (
            <div className="space-y-2">
              <h2 className="text-lg font-semibold text-foreground">Formulación</h2>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Beaker className="size-5 text-primary" />
                <span>{typedProducto.producto_formulacion}</span>
              </div>
            </div>
          )}

          {typedProducto.producto_presentacion && (
            <div className="space-y-2">
              <h2 className="text-lg font-semibold text-foreground">Presentación</h2>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Beaker className="size-5 text-primary" />
                <span>{typedProducto.producto_presentacion}</span>
              </div>
            </div>
          )}

          {plagas.length > 0 && (
            <div className="space-y-3">
              <h2 className="text-lg font-semibold text-foreground">
                {typedProducto.categoria === 'herbicidas'
                  ? 'Malezas que controla'
                  : typedProducto.categoria === 'fungicidas'
                    ? 'Enfermedades que controla'
                    : 'Plagas que elimina'}
              </h2>
              <div className="flex flex-wrap gap-2">
                {plagas.map((plaga, index) => (
                  <Badge key={index} variant="secondary" className="text-sm">
                    {plaga}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          <div className="mt-4 rounded-xl border border-border bg-card p-6">
            <h3 className="mb-4 font-semibold text-foreground">Información adicional</h3>
            <dl className="grid gap-3 text-sm">
              <div className="flex justify-between">
                <dt className="text-muted-foreground">ID del producto</dt>
                <dd className="font-mono text-xs text-foreground">{typedProducto.id}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Categoría</dt>
                <dd className="capitalize text-foreground">{typedProducto.categoria}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Estado</dt>
                <dd className="capitalize text-foreground">{typedProducto.estado}</dd>
              </div>
              {typedProducto.created_at && (
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Fecha de registro</dt>
                  <dd className="text-foreground">
                    {new Date(typedProducto.created_at).toLocaleDateString('es-ES', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </dd>
                </div>
              )}
            </dl>
          </div>

          <div className="space-y-6">
            <AddToBudget producto={typedProducto} />
          </div>
        </div>
      </div>
    </div>
  )
}
