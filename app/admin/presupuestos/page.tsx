'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

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

export default function AdminPresupuestosPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [budgets, setBudgets] = useState<StoredPresupuesto[]>([])
  const [error, setError] = useState('')
  const [savingId, setSavingId] = useState<string | null>(null)
  const [sendingId, setSendingId] = useState<string | null>(null)
  const [saveMessages, setSaveMessages] = useState<Record<string, string>>({})

  useEffect(() => {
    if (typeof window === 'undefined') {
      return
    }

    const auth = window.localStorage.getItem('admin-auth')
    if (auth !== 'true') {
      router.push('/admin')
      return
    }

    fetch('/api/admin/presupuestos')
      .then(async (response) => {
        if (!response.ok) {
          throw new Error(await response.text())
        }
        return response.json()
      })
      .then((data) => {
        setBudgets(data ?? [])
      })
      .catch((error) => {
        setError(error instanceof Error ? error.message : 'Error al cargar presupuestos.')
      })
      .finally(() => {
        setLoading(false)
      })
  }, [router])

  const handleLogout = () => {
    window.localStorage.removeItem('admin-auth')
    router.push('/admin')
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

  const handleUnitPriceChange = (budgetId: string, productId: string, value: string) => {
    const unitPrice = value === '' ? undefined : Number(value)

    if (unitPrice !== undefined && !Number.isFinite(unitPrice)) {
      return
    }

    setSaveMessages((current) => ({ ...current, [budgetId]: '' }))
    setBudgets((current) =>
      current.map((budget) =>
        budget.id === budgetId
          ? {
              ...budget,
              items: budget.items.map((item) =>
                item.producto.id === productId ? { ...item, unitPrice } : item,
              ),
            }
          : budget,
      ),
    )
  }

  const handleSaveBudget = async (budget: StoredPresupuesto) => {
    setSavingId(budget.id)
    setSaveMessages((current) => ({ ...current, [budget.id]: '' }))

    try {
      const response = await fetch('/api/admin/presupuestos', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(budget),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Error al guardar presupuesto.')
      }

      setBudgets((current) =>
        current.map((item) => (item.id === budget.id ? data.presupuesto : item)),
      )
      setSaveMessages((current) => ({ ...current, [budget.id]: 'Presupuesto guardado.' }))
    } catch (error) {
      setSaveMessages((current) => ({
        ...current,
        [budget.id]: error instanceof Error ? error.message : 'Error al guardar presupuesto.',
      }))
    } finally {
      setSavingId(null)
    }
  }

  const handleSendBudget = async (budget: StoredPresupuesto) => {
    setSendingId(budget.id)
    setSaveMessages((current) => ({ ...current, [budget.id]: '' }))

    try {
      const response = await fetch('/api/admin/presupuestos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(budget),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Error al enviar presupuesto.')
      }

      setSaveMessages((current) => ({
        ...current,
        [budget.id]: `Presupuesto enviado a ${budget.email}.`,
      }))
    } catch (error) {
      setSaveMessages((current) => ({
        ...current,
        [budget.id]: error instanceof Error ? error.message : 'Error al enviar presupuesto.',
      }))
    } finally {
      setSendingId(null)
    }
  }

  return (
    <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Panel de Presupuestos
          </h1>
          <p className="mt-2 text-muted-foreground">
            Revisa los presupuestos guardados con fecha de envío y datos de contacto.
          </p>
        </div>
        <Button variant="ghost" onClick={handleLogout}>
          Cerrar sesión
        </Button>
      </div>

      {loading ? (
        <div className="rounded-3xl border border-border bg-card p-8 text-center text-muted-foreground">
          Cargando presupuestos...
        </div>
      ) : error ? (
        <div className="rounded-3xl border border-destructive bg-destructive/10 p-8 text-center text-destructive">
          {error}
        </div>
      ) : budgets.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-border bg-secondary/50 p-12 text-center">
          <p className="text-lg font-semibold text-foreground">No hay presupuestos guardados aún.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {budgets.map((budget) => (
            <div key={budget.id} className="rounded-3xl border border-border bg-card p-6">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Enviado</p>
                  <p className="text-lg font-semibold text-foreground">
                    {new Date(budget.submittedAt).toLocaleString('es-ES')}
                  </p>
                </div>
                <div className="rounded-full bg-secondary px-4 py-2 text-sm font-medium text-foreground">
                  {budget.items.length} productos
                </div>
              </div>

              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <div className="rounded-2xl border border-border bg-background/80 p-4">
                  <p className="text-sm text-muted-foreground">Nombre</p>
                  <p className="font-medium text-foreground">{budget.name}</p>
                </div>
                <div className="rounded-2xl border border-border bg-background/80 p-4">
                  <p className="text-sm text-muted-foreground">Email</p>
                  <p className="font-medium text-foreground">{budget.email}</p>
                </div>
                <div className="rounded-2xl border border-border bg-background/80 p-4">
                  <p className="text-sm text-muted-foreground">Empresa</p>
                  <p className="font-medium text-foreground">{budget.company || 'No especificada'}</p>
                </div>
                <div className="rounded-2xl border border-border bg-background/80 p-4">
                  <p className="text-sm text-muted-foreground">Observación</p>
                  <p className="font-medium text-foreground">{budget.observation || 'Ninguna'}</p>
                </div>
              </div>

              <div className="mt-6 overflow-hidden rounded-2xl border border-border bg-background/80">
                <div className="border-b border-border bg-muted/50 px-4 py-3 text-sm font-semibold text-muted-foreground">
                  Productos
                </div>
                <div className="hidden grid-cols-[minmax(0,1fr)_110px_160px_160px] gap-4 border-b border-border px-4 py-3 text-sm font-semibold text-muted-foreground md:grid">
                  <span>Producto</span>
                  <span>Cantidad</span>
                  <span>Precio unitario</span>
                  <span className="text-right">Subtotal</span>
                </div>
                <div className="divide-y divide-border">
                  {budget.items.map((item) => (
                    <div key={item.producto.id} className="grid gap-3 px-4 py-3 md:grid-cols-[minmax(0,1fr)_110px_160px_160px] md:items-center">
                      <div>
                        <p className="font-semibold text-foreground">{item.producto.producto_nombre}</p>
                        <p className="text-sm text-muted-foreground capitalize">{item.producto.categoria}</p>
                      </div>
                      <p className="text-sm font-medium text-foreground">
                        <span className="text-muted-foreground md:hidden">Cantidad: </span>
                        {item.quantity}
                      </p>
                      <div>
                        <label className="mb-1 block text-xs font-medium text-muted-foreground md:hidden">
                          Precio unitario
                        </label>
                        <Input
                          type="number"
                          min="0"
                          step="0.01"
                          inputMode="decimal"
                          value={item.unitPrice ?? ''}
                          onChange={(event) =>
                            handleUnitPriceChange(budget.id, item.producto.id, event.target.value)
                          }
                          placeholder="0.00"
                        />
                      </div>
                      <p className="text-sm font-semibold text-foreground md:text-right">
                        <span className="text-muted-foreground md:hidden">Subtotal: </span>
                        {formatMoney(getSubtotal(item))}
                      </p>
                    </div>
                  ))}
                </div>
                <div className="flex flex-col gap-3 border-t border-border bg-muted/30 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Total general</p>
                    <p className="text-2xl font-bold text-foreground">{formatMoney(getBudgetTotal(budget))}</p>
                  </div>
                  <div className="flex flex-col gap-2 sm:items-end">
                    <div className="flex flex-col gap-2 sm:flex-row">
                      <Button onClick={() => handleSaveBudget(budget)} disabled={savingId === budget.id}>
                        {savingId === budget.id ? 'Guardando...' : 'Guardar presupuesto'}
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => handleSendBudget(budget)}
                        disabled={sendingId === budget.id}
                      >
                        {sendingId === budget.id ? 'Enviando...' : 'Enviar Presupuesto'}
                      </Button>
                    </div>
                    {saveMessages[budget.id] && (
                      <p className="text-sm text-muted-foreground">{saveMessages[budget.id]}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
