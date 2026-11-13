import { NextResponse } from 'next/server'
import { getSupabaseAdminClient } from '@/lib/supabase'

const TABLE = process.env.SUPABASE_PRODUCTS_TABLE || 'products'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const search = searchParams.get('search')?.trim() ?? ''
    const supabase = getSupabaseAdminClient()

    let query = supabase
      .from(TABLE)
      .select('id, name, sku, status, is_featured, image_url, brand, product_categories(categories(id, name))')
      .order('created_at', { ascending: false })

    if (search) {
      const { data: matchingCats } = await supabase
        .from('categories')
        .select('id')
        .ilike('name', `%${search}%`)

      const catIds = (matchingCats ?? []).map((c) => c.id)

      let orFilter = `name.ilike.%${search}%,sku.ilike.%${search}%,brand.ilike.%${search}%`
      if (catIds.length > 0) {
        orFilter += `,category_id.in.(${catIds.join(',')})`
      }

      query = query.or(orFilter)
    }

    const { data, error } = await query
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })

    return NextResponse.json(data ?? [])
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Error desconocido' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const supabase = getSupabaseAdminClient()

    const { data, error } = await supabase
      .from(TABLE)
      .insert({
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
      })
      .select()
      .single()

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })

    // Insertar categorías en la junction table
    const categoryIds: string[] = body.category_ids ?? []
    if (categoryIds.length > 0) {
      const rows = categoryIds.slice(0, 3).map((category_id: string) => ({ product_id: data.id, category_id }))
      await supabase.from('product_categories').insert(rows)
    }

    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Error desconocido' }, { status: 500 })
  }
}
