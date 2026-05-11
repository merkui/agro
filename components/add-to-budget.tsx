'use client'

import { ChangeEvent, useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ToastAction } from '@/components/ui/toast'
import { toast } from '@/hooks/use-toast'
import { useBudget } from '@/components/use-budget'
import { cn } from '@/lib/utils'
import type { Producto } from '@/lib/types'

interface AddToBudgetProps {
  producto: Producto
  buttonClassName?: string
}

export function AddToBudget({ producto, buttonClassName }: AddToBudgetProps) {
  const [quantity, setQuantity] = useState('1')
  const { addItem } = useBudget()

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target

    if (value === '') {
      setQuantity(value)
      return
    }

    const numericValue = Number(value)
    setQuantity(numericValue >= 1 ? value : '1')
  }

  const handleAdd = () => {
    const numericQuantity = Number(quantity)

    if (numericQuantity < 1) return
    addItem(producto, numericQuantity)
    toast({
      title: 'Producto agregado',
      description: `${producto.producto_nombre} x ${numericQuantity} añadido al presupuesto.`,
      variant: 'success',
      duration: 2000,
      action: (
        <ToastAction asChild altText="Ver presupuesto">
          <Link href="/presupuesto">Ver Presupuesto</Link>
        </ToastAction>
      ),
    })
    setQuantity('1')
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-3">
        <Input
          type="number"
          min={1}
          value={quantity}
          onChange={handleChange}
          className="w-24"
        />
        <Button size="sm" className={cn('cursor-pointer', buttonClassName)} onClick={handleAdd}>
          Agregar al Presupuesto
        </Button>
      </div>
    </div>
  )
}
