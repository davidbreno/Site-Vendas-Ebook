import { Header } from '@/components/header'
import { Footer } from '@/components/footer'

export default function RefundPolicyPage() {
  return (
    <main className="min-h-screen bg-navy text-cream">
      <Header />
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="bg-navy-light border border-gold/25 rounded-3xl p-10 shadow-xl shadow-black/20">
          <h1 className="font-serif text-4xl text-cream mb-6">Política de Reembolso</h1>
          <p className="text-cream/70 leading-relaxed text-lg mb-6">
            Esta política explica as regras de reembolso para produtos e serviços oferecidos pela Marca & Mente Studio.
          </p>
          <div className="space-y-4 text-cream/70">
            <p>Reembolsos serão analisados caso a entrega não atenda às expectativas ou requisitos acordados.</p>
            <p>Solicitações devem ser feitas em até 7 dias após a compra.</p>
            <p>Cada caso é tratado com transparência e prioridade.</p>
          </div>
        </div>
      </section>
      <Footer />
    </main>
  )
}
