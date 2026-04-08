export const dynamic = 'force-dynamic'

import { Footer } from '@/components/footer'
import { Header } from '@/components/header'
import { ProductCatalog } from '@/components/products/product-catalog'
import { getCategories, getProducts } from '@/lib/shop'

export default async function ProductsPage() {
  const categories = await getCategories()
  const products = await getProducts()

  return (
    <main className="min-h-screen bg-white">
      <Header />

      <section className="relative py-24 lg:py-32 bg-white overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-cream/80 via-white to-cream" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl text-center mx-auto mb-16">
            <span className="text-gold text-sm font-medium tracking-widest uppercase">
              Catálogo completo
            </span>
            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl text-navy mt-6 leading-tight text-balance">
              Encontre o produto ideal para sua marca
            </h1>
            <p className="text-navy/70 text-lg sm:text-xl mt-6 leading-relaxed">
              Navegue pelo catálogo premium e filtre por categoria para descobrir soluções digitais prontas para vender.
            </p>
          </div>
        </div>
      </section>

      <ProductCatalog categories={categories} products={products} />

      <Footer />
    </main>
  )
}
