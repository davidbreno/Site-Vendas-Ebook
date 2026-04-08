"use client"

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Loader2, CheckCircle2 } from 'lucide-react'
import type { Order, OrderItem } from '@prisma/client'

type OrderWithItems = Order & { items: OrderItem[] }

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<OrderWithItems[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [confirmingId, setConfirmingId] = useState<number | null>(null)

  const fetchOrders = async () => {
    try {
      const response = await fetch('/api/admin/orders')
      if (response.ok) {
        const data = await response.json()
        setOrders(data)
      } else {
        setError('Erro ao carregar pedidos')
      }
    } catch (fetchError) {
      console.error('Error fetching orders:', fetchError)
      setError('Erro ao carregar pedidos')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchOrders()
  }, [])

  const formatDate = (date: string | Date) => {
    const dateObj = typeof date === 'string' ? new Date(date) : date
    return dateObj.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const formatPrice = (value: string | number) => {
    const numeric = typeof value === 'number' ? value : Number(value)
    if (Number.isNaN(numeric)) {
      return 'R$ 0,00'
    }
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(numeric)
  }

  const getPaymentBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-green-500">Pago</Badge>
      case 'pending':
        return <Badge variant="secondary">Pendente</Badge>
      case 'failed':
        return <Badge variant="destructive">Falhou</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const handleConfirmPayment = async (orderId: number) => {
    setConfirmingId(orderId)
    try {
      const response = await fetch(`/api/admin/orders/${orderId}/confirm`, { method: 'POST' })
      if (!response.ok) {
        const data = await response.json()
        setError(data.error || 'Erro ao confirmar pagamento')
      } else {
        await fetchOrders()
      }
    } catch (confirmError) {
      console.error('Error confirming order:', confirmError)
      setError('Erro ao confirmar pagamento')
    } finally {
      setConfirmingId(null)
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-gray-900">Pedidos</h1>
        <div className="text-center py-8">
          <Loader2 className="mx-auto h-8 w-8 animate-spin" />
          <p className="mt-2 text-gray-600">Carregando pedidos...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Pedidos</h1>
        <p className="text-gray-600 mt-2">
          Confirme pagamentos Pix manuais e envie os ebooks automaticamente.
        </p>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {orders.length === 0 ? (
        <Card>
          <CardContent className="text-center py-8 text-gray-500">
            Nenhum pedido encontrado.
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {orders.map((order) => (
            <Card key={order.id}>
              <CardHeader className="pb-4">
                <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                  <div>
                    <CardTitle className="text-lg">Pedido #{order.id}</CardTitle>
                    <p className="text-sm text-gray-600 mt-1">
                      {order.customerName} ââ‚¬¢ {formatDate(order.createdAt)}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    {getPaymentBadge(order.paymentStatus)}
                    <Badge variant="outline">{order.paymentMethod.toUpperCase()}</Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="font-medium text-gray-900">Contato</p>
                    <p className="text-gray-600 mt-1">{order.customerEmail}</p>
                    <p className="text-gray-600">{order.customerPhone}</p>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Total</p>
                    <p className="text-gray-600 mt-1">{formatPrice(order.total.toString())}</p>
                    <p className="text-gray-500 text-xs">Status do pedido: {order.orderStatus}</p>
                  </div>
                </div>

                <div>
                  <p className="font-medium text-gray-900 mb-2">Itens</p>
                  <ul className="space-y-1 text-sm text-gray-600">
                    {order.items.map((item) => (
                      <li key={item.id}>
                        {item.title} (x{item.quantity})
                      </li>
                    ))}
                  </ul>
                </div>

                {order.paymentStatus !== 'completed' ? (
                  <div className="flex flex-wrap gap-3">
                    <Button
                      onClick={() => handleConfirmPayment(order.id)}
                      disabled={confirmingId === order.id}
                    >
                      {confirmingId === order.id ? (
                        <span className="inline-flex items-center gap-2">
                          <Loader2 className="h-4 w-4 animate-spin" />
                          Confirmando...
                        </span>
                      ) : (
                        'Confirmar pagamento'
                      )}
                    </Button>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-green-600 text-sm font-medium">
                    <CheckCircle2 className="h-4 w-4" />
                    Ebook enviado
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
