'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, X, Leaf, ClipboardList } from 'lucide-react'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { useBudget } from '@/components/use-budget'
import { ProductSearch } from '@/components/product-search'
import { getAllProducts } from '@/lib/product-data'

const navigation = [
  { name: 'Inicio', href: '/' },
  { name: 'Productos', href: '/productos' },
  { name: 'Quienes Somos', href: '/quienes-somos' },
]

export function Header() {
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { totalItems } = useBudget()
  const productos = getAllProducts()

  return (
    <header className="sticky top-0 z-50 w-full border-b border-[#1f4f31] bg-[#123820]/95 text-[#f4fbf1] backdrop-blur supports-[backdrop-filter]:bg-[#123820]/90">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-8">
        <div className="flex shrink-0 lg:flex-1">
          <Link href="/" className="-m-1.5 flex items-center gap-2 p-1.5">
            <Leaf className="size-8 text-[#dff7d7]" />
            <span className="text-xl font-bold text-[#f4fbf1]">AgroProductos</span>
          </Link>
        </div>

        <ProductSearch
          productos={productos}
          className="mx-6 hidden max-w-md flex-1 md:block lg:max-w-lg"
        />
        
        <div className="flex items-center gap-3 lg:hidden">
          <div className="flex lg:hidden">
            <Button
              variant="ghost"
              size="icon"
              className="text-[#f4fbf1] hover:bg-white/10 hover:text-white"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <span className="sr-only">Abrir menu</span>
              {mobileMenuOpen ? (
                <X className="size-6" />
              ) : (
                <Menu className="size-6" />
              )}
            </Button>
          </div>
          
        </div>

        <div className="hidden shrink-0 items-center lg:flex lg:gap-x-8">
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                'text-base font-medium transition-colors hover:text-white',
                pathname === item.href
                  ? 'text-white'
                  : 'text-[#dff7d7]'
              )}
            >
              {item.name}
            </Link>
          ))}
          <Button variant="ghost" size="icon" className="text-[#f4fbf1] hover:bg-white/10 hover:text-white" asChild>
            <Link href="/presupuesto" className="relative">
              <span className="sr-only">Ver presupuesto</span>
              <ClipboardList className="size-6" />
              {totalItems > 0 && (
                <span className="absolute -right-2 -top-2 inline-flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-destructive px-1.5 text-[10px] font-semibold text-white">
                  {totalItems}
                </span>
              )}
            </Link>
          </Button>
        </div>
      </nav>

      <div className="px-6 pb-4 md:hidden">
        <ProductSearch productos={productos} />
      </div>

      {mobileMenuOpen && (
        <div className="lg:hidden">
          <div className="space-y-1 border-t border-[#1f4f31] px-6 py-4">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  'block rounded-lg px-3 py-2 text-base font-medium transition-colors',
                  pathname === item.href
                    ? 'bg-white/15 text-white'
                    : 'text-[#dff7d7] hover:bg-white/10 hover:text-white'
                )}
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  )
}
