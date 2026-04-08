import { Header } from '@/components/header'
import { Footer } from '@/components/footer'

export default function PrivacyPolicyPage() {
  return (
    <main className="min-h-screen bg-navy text-cream">
      <Header />
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="bg-navy-light border border-gold/25 rounded-3xl p-10 shadow-xl shadow-black/20">
          <h1 className="font-serif text-4xl text-cream mb-6">Política de Privacidade</h1>
          <p className="text-cream/70 leading-relaxed text-lg mb-6">
            Este documento descreve como coletamos, usamos e protegemos os dados dos usuários.
            Nossa prioridade é oferecer uma experiência premium e segura para todos os clientes.
          </p>
          <div className="space-y-4 text-cream/70">
            <p>Coletamos apenas informações necessárias para entrega de conteúdo digital e suporte ao cliente.</p>
            <p>Os dados não são compartilhados com terceiros sem consentimento explícito.</p>
            <p>Você pode solicitar exclusão ou correção de seus dados a qualquer momento.</p>
          </div>
        </div>
      </section>
      <Footer />
    </main>
  )
}
