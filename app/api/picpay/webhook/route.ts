import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { handlePaidCharge } from '@/lib/order-fulfillment'

type WebhookPayload = {
  data?: {
    status?: string
    merchantChargeId?: string
  }
}

export async function POST(request: NextRequest) {
  const authHeader = request.headers.get('authorization') || ''
  const expectedToken = process.env.PICPAY_WEBHOOK_TOKEN

  if (!expectedToken || authHeader !== expectedToken) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const payload = (await request.json()) as WebhookPayload
    const status = payload.data?.status
    const merchantChargeId = payload.data?.merchantChargeId

    if (!status || !merchantChargeId) {
      return NextResponse.json({ error: 'Invalid payload' }, { status: 400 })
    }

    let paymentStatus = 'pending'

    if (status === 'PAID') {
      paymentStatus = 'completed'
    } else if (status === 'CANCELED' || status === 'DENIED' || status === 'ERROR') {
      paymentStatus = 'failed'
    } else if (status === 'REFUNDED') {
      paymentStatus = 'refunded'
    }

    if (status === 'PAID') {
      await handlePaidCharge(merchantChargeId)
    } else {
      await prisma.order.updateMany({
        where: { paymentId: merchantChargeId },
        data: { paymentStatus },
      })
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('PicPay webhook error:', error)
    return NextResponse.json({ error: 'Webhook error' }, { status: 500 })
  }
}
