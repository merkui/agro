import type { Producto } from './types'

export function slugifyProductName(name: string) {
  return name
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export function getProductUrl(producto: Pick<Producto, 'categoria' | 'producto_nombre'>) {
  return `/producto/${producto.categoria}/${slugifyProductName(producto.producto_nombre)}`
}
