import fs from 'node:fs/promises'
import path from 'node:path'
import nodemailer from 'nodemailer'
import { NextResponse } from 'next/server'

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

interface StoredPresupuesto extends PresupuestoRequest {
  id: string
  submittedAt: string
}

const ADMIN_EMAIL = process.env.ADMIN_EMAIL
const SMTP_HOST = process.env.SMTP_HOST
const SMTP_PORT = Number(process.env.SMTP_PORT || 587)
const SMTP_USER = process.env.SMTP_USER
const SMTP_PASS = process.env.SMTP_PASS
const PRESUPUESTOS_FILE = path.join(process.cwd(), 'data', 'presupuestos.json')

const isSmtpConfigured = Boolean(ADMIN_EMAIL && SMTP_HOST && SMTP_USER && SMTP_PASS)

async function savePresupuestoToFile(payload: StoredPresupuesto) {
  await fs.mkdir(path.dirname(PRESUPUESTOS_FILE), { recursive: true })

  let existing: StoredPresupuesto[] = []

  try {
    const fileContents = await fs.readFile(PRESUPUESTOS_FILE, 'utf8')
    existing = JSON.parse(fileContents) as StoredPresupuesto[]
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code !== 'ENOENT') {
      throw error
    }
  }

  existing.push(payload)
  await fs.writeFile(PRESUPUESTOS_FILE, JSON.stringify(existing, null, 2) + '\n', 'utf8')
}

async function sendPresupuestoEmail(payload: StoredPresupuesto) {
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

    const record: StoredPresupuesto = {
      ...payload,
      id: crypto.randomUUID(),
      submittedAt: new Date().toISOString(),
    }

    await savePresupuestoToFile(record)

    if (isSmtpConfigured) {
      await sendPresupuestoEmail(record)
    }

    return NextResponse.json({ success: true, saved: true, emailSent: isSmtpConfigured })
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Error desconocido' },
      { status: 500 },
    )
  }
}
