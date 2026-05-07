import { notFound, permanentRedirect } from 'next/navigation'
import { getProductById, getProductUrl } from '@/lib/product-data'

interface LegacyProductPageProps {
  params: Promise<{ id: string }>
}

export default async function LegacyProductPage({ params }: LegacyProductPageProps) {
  const { id } = await params
  const producto = getProductById(id)

  if (!producto) {
    notFound()
  }

  permanentRedirect(getProductUrl(producto))
}
