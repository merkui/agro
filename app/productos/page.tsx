import { ProductosContent } from './productos-content'
import { getAllProducts } from '@/lib/product-data'

interface ProductosPageProps {
  searchParams: Promise<{ categoria?: string; estado?: string }>
}

export default async function ProductosPage({ searchParams }: ProductosPageProps) {
  const params = await searchParams
  const productos = getAllProducts({
    categoria: params.categoria,
    estado: params.estado,
  })

  return (
    <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          Catalogo de Productos
        </h1>
        <p className="mt-2 text-muted-foreground">
          Explora nuestra amplia gama de productos agricolas
        </p>
      </div>
      
      <ProductosContent 
        productos={productos || []} 
        selectedCategoria={params.categoria}
        selectedEstado={params.estado}
      />
    </div>
  )
}
