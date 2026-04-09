"use client"

import { PenTool, Layers, BookOpen, Instagram, FileText, Globe, Clock, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"

const services = [
  {
    icon: PenTool,
    title: "Design de Logo",
    description: "Logotipo exclusivo que captura a essência da sua marca com elegância e profissionalismo.",
    startingPrice: "A partir de R$ 497",
    delivery: "5-7 dias úteis",
  },
  {
    icon: Layers,
    title: "Identidade Visual Completa",
    description: "Sistema visual completo com logo, paleta, tipografia e manual de marca.",
    startingPrice: "A partir de R$ 1.997",
    delivery: "15-20 dias úteis",
  },
  {
    icon: BookOpen,
    title: "Design de Ebook Personalizado",
    description: "Ebook com design premium, diagramação profissional e capa impactante.",
    startingPrice: "A partir de R$ 797",
    delivery: "7-10 dias úteis",
  },
  {
    icon: Instagram,
    title: "Design para Redes Sociais",
    description: "Templates personalizados para feed, stories e destaques do Instagram.",
    startingPrice: "A partir de R$ 397",
    delivery: "3-5 dias úteis",
  },
  {
    icon: FileText,
    title: "Catálogo Digital",
    description: "Catálogo interativo e elegante para apresentar seus produtos ou serviços.",
    startingPrice: "A partir de R$ 697",
    delivery: "7-10 dias úteis",
  },
  {
    icon: Globe,
    title: "Design de Landing Page",
    description: "Página de vendas otimizada para conversão com design premium.",
    startingPrice: "A partir de R$ 1.497",
    delivery: "10-14 dias úteis",
  },
]

export function Services() {
  return (
    <section id="personalizado" className="relative py-24 lg:py-32 bg-cream">
      <div className="absolute inset-0 bg-gradient-to-b from-cream via-white/70 to-cream" />
      <div className="absolute top-1/2 left-0 w-72 h-72 bg-gold/8 rounded-full blur-3xl" />
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16 animate-fade-in-up">
          <span className="text-gold text-xs font-medium tracking-[0.35em] uppercase">
            Serviços Personalizados
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-navy mt-4 text-balance">
            Seu projeto, nossa criatividade
          </h2>
          <p className="text-navy/70 text-lg mt-4 max-w-2xl mx-auto">
            Soluções exclusivas criadas sob medida para elevar sua marca ao próximo nível.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, index) => (
            <div
              key={index}
              className="group relative bg-white/80 border border-gold/20 rounded-2xl p-8 hover:border-gold/40 hover:bg-cream/70 shadow-[0_16px_50px_rgba(59,47,40,0.08)] transition-all duration-500 animate-fade-in-up"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Icon */}
              <div className="w-14 h-14 bg-gradient-to-br from-gold/20 to-gold/5 rounded-2xl flex items-center justify-center mb-6 group-hover:from-gold/30 group-hover:to-gold/10 transition-all duration-300">
                <service.icon className="w-7 h-7 text-gold" />
              </div>

              {/* Content */}
              <h3 className="text-navy font-semibold text-xl mb-3 group-hover:text-gold transition-colors">
                {service.title}
              </h3>
              <p className="text-navy/70 text-sm leading-relaxed mb-6">
                {service.description}
              </p>

              {/* Details */}
              <div className="space-y-3 mb-6">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-navy/60">Investimento</span>
                  <span className="text-gold font-semibold">{service.startingPrice}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-navy/60">Prazo estimado</span>
                  <div className="flex items-center gap-1 text-navy/80">
                    <Clock className="w-3.5 h-3.5" />
                    {service.delivery}
                  </div>
                </div>
              </div>

              {/* CTA */}
              <Button
                asChild
                variant="outline"
                className="w-full border-navy/25 bg-white/80 text-navy hover:bg-cream/80 hover:border-navy/40 rounded-full flex items-center justify-center gap-2 group-hover:border-navy/40"
              >
                <a href="/contato">
                  Solicitar orçamento
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </a>
              </Button>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

