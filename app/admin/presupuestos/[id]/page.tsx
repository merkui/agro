import { AdminShell } from '@/components/admin/shell'
import { PresupuestoEdit } from './presupuesto-edit'

const ADMIN_USER = process.env.ADMIN_USER ?? 'Admin'

export default async function AdminPresupuestoEditPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  return (
    <AdminShell user={ADMIN_USER}>
      <PresupuestoEdit id={id} />
    </AdminShell>
  )
}
