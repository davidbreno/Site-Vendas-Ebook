"use client"

import { useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, Banknote, Copy, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useCart } from '@/components/cart/cart-context'

export default function CheckoutPage() {
  const { state } = useCart()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    whatsapp: '',
    cpf: '',
  })
  const [fieldErrors, setFieldErrors] = useState<{ name?: string; email?: string; whatsapp?: string; cpf?: string }>({})
  const [pixPayload, setPixPayload] = useState({
    code: '',
    amount: '',
    expires: '15 minutos',
    recipient: '',
  })
  const [checkoutSuccess, setCheckoutSuccess] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [copyMessage, setCopyMessage] = useState('')
  const [apiError, setApiError] = useState('')
  const pixKey = process.env.NEXT_PUBLIC_PIX_KEY || ''
  const pixRecipient = process.env.NEXT_PUBLIC_PIX_RECIPIENT || ''
  const supportWhatsapp = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || ''

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(price)
  }

  const isValidEmail = (email: string) => /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)

  const validateForm = () => {
    const errors: { name?: string; email?: string; whatsapp?: string; cpf?: string } = {}

    if (!formData.name.trim()) {
      errors.name = 'Nome completo é obrigatório.'
    }

    if (!formData.email.trim()) {
      errors.email = 'Email é obrigatório.'
    } else if (!isValidEmail(formData.email)) {
      errors.email = 'Email inválido. Use formato exemplo@dominio.com.'
    }

    if (!formData.whatsapp.trim()) {
      errors.whatsapp = 'WhatsApp é obrigatório.'
    }

    if (!formData.cpf.trim()) {
      errors.cpf = 'CPF é obrigatório.'
    } else if (formData.cpf.replace(/\D/g, '').length !== 11) {
      errors.cpf = 'CPF inválido.'
    }

    setFieldErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleCheckout = async () => {
    setIsLoading(true)
    setApiError('')

    if (!validateForm()) {
      setCheckoutSuccess(false)
      setIsLoading(false)
      return
    }

    try {
      if (!pixKey) {
        setApiError('PIX não configurado. Informe a chave Pix no sistema.')
        setIsLoading(false)
        return
      }

      const response = await fetch('/api/orders/manual-pix', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          customer: {
            name: formData.name,
            email: formData.email,
            whatsapp: formData.whatsapp,
            cpf: formData.cpf,
          },
          items: state.items.map((item) => ({
            productId: item.product.id,
            quantity: item.quantity,
          })),
        }),
      })

      const data = await response.json()
      if (!response.ok) {
        setApiError(data.error || 'Não foi possível registrar o pedido.')
        setIsLoading(false)
        return
      }

      setPixPayload({
        code: pixKey,
        amount: formatPrice(state.total),
        expires: 'Após o pagamento',
        recipient: pixRecipient,
      })
      setCheckoutSuccess(true)
      setCopyMessage('')
    } catch (error) {
      console.error(error)
      setApiError('Não foi possível registrar o pedido.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(pixPayload.code)
      setCopyMessage('PIX copiado com sucesso!')
      setTimeout(() => setCopyMessage(''), 3000)
    } catch {
      setCopyMessage('Não foi possível copiar. Use Ctrl+C.')
    }
  }

  const whatsappLink = supportWhatsapp
    ? `https://wa.me/${supportWhatsapp.replace(/\D/g, '')}`
    : ''

  if (state.items.length === 0 && !checkoutSuccess) {
    return (
      <main className="min-h-screen bg-navy">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="font-serif text-4xl text-cream mb-4">Carrinho vazio</h1>
            <p className="text-cream/60 text-lg mb-8">
              Adicione produtos ao carrinho antes de finalizar a compra.
            </p>
            <Button
              className="bg-gold hover:bg-gold/90 text-navy font-semibold px-8 py-4 rounded-full"
              asChild
            >
              <Link href="/products">Explorar produtos</Link>
            </Button>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-navy">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="mb-8">
          <Button
            variant="ghost"
            className="text-cream hover:text-gold hover:bg-gold/10 mb-6"
            asChild
          >
            <Link href="/cart">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar ao carrinho
            </Link>
          </Button>

          <h1 className="font-serif text-4xl text-cream mb-2">Finalizar compra</h1>
          <p className="text-cream/60">
            Complete suas informações para receber os produtos digitais.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Checkout Form */}
          <div className="space-y-8">
            {/* Customer Information */}
            <div className="bg-navy-light border border-gold/25 rounded-2xl p-8">
              <h2 className="font-serif text-2xl text-cream mb-6">Informações pessoais</h2>

              <div className="grid sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-cream/80 text-sm font-medium mb-2">
                    Nome completo
                  </label>
                  <input
                    type="text"
                    className="w-full bg-navy border border-gold/20 rounded-lg px-4 py-3 text-cream placeholder:text-cream/40 focus:border-gold/50 focus:outline-none"
                    placeholder="Seu nome completo"
                    value={formData.name}
                    onChange={(event) => setFormData({ ...formData, name: event.target.value })}
                  />
                  {fieldErrors.name ? (
                    <p className="mt-2 text-sm text-red-400">{fieldErrors.name}</p>
                  ) : null}
                </div>

                <div>
                  <label className="block text-cream/80 text-sm font-medium mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    className="w-full bg-navy border border-gold/20 rounded-lg px-4 py-3 text-cream placeholder:text-cream/40 focus:border-gold/50 focus:outline-none"
                    placeholder="seu@email.com"
                    value={formData.email}
                    onChange={(event) => setFormData({ ...formData, email: event.target.value })}
                  />
                  {fieldErrors.email ? (
                    <p className="mt-2 text-sm text-red-400">{fieldErrors.email}</p>
                  ) : null}
                </div>

                <div>
                  <label className="block text-cream/80 text-sm font-medium mb-2">
                    WhatsApp
                  </label>
                  <input
                    type="tel"
                    className="w-full bg-navy border border-gold/20 rounded-lg px-4 py-3 text-cream placeholder:text-cream/40 focus:border-gold/50 focus:outline-none"
                    placeholder="(11) 99999-9999"
                    value={formData.whatsapp}
                    onChange={(event) => setFormData({ ...formData, whatsapp: event.target.value })}
                  />
                  {fieldErrors.whatsapp ? (
                    <p className="mt-2 text-sm text-red-400">{fieldErrors.whatsapp}</p>
                  ) : null}
                </div>

                <div>
                  <label className="block text-cream/80 text-sm font-medium mb-2">
                    CPF
                  </label>
                  <input
                    type="text"
                    className="w-full bg-navy border border-gold/20 rounded-lg px-4 py-3 text-cream placeholder:text-cream/40 focus:border-gold/50 focus:outline-none"
                    placeholder="000.000.000-00"
                    value={formData.cpf}
                    onChange={(event) => setFormData({ ...formData, cpf: event.target.value })}
                  />
                  {fieldErrors.cpf ? (
                    <p className="mt-2 text-sm text-red-400">{fieldErrors.cpf}</p>
                  ) : null}
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <div className="bg-navy-light border border-gold/25 rounded-2xl p-8">
              <h2 className="font-serif text-2xl text-cream mb-6">Forma de pagamento</h2>

              <div className="flex items-center gap-4 p-4 border border-gold/20 rounded-lg">
                <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
                  <Banknote className="w-5 h-5 text-green-400" />
                </div>
                <div>
                  <div className="text-cream font-medium">PIX</div>
                  <div className="text-cream/60 text-sm">Pagamento instantâneo</div>
                </div>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:sticky lg:top-6 h-fit">
            <div className="bg-navy-light border border-gold/25 rounded-2xl p-8">
              <h2 className="font-serif text-2xl text-cream mb-6">Resumo do pedido</h2>

              <div className="space-y-4 mb-6">
                {state.items.map((item) => (
                  <div key={item.product.id} className="flex justify-between items-center">
                    <div className="flex-1">
                      <div className="text-cream font-medium">{item.product.title}</div>
                      <div className="text-cream/60 text-sm">
                        {item.quantity}x {item.product.price}
                      </div>
                    </div>
                    <div className="text-gold font-semibold">
                      {formatPrice(parseFloat(item.product.price.replace('R$ ', '').replace(',', '.')) * item.quantity)}
                    </div>
                  </div>
                ))}

                <div className="border-t border-gold/25 pt-4 space-y-2">
                  <div className="flex justify-between text-cream/80">
                    <span>Subtotal</span>
                    <span>{formatPrice(state.total)}</span>
                  </div>
                  <div className="flex justify-between text-cream/80">
                    <span>Frete</span>
                    <span className="text-green-400">Grátis</span>
                  </div>
                  <div className="border-t border-gold/25 pt-2">
                    <div className="flex justify-between text-cream font-semibold text-xl">
                      <span>Total</span>
                      <span>{formatPrice(state.total)}</span>
                    </div>
                  </div>
                </div>
              </div>

              <Button
                className="w-full bg-gold hover:bg-gold/90 text-navy font-semibold py-4 rounded-full text-lg"
                size="lg"
                type="button"
                onClick={handleCheckout}
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className="inline-flex items-center gap-2">
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Processando...
                  </span>
                ) : (
                  <>Gerar PIX</>
                )}
              </Button>

              {apiError ? (
                <div className="mt-4 rounded-2xl border border-red-500/30 bg-red-500/10 p-4 text-red-200 text-sm">
                  {apiError}
                </div>
              ) : null}

              {checkoutSuccess ? (
                <div className="mt-6 bg-navy border border-green-400/20 rounded-2xl p-6">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="text-cream font-semibold text-lg mb-2">Pedido registrado</div>
                      <p className="text-cream/70 text-sm mb-4">
                        Use a chave Pix abaixo para pagar. Depois, envie o comprovante.
                      </p>
                    </div>
                    <div className="rounded-full bg-green-500/10 px-3 py-1 text-green-300 text-xs font-semibold">
                      Seguro</div>
                  </div>

                  <div className="mt-4 space-y-3 text-cream/80 text-sm">
                  {pixPayload.recipient ? (
                    <div className="flex justify-between">
                      <span>Beneficiário</span>
                      <span className="font-medium text-cream">{pixPayload.recipient}</span>
                    </div>
                  ) : null}
                    <div className="flex justify-between">
                      <span>Valor</span>
                      <span className="font-medium text-cream">{pixPayload.amount}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Validade</span>
                      <span className="font-medium text-cream">{pixPayload.expires}</span>
                    </div>
                  </div>

                  <div className="mt-5 rounded-2xl border border-gold/20 bg-navy-light p-4">
                    <div className="text-cream font-medium text-sm mb-2">Chave PIX</div>
                    <pre className="overflow-x-auto whitespace-pre-wrap break-all text-sm text-cream/80">{pixPayload.code}</pre>
                    <Button
                      className="mt-4 bg-gold hover:bg-gold/90 text-navy font-semibold px-4 py-2 rounded-full"
                      size="sm"
                      type="button"
                      onClick={handleCopyCode}
                    >
                      <Copy className="w-4 h-4 mr-2" /> Copiar código
                    </Button>
                    {copyMessage ? (
                      <p className="mt-2 text-sm text-green-300">{copyMessage}</p>
                    ) : null}
                  </div>
                  <div className="mt-4 text-cream/70 text-sm">
                    Após o pagamento, envie o comprovante para liberar o acesso.
                    {whatsappLink ? (
                      <div className="mt-3">
                        <a
                          href={whatsappLink}
                          className="inline-flex items-center justify-center rounded-full border border-gold/40 px-4 py-2 text-cream hover:bg-gold/10"
                          target="_blank"
                          rel="noreferrer"
                        >
                          Enviar comprovante no WhatsApp
                        </a>
                      </div>
                    ) : null}
                  </div>
                </div>
              ) : null}

              <div className="mt-6 space-y-3">
                <div className="flex items-center gap-2 text-cream/60 text-sm">
                  <div className="w-2 h-2 bg-green-400 rounded-full" />
                  Entrega digital imediata
                </div>
                <div className="flex items-center gap-2 text-cream/60 text-sm">
                  <div className="w-2 h-2 bg-green-400 rounded-full" />
                  Compra 100% segura
                </div>
                <div className="flex items-center gap-2 text-cream/60 text-sm">
                  <div className="w-2 h-2 bg-green-400 rounded-full" />
                  Suporte dedicado
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
