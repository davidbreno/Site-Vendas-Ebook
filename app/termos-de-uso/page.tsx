import { Header } from '@/components/header'
import { Footer } from '@/components/footer'

export default function TermsOfUsePage() {
  return (
    <main className="min-h-screen bg-navy text-cream">
      <Header />
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="bg-navy-light border border-gold/10 rounded-3xl p-10 shadow-xl shadow-black/20">
          <h1 className="font-serif text-4xl text-cream mb-6">Termos de Uso</h1>
          <p className="text-cream/70 leading-relaxed text-lg mb-6">
            Estes termos regem o uso da plataforma Marca & Mente Studio.
            Ao utilizar nossos serviços, você concorda com as regras e condições listadas abaixo.
          </p>
          <div className="space-y-4 text-cream/70">
            <p>O acesso aos materiais é concedido mediante o cumprimento de todas as políticas internas.</p>
            <p>Conteúdo digital não pode ser redistribuído sem autorização.</p>
            <p>Reservamo-nos o direito de alterar os termos a qualquer momento.</p>
          </div>
        </div>
      </section>
      <Footer />
    </main>
  )
}
