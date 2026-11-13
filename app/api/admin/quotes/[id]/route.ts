import { NextResponse } from 'next/server'
import { getSupabaseAdminClient } from '@/lib/supabase'

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const supabase = getSupabaseAdminClient()

    const { data, error } = await supabase
      .from('quotes')
      .select('*, customers(*), quote_items(*, products(id, name, sku))')
      .eq('id', id)
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Error desconocido' },
      { status: 500 },
    )
  }
}

interface UpdateItem {
  id: string
  unit_price: number
  subtotal: number
}

interface UpdatePayload {
  status: string
  items: UpdateItem[]
  total: number
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const payload = (await request.json()) as UpdatePayload
    const supabase = getSupabaseAdminClient()

    // Actualizar cada item
    for (const item of payload.items) {
      const { error } = await supabase
        .from('quote_items')
        .update({ unit_price: item.unit_price, subtotal: item.subtotal })
        .eq('id', item.id)

      if (error) {
        return NextResponse.json({ error: `Error al actualizar item: ${error.message}` }, { status: 500 })
      }
    }

    // Actualizar quote con status y total
    const { data, error } = await supabase
      .from('quotes')
      .update({
        status: payload.status,
        subtotal: payload.total,
        total: payload.total,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select('*, customers(*), quote_items(*, products(id, name, sku))')
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Error desconocido' },
      { status: 500 },
    )
  }
}
