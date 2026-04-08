import { NextRequest, NextResponse } from 'next/server'
import { randomUUID } from 'crypto'
import { Prisma } from '@prisma/client'
import { prisma } from '@/lib/prisma'
import { picpayRequest } from '@/lib/picpay'

type CartItemInput = {
  productId: number
  quantity: number
}

type ChargeRequestBody = {
  customer: {
    name: string
    email: string
    whatsapp: string
    cpf: string
  }
  items: CartItemInput[]
}

type PicPayChargeResponse = {
  merchantChargeId: string
  chargeStatus: string
  amount: number
  transactions: Array<{
    paymentType: string
    transactionStatus: string
    pix?: {
      qrCode: string
      qrCodeBase64: string
    }
  }>
}

function parsePhone(whatsapp: string) {
  const digits = whatsapp.replace(/\D/g, '')
  if (digits.length < 10) {
    return null
  }

  let countryCode = '55'
  let areaCode = ''
  let number = ''

  if (digits.startsWith('55') && digits.length >= 12) {
    countryCode = '55'
    areaCode = digits.slice(2, 4)
    number = digits.slice(4)
  } else {
    areaCode = digits.slice(0, 2)
    number = digits.slice(2)
  }

  if (!areaCode || !number) {
    return null
  }

  return { countryCode, areaCode, number }
}

function getClientIp(request: NextRequest) {
  const forwarded = request.headers.get('x-forwarded-for')
  if (forwarded) {
    return forwarded.split(',')[0].trim()
  }
  return request.headers.get('x-real-ip') || '127.0.0.1'
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as ChargeRequestBody

    if (!body?.items?.length) {
      return NextResponse.json({ error: 'Carrinho vazio.' }, { status: 400 })
    }

    const customer = body.customer
    if (!customer?.name || !customer?.email || !customer?.whatsapp || !customer?.cpf) {
      return NextResponse.json({ error: 'Dados do cliente incompletos.' }, { status: 400 })
    }

    const phone = parsePhone(customer.whatsapp)
    if (!phone) {
      return NextResponse.json({ error: 'WhatsApp inválido.' }, { status: 400 })
    }

    const cpf = customer.cpf.replace(/\D/g, '')
    if (cpf.length !== 11) {
      return NextResponse.json({ error: 'CPF inválido.' }, { status: 400 })
    }

    const productIds = body.items.map(item => item.productId)
    const products = await prisma.product.findMany({
      where: { id: { in: productIds } },
    })

    if (products.length !== productIds.length) {
      return NextResponse.json({ error: 'Produto não encontrado.' }, { status: 400 })
    }

    const itemsWithProduct = body.items.map(item => {
      const product = products.find(p => p.id === item.productId)
      return {
        product,
        quantity: item.quantity,
      }
    })

    const total = itemsWithProduct.reduce((sum, item) => {
      if (!item.product) return sum
      return sum + item.product.price.toNumber() * item.quantity
    }, 0)

    const amountInCents = Math.round(total * 100)
    if (amountInCents <= 0) {
      return NextResponse.json({ error: 'Total inválido.' }, { status: 400 })
    }

    const merchantChargeId = randomUUID()

    const chargeResponse = await picpayRequest<PicPayChargeResponse>('/charge/pix', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        paymentSource: 'GATEWAY',
        merchantChargeId,
        customer: {
          name: customer.name,
          email: customer.email,
          documentType: 'CPF',
          document: cpf,
          phone: {
            countryCode: phone.countryCode,
            areaCode: phone.areaCode,
            number: phone.number,
            type: 'MOBILE',
          },
        },
        transactions: [
          {
            paymentType: 'PIX',
            amount: amountInCents,
            pix: {
              expiration: 900,
            },
          },
        ],
        deviceInformation: {
          ip: getClientIp(request),
        },
      }),
    })

    const pixData = chargeResponse.transactions?.[0]?.pix
    if (!pixData?.qrCode) {
      return NextResponse.json({ error: 'Não foi possível gerar o QR Code.' }, { status: 500 })
    }

    await prisma.order.create({
      data: {
        customerName: customer.name,
        customerEmail: customer.email,
        customerPhone: customer.whatsapp,
        total: new Prisma.Decimal(total),
        paymentMethod: 'pix',
        paymentStatus: 'pending',
        orderStatus: 'processing',
        paymentId: merchantChargeId,
        items: {
          create: itemsWithProduct.map(item => ({
            productId: item.product?.id ?? 0,
            title: item.product?.title ?? 'Produto',
            price: item.product?.price ?? new Prisma.Decimal(0),
            quantity: item.quantity,
          })),
        },
      },
    })

    return NextResponse.json({
      merchantChargeId,
      amount: amountInCents,
      qrCode: pixData.qrCode,
      qrCodeBase64: pixData.qrCodeBase64,
      expiresInSeconds: 900,
    })
  } catch (error) {
    console.error('PicPay charge error:', error)
    const message = error instanceof Error ? error.message : String(error)
    const responseError = process.env.NODE_ENV === 'production'
      ? 'Erro ao gerar cobrança Pix.'
      : message
    return NextResponse.json({ error: responseError }, { status: 500 })
  }
}
