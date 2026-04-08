import { NextRequest, NextResponse } from 'next/server'
import { picpayRequest } from '@/lib/picpay'
import { handlePaidCharge } from '@/lib/order-fulfillment'

type ChargeResponse = {
  merchantChargeId: string
  chargeStatus: string
  transactions?: Array<{
    paymentType: string
    transactionStatus: string
  }>
}

export async function GET(
  _request: NextRequest,
  { params }: { params: { merchantChargeId?: string } }
) {
  const merchantChargeId = params.merchantChargeId
  if (!merchantChargeId) {
    return NextResponse.json({ error: 'Identificador inválido.' }, { status: 400 })
  }

  try {
    const data = await picpayRequest<ChargeResponse>(`/charge/${merchantChargeId}`, {
      method: 'GET',
    })

    if (data.chargeStatus === 'PAID' || data.transactions?.[0]?.transactionStatus === 'PAID') {
      await handlePaidCharge(merchantChargeId)
    }

    return NextResponse.json({
      merchantChargeId: data.merchantChargeId,
      chargeStatus: data.chargeStatus,
      transactionStatus: data.transactions?.[0]?.transactionStatus ?? null,
    })
  } catch (error) {
    console.error('PicPay status error:', error)
    return NextResponse.json({ error: 'Erro ao consultar cobrança.' }, { status: 500 })
  }
}
