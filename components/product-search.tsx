'use client'

import { useEffect, useMemo, useState } from 'react'
import type { FormEvent, KeyboardEvent } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Search } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { CATEGORIAS, type Producto } from '@/lib/types'
import { cn } from '@/lib/utils'
import { getProductUrl } from '@/lib/product-data'

interface ProductSearchProps {
  productos: Producto[]
  className?: string
}

const MIN_SEARCH_LENGTH = 3

function normalizeText(value: string | null | undefined) {
  return (value || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
}

export function ProductSearch({ productos, className }: ProductSearchProps) {
  const router = useRouter()
  const [search, setSearch] = useState('')
  const [selectedIndex, setSelectedIndex] = useState(-1)

  const results = useMemo(() => {
    const query = normalizeText(search.trim())

    if (query.length < MIN_SEARCH_LENGTH) {
      return []
    }

    const queryTerms = query.split(/\s+/).filter(Boolean)

    return productos.filter((producto) => {
      const categoria = CATEGORIAS.find((item) => item.value === producto.categoria)
      const searchableText = normalizeText(
        [
          producto.producto_nombre,
          producto.producto_descripcion,
          producto.categoria,
          categoria?.label,
        ].join(' '),
      )

      return queryTerms.every((term) => searchableText.includes(term))
    })
  }, [productos, search])

  const shouldShowResults = search.trim().length >= MIN_SEARCH_LENGTH

  useEffect(() => {
    if (selectedIndex >= results.length) {
      setSelectedIndex(results.length - 1)
    }
  }, [results.length, selectedIndex])

  const handleSearchChange = (event: FormEvent<HTMLInputElement>) => {
    setSearch(event.currentTarget.value)
    setSelectedIndex(-1)
  }

  const closeResults = () => {
    setSearch('')
    setSelectedIndex(-1)
  }

  const goToProduct = (producto: Producto) => {
    closeResults()
    router.push(getProductUrl(producto))
  }

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Escape') {
      closeResults()
      return
    }

    if (!shouldShowResults || results.length === 0) {
      return
    }

    if (event.key === 'ArrowDown') {
      event.preventDefault()
      setSelectedIndex((current) => (current + 1) % results.length)
    }

    if (event.key === 'ArrowUp') {
      event.preventDefault()
      setSelectedIndex((current) => (current <= 0 ? results.length - 1 : current - 1))
    }

    if (event.key === 'Enter' && selectedIndex >= 0) {
      event.preventDefault()
      goToProduct(results[selectedIndex])
    }

  }

  return (
    <div className={cn('relative mx-auto w-full max-w-2xl', className)}>
      <div className="relative">
        <Search className="pointer-events-none absolute left-3 top-1/2 size-5 -translate-y-1/2 text-[#42614a]" />
        <Input
          type="search"
          value={search}
          onChange={handleSearchChange}
          onInput={handleSearchChange}
          onKeyDown={handleKeyDown}
          placeholder="Buscar productos"
          className="h-10 rounded-lg border-white/60 bg-[#f7fbf4] pl-10 text-base text-[#123820] shadow-sm placeholder:text-[#5c725f] focus-visible:ring-white/60"
          aria-label="Buscar productos"
          aria-expanded={shouldShowResults}
          aria-controls="product-search-results"
          role="combobox"
        />
      </div>

      {shouldShowResults && (
        <div
          id="product-search-results"
          role="listbox"
          aria-label="Resultados de búsqueda"
          className="absolute left-0 right-0 top-full z-[100] mt-2 max-h-72 overflow-y-auto rounded-lg border border-border bg-popover p-1 shadow-lg"
        >
          {results.length > 0 ? (
            results.map((producto, index) => (
              <Link
                key={producto.id}
                href={getProductUrl(producto)}
                role="option"
                aria-selected={selectedIndex === index}
                onMouseEnter={() => setSelectedIndex(index)}
                onClick={closeResults}
                className={cn(
                  'block rounded-md px-3 py-2 text-sm font-medium text-popover-foreground outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground',
                  selectedIndex === index && 'bg-accent text-accent-foreground',
                )}
              >
                {producto.producto_nombre}
              </Link>
            ))
          ) : (
            <p className="px-3 py-2 text-sm text-muted-foreground">
              No se encontraron productos.
            </p>
          )}
        </div>
      )}
    </div>
  )
}
