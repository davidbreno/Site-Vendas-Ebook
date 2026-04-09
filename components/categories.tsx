"use client"

import Link from "next/link"
import { BookOpen, Sparkles, PenTool, Instagram } from "lucide-react"

const categories = [
  {
    icon: BookOpen,
    title: "Ebooks",
    description: "Conteúdo premium para educar e converter sua audiência em clientes fiéis.",
    color: "from-gold/20 to-gold/5",
    href: "/products",
    iconColor: "text-[#5DE1FF]",
  },
  {
    icon: Sparkles,
    title: "Serviços Personalizados",
    description: "Soluções criativas sob medida para necessidades únicas do seu negócio.",
    color: "from-cream/10 to-cream/5",
    href: "/#personalizado",
    iconColor: "text-[#F3B36A]",
  },
  {
    icon: PenTool,
    title: "Design de Logo",
    description: "Identidade visual exclusiva que comunica profissionalismo e confiança.",
    color: "from-gold/15 to-gold/5",
    href: "/#personalizado",
    iconColor: "text-[#B35CFF]",
  },
  {
    icon: Instagram,
    title: "Packs para Instagram",
    description: "Templates e designs prontos para elevar sua presença nas redes sociais.",
    color: "from-cream/10 to-cream/5",
    href: "/#personalizado",
    iconColor: "text-[#FF5FB7]",
  },
]

export function Categories() {
  return (
    <section id="catalogo" className="relative py-20 lg:py-28 bg-cream">
      <div className="absolute inset-0 bg-gradient-to-b from-cream via-cream to-white/70" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12 animate-fade-in-up">
          <span className="text-gold text-xs font-medium tracking-[0.35em] uppercase">
            Categorias
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-navy mt-4 text-balance">
            Encontre o que sua marca precisa
          </h2>
          <p className="text-navy/70 text-base sm:text-lg mt-4 max-w-2xl mx-auto">
            Produtos e serviços premium organizados para você encontrar a solução perfeita.
          </p>
        </div>

        {/* Category Strip */}
        <div className="rounded-[2rem] border border-gold/25 bg-white/80 shadow-[0_18px_60px_rgba(59,47,40,0.08)] backdrop-blur">
          <div className="grid md:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-gold/20">
            {categories.map((category, index) => (
              <Link
                key={index}
                href={category.href}
                className="group flex items-center gap-4 px-6 py-6 text-left transition-colors hover:bg-cream/60"
              >
                <div className="w-11 h-11 bg-gold/10 rounded-full flex items-center justify-center shrink-0">
                  <category.icon className={`w-5 h-5 ${category.iconColor}`} />
                </div>
                <div>
                  <div className="text-navy font-semibold">{category.title}</div>
                  <div className="text-navy/60 text-sm">{category.description}</div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

