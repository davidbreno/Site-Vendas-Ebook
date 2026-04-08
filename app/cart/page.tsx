"use client"

import Link from 'next/link'
import { Minus, Plus, Trash2, ShoppingBag, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useCart } from '@/components/cart/cart-context'

export default function CartPage() {
  const { state, updateQuantity, removeItem } = useCart()

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(price)
  }

  if (state.items.length === 0) {
    return (
      <main className="min-h-screen bg-navy">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <div className="w-24 h-24 bg-navy-light rounded-full flex items-center justify-center mx-auto mb-8">
              <ShoppingBag className="w-12 h-12 text-gold" />
            </div>
            <h1 className="font-serif text-4xl text-cream mb-4">Seu carrinho está vazio</h1>
            <p className="text-cream/60 text-lg mb-8 max-w-md mx-auto">
              Explore nosso catálogo e adicione produtos premium ao seu carrinho.
            </p>
            <Button
              className="bg-gold hover:bg-gold/90 text-navy font-semibold px-8 py-4 rounded-full"
              asChild
            >
              <Link href="/products">Explorar produtos</Link>
            </Button>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-navy">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="mb-8">
          <Button
            variant="ghost"
            className="text-cream hover:text-gold hover:bg-gold/10 mb-6"
            asChild
          >
            <Link href="/products">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Continuar comprando
            </Link>
          </Button>

          <h1 className="font-serif text-4xl text-cream mb-2">Seu carrinho</h1>
          <p className="text-cream/60">
            {state.itemCount} {state.itemCount === 1 ? 'item' : 'itens'} no carrinho
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-6">
            {state.items.map((item) => (
              <div
                key={item.product.id}
                className="bg-navy-light border border-gold/10 rounded-2xl p-6"
              >
                <div className="flex gap-6">
                  {/* Product Image */}
                  <div className="w-24 h-24 bg-gradient-to-br from-gold/20 to-gold/5 border border-gold/30 rounded-lg flex-shrink-0">
                    <div className="w-full h-full flex items-center justify-center">
                      <div className="w-8 h-8 bg-gold/40 rounded" />
                    </div>
                  </div>

                  {/* Product Info */}
                  <div className="flex-1 min-w-0">
                    <h3 className="text-cream font-semibold text-lg mb-2">
                      {item.product.title}
                    </h3>
                    <p className="text-cream/60 text-sm mb-4">
                      {item.product.category?.name ?? 'Produto'}
                    </p>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                            className="w-8 h-8 bg-navy border border-gold/20 rounded-full flex items-center justify-center text-cream hover:bg-gold/10 hover:border-gold/40 transition-colors"
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          <span className="text-cream font-medium w-8 text-center">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                            className="w-8 h-8 bg-navy border border-gold/20 rounded-full flex items-center justify-center text-cream hover:bg-gold/10 hover:border-gold/40 transition-colors"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>

                        <button
                          onClick={() => removeItem(item.product.id)}
                          className="text-cream/50 hover:text-red-400 transition-colors"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>

                      <div className="text-right">
                        <div className="text-gold font-bold text-xl">
                          {formatPrice(parseFloat(item.product.price.replace('R$ ', '').replace(',', '.')) * item.quantity)}
                        </div>
                        <div className="text-cream/50 text-sm">
                          {item.product.price} cada
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-navy-light border border-gold/10 rounded-2xl p-6 sticky top-6">
              <h2 className="font-serif text-2xl text-cream mb-6">Resumo do pedido</h2>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-cream/80">
                  <span>Subtotal ({state.itemCount} itens)</span>
                  <span>{formatPrice(state.total)}</span>
                </div>
                <div className="flex justify-between text-cream/80">
                  <span>Frete</span>
                  <span className="text-green-400">Grátis</span>
                </div>
                <div className="border-t border-gold/10 pt-4">
                  <div className="flex justify-between text-cream font-semibold text-lg">
                    <span>Total</span>
                    <span>{formatPrice(state.total)}</span>
                  </div>
                </div>
              </div>

              <Button
                className="w-full bg-gold hover:bg-gold/90 text-navy font-semibold py-4 rounded-full text-lg"
                asChild
              >
                <Link href="/checkout">
                  Finalizar compra
                </Link>
              </Button>

              <p className="text-cream/50 text-xs text-center mt-4">
                Compra segura • Entrega digital imediata
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}