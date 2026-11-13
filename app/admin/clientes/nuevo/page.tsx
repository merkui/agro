import { AdminShell } from '@/components/admin/shell'
import { ClienteForm } from '../cliente-form'

const ADMIN_USER = process.env.ADMIN_USER ?? 'Admin'

export default function NuevoClientePage() {
  return (
    <AdminShell user={ADMIN_USER}>
      <ClienteForm />
    </AdminShell>
  )
}
