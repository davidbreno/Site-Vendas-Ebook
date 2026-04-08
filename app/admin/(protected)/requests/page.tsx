"use client"

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Loader2, Eye, Mail, Phone, MessageSquare } from 'lucide-react'
import type { CustomRequest } from '@prisma/client'

export default function AdminRequestsPage() {
  const [requests, setRequests] = useState<CustomRequest[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [selectedRequest, setSelectedRequest] = useState<CustomRequest | null>(null)

  const fetchRequests = async () => {
    try {
      const response = await fetch('/api/admin/requests')
      if (response.ok) {
        const data = await response.json()
        setRequests(data)
      } else {
        setError('Erro ao carregar solicitações')
      }
    } catch (error) {
      console.error('Error fetching requests:', error)
      setError('Erro ao carregar solicitações')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchRequests()
  }, [])

  const formatDate = (date: string | Date) => {
    const dateObj = typeof date === 'string' ? new Date(date) : date
    return dateObj.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="secondary">Pendente</Badge>
      case 'in_progress':
        return <Badge variant="default">Em Andamento</Badge>
      case 'completed':
        return <Badge variant="default" className="bg-green-500">Concluído</Badge>
      case 'cancelled':
        return <Badge variant="destructive">Cancelado</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-gray-900">Solicitações Personalizadas</h1>
        <div className="text-center py-8">
          <Loader2 className="mx-auto h-8 w-8 animate-spin" />
          <p className="mt-2 text-gray-600">Carregando solicitações...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Solicitações Personalizadas</h1>
        <p className="text-gray-600 mt-2">
          Gerencie as solicitações de serviços personalizados dos clientes.
        </p>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 gap-6">
        {requests.length === 0 ? (
          <Card>
            <CardContent className="text-center py-8">
              <MessageSquare className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">Nenhuma solicitação</h3>
              <p className="mt-1 text-sm text-gray-500">
                Ainda não há solicitações personalizadas.
              </p>
            </CardContent>
          </Card>
        ) : (
          requests.map((request) => (
            <Card key={request.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg">{request.serviceType}</CardTitle>
                    <p className="text-sm text-gray-600 mt-1">
                      {request.name} â€¢ {formatDate(request.createdAt)}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    {getStatusBadge(request.status)}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedRequest(request)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="font-medium text-gray-900">Contato</p>
                    <div className="space-y-1 mt-1">
                      <p className="flex items-center text-gray-600">
                        <Mail className="h-4 w-4 mr-2" />
                        {request.email}
                      </p>
                      {request.phone && (
                        <p className="flex items-center text-gray-600">
                          <Phone className="h-4 w-4 mr-2" />
                          {request.phone}
                        </p>
                      )}
                    </div>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Orçamento</p>
                    <p className="text-gray-600 mt-1">
                      {request.budget ? `R$ ${request.budget}` : 'Não informado'}
                    </p>
                  </div>
                </div>
                {request.message && (
                  <div className="mt-4">
                    <p className="font-medium text-gray-900">Mensagem</p>
                    <p className="text-gray-600 mt-1 text-sm">{request.message}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Request Detail Modal */}
      {selectedRequest && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-start justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">
                  Detalhes da Solicitação
                </h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedRequest(null)}
                >
                  âœ•
                </Button>
              </div>

              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-medium text-gray-900 mb-2">Informações do Cliente</h3>
                    <div className="space-y-2 text-sm">
                      <p><strong>Nome:</strong> {selectedRequest.name}</p>
                      <p><strong>E-mail:</strong> {selectedRequest.email}</p>
                      {selectedRequest.phone && (
                        <p><strong>Telefone:</strong> {selectedRequest.phone}</p>
                      )}
                    </div>
                  </div>

                  <div>
                    <h3 className="font-medium text-gray-900 mb-2">Detalhes do Serviço</h3>
                    <div className="space-y-2 text-sm">
                      <p><strong>Serviço:</strong> {selectedRequest.serviceType}</p>
                      <p><strong>Status:</strong> {getStatusBadge(selectedRequest.status)}</p>
                      <p><strong>Orçamento:</strong> {selectedRequest.budget ? `R$ ${selectedRequest.budget}` : 'Não informado'}</p>
                      <p><strong>Data:</strong> {formatDate(selectedRequest.createdAt)}</p>
                    </div>
                  </div>
                </div>

                {selectedRequest.message && (
                  <div>
                    <h3 className="font-medium text-gray-900 mb-2">Mensagem Detalhada</h3>
                    <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded">
                      {selectedRequest.message}
                    </p>
                  </div>
                )}

                <div className="flex justify-end space-x-4 pt-4 border-t">
                  <Button variant="outline" onClick={() => setSelectedRequest(null)}>
                    Fechar
                  </Button>
                  <Button>
                    Atualizar Status
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
