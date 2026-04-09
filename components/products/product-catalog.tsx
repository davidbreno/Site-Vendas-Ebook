"use client"

import { useMemo, useState } from 'react'
import { ProductCard } from '@/components/products/product-card'
import type { SerializedProduct } from '@/lib/shop'
import type { Category } from '@prisma/client'

type ProductCatalogProps = {
  products: SerializedProduct[]
  categories: Category[]
}

const ALL_FILTER = 'all'

export function ProductCatalog({ products, categories }: ProductCatalogProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>(ALL_FILTER)

  const filteredProducts = useMemo(() => {
    if (selectedCategory === ALL_FILTER) {
      return products
    }
    return products.filter((product) => product.category?.slug === selectedCategory)
  }, [products, selectedCategory])

  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {}
    for (const product of products) {
      const slug = product.category?.slug
      if (!slug) continue
      counts[slug] = (counts[slug] ?? 0) + 1
    }
    return counts
  }, [products])

  const activeCategories = useMemo(
    () =>
      categories
        .filter((category) => category.isActive && (categoryCounts[category.slug] ?? 0) > 0)
        .sort(
          (a, b) =>
            (categoryCounts[b.slug] ?? 0) - (categoryCounts[a.slug] ?? 0)
        ),
    [categories, categoryCounts]
  )

  return (
    <section className="relative py-12 lg:py-20 bg-cream">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <p className="text-gold text-xs font-medium uppercase tracking-[0.35em]">
            Catálogo disponível
          </p>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-navy mt-4 leading-tight">
            Explore nossos produtos premium
          </h2>
          <p className="text-navy/70 text-base leading-relaxed mt-4 max-w-3xl mx-auto">
            Todos os produtos prontos para a sua marca com distribuição otimizada para visualização em desktop e mobile.
          </p>
        </div>

        {activeCategories.length > 0 && (
          <div className="mb-12 flex flex-wrap justify-center gap-3">
            <button
              type="button"
              onClick={() => setSelectedCategory(ALL_FILTER)}
              className={`rounded-full border px-5 py-2 text-sm font-medium transition-all duration-300 ${
                selectedCategory === ALL_FILTER
                  ? 'border-gold bg-gold text-navy'
                  : 'border-navy/20 text-navy/70 hover:border-gold/60 hover:text-navy'
              }`}
            >
              Todos ({products.length})
            </button>
            {activeCategories.map((category) => (
              <button
                key={category.id}
                type="button"
                onClick={() => setSelectedCategory(category.slug)}
                className={`rounded-full border px-5 py-2 text-sm font-medium transition-all duration-300 ${
                  selectedCategory === category.slug
                    ? 'border-gold bg-gold text-navy'
                    : 'border-navy/20 text-navy/70 hover:border-gold/60 hover:text-navy'
                }`}
              >
                {category.name}
                <span className="ml-1 text-xs opacity-70">
                  ({categoryCounts[category.slug] ?? 0})
                </span>
              </button>
            ))}
          </div>
        )}

        {filteredProducts.length === 0 ? (
          <div className="text-center py-16 text-navy/60">
            Nenhum produto nesta categoria.
          </div>
        ) : (
          <div className="grid gap-8 sm:grid-cols-2 xl:grid-cols-3">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
