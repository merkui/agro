import { AdminShell } from '@/components/admin/shell'
import { ProductoForm } from '../producto-form'

const ADMIN_USER = process.env.ADMIN_USER ?? 'Admin'

export default function NuevoProductoPage() {
  return (
    <AdminShell user={ADMIN_USER}>
      <ProductoForm />
    </AdminShell>
  )
}
