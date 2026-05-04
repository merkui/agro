'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, X, Leaf, ClipboardList } from 'lucide-react'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { useBudget } from '@/components/use-budget'

const navigation = [
  { name: 'Inicio', href: '/' },
  { name: 'Productos', href: '/productos' },
  { name: 'Quienes Somos', href: '/quienes-somos' },
]

export function Header() {
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { totalItems } = useBudget()

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-8">
        <div className="flex lg:flex-1">
          <Link href="/" className="-m-1.5 flex items-center gap-2 p-1.5">
            <Leaf className="size-8 text-primary" />
            <span className="text-xl font-bold text-foreground">AgroProductos</span>
          </Link>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="flex lg:hidden">
            <Button
              variant="ghost"
              size="icon"
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

        <div className="hidden lg:flex lg:gap-x-8">
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                'text-base font-medium transition-colors hover:text-primary',
                pathname === item.href
                  ? 'text-primary'
                  : 'text-muted-foreground'
              )}
            >
              {item.name}
            </Link>
          ))}
          <Button variant="ghost" size="icon" asChild>
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

      {mobileMenuOpen && (
        <div className="lg:hidden">
          <div className="space-y-1 border-t border-border px-6 py-4">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  'block rounded-lg px-3 py-2 text-base font-medium transition-colors',
                  pathname === item.href
                    ? 'bg-primary/10 text-primary'
                    : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
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
