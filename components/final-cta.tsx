"use client"

import { ArrowRight, MessageCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { getWhatsappLink } from "@/lib/whatsapp"

export function FinalCTA() {
  return (
    <section className="relative py-24 lg:py-32 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-cream via-white/70 to-cream" />
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-gold/12 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-gold/6 rounded-full blur-2xl" />
      
      {/* Border Glow */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent" />
      
      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="animate-fade-in-up">
          {/* Badge */}
          <span className="inline-block bg-gold/10 border border-gold/30 text-gold text-sm font-medium px-4 py-2 rounded-full mb-8">
            Comece sua transformação hoje
          </span>

          {/* Title */}
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl xl:text-6xl text-navy leading-tight text-balance">
            Pronto para elevar sua marca e{" "}
            <span className="text-gold">começar a vender no mundo digital?</span>
          </h2>

          {/* Description */}
          <p className="text-navy/70 text-lg sm:text-xl mt-6 max-w-2xl mx-auto leading-relaxed">
            Explore ebooks premium, solicite trabalhos criativos personalizados e transforme 
            sua presença online em uma experiência de vendas profissional.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-10">
            <Button
              size="lg"
              className="bg-navy hover:bg-navy/90 text-cream font-semibold px-10 py-6 rounded-full flex items-center gap-2 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-navy/20 text-lg"
              asChild
            >
              <a href="#catalogo">
                Começar agora
                <ArrowRight className="w-5 h-5" />
              </a>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-navy/25 bg-white/80 text-navy hover:bg-cream/80 hover:border-navy/40 px-10 py-6 rounded-full flex items-center gap-2 transition-all duration-300 text-lg"
              asChild
            >
              <a href={getWhatsappLink()} target="_blank" rel="noopener noreferrer">
                <MessageCircle className="w-5 h-5" />
                WhatsApp
              </a>
            </Button>
          </div>

          {/* Trust Badges */}
          <div className="flex flex-wrap items-center justify-center gap-6 mt-12 text-navy/60 text-sm">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              Compra 100% segura
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Acesso imediato
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              Suporte dedicado
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

