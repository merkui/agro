import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { CategoryCard } from '@/components/category-card'
import { ProductCard } from '@/components/product-card'
import { getFeaturedProducts } from '@/lib/product-data'
import { CATEGORIAS } from '@/lib/types'
import { ArrowRight } from 'lucide-react'

export default function HomePage() {
  const productos = getFeaturedProducts()

  return (
    <div>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-primary/5">
        <div className="mx-auto max-w-7xl px-6 py-24 lg:px-8 lg:py-32">
          <div className="mx-auto max-w-2xl text-center">
            <h1 className="text-balance text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
              Protege tus cultivos con productos de calidad
            </h1>
            <p className="mt-6 text-pretty text-lg leading-relaxed text-muted-foreground">
              Descubre nuestra amplia gama de insecticidas, herbicidas y fungicidas. 
              Soluciones efectivas para mantener tus cultivos sanos y productivos.
            </p>
            <div className="mt-10 flex items-center justify-center gap-4">
              <Button size="lg" asChild>
                <Link href="/productos">
                  Ver productos
                  <ArrowRight className="size-4" />
                </Link>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link href="/quienes-somos">Conocenos</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 lg:py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Nuestras Categorías
            </h2>
            <p className="mt-4 text-muted-foreground">
              Encuentra el producto adecuado para cada necesidad
            </p>
          </div>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {CATEGORIAS.map((categoria) => (
              <CategoryCard
                key={categoria.value}
                title={categoria.label}
                description={categoria.description}
                href={`/productos?categoria=${categoria.value}`}
                icon={categoria.value}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="border-t border-border bg-card py-16 lg:py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                Productos Destacados
              </h2>
              <p className="mt-4 text-muted-foreground">
                Los productos más populares de nuestro catálogo
              </p>
            </div>
            <Button variant="outline" className="hidden sm:flex" asChild>
              <Link href="/productos">
                Ver todos
                <ArrowRight className="size-4" />
              </Link>
            </Button>
          </div>
          
          {productos && productos.length > 0 ? (
            <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {productos.map((producto) => (
                <ProductCard key={producto.id} producto={producto} />
              ))}
            </div>
          ) : (
            <div className="mt-12 rounded-lg border border-dashed border-border bg-secondary/50 p-12 text-center">
              <p className="text-muted-foreground">
                No hay productos destacados disponibles en este momento.
              </p>
            </div>
          )}
          
          <div className="mt-8 text-center sm:hidden">
            <Button variant="outline" asChild>
              <Link href="/productos">
                Ver todos los productos
                <ArrowRight className="size-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
