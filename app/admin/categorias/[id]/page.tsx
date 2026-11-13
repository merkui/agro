import { AdminShell } from '@/components/admin/shell'
import { CategoriaForm } from '../categoria-form'

const ADMIN_USER = process.env.ADMIN_USER ?? 'Admin'

export default async function EditarCategoriaPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  return (
    <AdminShell user={ADMIN_USER}>
      <CategoriaForm categoryId={id} />
    </AdminShell>
  )
}
