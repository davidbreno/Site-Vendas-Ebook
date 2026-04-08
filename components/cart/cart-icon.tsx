"use client"

import Link from "next/link"
import { ShoppingCart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useCart } from "@/components/cart/cart-context"

interface CartIconProps {
  className?: string
}

export function CartIcon({ className }: CartIconProps) {
  const { state } = useCart()

  return (
    <Button
      variant="ghost"
      className={`relative hover:text-gold hover:bg-gold/10 p-2 ${className ?? "text-cream"}`}
      asChild
    >
      <Link href="/cart">
        <ShoppingCart className="w-5 h-5" />
        {state.itemCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-gold text-navy text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
            {state.itemCount}
          </span>
        )}
      </Link>
    </Button>
  )
}
