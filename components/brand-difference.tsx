"use client"

import { Sparkles, Target, Trophy, Briefcase, Zap, Crown } from "lucide-react"

const differences = [
  {
    icon: Sparkles,
    title: "Estética Premium",
    description: "Design sofisticado que comunica valor e qualidade em cada detalhe.",
  },
  {
    icon: Target,
    title: "Estratégia de Conversão",
    description: "Cada elemento pensado para transformar visitantes em clientes.",
  },
  {
    icon: Trophy,
    title: "Posicionamento de Autoridade",
    description: "Construa uma imagem que inspira confiança e credibilidade.",
  },
  {
    icon: Briefcase,
    title: "Profissionalismo",
    description: "Padrão de qualidade que diferencia você da concorrência.",
  },
  {
    icon: Zap,
    title: "Praticidade",
    description: "Soluções prontas para usar e acelerar seus resultados.",
  },
  {
    icon: Crown,
    title: "Exclusividade",
    description: "Produtos e serviços únicos criados para sua realidade.",
  },
]

export function BrandDifference() {
  return (
    <section id="branding" className="relative py-24 lg:py-32 bg-white overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-cream/70 to-white" />
      <div className="absolute top-0 right-0 w-96 h-96 bg-gold/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-gold/3 rounded-full blur-2xl" />
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Content */}
          <div className="animate-fade-in-up">
            <span className="text-gold text-sm font-medium tracking-widest uppercase">
              Nosso Diferencial
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-navy mt-4 leading-tight text-balance">
              Mais que design:{" "}
              <span className="text-gold">estratégia construída para vender</span>
            </h2>
            <p className="text-navy/70 text-lg mt-6 leading-relaxed">
              Na Marca & Mente Studio, cada projeto é desenvolvido com foco em resultados reais. 
              Combinamos estética refinada com estratégias de conversão para transformar sua 
              presença digital em uma máquina de vendas.
            </p>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 mt-10">
              <div className="text-center">
                <div className="text-gold text-3xl font-bold">500+</div>
                <div className="text-navy/60 text-sm mt-1">Projetos entregues</div>
              </div>
              <div className="text-center">
                <div className="text-gold text-3xl font-bold">98%</div>
                <div className="text-navy/60 text-sm mt-1">Clientes satisfeitos</div>
              </div>
              <div className="text-center">
                <div className="text-gold text-3xl font-bold">5</div>
                <div className="text-navy/60 text-sm mt-1">Anos de experiência</div>
              </div>
            </div>
          </div>

          {/* Right Grid */}
          <div className="grid sm:grid-cols-2 gap-4">
            {differences.map((item, index) => (
              <div
                key={index}
                className="group bg-cream border border-gold/25 rounded-xl p-6 hover:border-gold/30 hover:bg-cream/80 transition-all duration-300 animate-fade-in-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="w-10 h-10 bg-gold/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-gold/20 transition-colors">
                  <item.icon className="w-5 h-5 text-gold" />
                </div>
                <h3 className="text-navy font-semibold mb-2">{item.title}</h3>
                <p className="text-navy/60 text-sm">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

