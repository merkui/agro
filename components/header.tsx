import { HeaderClient } from '@/components/header-client'
import { getAllProducts } from '@/lib/products'

export async function Header() {
  const productos = await getAllProducts()

  return <HeaderClient productos={productos} />
}
