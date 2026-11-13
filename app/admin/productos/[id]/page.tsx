import { AdminShell } from '@/components/admin/shell'
import { ProductoForm } from '../producto-form'

const ADMIN_USER = process.env.ADMIN_USER ?? 'Admin'

export default async function EditarProductoPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  return (
    <AdminShell user={ADMIN_USER}>
      <ProductoForm productId={id} />
    </AdminShell>
  )
}
