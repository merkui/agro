import { unstable_noStore as noStore } from 'next/cache'
import type { Categoria, Producto } from './types'
import { slugifyProductName } from './product-helpers'
import { getSupabaseClient } from './supabase'

const PRODUCTS_TABLE = process.env.SUPABASE_PRODUCTS_TABLE || 'products'

type CategoryRow = {
  id?: string
  slug?: string
  name?: string
} | null

type ProductCategoryRow = {
  category_id?: string
  categories?: CategoryRow
}

type ProductRow = {
  id: string
  name?: string
  short_description?: string | null
  description?: string | null
  formulation?: string | null
  pest_target?: string | null
  unit?: string | null
  status?: string | null
  is_featured?: boolean | null
  created_at?: string
  image_url?: string | null
  product_categories?: ProductCategoryRow[] | null
}

function getCategorias(row: ProductRow): Categoria[] {
  const pcs = row.product_categories
  if (!Array.isArray(pcs) || pcs.length === 0) return []
  return pcs
    .map((pc) => pc.categories?.slug ?? pc.categories?.name ?? '')
    .filter(Boolean)
}

function mapProduct(row: ProductRow): Producto {
  if (!row.id || !row.name) {
    throw new Error('La consulta de productos no devolvio id o name.')
  }

  const categorias = getCategorias(row)

  return {
    id: row.id,
    producto_nombre: row.name,
    producto_descripcion: row.description ?? row.short_description ?? null,
    producto_formulacion: row.formulation ?? null,
    producto_presentacion: row.unit ?? '',
    producto_plaga: row.pest_target ?? null,
    estado: row.status ?? '',
    categoria: categorias[0] ?? '',
    categorias,
    created_at: row.created_at ?? '',
    image_urls: row.image_url ? [row.image_url] : [],
  }
}

function buildProductsQuery() {
  noStore()
  return getSupabaseClient()
    .from(PRODUCTS_TABLE)
    .select('*, product_categories(category_id, categories(id, name, slug))')
}

export async function getAllProducts(filters: { categoria?: string; estado?: string } = {}) {
  let query = buildProductsQuery().order('created_at', { ascending: false })

  if (filters.categoria) {
    const { data: cat } = await getSupabaseClient()
      .from('categories')
      .select('id')
      .eq('slug', filters.categoria)
      .single()

    if (cat) {
      const { data: pcs } = await getSupabaseClient()
        .from('product_categories')
        .select('product_id')
        .eq('category_id', cat.id)

      const ids = (pcs ?? []).map((pc) => pc.product_id)
      query = query.in('id', ids.length ? ids : ['00000000-0000-0000-0000-000000000000'])
    }
  }

  const { data, error } = await query

  if (error) {
    throw new Error(`Error al leer productos desde Supabase: ${error.message}`)
  }

  let products = (data ?? []).map((row) => mapProduct(row as ProductRow))

  if (filters.estado) {
    products = products.filter((p) => p.estado === filters.estado)
  }

  return products
}

export async function getFeaturedProducts(limit = 6) {
  const { data, error } = await buildProductsQuery()
    .eq('is_featured', true)
    .order('created_at', { ascending: false })
    .limit(limit)

  if (error) {
    throw new Error(`Error al leer productos destacados desde Supabase: ${error.message}`)
  }

  return (data ?? []).map((row) => mapProduct(row as ProductRow))
}

export async function getProductById(id: string) {
  const { data, error } = await buildProductsQuery().eq('id', id).maybeSingle()

  if (error) {
    throw new Error(`Error al leer producto desde Supabase: ${error.message}`)
  }

  return data ? mapProduct(data as ProductRow) : null
}

export async function getProductBySlug(categoria: string, slug: string) {
  const productos = await getAllProducts({ categoria })
  return productos.find((p) => slugifyProductName(p.producto_nombre) === slug) ?? null
}
