import { AdminShell } from '@/components/admin/shell'
import { ClientesList } from './clientes-list'

const ADMIN_USER = process.env.ADMIN_USER ?? 'Admin'

export default function AdminClientesPage() {
  return (
    <AdminShell user={ADMIN_USER}>
      <div className="p-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-foreground">Clientes</h1>
          <p className="mt-1 text-sm text-muted-foreground">Gestión de clientes registrados.</p>
        </div>
        <ClientesList />
      </div>
    </AdminShell>
  )
}
