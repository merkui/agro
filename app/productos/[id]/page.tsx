import { notFound, permanentRedirect } from 'next/navigation'
import { getProductUrl } from '@/lib/product-helpers'
import { getProductById } from '@/lib/products'

interface LegacyProductPageProps {
  params: Promise<{ id: string }>
}

export default async function LegacyProductPage({ params }: LegacyProductPageProps) {
  const { id } = await params
  const producto = await getProductById(id)

  if (!producto) {
    notFound()
  }

  permanentRedirect(getProductUrl(producto))
}
