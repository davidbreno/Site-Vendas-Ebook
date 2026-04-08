"use client"

import { useRouter } from 'next/navigation'
import { Zap } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useCart } from '@/components/cart/cart-context'
import type { SerializedProduct } from '@/lib/shop'

type BuyNowButtonProps = {
  product: SerializedProduct
  className?: string
}

export function BuyNowButton({ product, className }: BuyNowButtonProps) {
  const router = useRouter()
  const { addItem } = useCart()

  const handleBuyNow = () => {
    addItem(product)
    router.push('/checkout')
  }

  return (
    <Button
      className={className}
      onClick={handleBuyNow}
    >
      <Zap className="w-4 h-4" />
      Comprar agora
    </Button>
  )
}
