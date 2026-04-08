import { NextRequest, NextResponse } from 'next/server'
import { randomUUID } from 'crypto'
import { Prisma } from '@prisma/client'
import { prisma } from '@/lib/prisma'
import { asaasRequest } from '@/lib/asaas'

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

type AsaasCustomerResponse = {
  id: string
}

type AsaasPaymentResponse = {
  id: string
}

type AsaasPixQrResponse = {
  payload: string
  encodedImage: string
  expirationDate?: string
}

function parsePhone(whatsapp: string) {
  const digits = whatsapp.replace(/\D/g, '')
  if (digits.length < 10) {
    return null
  }
  return digits
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

    if (total <= 0) {
      return NextResponse.json({ error: 'Total inválido.' }, { status: 400 })
    }

    const customerResponse = await asaasRequest<AsaasCustomerResponse>('/customers', {
      method: 'POST',
      body: JSON.stringify({
        name: customer.name,
        cpfCnpj: cpf,
        email: customer.email,
        mobilePhone: phone,
      }),
    })

    const merchantChargeId = randomUUID()
    const dueDate = new Date().toISOString().slice(0, 10)

    const paymentResponse = await asaasRequest<AsaasPaymentResponse>('/payments', {
      method: 'POST',
      body: JSON.stringify({
        customer: customerResponse.id,
        billingType: 'PIX',
        value: total,
        dueDate,
        description: 'Compra de produto digital',
        externalReference: merchantChargeId,
      }),
    })

    const pixQrResponse = await asaasRequest<AsaasPixQrResponse>(
      `/payments/${paymentResponse.id}/pixQrCode`,
      { method: 'GET' }
    )

    if (!pixQrResponse?.payload || !pixQrResponse?.encodedImage) {
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
        paymentId: paymentResponse.id,
        notes: merchantChargeId,
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
      paymentId: paymentResponse.id,
      qrCode: pixQrResponse.payload,
      qrCodeBase64: pixQrResponse.encodedImage,
      expiresAt: pixQrResponse.expirationDate ?? null,
    })
  } catch (error) {
    console.error('Asaas pix error:', error)
    const message = error instanceof Error ? error.message : String(error)
    const responseError = process.env.NODE_ENV === 'production'
      ? 'Erro ao gerar cobrança Pix.'
      : message
    return NextResponse.json({ error: responseError }, { status: 500 })
  }
}
