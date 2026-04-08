import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { cookies } from 'next/headers'

// Auth check middleware
async function checkAuth() {
  const cookieStore = await cookies()
  const authToken = cookieStore.get('admin-auth')?.value
  return authToken === process.env.ADMIN_AUTH_TOKEN
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await checkAuth())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { id } = await params

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

    // Generate slug from title if title changed
    let slug
    if (title) {
      slug = title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '')
    }

    const product = await prisma.product.update({
      where: { id: parseInt(id) },
      data: {
        ...(title && { title }),
        ...(description !== undefined && { description }),
        ...(price !== undefined && { price: normalizedPrice }),
        ...(originalPrice !== undefined && { originalPrice: normalizedOriginalPrice }),
        ...(categoryId && { categoryId }),
        ...(imageUrl !== undefined && { imageUrl }),
        ...(downloadUrl !== undefined && { downloadUrl }),
        ...(benefits !== undefined && { benefits: normalizedBenefits }),
        ...(isActive !== undefined && { isActive }),
        ...(featured !== undefined && { featured }),
        ...(slug && { slug })
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
    console.error('Error updating product:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await checkAuth())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { id } = await params

  try {
    await prisma.product.delete({
      where: { id: parseInt(id) }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting product:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
