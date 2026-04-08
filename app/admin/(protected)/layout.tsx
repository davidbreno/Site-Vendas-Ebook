import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'
import { AdminLayout } from '@/components/admin/admin-layout'

export default async function AdminLayoutPage({
  children,
}: {
  children: React.ReactNode
}) {
  // Simple authentication check using cookies
  const cookieStore = await cookies()
  const authToken = cookieStore.get('admin-auth')?.value

  if (!authToken || authToken !== process.env.ADMIN_AUTH_TOKEN) {
    redirect('/admin/login')
  }

  return <AdminLayout>{children}</AdminLayout>
}