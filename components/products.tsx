import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ProductCard } from '@/components/products/product-card'
import type { SerializedProduct } from '@/lib/shop'

interface ProductsProps {
  products: SerializedProduct[]
}

export function Products({ products }: ProductsProps) {
  return (
    <section className="relative py-24 lg:py-32 bg-white">
      <div className="absolute inset-0 bg-gradient-to-b from-cream/70 to-white" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16 animate-fade-in-up">
          <span className="text-gold text-sm font-medium tracking-widest uppercase">
            Produtos em Destaque
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-navy mt-4 text-balance">
            Sua vitrine de produtos premium
          </h2>
          <p className="text-navy/70 text-lg mt-4 max-w-2xl mx-auto">
            Ebooks, planners e kits digitais desenvolvidos para impulsionar seu negócio.
          </p>
        </div>

        {/* Products Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((product, index) => (
            <div key={product.id} className="animate-fade-in-up" style={{ animationDelay: `${index * 100}ms` }}>
              <ProductCard product={product} />
            </div>
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center mt-12">
          <Button
            size="lg"
            variant="outline"
            className="border-navy/25 bg-cream text-navy hover:bg-cream/90 hover:border-navy/40 px-8 py-6 rounded-full"
            asChild
          >
            <Link href="/products">Ver todos os produtos</Link>
          </Button>
        </div>
      </div>
    </section>
  )
}

