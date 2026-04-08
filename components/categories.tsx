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
    <section id="catalogo" className="relative py-24 lg:py-32 bg-white">
      <div className="absolute inset-0 bg-gradient-to-b from-cream/70 to-white" />
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16 animate-fade-in-up">
          <span className="text-gold text-sm font-medium tracking-widest uppercase">
            Categorias
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-navy mt-4 text-balance">
            Encontre o que sua marca precisa
          </h2>
          <p className="text-navy/70 text-lg mt-4 max-w-2xl mx-auto">
            Produtos e serviços premium organizados para você encontrar a solução perfeita.
          </p>
        </div>

        {/* Category Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((category, index) => (
            <Link
              key={index}
              href={category.href}
              className="group relative block bg-cream border border-gold/25 rounded-2xl p-8 hover:border-gold/30 transition-all duration-500 cursor-pointer overflow-hidden animate-fade-in-up"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Background Gradient */}
              <div className={`absolute inset-0 bg-gradient-to-br ${category.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
              
              <div className="relative">
                <div className="w-14 h-14 bg-gold/10 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-gold/20 group-hover:scale-110 transition-all duration-300">
                  <category.icon className={`w-7 h-7 ${category.iconColor}`} />
                </div>
                
                <h3 className="text-navy font-semibold text-xl mb-3">
                  {category.title}
                </h3>
                
                <p className="text-navy/70 text-sm leading-relaxed">
                  {category.description}
                </p>

                {/* Hover Arrow */}
                <div className="mt-6 flex items-center text-gold text-sm font-medium opacity-0 group-hover:opacity-100 transform translate-x-[-10px] group-hover:translate-x-0 transition-all duration-300">
                  Ver produtos
                  <svg className="w-4 h-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}

