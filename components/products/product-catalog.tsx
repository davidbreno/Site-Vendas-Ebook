"use client"

import { ProductCard } from '@/components/products/product-card'
import type { SerializedProduct } from '@/lib/shop'
import type { Category } from '@prisma/client'

type ProductCatalogProps = {
  products: SerializedProduct[]
  categories: Category[]
}

export function ProductCatalog({ products }: ProductCatalogProps) {
  return (
    <section className="relative py-12 lg:py-20 bg-navy">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <p className="text-gold text-sm font-medium uppercase tracking-[0.3em]">
            Catálogo disponível
          </p>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-cream mt-4 leading-tight">
            Explore nossos produtos premium
          </h2>
          <p className="text-cream/60 text-base leading-relaxed mt-4 max-w-3xl mx-auto">
            Todos os produtos prontos para a sua marca com distribuição otimizada para visualização em desktop e mobile.
          </p>
        </div>

        <div className="grid gap-8 sm:grid-cols-2 xl:grid-cols-3">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  )
}
