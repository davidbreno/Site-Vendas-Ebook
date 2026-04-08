"use client"

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Loader2 } from 'lucide-react'
import type { Service } from '@prisma/client'

const serviceSchema = z.object({
  title: z.string().min(1, 'Nome é obrigatório'),
  description: z.string().min(1, 'Descrição é obrigatória'),
  startingPrice: z.string().min(1, 'Preço inicial é obrigatório'),
  delivery: z.string().min(1, 'Prazo de entrega é obrigatório'),
  isActive: z.boolean().default(true),
  featured: z.boolean().default(false)
})

type ServiceFormData = z.infer<typeof serviceSchema>

interface ServiceFormProps {
  service?: Service | null
  onSuccess: () => void
}

export function ServiceForm({ service, onSuccess }: ServiceFormProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors }
  } = useForm<ServiceFormData>({
    resolver: zodResolver(serviceSchema),
    defaultValues: {
      title: service?.title || '',
      description: service?.description || '',
      startingPrice: service?.startingPrice || '',
      delivery: service?.delivery || '',
      isActive: service?.isActive ?? true,
      featured: service?.featured ?? false
    }
  })

  const isActive = watch('isActive')

  const onSubmit = async (data: ServiceFormData) => {
    setLoading(true)
    setError('')

    try {
      const payload = {
        ...data
      }

      const url = service
        ? `/api/admin/services/${service.id}`
        : '/api/admin/services'

      const response = await fetch(url, {
        method: service ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      })

      if (response.ok) {
        onSuccess()
      } else {
        const errorData = await response.json()
        setError(errorData.error || 'Erro ao salvar serviço')
      }
    } catch (err) {
      setError('Erro ao salvar serviço')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="max-w-4xl">
      <CardHeader>
        <CardTitle>{service ? 'Editar Serviço' : 'Novo Serviço'}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="title">Nome do Serviço *</Label>
              <Input
                id="title"
                {...register('title')}
                placeholder="Nome do serviço"
              />
              {errors.title && (
                <p className="text-sm text-red-600">{errors.title.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="startingPrice">Preço Inicial *</Label>
              <Input
                id="startingPrice"
                {...register('startingPrice')}
                placeholder="Ex: A partir de R$ 500,00"
              />
              {errors.startingPrice && (
                <p className="text-sm text-red-600">{errors.startingPrice.message}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descrição *</Label>
            <Textarea
              id="description"
              {...register('description')}
              placeholder="Descrição detalhada do serviço"
              rows={4}
            />
            {errors.description && (
              <p className="text-sm text-red-600">{errors.description.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="delivery">Prazo de Entrega *</Label>
            <Input
              id="delivery"
              {...register('delivery')}
              placeholder="Ex: 5-7 dias úteis"
            />
            {errors.delivery && (
              <p className="text-sm text-red-600">{errors.delivery.message}</p>
            )}
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="isActive"
              checked={isActive}
              onCheckedChange={(checked) => setValue('isActive', checked)}
            />
            <Label htmlFor="isActive">Serviço ativo</Label>
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="flex justify-end space-x-4">
            <Button type="button" variant="outline" onClick={onSuccess}>
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {service ? 'Atualizar' : 'Criar'} Serviço
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
