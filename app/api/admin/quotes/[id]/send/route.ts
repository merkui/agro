import nodemailer from 'nodemailer'
import { NextResponse } from 'next/server'
import { getSupabaseAdminClient } from '@/lib/supabase'

const SMTP_HOST = process.env.SMTP_HOST
const SMTP_PORT = Number(process.env.SMTP_PORT || 587)
const SMTP_USER = process.env.SMTP_USER
const SMTP_PASS = process.env.SMTP_PASS

const formatMoney = (value: number) =>
  new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    minimumFractionDigits: 2,
  }).format(value)

export async function POST(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const supabase = getSupabaseAdminClient()

    const { data: quote, error } = await supabase
      .from('quotes')
      .select('*, customers(*), quote_items(*, products(id, name, sku))')
      .eq('id', id)
      .single()

    if (error || !quote) {
      return NextResponse.json({ error: 'Presupuesto no encontrado.' }, { status: 404 })
    }

    const customer = Array.isArray(quote.customers) ? quote.customers[0] : quote.customers
    const items = Array.isArray(quote.quote_items) ? quote.quote_items : []

    if (!customer?.email) {
      return NextResponse.json({ error: 'El cliente no tiene email registrado.' }, { status: 400 })
    }

    if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS) {
      return NextResponse.json({ error: 'Email no configurado en el servidor.' }, { status: 500 })
    }

    const transporter = nodemailer.createTransport({
      host: SMTP_HOST,
      port: SMTP_PORT,
      secure: SMTP_PORT === 465,
      auth: { user: SMTP_USER, pass: SMTP_PASS },
    })

    const itemsHtml = items
      .map((item) => {
        const name = item.product_name_snapshot ?? item.products?.name ?? 'Producto'
        const unitPrice = item.unit_price ?? 0
        const subtotal = item.subtotal ?? unitPrice * item.quantity
        return `
          <tr style="border-bottom:1px solid #e5e7eb">
            <td style="padding:10px 8px">${name}</td>
            <td style="padding:10px 8px;text-align:center">${item.quantity}</td>
            <td style="padding:10px 8px;text-align:right">${formatMoney(unitPrice)}</td>
            <td style="padding:10px 8px;text-align:right">${formatMoney(subtotal)}</td>
          </tr>`
      })
      .join('')

    const html = `
      <div style="font-family:sans-serif;max-width:600px;margin:0 auto;color:#111">
        <h2 style="color:#166534">Presupuesto N° ${quote.quote_number}</h2>
        <p>Hola <strong>${customer.full_name}</strong>,</p>
        <p>A continuación el detalle de su presupuesto solicitado.</p>
        <table style="border-collapse:collapse;width:100%;margin-top:16px;font-size:14px">
          <thead style="background:#f0fdf4">
            <tr>
              <th style="text-align:left;padding:10px 8px;border-bottom:2px solid #166534">Producto</th>
              <th style="text-align:center;padding:10px 8px;border-bottom:2px solid #166534">Cantidad</th>
              <th style="text-align:right;padding:10px 8px;border-bottom:2px solid #166534">Precio unit.</th>
              <th style="text-align:right;padding:10px 8px;border-bottom:2px solid #166534">Subtotal</th>
            </tr>
          </thead>
          <tbody>${itemsHtml}</tbody>
          <tfoot>
            <tr style="background:#f0fdf4">
              <td colspan="3" style="padding:12px 8px;text-align:right;font-weight:bold">Total</td>
              <td style="padding:12px 8px;text-align:right;font-weight:bold">${formatMoney(quote.total ?? 0)}</td>
            </tr>
          </tfoot>
        </table>
        <p style="margin-top:24px;color:#6b7280;font-size:13px">
          Ante cualquier consulta no dude en contactarnos.
        </p>
      </div>`

    await transporter.sendMail({
      from: SMTP_USER,
      to: customer.email,
      subject: `Presupuesto N° ${quote.quote_number} — AgroProductos`,
      html,
    })

    // Actualizar estado a enviado
    await supabase
      .from('quotes')
      .update({ status: 'sent', sent_at: new Date().toISOString(), updated_at: new Date().toISOString() })
      .eq('id', id)

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Error al enviar.' },
      { status: 500 },
    )
  }
}
