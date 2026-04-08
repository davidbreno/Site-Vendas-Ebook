import { NextRequest, NextResponse } from 'next/server'
import { randomUUID } from 'crypto'
import nodemailer from 'nodemailer'
import { Prisma } from '@prisma/client'
import { prisma } from '@/lib/prisma'

type CartItemInput = {
  productId: number
  quantity: number
}

type ManualPixBody = {
  customer: {
    name: string
    email: string
    whatsapp: string
    cpf: string
  }
  items: CartItemInput[]
}

function getMailConfig() {
  const smtpHost = process.env.SMTP_HOST
  const smtpPort = process.env.SMTP_PORT
  const smtpUser = process.env.SMTP_USER
  const smtpPass = process.env.SMTP_PASS
  const receiverEmail = process.env.CONTACT_RECEIVER_EMAIL || process.env.SMTP_USER

  if (!smtpHost || !smtpPort || !smtpUser || !smtpPass || !receiverEmail) {
    throw new Error('Configuração de email incompleta. Verifique as variáveis de ambiente.')
  }

  return {
    smtpHost,
    smtpPort: parseInt(smtpPort, 10),
    smtpUser,
    smtpPass,
    receiverEmail,
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as ManualPixBody

    if (!body?.items?.length) {
      return NextResponse.json({ error: 'Carrinho vazio.' }, { status: 400 })
    }

    const customer = body.customer
    if (!customer?.name || !customer?.email || !customer?.whatsapp || !customer?.cpf) {
      return NextResponse.json({ error: 'Dados do cliente incompletos.' }, { status: 400 })
    }

    const cpf = customer.cpf.replace(/\D/g, '')
    if (cpf.length !== 11) {
      return NextResponse.json({ error: 'CPF inválido.' }, { status: 400 })
    }

    const pixKey = process.env.NEXT_PUBLIC_PIX_KEY
    if (!pixKey) {
      return NextResponse.json({ error: 'PIX não configurado.' }, { status: 500 })
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

    const order = await prisma.order.create({
      data: {
        customerName: customer.name,
        customerEmail: customer.email,
        customerPhone: customer.whatsapp,
        total: new Prisma.Decimal(total),
        paymentMethod: 'pix',
        paymentStatus: 'pending',
        orderStatus: 'processing',
        paymentId: `manual_${randomUUID()}`,
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

    const { smtpHost, smtpPort, smtpUser, smtpPass, receiverEmail } = getMailConfig()
    const transporter = nodemailer.createTransport({
      host: smtpHost,
      port: smtpPort,
      secure: smtpPort === 465,
      auth: {
        user: smtpUser,
        pass: smtpPass,
      },
    })

    const itemsText = itemsWithProduct
      .map(item => `${item.product?.title ?? 'Produto'} (x${item.quantity})`)
      .join('\n')

    const supportWhatsapp = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || ''
    const whatsappDisplay = supportWhatsapp ? `https://wa.me/${supportWhatsapp.replace(/\D/g, '')}` : 'WhatsApp não configurado'

    await transporter.sendMail({
      from: smtpUser,
      to: receiverEmail,
      subject: `Novo pedido Pix manual - ${customer.name}`,
      text: `Novo pedido Pix manual\n\nCliente: ${customer.name}\nEmail: ${customer.email}\nWhatsApp: ${customer.whatsapp}\nCPF: ${cpf}\nTotal: ${total}\n\nItens:\n${itemsText}\n\nChave Pix:\n${pixKey}`,
      html: `
        <div style="font-family: system-ui, sans-serif; color: #111;">
          <h2>Novo pedido Pix manual</h2>
          <p><strong>Cliente:</strong> ${customer.name}</p>
          <p><strong>Email:</strong> ${customer.email}</p>
          <p><strong>WhatsApp:</strong> ${customer.whatsapp}</p>
          <p><strong>CPF:</strong> ${cpf}</p>
          <p><strong>Total:</strong> ${total}</p>
          <p><strong>Itens:</strong></p>
          <pre style="white-space: pre-wrap;">${itemsText}</pre>
          <p><strong>Chave Pix:</strong> ${pixKey}</p>
        </div>
      `,
    })

    await transporter.sendMail({
      from: smtpUser,
      to: customer.email,
      replyTo: receiverEmail,
      subject: 'Pedido recebido - pagamento Pix',
      text: `Olá ${customer.name},\n\nRecebemos seu pedido. Para pagar, use a chave Pix abaixo:\n${pixKey}\n\nApós o pagamento, envie o comprovante para:\n${whatsappDisplay}\n\nAssim que confirmado, enviamos seus links de download.`,
      html: `
        <div style="font-family: system-ui, sans-serif; color: #111;">
          <h2>Pedido recebido</h2>
          <p>Olá ${customer.name}, recebemos seu pedido.</p>
          <p><strong>Chave Pix:</strong> ${pixKey}</p>
          <p>Após o pagamento, envie o comprovante para:</p>
          <p><a href="${whatsappDisplay}">${whatsappDisplay}</a></p>
          <p>Assim que confirmado, enviamos seus links de download.</p>
        </div>
      `,
    })

    return NextResponse.json({ orderId: order.id })
  } catch (error) {
    console.error('Manual Pix error:', error)
    const message = error instanceof Error ? error.message : String(error)
    const responseError = process.env.NODE_ENV === 'production'
      ? 'Erro ao registrar pedido.'
      : message
    return NextResponse.json({ error: responseError }, { status: 500 })
  }
}
