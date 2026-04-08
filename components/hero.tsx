"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"

const particles = [
  { top: "12%", left: "14%", size: 2, color: "#F3B36A", delay: 0 },
  { top: "22%", left: "64%", size: 3, color: "#79D2FF", delay: 1.2 },
  { top: "35%", left: "82%", size: 2, color: "#F3B36A", delay: 2.4 },
  { top: "48%", left: "28%", size: 3, color: "#79D2FF", delay: 0.8 },
  { top: "62%", left: "12%", size: 2, color: "#F3B36A", delay: 1.6 },
  { top: "70%", left: "58%", size: 2, color: "#79D2FF", delay: 2.1 },
  { top: "18%", left: "42%", size: 2, color: "#F3B36A", delay: 0.4 },
  { top: "78%", left: "80%", size: 3, color: "#79D2FF", delay: 1.9 },
]

const flakes = [
  { top: "62%", left: "6%", size: 12, delay: 0, duration: 18 },
  { top: "66%", left: "14%", size: 10, delay: 2.1, duration: 19 },
  { top: "70%", left: "22%", size: 14, delay: 1.3, duration: 21 },
  { top: "74%", left: "30%", size: 9, delay: 3.2, duration: 17 },
  { top: "68%", left: "38%", size: 13, delay: 0.7, duration: 20 },
  { top: "72%", left: "46%", size: 11, delay: 2.8, duration: 19 },
  { top: "76%", left: "54%", size: 15, delay: 4.1, duration: 22 },
  { top: "80%", left: "62%", size: 10, delay: 1.9, duration: 18 },
  { top: "74%", left: "70%", size: 12, delay: 3.6, duration: 20 },
  { top: "78%", left: "78%", size: 9, delay: 0.9, duration: 17 },
  { top: "82%", left: "86%", size: 13, delay: 2.4, duration: 21 },
  { top: "86%", left: "92%", size: 8, delay: 4.8, duration: 16 },
  { top: "88%", left: "10%", size: 9, delay: 1.5, duration: 17 },
  { top: "90%", left: "20%", size: 11, delay: 3.9, duration: 19 },
  { top: "92%", left: "32%", size: 8, delay: 2.2, duration: 16 },
  { top: "94%", left: "42%", size: 10, delay: 4.3, duration: 18 },
  { top: "88%", left: "52%", size: 12, delay: 1.1, duration: 20 },
  { top: "90%", left: "60%", size: 9, delay: 3.1, duration: 17 },
  { top: "92%", left: "70%", size: 11, delay: 2.6, duration: 19 },
  { top: "94%", left: "82%", size: 8, delay: 4.6, duration: 16 },
  { top: "86%", left: "44%", size: 14, delay: 0.4, duration: 21 },
  { top: "80%", left: "26%", size: 12, delay: 2.9, duration: 19 },
  { top: "84%", left: "66%", size: 10, delay: 3.7, duration: 18 },
  { top: "78%", left: "50%", size: 13, delay: 1.7, duration: 20 },
]

export function Hero() {
  return (
    <section id="home" className="relative h-screen w-full overflow-hidden bg-white">
      {/* Background Image + Parallax */}
      <motion.div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: "url('/images/hero-topo.png.png')" }}
        initial={{ scale: 1.05, y: 0 }}
        animate={{ scale: [1.05, 1.08, 1.05], y: [0, -12, 0] }}
        transition={{ duration: 26, repeat: Infinity, ease: "easeInOut" }}
      />
      <div className="absolute inset-0 bg-black/20" />
      <div className="absolute inset-0 bg-gradient-to-b from-black/35 via-transparent to-black/55" />
      <div className="absolute inset-0 pointer-events-none">
        <div className="fog-layer" />
        <div className="fog-layer fog-2" />
      </div>
      <div className="absolute inset-0 pointer-events-none opacity-90 mix-blend-screen">
        {flakes.map((flake, index) => (
          <span
            key={index}
            className="hero-flake"
            style={{
              top: flake.top,
              left: flake.left,
              width: flake.size,
              height: flake.size,
              animationDuration: `${flake.duration}s`,
              animationDelay: `${flake.delay}s`,
              opacity: 0.35,
            }}
          />
        ))}
      </div>

      {/* Cosmic Dust + Light Orbs */}
      <div className="absolute inset-0">
        {particles.map((particle, index) => (
          <motion.span
            key={index}
            className="absolute rounded-full"
            style={{
              top: particle.top,
              left: particle.left,
              width: particle.size * 3,
              height: particle.size * 3,
              backgroundColor: particle.color,
              boxShadow: `0 0 18px ${particle.color}55`,
            }}
            initial={{ opacity: 0.35, y: 0 }}
            animate={{ opacity: [0.25, 0.7, 0.25], y: [0, -18, 0] }}
            transition={{
              duration: 12,
              repeat: Infinity,
              delay: particle.delay,
              ease: "easeInOut",
            }}
          />
        ))}
        <motion.div
          className="absolute inset-0"
          initial={{ opacity: 0.3 }}
          animate={{ opacity: [0.25, 0.45, 0.25] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        >
          <div className="absolute top-1/4 left-1/3 h-40 w-40 rounded-full bg-[#F3B36A]/10 blur-3xl" />
          <div className="absolute bottom-1/3 right-1/4 h-52 w-52 rounded-full bg-[#79D2FF]/15 blur-3xl" />
        </motion.div>
      </div>

      {/* Content */}
      <div className="relative z-10 flex h-full items-center justify-center px-4">
        <div className="max-w-4xl text-center">
          <motion.h1
            className="font-serif text-4xl sm:text-5xl lg:text-6xl text-white leading-tight text-balance"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: "easeOut" }}
          >
            Um universo infinito de{" "}
            <span className="text-[#F3B36A]">inspirações</span> para criar, vender e
            se destacar.
          </motion.h1>

          <motion.p
            className="mt-6 text-base sm:text-lg lg:text-xl text-[#E9D7FF] leading-relaxed"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: "easeOut", delay: 0.2 }}
          >
            Ebooks premium, branding estratégico e soluções criativas para transformar sua presença
            digital em resultados reais.
          </motion.p>

          <motion.div
            className="mt-10 flex justify-center"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: "easeOut", delay: 0.35 }}
          >
            <Button
              size="lg"
              className="bg-[#F3B36A] text-[#1B2340] font-semibold px-10 py-6 rounded-full shadow-[0_0_35px_rgba(243,179,106,0.35)] hover:shadow-[0_0_45px_rgba(243,179,106,0.55)] hover:scale-[1.03] transition-all duration-300"
              asChild
            >
              <a href="#catalogo">Explorar Coleção Premium</a>
            </Button>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

