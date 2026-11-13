import nodemailer from 'nodemailer'
import { NextResponse } from 'next/server'
import { getSupabaseAdminClient } from '@/lib/supabase'

interface BudgetProduct {
  id: string
  producto_nombre: string
  producto_descripcion: string | null
  categoria: string
}

interface BudgetItem {
  producto: BudgetProduct
  quantity: number
}

interface PresupuestoRequest {
  name: string
  email: string
  company?: string
  observation?: string
  items: BudgetItem[]
}

const ADMIN_EMAIL = process.env.ADMIN_EMAIL
const SMTP_HOST = process.env.SMTP_HOST
const SMTP_PORT = Number(process.env.SMTP_PORT || 587)
const SMTP_USER = process.env.SMTP_USER
const SMTP_PASS = process.env.SMTP_PASS

const isSmtpConfigured = Boolean(ADMIN_EMAIL && SMTP_HOST && SMTP_USER && SMTP_PASS)

async function saveToSupabase(payload: PresupuestoRequest & { submittedAt: string }) {
  const supabase = getSupabaseAdminClient()

  // 1. Upsert customer por email
  const { data: customer, error: customerError } = await supabase
    .from('customers')
    .upsert(
      {
        full_name: payload.name,
        email: payload.email,
        company: payload.company || null,
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'email', ignoreDuplicates: false },
    )
    .select('id')
    .single()

  if (customerError) {
    throw new Error(`Error al guardar cliente: ${customerError.message}`)
  }

  // 2. Insert quote
  const { data: quote, error: quoteError } = await supabase
    .from('quotes')
    .insert({
      customer_id: customer.id,
      status: 'pending',
      customer_notes: payload.observation || null,
    })
    .select('id')
    .single()

  if (quoteError) {
    throw new Error(`Error al guardar presupuesto: ${quoteError.message}`)
  }

  // 3. Insert quote_items
  const quoteItems = payload.items.map((item) => ({
    quote_id: quote.id,
    product_id: item.producto.id,
    quantity: item.quantity,
    unit_price: 0,
    subtotal: 0,
    product_name_snapshot: item.producto.producto_nombre,
  }))

  const { error: itemsError } = await supabase.from('quote_items').insert(quoteItems)

  if (itemsError) {
    throw new Error(`Error al guardar items del presupuesto: ${itemsError.message}`)
  }

  return { customerId: customer.id, quoteId: quote.id }
}

async function sendPresupuestoEmail(payload: PresupuestoRequest & { submittedAt: string }) {
  if (!isSmtpConfigured) {
    throw new Error('Email server not configured.')
  }

  const transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port: SMTP_PORT,
    secure: SMTP_PORT === 465,
    auth: {
      user: SMTP_USER,
      pass: SMTP_PASS,
    },
  })

  const itemsHtml = payload.items
    .map(
      (item) =>
        `<tr style="border-bottom:1px solid #ddd"><td style="padding:8px">${item.producto.producto_nombre}</td><td style="padding:8px">${item.quantity}</td><td style="padding:8px">${item.producto.categoria}</td></tr>`,
    )
    .join('')

  const html = `
    <div>
      <h2>Nuevo presupuesto enviado</h2>
      <p><strong>Nombre:</strong> ${payload.name}</p>
      <p><strong>Email:</strong> ${payload.email}</p>
      <p><strong>Empresa:</strong> ${payload.company || 'No especificada'}</p>
      <p><strong>Observación:</strong> ${payload.observation || 'Ninguna'}</p>
      <p><strong>Fecha de envío:</strong> ${payload.submittedAt}</p>
      <h3>Productos</h3>
      <table style="border-collapse:collapse;width:100%;margin-top:16px">
        <thead>
          <tr>
            <th style="text-align:left;padding:8px;border-bottom:1px solid #ddd">Producto</th>
            <th style="text-align:left;padding:8px;border-bottom:1px solid #ddd">Cantidad</th>
            <th style="text-align:left;padding:8px;border-bottom:1px solid #ddd">Categoría</th>
          </tr>
        </thead>
        <tbody>
          ${itemsHtml}
        </tbody>
      </table>
    </div>
  `

  const textItems = payload.items
    .map((item) => `- ${item.producto.producto_nombre} (${item.producto.categoria}) x ${item.quantity}`)
    .join('\n')

  const text = `Nuevo presupuesto enviado\n\nNombre: ${payload.name}\nEmail: ${payload.email}\nEmpresa: ${payload.company || 'No especificada'}\nObservación: ${payload.observation || 'Ninguna'}\nFecha de envío: ${payload.submittedAt}\n\nProductos:\n${textItems}`

  await transporter.sendMail({
    from: SMTP_USER,
    to: ADMIN_EMAIL,
    subject: `Nuevo presupuesto de ${payload.name}`,
    text,
    html,
    replyTo: payload.email,
  })
}

export async function POST(request: Request) {
  try {
    const payload = (await request.json()) as PresupuestoRequest

    if (!payload.name || !payload.email || !payload.items?.length) {
      return NextResponse.json(
        { error: 'Faltan campos requeridos o no hay productos en el presupuesto.' },
        { status: 400 },
      )
    }

    const record = { ...payload, submittedAt: new Date().toISOString() }

    const { quoteId } = await saveToSupabase(record)

    let emailSent = false
    if (isSmtpConfigured) {
      await sendPresupuestoEmail(record)
      emailSent = true
    }

    return NextResponse.json({ success: true, quoteId, emailSent })
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Error desconocido' },
      { status: 500 },
    )
  }
}
