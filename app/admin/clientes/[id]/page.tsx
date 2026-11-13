import { AdminShell } from '@/components/admin/shell'
import { ClienteForm } from '../cliente-form'

const ADMIN_USER = process.env.ADMIN_USER ?? 'Admin'

export default async function EditarClientePage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  return (
    <AdminShell user={ADMIN_USER}>
      <ClienteForm customerId={id} />
    </AdminShell>
  )
}
