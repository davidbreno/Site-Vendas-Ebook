import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import {
  Package,
  FolderOpen,
  Wrench,
  MessageSquare,
  Settings,
  FileText,
  BarChart3
} from 'lucide-react'

const adminSections = [
  {
    title: 'Produtos',
    description: 'Gerenciar produtos do catálogo',
    href: '/admin/products',
    icon: Package,
    color: 'text-blue-600'
  },
  {
    title: 'Categorias',
    description: 'Organizar produtos por categoria',
    href: '/admin/categories',
    icon: FolderOpen,
    color: 'text-green-600'
  },
  {
    title: 'Serviços',
    description: 'Gerenciar serviços oferecidos',
    href: '/admin/services',
    icon: Wrench,
    color: 'text-purple-600'
  },
  {
    title: 'Depoimentos',
    description: 'Gerenciar depoimentos de clientes',
    href: '/admin/testimonials',
    icon: MessageSquare,
    color: 'text-orange-600'
  },
  {
    title: 'Configurações',
    description: 'Configurações gerais do site',
    href: '/admin/settings',
    icon: Settings,
    color: 'text-gray-600'
  },
  {
    title: 'Pedidos Personalizados',
    description: 'Visualizar pedidos de personalização',
    href: '/admin/requests',
    icon: FileText,
    color: 'text-red-600'
  }
]

export default function AdminDashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard Administrativo</h1>
        <p className="text-gray-600 mt-2">
          Gerencie seu site de forma eficiente e organizada.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {adminSections.map((section) => {
          const Icon = section.icon
          return (
            <Card key={section.href} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-lg bg-gray-100`}>
                    <Icon className={`h-6 w-6 ${section.color}`} />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{section.title}</CardTitle>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription className="mb-4">
                  {section.description}
                </CardDescription>
                <Button asChild className="w-full">
                  <Link href={section.href}>
                    Gerenciar
                  </Link>
                </Button>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Produtos</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">-</div>
            <p className="text-xs text-muted-foreground">
              Carregando...
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Categorias</CardTitle>
            <FolderOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">-</div>
            <p className="text-xs text-muted-foreground">
              Carregando...
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pedidos Pendentes</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">-</div>
            <p className="text-xs text-muted-foreground">
              Carregando...
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Depoimentos</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">-</div>
            <p className="text-xs text-muted-foreground">
              Carregando...
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
