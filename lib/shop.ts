import type {
  Category,
  Product,
  Service,
  SiteSettings,
  Testimonial,
  CustomRequest,
} from '@prisma/client'
import { prisma } from '@/lib/prisma'

export type ProductWithCategory = Product & { category: Category | null }
export type SerializedProduct = Omit<ProductWithCategory, 'price' | 'originalPrice'> & {
  price: string
  originalPrice: string
}

function serializeProduct(product: ProductWithCategory): SerializedProduct {
  return {
    ...product,
    price: product.price.toString(),
    originalPrice: product.originalPrice ? product.originalPrice.toString() : '',
  }
}

export async function getProducts(categorySlug?: string) {
  const products = await prisma.product.findMany({
    where: categorySlug
      ? {
          category: {
            slug: categorySlug,
          },
        }
      : undefined,
    include: { category: true },
    orderBy: { createdAt: 'desc' },
  })

  return products.map(serializeProduct)
}

export async function getFeaturedProducts() {
  const products = await prisma.product.findMany({
    where: { featured: true },
    include: { category: true },
    orderBy: { createdAt: 'desc' },
  })

  return products.map(serializeProduct)
}

export async function getProductBySlug(slug?: string) {
  if (!slug) {
    return null
  }

  const product = await prisma.product.findUnique({
    where: { slug },
    include: { category: true },
  })

  if (!product) {
    return null
  }

  return serializeProduct(product)
}

export async function getRelatedProducts(productId: number, categoryId?: number) {
  if (!categoryId) {
    return []
  }

  const related = await prisma.product.findMany({
    where: {
      categoryId,
      id: {
        not: productId,
      },
    },
    include: { category: true },
    take: 3,
  })

  if (related.length > 0) {
    return related.map(serializeProduct)
  }

  return getFeaturedProducts()
}

export async function getCategories() {
  return prisma.category.findMany({
    orderBy: { name: 'asc' },
  })
}

export async function getServices() {
  return prisma.service.findMany({
    orderBy: { createdAt: 'desc' },
  })
}

export async function getTestimonials() {
  return prisma.testimonial.findMany({
    orderBy: { createdAt: 'desc' },
  })
}

export async function getSiteSettings() {
  return prisma.siteSettings.findFirst()
}

export async function createCustomRequest(data: {
  name: string
  email: string
  phone: string
  serviceType: string
  budget?: string
  message: string
}) {
  return prisma.customRequest.create({ data })
}
