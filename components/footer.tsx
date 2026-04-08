"use client"

import { Instagram, Mail, MessageCircle, CreditCard, Shield, Lock } from "lucide-react"
import { getWhatsappLink } from "@/lib/whatsapp"

const quickLinks = [
  { href: "/#home", label: "Home" },
  { href: "/#catalogo", label: "Catálogo" },
  { href: "/#personalizado", label: "Serviços" },
  { href: "/#branding", label: "Branding" },
  { href: "/contato", label: "Contato" },
]

const legalLinks = [
  { href: "/politica-de-privacidade", label: "Política de Privacidade" },
  { href: "/termos-de-uso", label: "Termos de Uso" },
  { href: "/politica-de-reembolso", label: "Política de Reembolso" },
]

export function Footer() {
  return (
    <footer id="contato" className="relative bg-white border-t border-gold/25">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="lg:col-span-2">
            <div className="flex items-center mb-4">
              <img
                src="/logo.png"
                alt="Marca & Mente Studio"
                className="h-16 w-auto sm:h-20"
              />
            </div>
            <p className="text-navy/70 leading-relaxed max-w-md mb-6">
              Transformando ideias em marcas premium. Ebooks, design e soluções criativas 
              para empreendedores que buscam excelência e resultados reais no digital.
            </p>
            
            {/* Social Links */}
            <div className="flex gap-4">
              <a
                href={getWhatsappLink()}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-gold/10 border border-gold/20 rounded-full flex items-center justify-center text-gold hover:bg-gold/20 hover:border-gold/40 transition-all duration-300"
                aria-label="WhatsApp"
              >
                <MessageCircle className="w-5 h-5" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-gold/10 border border-gold/20 rounded-full flex items-center justify-center text-gold hover:bg-gold/20 hover:border-gold/40 transition-all duration-300"
                aria-label="Instagram"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href="mailto:contato@marcaemente.com"
                className="w-10 h-10 bg-gold/10 border border-gold/20 rounded-full flex items-center justify-center text-gold hover:bg-gold/20 hover:border-gold/40 transition-all duration-300"
                aria-label="Email"
              >
                <Mail className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-navy font-semibold mb-6">Links Rápidos</h4>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="text-navy/70 hover:text-gold transition-colors duration-300"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-navy font-semibold mb-6">Legal</h4>
            <ul className="space-y-3">
              {legalLinks.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-navy/70 hover:text-gold transition-colors duration-300"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Payment & Security */}
        <div className="mt-12 pt-8 border-t border-gold/25">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            {/* Payment Methods */}
            <div className="flex items-center gap-4">
              <span className="text-navy/60 text-sm">Formas de pagamento:</span>
              <div className="flex items-center gap-3">
                <div className="w-10 h-6 bg-cream/10 rounded flex items-center justify-center">
                  <CreditCard className="w-5 h-3 text-navy/70" />
                </div>
                <div className="w-10 h-6 bg-cream/10 rounded flex items-center justify-center text-navy/70 text-xs font-bold">
                  PIX
                </div>
                <div className="w-10 h-6 bg-cream/10 rounded flex items-center justify-center">
                  <svg className="w-6 h-4 text-navy/70" viewBox="0 0 24 16" fill="currentColor">
                    <rect width="24" height="16" rx="2" fill="currentColor" opacity="0.3" />
                    <circle cx="9" cy="8" r="4" fill="currentColor" opacity="0.5" />
                    <circle cx="15" cy="8" r="4" fill="currentColor" opacity="0.5" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Security Badges */}
            <div className="flex items-center gap-6 text-navy/60 text-sm">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-gold" />
                Site seguro
              </div>
              <div className="flex items-center gap-2">
                <Lock className="w-4 h-4 text-gold" />
                SSL Certificado
              </div>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 text-center">
          <p className="text-navy/50 text-sm">
            © {new Date().getFullYear()} Marca & Mente Studio. Todos os direitos reservados.
          </p>
          <p className="text-navy/50 text-sm mt-2">
            CNPJ: 66.130.811/0001-15
          </p>
        </div>
      </div>

      {/* Atalho discreto para admin */}
      <a
        href="/admin/login"
        aria-label="Acesso administrativo"
        className="group absolute bottom-3 right-3 h-6 w-6 rounded-full border border-gold/30 bg-gold/30 opacity-5 transition-all duration-300 hover:opacity-60 focus:opacity-70 focus:outline-none focus:ring-2 focus:ring-gold/40"
        title="Admin"
      >
        <span className="sr-only">Admin</span>
      </a>
    </footer>
  )
}

