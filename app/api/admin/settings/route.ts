import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
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
    // Get the first (and should be only) settings record
    const settings = await prisma.siteSettings.findFirst()

    if (!settings) {
      // Create default settings if none exist
      const defaultSettings = await prisma.siteSettings.create({
        data: {
          siteName: 'Marca & Mente Studio',
          siteDescription: 'Plataforma premium com ebooks, sistemas de branding e soluções criativas personalizadas.',
          contactEmail: 'contato@marcamente.com',
          contactPhone: '',
          whatsappNumber: '',
          address: '',
          facebookUrl: '',
          instagramUrl: '',
          linkedinUrl: '',
          maintenanceMode: false
        }
      })
      return NextResponse.json(defaultSettings)
    }

    return NextResponse.json(settings)
  } catch (error) {
    console.error('Error fetching settings:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  if (!(await checkAuth())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await request.json()
    const {
      siteName,
      siteDescription,
      contactEmail,
      contactPhone,
      whatsappNumber,
      address,
      facebookUrl,
      instagramUrl,
      linkedinUrl,
      maintenanceMode
    } = body

    // Get existing settings or create new ones
    const existingSettings = await prisma.siteSettings.findFirst()

    const settings = await prisma.siteSettings.upsert({
      where: {
        id: existingSettings?.id || 1
      },
      update: {
        siteName,
        siteDescription,
        contactEmail,
        contactPhone,
        whatsappNumber,
        address,
        facebookUrl,
        instagramUrl,
        linkedinUrl,
        maintenanceMode
      },
      create: {
        siteName,
        siteDescription,
        contactEmail,
        contactPhone,
        whatsappNumber,
        address,
        facebookUrl,
        instagramUrl,
        linkedinUrl,
        maintenanceMode
      }
    })

    return NextResponse.json(settings)
  } catch (error) {
    console.error('Error updating settings:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}