import { NextResponse } from 'next/server'
import { getSupabaseAdminClient } from '@/lib/supabase'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const search = searchParams.get('search')?.trim() ?? ''
    const supabase = getSupabaseAdminClient()

    let query = supabase
      .from('customers')
      .select('id, full_name, email, phone, company, city, province, is_active, created_at')
      .order('created_at', { ascending: false })

    if (search) {
      query = query.or(
        `full_name.ilike.%${search}%,email.ilike.%${search}%,company.ilike.%${search}%,city.ilike.%${search}%`,
      )
    }

    const { data, error } = await query

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })

    return NextResponse.json(data ?? [])
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Error desconocido' },
      { status: 500 },
    )
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const supabase = getSupabaseAdminClient()

    const { data, error } = await supabase
      .from('customers')
      .insert({
        full_name: body.full_name,
        email: body.email,
        phone: body.phone || null,
        company: body.company || null,
        address: body.address || null,
        city: body.city || null,
        province: body.province || null,
        notes: body.notes || null,
        is_active: body.is_active ?? true,
      })
      .select()
      .single()

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })

    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Error desconocido' },
      { status: 500 },
    )
  }
}
