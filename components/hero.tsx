"use client"

import { Button } from "@/components/ui/button"

export function Hero() {
  return (
    <section id="home" className="relative overflow-hidden bg-cream">
      <div className="absolute inset-0">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-40"
          style={{ backgroundImage: "url('/images/hero-topo.png.png')" }}
        />
        <div
          className="absolute inset-0 opacity-90"
          style={{
            background: "linear-gradient(135deg, #F5EEE6, #E8D9C8, #D7BEA8)",
          }}
        />
        <div
          className="absolute inset-0 opacity-30 mix-blend-multiply"
          style={{
            backgroundImage:
              "radial-gradient(circle at 20% 20%, rgba(90, 70, 55, 0.08) 0, rgba(90, 70, 55, 0) 55%), radial-gradient(circle at 80% 10%, rgba(90, 70, 55, 0.06) 0, rgba(90, 70, 55, 0) 50%), radial-gradient(circle at 30% 80%, rgba(90, 70, 55, 0.05) 0, rgba(90, 70, 55, 0) 60%), repeating-linear-gradient(135deg, rgba(90, 70, 55, 0.06) 0, rgba(90, 70, 55, 0.06) 1px, rgba(90, 70, 55, 0) 1px, rgba(90, 70, 55, 0) 5px)",
          }}
        />
        <div className="absolute inset-0 bg-[radial-gradient(70%_50%_at_20%_10%,rgba(201,163,122,0.22)_0%,rgba(246,239,233,0)_60%)]" />
      </div>

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-28 lg:py-32">
        <div className="rounded-[2.5rem] border border-gold/30 bg-white/75 p-10 sm:p-14 text-center shadow-[0_24px_80px_rgba(59,47,40,0.18)] backdrop-blur">
          <span className="text-gold text-xs font-medium tracking-[0.4em] uppercase">
            Marca &amp; Mente Studio
          </span>
          <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl text-navy mt-6 leading-tight text-balance">
            Um universo infinito de{" "}
            <span className="text-gold">inspirações</span> para criar, vender e se destacar.
          </h1>
          <p className="mt-6 text-base sm:text-lg lg:text-xl text-navy/70 leading-relaxed">
            Ebooks premium, branding estratégico e soluções criativas para transformar sua presença
            digital em resultados reais.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row justify-center gap-4">
            <Button
              size="lg"
              className="bg-navy hover:bg-navy/90 text-cream font-semibold px-10 py-6 rounded-full shadow-[0_12px_32px_rgba(59,47,40,0.28)]"
              asChild
            >
              <a href="#catalogo">Explorar Coleção Premium</a>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-navy/25 bg-white/80 text-navy hover:bg-cream/80 hover:border-navy/40 px-10 py-6 rounded-full"
              asChild
            >
              <a href="/contato">Falar com a equipe</a>
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
