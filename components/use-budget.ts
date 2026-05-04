'use client'

import { useBudgetContext } from '@/components/budget-provider'

export function useBudget() {
  return useBudgetContext()
}
