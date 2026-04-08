"use client"

import { useState, useEffect } from "react"
import Link from 'next/link'
import { ShoppingCart, Zap } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useCart } from '@/components/cart/cart-context'
import type { SerializedProduct } from '@/lib/shop'

type ProductCardProps = {
  product: SerializedProduct
}

export function ProductCard({ product }: ProductCardProps) {
  const [isHydrated, setIsHydrated] = useState(false)
  const [imageError, setImageError] = useState(false)
  const [imageLoaded, setImageLoaded] = useState(false)
  const { addItem } = useCart()

  useEffect(() => {
    setIsHydrated(true)
  }, [])

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    if (isHydrated) {
      addItem(product)
    }
  }

  return (
    <article className="group bg-cream border border-gold/25 rounded-2xl overflow-hidden hover:border-gold/30 transition-all duration-500">
      <div className="relative h-56 bg-gradient-to-br from-cream to-white p-6">
        {product.imageUrl && !imageError ? (
          <img
            src={product.imageUrl}
            alt={product.title}
            className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-300 ${
              imageLoaded ? 'opacity-100' : 'opacity-0'
            }`}
            loading="lazy"
            onLoad={() => setImageLoaded(true)}
            onError={() => setImageError(true)}
          />
        ) : null}
        <div className="absolute inset-0 bg-gradient-to-t from-navy/60 to-transparent" />
        
        {product.badge && (
          <span className="absolute top-4 left-4 bg-gold text-navy text-xs font-semibold px-3 py-1 rounded-full">
            {product.badge}
          </span>
        )}

        <span className="absolute top-4 right-4 bg-white/80 text-navy/70 text-xs px-3 py-1 rounded-full border border-gold/20">
          {product.category?.name ?? 'Produto'}
        </span>

        {(!product.imageUrl || imageError || !imageLoaded) && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-32 h-40 bg-gradient-to-br from-gold/20 to-gold/5 border border-gold/30 rounded-lg shadow-2xl transform group-hover:scale-105 group-hover:-translate-y-2 transition-transform duration-500">
            <div className="p-4 space-y-2">
              <div className="h-2 bg-gold/40 rounded w-3/4" />
                <div className="h-1.5 bg-navy/10 rounded w-full" />
                <div className="h-1.5 bg-navy/10 rounded w-2/3" />
                <div className="h-1.5 bg-navy/10 rounded w-4/5" />
            </div>
          </div>
        )}
      </div>

      <div className="p-6 space-y-4">
        <h3 className="text-navy font-semibold text-lg group-hover:text-gold transition-colors">
          {product.title}
        </h3>
        <p className="text-navy/70 text-sm leading-relaxed">{product.description}</p>

        <div className="flex items-center gap-3">
          <span className="text-gold text-2xl font-bold">{product.price}</span>
          <span className="text-navy/40 text-sm line-through">{product.originalPrice}</span>
        </div>

        <div className="flex gap-3 pt-2 flex-col sm:flex-row">
          <Button
            variant="outline"
            className="w-full sm:flex-1 border-navy/25 bg-cream text-navy hover:bg-cream/90 hover:border-navy/40 rounded-full flex items-center justify-center gap-2"
            onClick={handleAddToCart}
          >
            <ShoppingCart className="w-4 h-4" />
            Carrinho
          </Button>

          <Button
            variant="default"
            className="w-full sm:flex-1 bg-gold hover:bg-gold/90 text-navy rounded-full flex items-center justify-center gap-2"
            asChild
          >
            <Link href={`/product/${product.slug}`}>
              <Zap className="w-4 h-4" />
              Comprar
            </Link>
          </Button>
        </div>
      </div>
    </article>
  )
}
