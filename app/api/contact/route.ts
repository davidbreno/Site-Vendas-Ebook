import { NextRequest, NextResponse } from 'next/server'
import nodemailer from 'nodemailer'

const smtpHost = process.env.SMTP_HOST
const smtpPort = process.env.SMTP_PORT
const smtpUser = process.env.SMTP_USER
const smtpPass = process.env.SMTP_PASS
const receiverEmail = process.env.CONTACT_RECEIVER_EMAIL || process.env.SMTP_USER

export async function POST(request: NextRequest) {
  try {
    const { name, email, phone, message } = await request.json()

    if (!name || !email || !phone || !message) {
      return NextResponse.json(
        { error: 'Todos os campos são obrigatórios.' },
        { status: 400 }
      )
    }

    if (!smtpHost || !smtpPort || !smtpUser || !smtpPass || !receiverEmail) {
      return NextResponse.json(
        { error: 'Configuração de email incompleta. Verifique as variáveis de ambiente.' },
        { status: 500 }
      )
    }

    const transporter = nodemailer.createTransport({
      host: smtpHost,
      port: parseInt(smtpPort, 10),
      secure: smtpPort === '465',
      auth: {
        user: smtpUser,
        pass: smtpPass,
      },
    })

    await transporter.sendMail({
      from: smtpUser,
      to: receiverEmail,
      subject: `Novo pedido de orçamento de ${name}`,
      text: `Nome: ${name}\nEmail: ${email}\nWhatsApp: ${phone}\n\nMensagem:\n${message}`,
      html: `
        <div style="font-family: system-ui, sans-serif; color: #111;"><h2>Novo pedido de orçamento</h2>
        <p><strong>Nome:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>WhatsApp:</strong> ${phone}</p>
        <p><strong>Mensagem:</strong></p>
        <p style="white-space: pre-wrap;">${message}</p>
        </div>
      `,
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Erro ao enviar email de contato:', error)

    const message = error instanceof Error ? error.message : String(error)
    const responseError = process.env.NODE_ENV === 'production'
      ? 'Não foi possível enviar a mensagem. Tente novamente mais tarde.'
      : message

    return NextResponse.json(
      { error: responseError },
      { status: 500 }
    )
  }
}
