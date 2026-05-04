'use client'

import Link from 'next/link'
import { useState } from 'react'
import { useBudget } from '@/components/use-budget'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft, Trash2 } from 'lucide-react'

export default function PresupuestoPage() {
  const { items, totalItems, updateQuantity, removeItem, clearBudget } = useBudget()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [company, setCompany] = useState('')
  const [observation, setObservation] = useState('')
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState('')

  const clearForm = () => {
    setName('')
    setEmail('')
    setCompany('')
    setObservation('')
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!name || !email || items.length === 0) {
      setStatus('error')
      setMessage('Complete nombre, email y asegúrese de tener productos en el presupuesto.')
      return
    }

    setStatus('submitting')
    setMessage('')

    try {
      const response = await fetch('/api/presupuesto', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          email,
          company,
          observation,
          items,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Error al enviar el presupuesto.')
      }

      clearBudget()
      clearForm()
      setStatus('success')
      setMessage('Presupuesto enviado correctamente. Pronto nos comunicaremos con usted.')
    } catch (error) {
      setStatus('error')
      setMessage(
        error instanceof Error
          ? error.message
          : 'Ocurrió un error al enviar el presupuesto.',
      )
    }
  }

  return (
    <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Su Presupuesto
          </h1>
          <p className="mt-2 text-muted-foreground">
            Revisa los productos que has agregado y ajusta las cantidades.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Link href="/" className="text-sm font-medium text-primary underline">
            Volver al inicio
          </Link>
          <Badge variant="secondary">Total de items: {totalItems}</Badge>
        </div>
      </div>

      {message && (
        <div
          className={`mb-6 rounded-xl border p-4 text-sm ${
            status === 'success'
              ? 'border-emerald-200 bg-emerald-100 text-emerald-900'
              : 'border-destructive bg-destructive/10 text-destructive'
          }`}
        >
          {message}
        </div>
      )}

      {items.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border bg-secondary/50 p-12 text-center">
          <p className="text-lg font-semibold text-foreground">No hay productos en su presupuesto.</p>
          <p className="mt-2 text-sm text-muted-foreground">
            Agrega productos desde el catálogo para comenzar a armar tu presupuesto.
          </p>
          <div className="mt-6">
            <Button asChild>
              <Link href="/productos">Ver productos</Link>
            </Button>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="rounded-3xl border border-border bg-card p-6">
            <div className="grid gap-6 md:grid-cols-[2fr_1fr_1fr_1fr] md:items-center">
              <span className="text-sm font-medium text-muted-foreground">Producto</span>
              <span className="text-sm font-medium text-muted-foreground">Cantidad</span>
              <span className="text-sm font-medium text-muted-foreground">Categoria</span>
              <span className="text-sm font-medium text-muted-foreground">Acción</span>
            </div>
            <div className="mt-4 space-y-4">
              {items.map((item) => (
                <div key={item.producto.id} className="grid gap-4 rounded-2xl border border-border bg-background/80 p-4 md:grid-cols-[2fr_1fr_1fr_1fr] md:items-center">
                  <div>
                    <Link href={`/productos/${item.producto.id}`} className="font-semibold text-foreground hover:text-primary">
                      {item.producto.producto_nombre}
                    </Link>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {item.producto.producto_descripcion}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Input
                      type="number"
                      min={1}
                      value={item.quantity}
                      onChange={(event) => updateQuantity(item.producto.id, Number(event.target.value) || 1)}
                      className="w-24"
                    />
                  </div>
                  <div className="text-sm font-medium text-foreground capitalize">
                    {item.producto.categoria}
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="destructive" size="sm" onClick={() => removeItem(item.producto.id)}>
                      <Trash2 className="size-4" />
                      Eliminar
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-3 rounded-3xl border border-border bg-card p-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Items totales:</p>
              <p className="text-2xl font-semibold text-foreground">{totalItems}</p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button variant="outline" onClick={clearBudget}>Limpiar presupuesto</Button>
              <Button asChild>
                <Link href="/productos">Seguir comprando</Link>
              </Button>
            </div>
          </div>

          <form
            className="rounded-3xl border border-border bg-card p-6 space-y-6"
            onSubmit={handleSubmit}
          >
            <div>
              <h2 className="text-2xl font-semibold text-foreground">Enviar presupuesto</h2>
              <p className="mt-2 text-sm text-muted-foreground">
                Complete sus datos y envíe el presupuesto al administrador.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <Input
                type="text"
                placeholder="Nombre"
                value={name}
                onChange={(event) => setName(event.target.value)}
                required
              />
              <Input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
              />
            </div>

            <Input
              type="text"
              placeholder="Empresa"
              value={company}
              onChange={(event) => setCompany(event.target.value)}
            />

            <Textarea
              placeholder="Observación"
              value={observation}
              onChange={(event) => setObservation(event.target.value)}
              rows={4}
            />

            <div className="flex flex-wrap items-center gap-3">
              <Button type="submit" disabled={status === 'submitting'}>
                {status === 'submitting' ? 'Enviando...' : 'Enviar el Presupuesto'}
              </Button>
              <Button variant="outline" onClick={() => {
                clearForm()
                setStatus('idle')
                setMessage('')
              }} type="button">
                Limpiar formulario
              </Button>
            </div>
          </form>
        </div>
      )}
    </div>
  )
}
