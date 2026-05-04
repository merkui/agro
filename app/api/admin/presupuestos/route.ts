import fs from 'node:fs/promises'
import path from 'node:path'
import nodemailer from 'nodemailer'
import { NextResponse } from 'next/server'

const PRESUPUESTOS_FILE = path.join(process.cwd(), 'data', 'presupuestos.json')
const SMTP_HOST = process.env.SMTP_HOST
const SMTP_PORT = Number(process.env.SMTP_PORT || 587)
const SMTP_USER = process.env.SMTP_USER
const SMTP_PASS = process.env.SMTP_PASS

const isSmtpConfigured = Boolean(SMTP_HOST && SMTP_USER && SMTP_PASS)

interface BudgetProduct {
  id: string
  producto_nombre: string
  producto_descripcion: string | null
  categoria: string
}

interface BudgetItem {
  producto: BudgetProduct
  quantity: number
  unitPrice?: number
}

interface StoredPresupuesto {
  id: string
  submittedAt: string
  name: string
  email: string
  company?: string
  observation?: string
  items: BudgetItem[]
}

async function readPresupuestos() {
  try {
    const fileContents = await fs.readFile(PRESUPUESTOS_FILE, 'utf8')
    return JSON.parse(fileContents) as StoredPresupuesto[]
  } catch (error) {
    const err = error as NodeJS.ErrnoException
    if (err.code === 'ENOENT') {
      return []
    }

    throw err
  }
}

const formatMoney = (value: number) =>
  new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    minimumFractionDigits: 2,
  }).format(value)

const getSubtotal = (item: BudgetItem) => (item.unitPrice ?? 0) * item.quantity

const getBudgetTotal = (budget: StoredPresupuesto) =>
  budget.items.reduce((total, item) => total + getSubtotal(item), 0)

async function sendClientPresupuestoEmail(budget: StoredPresupuesto) {
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

  const itemsHtml = budget.items
    .map((item) => {
      const unitPrice = item.unitPrice ?? 0
      return `
        <tr style="border-bottom:1px solid #ddd">
          <td style="padding:8px">${item.producto.producto_nombre}</td>
          <td style="padding:8px">${item.quantity}</td>
          <td style="padding:8px">${formatMoney(unitPrice)}</td>
          <td style="padding:8px;text-align:right">${formatMoney(getSubtotal(item))}</td>
        </tr>
      `
    })
    .join('')

  const html = `
    <div>
      <h2>Presupuesto solicitado</h2>
      <p>Hola ${budget.name},</p>
      <p>Te enviamos el detalle del presupuesto solicitado.</p>
      <table style="border-collapse:collapse;width:100%;margin-top:16px">
        <thead>
          <tr>
            <th style="text-align:left;padding:8px;border-bottom:1px solid #ddd">Producto</th>
            <th style="text-align:left;padding:8px;border-bottom:1px solid #ddd">Cantidad</th>
            <th style="text-align:left;padding:8px;border-bottom:1px solid #ddd">Precio unitario</th>
            <th style="text-align:right;padding:8px;border-bottom:1px solid #ddd">Subtotal</th>
          </tr>
        </thead>
        <tbody>
          ${itemsHtml}
        </tbody>
        <tfoot>
          <tr>
            <td colspan="3" style="padding:12px 8px;text-align:right"><strong>Total general</strong></td>
            <td style="padding:12px 8px;text-align:right"><strong>${formatMoney(getBudgetTotal(budget))}</strong></td>
          </tr>
        </tfoot>
      </table>
    </div>
  `

  const textItems = budget.items
    .map((item) => {
      const unitPrice = item.unitPrice ?? 0
      return `- ${item.producto.producto_nombre}: ${item.quantity} x ${formatMoney(unitPrice)} = ${formatMoney(getSubtotal(item))}`
    })
    .join('\n')

  const text = `Hola ${budget.name},\n\nTe enviamos el detalle del presupuesto solicitado.\n\n${textItems}\n\nTotal general: ${formatMoney(getBudgetTotal(budget))}`

  await transporter.sendMail({
    from: SMTP_USER,
    to: budget.email,
    subject: `Presupuesto solicitado - ${budget.name}`,
    text,
    html,
  })
}

export async function GET() {
  try {
    return NextResponse.json(await readPresupuestos())
  } catch (error) {
    const err = error as NodeJS.ErrnoException
    return NextResponse.json(
      { error: err.message || 'Error al leer presupuestos.' },
      { status: 500 },
    )
  }
}

export async function PUT(request: Request) {
  try {
    const payload = (await request.json()) as StoredPresupuesto

    if (!payload.id || !payload.items?.length) {
      return NextResponse.json(
        { error: 'Faltan datos del presupuesto.' },
        { status: 400 },
      )
    }

    const presupuestos = await readPresupuestos()
    const index = presupuestos.findIndex((budget) => budget.id === payload.id)

    if (index === -1) {
      return NextResponse.json(
        { error: 'Presupuesto no encontrado.' },
        { status: 404 },
      )
    }

    presupuestos[index] = {
      ...presupuestos[index],
      items: payload.items.map((item) => ({
        ...item,
        unitPrice:
          typeof item.unitPrice === 'number' && Number.isFinite(item.unitPrice)
            ? item.unitPrice
            : undefined,
      })),
    }

    await fs.mkdir(path.dirname(PRESUPUESTOS_FILE), { recursive: true })
    await fs.writeFile(PRESUPUESTOS_FILE, JSON.stringify(presupuestos, null, 2) + '\n', 'utf8')

    return NextResponse.json({ success: true, presupuesto: presupuestos[index] })
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Error al guardar presupuesto.' },
      { status: 500 },
    )
  }
}

export async function POST(request: Request) {
  try {
    const payload = (await request.json()) as StoredPresupuesto

    if (!payload.id || !payload.email || !payload.items?.length) {
      return NextResponse.json(
        { error: 'Faltan datos para enviar el presupuesto.' },
        { status: 400 },
      )
    }

    await sendClientPresupuestoEmail(payload)

    return NextResponse.json({ success: true, emailSent: true })
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Error al enviar presupuesto.' },
      { status: 500 },
    )
  }
}
