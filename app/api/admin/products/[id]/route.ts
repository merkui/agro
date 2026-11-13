import { NextResponse } from 'next/server'
import { getSupabaseAdminClient } from '@/lib/supabase'

const TABLE = process.env.SUPABASE_PRODUCTS_TABLE || 'products'

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const { data, error } = await getSupabaseAdminClient()
      .from(TABLE)
      .select('*, product_categories(category_id, categories(id, name, slug))')
      .eq('id', id)
      .single()
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Error desconocido' }, { status: 500 })
  }
}

async function syncCategories(supabase: ReturnType<typeof getSupabaseAdminClient>, productId: string, categoryIds: string[]) {
  // Borrar las existentes
  await supabase.from('product_categories').delete().eq('product_id', productId)

  // Insertar las nuevas (máximo 3)
  if (categoryIds.length > 0) {
    const rows = categoryIds.slice(0, 3).map((category_id) => ({ product_id: productId, category_id }))
    const { error } = await supabase.from('product_categories').insert(rows)
    if (error) throw new Error(`Error al guardar categorías: ${error.message}`)
  }
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const body = await request.json()
    const supabase = getSupabaseAdminClient()

    const { data, error } = await supabase
      .from(TABLE)
      .update({
        name: body.name,
        slug: body.slug || null,
        sku: body.sku || null,
        category_id: body.category_ids?.[0] || null,
        short_description: body.short_description || null,
        description: body.description || null,
        formulation: body.formulation || null,
        pest_target: body.pest_target || null,
        brand: body.brand || null,
        unit: body.unit || null,
        image_url: body.image_url || null,
        status: body.status || 'active',
        is_featured: body.is_featured ?? false,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single()

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })

    await syncCategories(supabase, id, body.category_ids ?? [])

    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Error desconocido' }, { status: 500 })
  }
}
