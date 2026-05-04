'use client'

import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import type { Producto } from '@/lib/types'

export interface BudgetItem {
  producto: Producto
  quantity: number
}

interface BudgetContextValue {
  items: BudgetItem[]
  totalItems: number
  addItem: (producto: Producto, quantity: number) => void
  updateQuantity: (id: string, quantity: number) => void
  removeItem: (id: string) => void
  clearBudget: () => void
}

const BudgetContext = createContext<BudgetContextValue | undefined>(undefined)
const STORAGE_KEY = 'agro-budget'

function loadBudget(): BudgetItem[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

function saveBudget(items: BudgetItem[]) {
  if (typeof window === 'undefined') return
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
  } catch {
    // ignore storage errors
  }
}

export function BudgetProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<BudgetItem[]>([])

  useEffect(() => {
    setItems(loadBudget())
  }, [])

  useEffect(() => {
    saveBudget(items)
  }, [items])

  const addItem = (producto: Producto, quantity: number) => {
    if (quantity < 1) return

    setItems((current) => {
      const existing = current.find((item) => item.producto.id === producto.id)
      if (existing) {
        return current.map((item) =>
          item.producto.id === producto.id
            ? { ...item, quantity: item.quantity + quantity }
            : item,
        )
      }

      return [...current, { producto, quantity }]
    })
  }

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity < 1) {
      removeItem(id)
      return
    }

    setItems((current) =>
      current.map((item) =>
        item.producto.id === id ? { ...item, quantity } : item,
      ),
    )
  }

  const removeItem = (id: string) => {
    setItems((current) => current.filter((item) => item.producto.id !== id))
  }

  const clearBudget = () => {
    setItems([])
  }

  const totalItems = useMemo(
    () => items.reduce((sum, item) => sum + item.quantity, 0),
    [items],
  )

  return (
    <BudgetContext.Provider
      value={{ items, totalItems, addItem, updateQuantity, removeItem, clearBudget }}
    >
      {children}
    </BudgetContext.Provider>
  )
}

export function useBudgetContext() {
  const context = useContext(BudgetContext)
  if (!context) {
    throw new Error('useBudgetContext must be used inside BudgetProvider')
  }
  return context
}
