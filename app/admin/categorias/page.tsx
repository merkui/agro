import { AdminShell } from '@/components/admin/shell'
import { CategoriasList } from './categorias-list'

const ADMIN_USER = process.env.ADMIN_USER ?? 'Admin'

export default function AdminCategoriasPage() {
  return (
    <AdminShell user={ADMIN_USER}>
      <div className="p-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-foreground">Categorías</h1>
          <p className="mt-1 text-sm text-muted-foreground">Gestión de categorías de productos.</p>
        </div>
        <CategoriasList />
      </div>
    </AdminShell>
  )
}
