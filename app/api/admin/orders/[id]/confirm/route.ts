import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { handleOrderConfirmation } from '@/lib/order-fulfillment'

async function checkAuth() {
  const cookieStore = await cookies()
  const authToken = cookieStore.get('admin-auth')?.value
  return authToken === process.env.ADMIN_AUTH_TOKEN
}

export async function POST(
  _request: NextRequest,
  { params }: { params: { id?: string } }
) {
  if (!(await checkAuth())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const rawId =
    params?.id ||
    _request.nextUrl.pathname.split('/').slice(-2, -1)[0] ||
    ''
  const id = Number.parseInt(String(rawId), 10)
  if (!id || Number.isNaN(id)) {
    return NextResponse.json({ error: 'ID inválido.' }, { status: 400 })
  }

  try {
    const result = await handleOrderConfirmation(id)
    return NextResponse.json(result)
  } catch (error) {
    console.error('Error confirming order:', error)
    return NextResponse.json({ error: 'Erro ao confirmar pedido.' }, { status: 500 })
  }
}
