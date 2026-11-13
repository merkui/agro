import { AdminShell } from '@/components/admin/shell'
import { CategoriaForm } from '../categoria-form'

const ADMIN_USER = process.env.ADMIN_USER ?? 'Admin'

export default function NuevaCategoriaPage() {
  return (
    <AdminShell user={ADMIN_USER}>
      <CategoriaForm />
    </AdminShell>
  )
}
