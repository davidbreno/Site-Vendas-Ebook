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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Loader2, Star } from 'lucide-react'
import type { Testimonial } from '@prisma/client'

const testimonialSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório'),
  company: z.string().optional(),
  content: z.string().min(1, 'Depoimento é obrigatório'),
  rating: z.string().min(1, 'Avaliação é obrigatória'),
  isActive: z.boolean().default(true)
})

type TestimonialFormData = z.infer<typeof testimonialSchema>

interface TestimonialFormProps {
  testimonial?: Testimonial | null
  onSuccess: () => void
}

export function TestimonialForm({ testimonial, onSuccess }: TestimonialFormProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors }
  } = useForm<TestimonialFormData>({
    resolver: zodResolver(testimonialSchema),
    defaultValues: {
      name: testimonial?.name || '',
      company: testimonial?.company || '',
      content: testimonial?.content || '',
      rating: testimonial?.rating?.toString() || '5',
      isActive: testimonial?.isActive ?? true
    }
  })

  const isActive = watch('isActive')
  const rating = watch('rating')

  const onSubmit = async (data: TestimonialFormData) => {
    setLoading(true)
    setError('')

    try {
      const payload = {
        ...data,
        rating: parseInt(data.rating)
      }

      const url = testimonial
        ? `/api/admin/testimonials/${testimonial.id}`
        : '/api/admin/testimonials'

      const response = await fetch(url, {
        method: testimonial ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      })

      if (response.ok) {
        onSuccess()
      } else {
        const errorData = await response.json()
        setError(errorData.error || 'Erro ao salvar depoimento')
      }
    } catch (err) {
      setError('Erro ao salvar depoimento')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="max-w-4xl">
      <CardHeader>
        <CardTitle>{testimonial ? 'Editar Depoimento' : 'Novo Depoimento'}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="name">Nome *</Label>
              <Input
                id="name"
                {...register('name')}
                placeholder="Nome da pessoa"
              />
              {errors.name && (
                <p className="text-sm text-red-600">{errors.name.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="company">Empresa</Label>
              <Input
                id="company"
                {...register('company')}
                placeholder="Empresa (opcional)"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="content">Depoimento *</Label>
            <Textarea
              id="content"
              {...register('content')}
              placeholder="Conteúdo do depoimento"
              rows={4}
            />
            {errors.content && (
              <p className="text-sm text-red-600">{errors.content.message}</p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="rating">Avaliação *</Label>
              <Select
                value={rating}
                onValueChange={(value) => setValue('rating', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione a avaliação" />
                </SelectTrigger>
                <SelectContent>
                  {[5, 4, 3, 2, 1].map((star) => (
                    <SelectItem key={star} value={star.toString()}>
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${
                              i < star ? 'text-yellow-400 fill-current' : 'text-gray-300'
                            }`}
                          />
                        ))}
                        <span className="ml-2">{star} estrelas</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.rating && (
                <p className="text-sm text-red-600">{errors.rating.message}</p>
              )}
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="isActive"
                checked={isActive}
                onCheckedChange={(checked) => setValue('isActive', checked)}
              />
              <Label htmlFor="isActive">Depoimento ativo</Label>
            </div>
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
              {testimonial ? 'Atualizar' : 'Criar'} Depoimento
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
