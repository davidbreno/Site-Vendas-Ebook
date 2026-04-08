import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { Prisma } from '@prisma/client'
import { cookies } from 'next/headers'

// Auth check middleware
async function checkAuth() {
  const cookieStore = await cookies()
  const authToken = cookieStore.get('admin-auth')?.value
  return authToken === process.env.ADMIN_AUTH_TOKEN
}

export async function GET() {
  if (!(await checkAuth())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const products = await prisma.product.findMany({
      include: {
        category: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    // Transform to include categoryName
    const transformedProducts = products.map((product: typeof products[0]) => ({
      ...product,
      categoryName: product.category?.name || 'Sem categoria'
    }))

    return NextResponse.json(transformedProducts)
  } catch (error) {
    console.error('Error fetching products:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  if (!(await checkAuth())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await request.json()
    const {
      title,
      description,
      price,
      originalPrice,
      categoryId,
      imageUrl,
      downloadUrl,
      benefits,
      isActive,
      featured
    } = body

    const normalizedPrice = typeof price === 'string' ? parseFloat(price) : price
    const normalizedOriginalPrice =
      originalPrice === null || originalPrice === undefined || originalPrice === ''
        ? null
        : typeof originalPrice === 'string'
          ? parseFloat(originalPrice)
          : originalPrice
    const normalizedBenefits =
      typeof benefits === 'string' && benefits.trim() ? benefits : null

    // Generate slug from title
    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')

    const product = await prisma.product.create({
      data: {
        title,
        description,
        price: normalizedPrice,
        ...(normalizedOriginalPrice !== null && {
          originalPrice: new Prisma.Decimal(normalizedOriginalPrice)
        }),
        categoryId,
        imageUrl,
        downloadUrl,
        benefits: normalizedBenefits,
        isActive: isActive ?? true,
        featured: featured ?? false,
        slug
      },
      include: {
        category: true
      }
    })

    return NextResponse.json({
      ...product,
      categoryName: product.category?.name || 'Sem categoria'
    })
  } catch (error) {
    console.error('Error creating product:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
