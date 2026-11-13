import { NextResponse } from 'next/server'
import { getSupabaseAdminClient } from '@/lib/supabase'

export async function GET() {
  try {
    const supabase = getSupabaseAdminClient()

    const { data, error } = await supabase
      .from('quotes')
      .select('id, quote_number, status, created_at, total, customers(full_name, email), quote_items(id)')
      .order('created_at', { ascending: false })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    const quotes = (data ?? []).map((q) => ({
      id: q.id,
      quote_number: q.quote_number,
      status: q.status,
      created_at: q.created_at,
      total: q.total,
      customer: Array.isArray(q.customers) ? q.customers[0] : q.customers,
      item_count: Array.isArray(q.quote_items) ? q.quote_items.length : 0,
    }))

    return NextResponse.json(quotes)
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Error desconocido' },
      { status: 500 },
    )
  }
}
