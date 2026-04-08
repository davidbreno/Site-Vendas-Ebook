"use client"

import { BookOpen, Palette, ShieldCheck, MessageCircle, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { getWhatsappLink } from "@/lib/whatsapp"

const features = [
  {
    icon: BookOpen,
    title: "Ebooks premium prontos para vender",
    description: "Conteúdo de alta qualidade pronto para seu negócio",
  },
  {
    icon: Palette,
    title: "Logos exclusivos e arte personalizada",
    description: "Design único para sua marca se destacar",
  },
  {
    icon: ShieldCheck,
    title: "Checkout inteligente e seguro",
    description: "Experiência de compra profissional e confiável",
  },
]

export function Hero() {
  return (
    <section id="home" className="relative min-h-screen flex items-center pt-20 overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-navy via-navy to-navy-light" />
      <div className="absolute top-1/4 right-0 w-96 h-96 bg-gold/5 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 left-0 w-64 h-64 bg-gold/3 rounded-full blur-2xl" />
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left Content */}
          <div className="space-y-8 animate-fade-in-up">
            <div className="space-y-6">
              <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl text-cream leading-tight text-balance">
                Conhecimento, design e exclusividade para transformar sua{" "}
                <span className="text-gold">presença digital</span> em vendas diárias.
              </h1>
              <p className="text-cream/70 text-lg sm:text-xl leading-relaxed max-w-xl">
                Uma plataforma premium com ebooks, sistemas de branding e soluções criativas personalizadas 
                para posicionar sua marca, elevar autoridade e aumentar conversões.
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                size="lg"
                className="bg-gold hover:bg-gold/90 text-navy font-semibold px-8 py-6 rounded-full flex items-center gap-2 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-gold/20"
                asChild
              >
                <a href="#catalogo">
                  Explorar catálogo
                  <ArrowRight className="w-5 h-5" />
                </a>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-gold/30 text-cream hover:bg-gold/10 hover:border-gold/50 px-8 py-6 rounded-full flex items-center gap-2 transition-all duration-300"
                asChild
              >
                <a href={getWhatsappLink()} target="_blank" rel="noopener noreferrer">
                  <MessageCircle className="w-5 h-5" />
                  Falar no WhatsApp
                </a>
              </Button>
            </div>
          </div>

          {/* Right Visual */}
          <div className="relative hidden lg:block">
            <div className="relative w-full aspect-square">
              {/* Floating Cards */}
              <div className="absolute top-8 left-8 w-48 h-64 bg-gradient-to-br from-navy-light to-navy border border-gold/20 rounded-2xl p-6 shadow-2xl animate-float">
                <div className="w-12 h-12 bg-gold/20 rounded-xl flex items-center justify-center mb-4">
                  <BookOpen className="w-6 h-6 text-gold" />
                </div>
                <div className="space-y-2">
                  <div className="h-3 bg-gold/30 rounded w-3/4" />
                  <div className="h-2 bg-cream/20 rounded w-full" />
                  <div className="h-2 bg-cream/20 rounded w-2/3" />
                </div>
                <div className="mt-6 text-gold font-semibold">R$ 97,00</div>
              </div>

              <div className="absolute top-24 right-4 w-44 h-56 bg-gradient-to-br from-gold/20 to-gold/5 border border-gold/30 rounded-2xl p-5 shadow-xl animate-float animation-delay-200">
                <div className="w-10 h-10 bg-navy rounded-lg flex items-center justify-center mb-3">
                  <Palette className="w-5 h-5 text-gold" />
                </div>
                <div className="space-y-2">
                  <div className="h-2 bg-navy/40 rounded w-full" />
                  <div className="h-2 bg-navy/30 rounded w-3/4" />
                </div>
                <div className="mt-4 text-navy text-sm font-medium">Logo Design</div>
              </div>

              <div className="absolute bottom-12 left-16 w-52 h-32 bg-navy-light border border-gold/20 rounded-xl p-4 shadow-xl animate-float animation-delay-400">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-8 h-8 bg-gold/20 rounded-full flex items-center justify-center">
                    <ShieldCheck className="w-4 h-4 text-gold" />
                  </div>
                  <span className="text-cream/80 text-sm">Compra segura</span>
                </div>
                <div className="flex gap-2">
                  <div className="flex-1 h-2 bg-gold/40 rounded" />
                  <div className="flex-1 h-2 bg-gold/20 rounded" />
                  <div className="flex-1 h-2 bg-gold/10 rounded" />
                </div>
              </div>

              {/* Glow Effect */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gold/10 rounded-full blur-3xl animate-glow" />
            </div>
          </div>
        </div>

        {/* Feature Cards */}
        <div className="grid sm:grid-cols-3 gap-6 mt-16 lg:mt-24">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group bg-navy-light/50 border border-gold/10 rounded-2xl p-6 hover:border-gold/30 transition-all duration-300 hover:bg-navy-light/80 animate-fade-in-up"
              style={{ animationDelay: `${index * 200}ms` }}
            >
              <div className="w-12 h-12 bg-gold/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-gold/20 transition-colors">
                <feature.icon className="w-6 h-6 text-gold" />
              </div>
              <h3 className="text-cream font-semibold mb-2">{feature.title}</h3>
              <p className="text-cream/60 text-sm">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
