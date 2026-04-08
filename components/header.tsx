"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Menu, X, MessageCircle, ShoppingCart } from "lucide-react"
import { Button } from "@/components/ui/button"
import dynamic from "next/dynamic"
import { getWhatsappLink } from "@/lib/whatsapp"

// Dynamically import cart components to avoid SSR issues
const CartIcon = dynamic(() => import("@/components/cart/cart-icon").then(mod => ({ default: mod.CartIcon })), {
  ssr: false,
  loading: () => (
    <Button
      variant="ghost"
      className="relative text-white/90 hover:text-gold hover:bg-gold/10 p-2"
      asChild
    >
      <Link href="/cart">
        <ShoppingCart className="w-5 h-5" />
      </Link>
    </Button>
  )
})

const MobileCartLink = dynamic(() => import("@/components/cart/mobile-cart-link").then(mod => ({ default: mod.MobileCartLink })), {
  ssr: false,
  loading: () => (
    <Link
      href="/cart"
      className="flex items-center gap-3 text-white/90 hover:text-gold transition-colors duration-300 text-lg py-2"
    >
      <ShoppingCart className="w-5 h-5" />
      Carrinho
    </Link>
  )
})

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/products", label: "Catálogo" },
  { href: "/#personalizado", label: "Personalizado" },
  { href: "/#branding", label: "Branding" },
  { href: "/contato", label: "Contato" },
]

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const getThreshold = () => {
      const hero = document.getElementById("home")
      return hero ? hero.offsetHeight - 120 : 240
    }

    let threshold = getThreshold()

    const handleScroll = () => {
      setIsScrolled(window.scrollY >= threshold)
    }

    const handleResize = () => {
      threshold = getThreshold()
      handleScroll()
    }

    handleScroll()
    window.addEventListener("scroll", handleScroll, { passive: true })
    window.addEventListener("resize", handleResize)

    return () => {
      window.removeEventListener("scroll", handleScroll)
      window.removeEventListener("resize", handleResize)
    }
  }, [])

  const navText = isScrolled ? "text-navy/80" : "text-white/90"
  const navHover = "hover:text-gold"
  const iconText = isScrolled ? "text-navy/80" : "text-white/90"

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/25 backdrop-blur-xl border-b border-black/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-24 sm:h-28">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <img
              src="/logo.png"
              alt="Marca & Mente Studio"
              className="h-[72px] w-auto sm:h-[84px]"
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`${navText} ${navHover} transition-colors duration-300 text-sm tracking-wide`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Desktop CTA and Cart */}
          <div className="hidden md:flex items-center gap-4">
            <CartIcon className={iconText} />

            <Button
              className="bg-gold hover:bg-gold/90 text-navy font-medium px-6 py-2 rounded-full flex items-center gap-2 transition-all duration-300 hover:scale-105"
              asChild
            >
              <a href={getWhatsappLink()} target="_blank" rel="noopener noreferrer">
                <MessageCircle className="w-4 h-4" />
                WhatsApp
              </a>
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className={`md:hidden p-2 ${iconText}`}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className={`md:hidden py-6 border-t animate-fade-in-up ${isScrolled ? "border-black/5" : "border-white/20"}`}>
            <nav className="flex flex-col gap-4">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsMenuOpen(false)}
                  className={`${navText} ${navHover} transition-colors duration-300 text-lg py-2`}
                >
                  {link.label}
                </Link>
              ))}

              <MobileCartLink
                onClick={() => setIsMenuOpen(false)}
                className={`${navText} ${navHover}`}
              />

              <Button
                className="bg-gold hover:bg-gold/90 text-navy font-medium px-6 py-3 rounded-full flex items-center justify-center gap-2 mt-4"
                asChild
              >
                <a href={getWhatsappLink()} target="_blank" rel="noopener noreferrer">
                  <MessageCircle className="w-4 h-4" />
                  WhatsApp
                </a>
              </Button>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}
