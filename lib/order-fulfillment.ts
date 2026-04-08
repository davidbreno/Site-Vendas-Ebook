import nodemailer from 'nodemailer'
import { prisma } from '@/lib/prisma'

type DownloadItem = {
  title: string
  quantity: number
  downloadUrl: string | null
}

function normalizeDownloadUrl(value: string | null) {
  if (!value) return null
  const trimmed = value.trim()
  if (!trimmed) return null
  if (/^https?:\/\//i.test(trimmed)) {
    return trimmed
  }
  if (trimmed.startsWith('/')) {
    const siteUrl = process.env.SITE_URL || process.env.NEXT_PUBLIC_SITE_URL
    if (!siteUrl) {
      return null
    }
    return `${siteUrl.replace(/\/$/, '')}${trimmed}`
  }
  return null
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

async function sendDownloadEmail(params: {
  to: string
  name: string
  items: DownloadItem[]
}) {
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

  const textLines = params.items.map((item) => {
    const qty = item.quantity > 1 ? ` (x${item.quantity})` : ''
    const normalizedUrl = normalizeDownloadUrl(item.downloadUrl)
    const linkText = normalizedUrl ?? 'Link indisponível (responda este email)'
    return `- ${item.title}${qty}: ${linkText}`
  })

  const htmlLines = params.items.map((item) => {
    const qty = item.quantity > 1 ? ` <strong>(x${item.quantity})</strong>` : ''
    const normalizedUrl = normalizeDownloadUrl(item.downloadUrl)
    const link = normalizedUrl
      ? `<a href="${normalizedUrl}">Baixar</a>`
      : `<span>Link indisponível (responda este email)</span>`
    return `<li>${item.title}${qty}: ${link}</li>`
  })

  await transporter.sendMail({
    from: smtpUser,
    to: params.to,
    replyTo: receiverEmail,
    subject: 'Seu ebook está disponível',
    text: `Olá ${params.name},\n\nSeu pagamento foi confirmado! Aqui estão seus links de download:\n\n${textLines.join('\n')}\n\nSe algum link não abrir, responda este email que ajudamos rapidamente.`,
    html: `
      <div style="font-family: system-ui, sans-serif; color: #111;">
        <h2>Pagamento confirmado</h2>
        <p>Olá ${params.name}, seu pagamento foi confirmado! Aqui estão seus links de download:</p>
        <ul>${htmlLines.join('')}</ul>
        <p>Se algum link não abrir, responda este email que ajudamos rapidamente.</p>
      </div>
    `,
  })
}

async function buildDownloadItems(order: {
  items: Array<{ productId: number; title: string; quantity: number }>
}) {
  const productIds = order.items.map((item) => item.productId)
  const products = await prisma.product.findMany({
    where: { id: { in: productIds } },
    select: { id: true, title: true, downloadUrl: true },
  })
  const productMap = new Map(products.map((product) => [product.id, product]))

  return order.items.map((item) => {
    const product = productMap.get(item.productId)
    return {
      title: product?.title ?? item.title,
      quantity: item.quantity,
      downloadUrl: product?.downloadUrl ?? null,
    }
  })
}

export async function handlePaidCharge(merchantChargeId: string) {
  const order = await prisma.order.findFirst({
    where: { paymentId: merchantChargeId },
    include: { items: true },
  })

  if (!order) {
    return { status: 'not_found' as const }
  }

  if (order.paymentStatus === 'completed') {
    return { status: 'already_completed' as const }
  }

  const downloadItems: DownloadItem[] = await buildDownloadItems(order)

  await prisma.order.update({
    where: { id: order.id },
    data: {
      paymentStatus: 'completed',
      orderStatus: 'delivered',
    },
  })

  await sendDownloadEmail({
    to: order.customerEmail,
    name: order.customerName,
    items: downloadItems,
  })

  return { status: 'updated' as const }
}

export async function handleOrderConfirmation(orderId: number) {
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: { items: true },
  })

  if (!order) {
    return { status: 'not_found' as const }
  }

  if (order.paymentStatus === 'completed') {
    return { status: 'already_completed' as const }
  }

  const downloadItems: DownloadItem[] = await buildDownloadItems(order)

  await prisma.order.update({
    where: { id: order.id },
    data: {
      paymentStatus: 'completed',
      orderStatus: 'delivered',
    },
  })

  await sendDownloadEmail({
    to: order.customerEmail,
    name: order.customerName,
    items: downloadItems,
  })

  return { status: 'updated' as const }
}
