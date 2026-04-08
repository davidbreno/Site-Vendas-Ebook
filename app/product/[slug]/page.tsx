export const dynamic = 'force-dynamic'

import Link from 'next/link'
import { notFound } from 'next/navigation'
import { CheckCircle, ShoppingCart } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Footer } from '@/components/footer'
import { Header } from '@/components/header'
import { ProductCard } from '@/components/products/product-card'
import { BuyNowButton } from '@/components/products/buy-now-button'
import { getProductBySlug, getRelatedProducts } from '@/lib/shop'

type ProductPageProps = {
  params: { slug?: string } | Promise<{ slug?: string }>
}

export default async function ProductPage({ params }: ProductPageProps) {
  const resolvedParams = await params
  const slug = resolvedParams?.slug
  const product = await getProductBySlug(slug)

  if (!product) {
    notFound()
  }

  const relatedProducts = await getRelatedProducts(product.id, product.categoryId ?? undefined)

  const benefits = [
    'Entrega digital imediata após a compra',
    'Design premium pronto para uso e apresentação',
    'Material preparado para conversão e autoridade',
    'Suporte direto via WhatsApp para dúvidas rápidas',
  ]

  return (
    <main className="min-h-screen bg-cream">
      <Header />

      <section className="relative py-24 lg:py-32 bg-cream overflow-hidden">
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-[1.7fr_1fr] items-start">
            <div className="space-y-8">
              <div className="inline-flex items-center gap-3 rounded-full border border-gold/30 bg-white/80 px-4 py-2 text-sm text-navy/70">
                {product.category?.name ?? 'Produto'}
              </div>

              <div className="space-y-6">
                <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl text-navy leading-tight text-balance">
                  {product.title}
                </h1>
                <p className="text-navy/70 text-lg sm:text-xl leading-relaxed max-w-3xl">
                  {product.description}
                </p>
              </div>

              <div className="grid gap-6 sm:grid-cols-2">
                <div className="rounded-[2rem] border border-gold/25 bg-white p-8">
                  <p className="text-navy/60 uppercase tracking-[0.25em] text-xs">Preço</p>
                  <div className="mt-4 flex items-center gap-4">
                    <span className="text-gold text-4xl font-bold">{product.price}</span>
                    <span className="text-navy/40 line-through">{product.originalPrice}</span>
                  </div>
                </div>

                <div className="rounded-[2rem] border border-gold/25 bg-white p-8">
                  <p className="text-navy/60 uppercase tracking-[0.25em] text-xs">Impulsione seu negócio</p>
                  <p className="text-navy/70 mt-3 text-sm leading-relaxed">
                    Um produto digital premium pensado para gerar mais valor e conversão na sua presença online.
                  </p>
                </div>
              </div>

              <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                <BuyNowButton
                  product={product}
                  className="w-full sm:w-auto bg-gold hover:bg-gold/90 text-navy font-semibold rounded-full px-8 py-5 flex items-center justify-center gap-2"
                />
                <Button
                  variant="outline"
                  className="w-full sm:w-auto border-gold/30 bg-white text-navy hover:bg-cream/80 hover:border-gold/50 rounded-full px-8 py-5 flex items-center justify-center gap-2"
                  asChild
                >
                  <Link href="/products">
                    <ShoppingCart className="w-4 h-4" />
                    Ver catálogo
                  </Link>
                </Button>
              </div>
            </div>

            <div className="space-y-8">
              <div className="rounded-[2rem] border border-gold/25 bg-white p-8">
                <div className="flex items-center justify-between gap-4 mb-6">
                  <div>
                    <p className="text-navy/60 uppercase tracking-[0.25em] text-xs">Principais benefícios</p>
                    <h2 className="text-2xl font-semibold text-navy mt-3">Benefícios que fazem a diferença</h2>
                  </div>
                </div>

                <div className="space-y-4">
                  {benefits.map((benefit) => (
                    <div key={benefit} className="flex items-start gap-3">
                      <span className="mt-1 text-gold">
                        <CheckCircle className="w-5 h-5" />
                      </span>
                      <p className="text-navy/70 text-sm leading-relaxed">{benefit}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-[2rem] border border-gold/25 bg-white p-8">
                <p className="text-navy/60 uppercase tracking-[0.25em] text-xs">Garantia</p>
                <div className="mt-4 space-y-4 text-navy/70 text-sm leading-relaxed">
                  <p>Compra segura e entrega imediata em formato digital.</p>
                  <p>Material preparado para utilização instantânea em campanhas e lançamentos.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {relatedProducts.length > 0 && (
        <section className="py-24 lg:py-32 bg-cream">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <p className="text-gold text-sm font-medium uppercase tracking-widest">
                Produtos relacionados
              </p>
              <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-navy mt-4 text-balance">
                Quem comprou isso também gostou
              </h2>
            </div>

            <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-8">
              {relatedProducts.map((related) => (
                <ProductCard key={related.id} product={related} />
              ))}
            </div>
          </div>
        </section>
      )}

      <Footer />
    </main>
  )
}
