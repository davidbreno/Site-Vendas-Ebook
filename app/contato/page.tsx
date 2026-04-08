"use client"

import { useState, type FormEvent } from 'react'
import Link from 'next/link'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { Mail, MessageCircle, MapPin } from 'lucide-react'
import { getWhatsappLink } from '@/lib/whatsapp'

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  })
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState('')

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setStatus('sending')
    setErrorMessage('')

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data?.error || 'Falha ao enviar a solicitação.')
      }

      setStatus('success')
      setFormData({ name: '', email: '', phone: '', message: '' })
    } catch (error) {
      setStatus('error')
      setErrorMessage(error instanceof Error ? error.message : 'Erro desconhecido ao enviar.')
    }
  }

  return (
    <main className="min-h-screen bg-navy text-cream">
      <Header />

      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-28">
        <div className="grid gap-12 lg:grid-cols-2">
          <div className="space-y-6">
            <span className="text-gold text-sm font-medium tracking-widest uppercase">Contato</span>
            <h1 className="font-serif text-4xl sm:text-5xl text-cream leading-tight">Vamos criar algo incrível juntos</h1>
            <p className="text-cream/70 text-lg leading-relaxed">
              Envie sua solicitação de orçamento ou fale diretamente com nossa equipe. Respondemos rapidamente para ajudar seu projeto a sair do papel.
            </p>

            <div className="space-y-4 text-cream/70">
              <div className="flex items-start gap-4">
                <div className="mt-1 rounded-2xl bg-gold/10 p-3 text-gold">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-semibold text-cream">Email</p>
                  <p>contato@marcaemente.com</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="mt-1 rounded-2xl bg-gold/10 p-3 text-gold">
                  <MessageCircle className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-semibold text-cream">WhatsApp</p>
                  <a
                    href={getWhatsappLink()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-cream/70 hover:text-gold transition-colors"
                  >
                    Falar no WhatsApp
                  </a>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="mt-1 rounded-2xl bg-gold/10 p-3 text-gold">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-semibold text-cream">Atendimento</p>
                  <p>Segunda a sexta, 9h às 18h</p>
                </div>
              </div>
            </div>

            <Link
              href="/"
              className="inline-flex items-center gap-2 text-sm text-gold hover:text-cream transition-colors"
            >
              Voltar à página inicial
            </Link>
          </div>

          <div className="rounded-3xl border border-gold/10 bg-navy-light p-8 shadow-xl shadow-black/20">
            <h2 className="text-2xl font-semibold text-cream mb-6">Solicitar orçamento</h2>
            <form className="space-y-5" onSubmit={handleSubmit}>
              <div>
                <label className="block text-cream/80 text-sm font-medium mb-2">Nome completo</label>
                <input
                  className="w-full rounded-2xl border border-gold/10 bg-navy px-4 py-3 text-cream placeholder:text-cream/40 focus:border-gold/50 focus:outline-none"
                  placeholder="Seu nome"
                  type="text"
                  value={formData.name}
                  onChange={(event) => setFormData({ ...formData, name: event.target.value })}
                  required
                />
              </div>
              <div>
                <label className="block text-cream/80 text-sm font-medium mb-2">Email</label>
                <input
                  className="w-full rounded-2xl border border-gold/10 bg-navy px-4 py-3 text-cream placeholder:text-cream/40 focus:border-gold/50 focus:outline-none"
                  placeholder="seu@email.com"
                  type="email"
                  value={formData.email}
                  onChange={(event) => setFormData({ ...formData, email: event.target.value })}
                  required
                />
              </div>
              <div>
                <label className="block text-cream/80 text-sm font-medium mb-2">WhatsApp</label>
                <input
                  className="w-full rounded-2xl border border-gold/10 bg-navy px-4 py-3 text-cream placeholder:text-cream/40 focus:border-gold/50 focus:outline-none"
                  placeholder="(11) 99999-9999"
                  type="tel"
                  value={formData.phone}
                  onChange={(event) => setFormData({ ...formData, phone: event.target.value })}
                  required
                />
              </div>
              <div>
                <label className="block text-cream/80 text-sm font-medium mb-2">Mensagem</label>
                <textarea
                  className="w-full min-h-[160px] rounded-3xl border border-gold/10 bg-navy px-4 py-3 text-cream placeholder:text-cream/40 focus:border-gold/50 focus:outline-none"
                  placeholder="Descreva seu projeto ou solicitação"
                  value={formData.message}
                  onChange={(event) => setFormData({ ...formData, message: event.target.value })}
                  required
                />
              </div>

              {status === 'success' && (
                <p className="text-green-300">Solicitação enviada com sucesso! Em breve entraremos em contato.</p>
              )}
              {status === 'error' && (
                <p className="text-red-400">{errorMessage}</p>
              )}

              <button
                type="submit"
                className="w-full rounded-full bg-gold px-6 py-4 text-navy font-semibold hover:bg-gold/90 transition-colors disabled:opacity-70"
                disabled={status === 'sending'}
              >
                {status === 'sending' ? 'Enviando...' : 'Enviar solicitação'}
              </button>
            </form>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
