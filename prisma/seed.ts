import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  await prisma.customRequest.deleteMany()
  await prisma.siteSettings.deleteMany()
  await prisma.testimonial.deleteMany()
  await prisma.service.deleteMany()
  await prisma.product.deleteMany()
  await prisma.category.deleteMany()

  const categories = [
    {
      name: 'Ebooks',
      slug: 'ebooks',
      description: 'Guias digitais premium para geração de autoridade e conversão.',
    },
    {
      name: 'Planner',
      slug: 'planner',
      description: 'Ferramentas de organização visual para empreendedores criativos.',
    },
    {
      name: 'Pack Design',
      slug: 'pack-design',
      description: 'Kits de conteúdo e layouts prontos para redes sociais e marketing.',
    },
    {
      name: 'Bundle',
      slug: 'bundle',
      description: 'Pacotes combinados de produtos digitais com alto valor percebido.',
    },
  ]

  const createdCategories = await Promise.all(
    categories.map((category) => prisma.category.create({ data: category }))
  )

  const categoryMap = createdCategories.reduce<Record<string, { id: number }>>(
    (acc, category) => ({
      ...acc,
      [category.slug]: { id: category.id },
    }),
    {}
  )

  const products = [
    {
      title: 'Marketing Digital Ebook',
      slug: 'marketing-digital-ebook',
      description: 'Estratégias comprovadas para aumentar suas vendas online e dominar o digital.',
      originalPrice: '197',
      price: '97',
      categorySlug: 'ebooks',
      badge: 'Mais Vendido',
      featured: true,
    },
    {
      title: 'Planner Premium 2024',
      slug: 'planner-premium-2024',
      description: 'Organize seu negócio com elegância e produtividade elevada.',
      originalPrice: '127',
      price: '67',
      categorySlug: 'planner',
      badge: 'Novo',
    },
    {
      title: 'Kit Conteúdo Instagram',
      slug: 'kit-conteudo-instagram',
      description: '120+ templates editáveis para posts, stories e reels de alto impacto.',
      originalPrice: '297',
      price: '147',
      categorySlug: 'pack-design',
      badge: 'Popular',
    },
    {
      title: 'Blueprint de Vendas',
      slug: 'blueprint-de-vendas',
      description: 'O guia definitivo para criar funis de vendas que convertem.',
      originalPrice: '397',
      price: '197',
      categorySlug: 'ebooks',
      badge: null,
    },
    {
      title: 'Guia Posicionamento de Marca',
      slug: 'guia-posicionamento-de-marca',
      description: 'Construa uma marca memorável que atrai clientes ideais.',
      originalPrice: '247',
      price: '127',
      categorySlug: 'ebooks',
      badge: 'Destaque',
    },
    {
      title: 'Pack Negócio Criativo',
      slug: 'pack-negocio-criativo',
      description: 'Tudo que você precisa para lançar seu negócio criativo com profissionalismo.',
      originalPrice: '497',
      price: '297',
      categorySlug: 'bundle',
      badge: 'Oferta',
    },
  ]

  await Promise.all(
    products.map((product) =>
      prisma.product.create({
        data: {
          title: product.title,
          slug: product.slug,
          description: product.description,
          originalPrice: product.originalPrice,
          price: product.price,
          badge: product.badge,
          featured: product.featured ?? false,
          category: {
            connect: {
              id: categoryMap[product.categorySlug].id,
            },
          },
        },
      })
    )
  )

  await prisma.service.createMany({
    data: [
      {
        title: 'Design de Logo',
        slug: 'design-de-logo',
        description: 'Logotipo exclusivo que captura a essência da sua marca com elegância e profissionalismo.',
        startingPrice: 'A partir de R$ 497',
        delivery: '5-7 dias úteis',
        featured: true,
      },
      {
        title: 'Identidade Visual Completa',
        slug: 'identidade-visual-completa',
        description: 'Sistema visual completo com logo, paleta, tipografia e manual de marca.',
        startingPrice: 'A partir de R$ 1.997',
        delivery: '15-20 dias úteis',
      },
      {
        title: 'Design de Ebook Personalizado',
        slug: 'design-de-ebook-personalizado',
        description: 'Ebook com design premium, diagramação profissional e capa impactante.',
        startingPrice: 'A partir de R$ 797',
        delivery: '7-10 dias úteis',
      },
      {
        title: 'Design para Redes Sociais',
        slug: 'design-para-redes-sociais',
        description: 'Templates personalizados para feed, stories e destaques do Instagram.',
        startingPrice: 'A partir de R$ 397',
        delivery: '3-5 dias úteis',
      },
      {
        title: 'Catálogo Digital',
        slug: 'catalogo-digital',
        description: 'Catálogo interativo e elegante para apresentar seus produtos ou serviços.',
        startingPrice: 'A partir de R$ 697',
        delivery: '7-10 dias úteis',
      },
      {
        title: 'Design de Landing Page',
        slug: 'design-de-landing-page',
        description: 'Página de vendas otimizada para conversão com design premium.',
        startingPrice: 'A partir de R$ 1.497',
        delivery: '10-14 dias úteis',
      },
    ],
  })

  await prisma.testimonial.createMany({
    data: [
      {
        name: 'Mariana Costa',
        company: 'Bloom Digital',
        content:
          'A Marca & Mente transformou completamente a identidade do meu negócio. O ebook que criaram para mim já gerou mais de R$50.000 em vendas. Qualidade excepcional!',
        rating: 5,
      },
      {
        name: 'Ricardo Oliveira',
        company: 'Scale Up Academy',
        content:
          'Profissionalismo e criatividade em cada detalhe. O logo e a identidade visual superaram todas as expectativas. Recomendo de olhos fechados!',
        rating: 5,
      },
      {
        name: 'Fernanda Lima',
        company: 'Empreendedora Digital',
        content:
          'Os templates de Instagram revolucionaram meu conteúdo. Meu engajamento triplicou e finalmente tenho um feed profissional que converte seguidores em clientes.',
        rating: 5,
      },
    ],
  })

  await prisma.siteSettings.create({
    data: {
      siteName: 'Marca & Mente Studio',
      siteDescription: 'Plataforma premium com ebooks, branding digital e soluções criativas personalizadas para posicionar sua marca e aumentar conversões.',
      contactEmail: 'contato@marcaemente.com',
      whatsappNumber: '+5500000000000',
      instagramUrl: 'https://instagram.com',
    },
  })
}

main()
  .then(() => {
    console.log('Seed concluído com sucesso.')
  })
  .catch((error) => {
    console.error('Erro ao rodar seed:', error)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
