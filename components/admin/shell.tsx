'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { FileText, Users, Tag, Package, LogOut, Leaf } from 'lucide-react'
import { Button } from '@/components/ui/button'

const NAV_ITEMS = [
  { href: '/admin/presupuestos', label: 'Presupuestos', icon: FileText },
  { href: '/admin/clientes', label: 'Clientes', icon: Users },
  { href: '/admin/categorias', label: 'Categorías', icon: Tag },
  { href: '/admin/productos', label: 'Productos', icon: Package },
]

function formatDate() {
  return new Intl.DateTimeFormat('es-AR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date())
}

interface AdminShellProps {
  user: string
  children: React.ReactNode
}

export function AdminShell({ user, children }: AdminShellProps) {
  const pathname = usePathname()
  const router = useRouter()

  const handleLogout = async () => {
    await fetch('/api/admin/auth', { method: 'DELETE' })
    router.push('/admin/login')
    router.refresh()
  }

  return (
    <div className="flex min-h-screen bg-muted/30">
      {/* Sidebar */}
      <aside className="flex w-60 shrink-0 flex-col border-r border-border bg-card">
        {/* Brand */}
        <div className="flex items-center gap-3 border-b border-border px-5 py-5">
          <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Leaf className="size-4" />
          </div>
          <span className="text-sm font-semibold text-foreground">AgroProductos</span>
        </div>

        {/* Info del día */}
        <div className="border-b border-border px-5 py-4 space-y-1">
          <p className="text-xs text-muted-foreground capitalize">{formatDate()}</p>
          <div className="flex items-center gap-2">
            <div className="size-2 rounded-full bg-emerald-500" />
            <p className="text-xs font-medium text-foreground">{user}</p>
          </div>
        </div>

        {/* Navegación */}
        <nav className="flex-1 space-y-1 px-3 py-4">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon
            const isActive = pathname.startsWith(item.href)
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                }`}
              >
                <Icon className="size-4 shrink-0" />
                {item.label}
              </Link>
            )
          })}
        </nav>

        {/* Logout */}
        <div className="border-t border-border px-3 py-4">
          <Button
            variant="ghost"
            className="w-full justify-start gap-3 text-muted-foreground hover:text-destructive"
            onClick={handleLogout}
          >
            <LogOut className="size-4" />
            Cerrar sesión
          </Button>
        </div>
      </aside>

      {/* Contenido principal */}
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  )
}
