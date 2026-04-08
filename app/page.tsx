export const dynamic = 'force-dynamic'

import { Header } from '@/components/header'
import { Hero } from '@/components/hero'
import { Categories } from '@/components/categories'
import { Products } from '@/components/products'
import { Services } from '@/components/services'
import { BrandDifference } from '@/components/brand-difference'
import { Testimonials } from '@/components/testimonials'
import { FinalCTA } from '@/components/final-cta'
import { Footer } from '@/components/footer'
import { getFeaturedProducts } from '@/lib/shop'

export default async function Home() {
  const featuredProducts = await getFeaturedProducts()

  return (
    <main className="min-h-screen bg-navy">
      <Header />
      <Hero />
      <Categories />
      <Products products={featuredProducts} />
      <Services />
      <BrandDifference />
      <Testimonials />
      <FinalCTA />
      <Footer />
    </main>
  )
}
