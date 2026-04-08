"use client"

import { Star, Quote } from "lucide-react"

const testimonials = [
  {
    name: "Mariana Costa",
    role: "CEO, Bloom Digital",
    testimonial: "A Marca & Mente transformou completamente a identidade do meu negócio. O ebook que criaram para mim já gerou mais de R$50.000 em vendas. Qualidade excepcional!",
    rating: 5,
    initials: "MC",
  },
  {
    name: "Ricardo Oliveira",
    role: "Fundador, Scale Up Academy",
    testimonial: "Profissionalismo e criatividade em cada detalhe. O logo e a identidade visual superaram todas as expectativas. Recomendo de olhos fechados!",
    rating: 5,
    initials: "RO",
  },
  {
    name: "Fernanda Lima",
    role: "Empreendedora Digital",
    testimonial: "Os templates de Instagram revolucionaram meu conteúdo. Meu engajamento triplicou e finalmente tenho um feed profissional que converte seguidores em clientes.",
    rating: 5,
    initials: "FL",
  },
]

export function Testimonials() {
  return (
    <section className="relative py-24 lg:py-32 bg-navy">
      <div className="absolute inset-0 bg-gradient-to-b from-navy-light/10 to-transparent" />
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16 animate-fade-in-up">
          <span className="text-gold text-sm font-medium tracking-widest uppercase">
            Depoimentos
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-cream mt-4 text-balance">
            O que nossos clientes dizem
          </h2>
          <p className="text-cream/60 text-lg mt-4 max-w-2xl mx-auto">
            Histórias reais de empreendedores que transformaram seus negócios com nossos produtos e serviços.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="group relative bg-navy-light/50 border border-gold/10 rounded-2xl p-8 hover:border-gold/30 transition-all duration-500 animate-fade-in-up"
              style={{ animationDelay: `${index * 200}ms` }}
            >
              {/* Quote Icon */}
              <div className="absolute top-6 right-6 opacity-10">
                <Quote className="w-12 h-12 text-gold" />
              </div>

              {/* Stars */}
              <div className="flex gap-1 mb-6">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-gold text-gold" />
                ))}
              </div>

              {/* Testimonial Text */}
              <p className="text-cream/80 leading-relaxed mb-8 italic">
                &quot;{testimonial.testimonial}&quot;
              </p>

              {/* Author */}
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-gold/30 to-gold/10 rounded-full flex items-center justify-center border border-gold/20">
                  <span className="text-gold font-semibold text-sm">{testimonial.initials}</span>
                </div>
                <div>
                  <div className="text-cream font-semibold">{testimonial.name}</div>
                  <div className="text-cream/50 text-sm">{testimonial.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
