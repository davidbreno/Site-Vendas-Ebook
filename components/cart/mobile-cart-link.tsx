"use client"

import Link from "next/link"
import { ShoppingCart } from "lucide-react"
import { useCart } from "@/components/cart/cart-context"

interface MobileCartLinkProps {
  onClick?: () => void
  className?: string
}

export function MobileCartLink({ onClick, className }: MobileCartLinkProps) {
  const { state } = useCart()

  return (
    <Link
      href="/cart"
      onClick={onClick}
      className={`flex items-center gap-3 hover:text-gold transition-colors duration-300 text-lg py-2 ${className ?? "text-cream/80"}`}
    >
      <ShoppingCart className="w-5 h-5" />
      Carrinho
      {state.itemCount > 0 && (
        <span className="bg-gold text-navy text-xs font-bold rounded-full px-2 py-1">
          {state.itemCount}
        </span>
      )}
    </Link>
  )
}
