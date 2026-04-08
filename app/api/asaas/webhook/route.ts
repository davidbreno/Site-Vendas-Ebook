import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { handlePaidOrderByPaymentId } from '@/lib/order-fulfillment'

type WebhookPayload = {
  event?: string
  payment?: {
    id?: string
    status?: string
  }
}

const paidEvents = new Set(['PAYMENT_RECEIVED', 'PAYMENT_CONFIRMED'])

export async function POST(request: NextRequest) {
  const expectedToken = process.env.ASAAS_WEBHOOK_TOKEN
  const receivedToken =
    request.headers.get('asaas-access-token') ||
    request.headers.get('authorization') ||
    ''

  if (expectedToken && receivedToken !== expectedToken) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const payload = (await request.json()) as WebhookPayload
    const event = payload.event
    const paymentId = payload.payment?.id
    const status = payload.payment?.status

    if (!event || !paymentId) {
      return NextResponse.json({ error: 'Invalid payload' }, { status: 400 })
    }

    if (paidEvents.has(event) || status === 'RECEIVED' || status === 'CONFIRMED') {
      await handlePaidOrderByPaymentId(paymentId)
    } else if (status === 'CANCELED' || status === 'REFUNDED') {
      await prisma.order.updateMany({
        where: { paymentId },
        data: { paymentStatus: 'failed' },
      })
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('Asaas webhook error:', error)
    return NextResponse.json({ error: 'Webhook error' }, { status: 500 })
  }
}
