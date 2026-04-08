"use client"

import { useState, useEffect } from 'react'
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
import { Loader2 } from 'lucide-react'
import type { Product, Category } from '@prisma/client'

const urlOrPath = z
  .string()
  .trim()
  .refine(
    (value) => value === '' || value.startsWith('/') || /^https?:\/\//i.test(value),
    'URL inválida'
  )

const productSchema = z.object({
  title: z.string().min(1, 'Nome é obrigatório'),
  description: z.string().min(1, 'Descrição é obrigatória'),
  price: z.string().min(1, 'Preço é obrigatório'),
  originalPrice: z.string().optional(),
  categoryId: z.string().min(1, 'Categoria é obrigatória'),
  imageUrl: urlOrPath.optional().or(z.literal('')),
  downloadUrl: urlOrPath.optional().or(z.literal('')),
  benefits: z.string().optional(),
  isActive: z.boolean().default(true),
  featured: z.boolean().default(false)
})

type ProductFormData = z.infer<typeof productSchema>

export type ProductFormProduct = Omit<Product, 'price' | 'originalPrice'> & {
  price: number | string
  originalPrice: number | string | null
}

interface ProductFormProps {
  product?: ProductFormProduct | null
  onSuccess: () => void
}

export function ProductForm({ product, onSuccess }: ProductFormProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [categories, setCategories] = useState<Category[]>([])

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors }
  } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      title: product?.title || '',
      description: product?.description || '',
      price: product?.price?.toString() || '',
      originalPrice: product?.originalPrice?.toString() || '',
      categoryId: product?.categoryId?.toString() || '',
      imageUrl: product?.imageUrl || '',
      downloadUrl: product?.downloadUrl || '',
      benefits: product?.benefits || '',
      isActive: product?.isActive ?? true,
      featured: product?.featured ?? false
    }
  })

  const isActive = watch('isActive')
  const featured = watch('featured')

  // Fetch categories on mount
  useEffect(() => {
    fetch('/api/admin/categories')
      .then(res => res.json())
      .then(setCategories)
      .catch(console.error)
  }, [])

  const onSubmit = async (data: ProductFormData) => {
    setLoading(true)
    setError('')

    try {
      const payload = {
        ...data,
        benefits: data.benefits || null,
        price: parseFloat(data.price),
        originalPrice: data.originalPrice ? parseFloat(data.originalPrice) : null,
        categoryId: data.categoryId ? parseInt(data.categoryId, 10) : null
      }

      const url = product
        ? `/api/admin/products/${product.id}`
        : '/api/admin/products'

      const response = await fetch(url, {
        method: product ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      })

      if (response.ok) {
        onSuccess()
      } else {
        const errorData = await response.json()
        setError(errorData.error || 'Erro ao salvar produto')
      }
    } catch (err) {
      setError('Erro ao salvar produto')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="max-w-4xl">
      <CardHeader>
        <CardTitle>{product ? 'Editar Produto' : 'Novo Produto'}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="title">Nome do Produto *</Label>
              <Input
                id="title"
                {...register('title')}
                placeholder="Nome do produto"
              />
              {errors.title && (
                <p className="text-sm text-red-600">{errors.title.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="categoryId">Categoria *</Label>
              <Select
                value={watch('categoryId')}
                onValueChange={(value) => setValue('categoryId', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione uma categoria" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id.toString()}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.categoryId && (
                <p className="text-sm text-red-600">{errors.categoryId.message}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descrição *</Label>
            <Textarea
              id="description"
              {...register('description')}
              placeholder="Descrição detalhada do produto"
              rows={4}
            />
            {errors.description && (
              <p className="text-sm text-red-600">{errors.description.message}</p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="price">Preço (R$) *</Label>
              <Input
                id="price"
                type="number"
                step="0.01"
                {...register('price')}
                placeholder="0.00"
              />
              {errors.price && (
                <p className="text-sm text-red-600">{errors.price.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="originalPrice">Preço Original (R$)</Label>
              <Input
                id="originalPrice"
                type="number"
                step="0.01"
                {...register('originalPrice')}
                placeholder="0.00"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="imageUrl">URL da Imagem</Label>
              <Input
                id="imageUrl"
                {...register('imageUrl')}
                placeholder="https://exemplo.com/imagem.jpg"
              />
              {errors.imageUrl && (
                <p className="text-sm text-red-600">{errors.imageUrl.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="downloadUrl">URL de Download</Label>
              <Input
                id="downloadUrl"
                {...register('downloadUrl')}
                placeholder="https://exemplo.com/download.zip"
              />
              {errors.downloadUrl && (
                <p className="text-sm text-red-600">{errors.downloadUrl.message}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="benefits">Benefícios (um por linha)</Label>
            <Textarea
              id="benefits"
              {...register('benefits')}
              placeholder="Benefício 1&#10;Benefício 2&#10;Benefício 3"
              rows={4}
            />
          </div>

          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-2">
              <Switch
                id="isActive"
                checked={isActive}
                onCheckedChange={(checked) => setValue('isActive', checked)}
              />
              <Label htmlFor="isActive">Produto ativo</Label>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="featured"
                checked={featured}
                onCheckedChange={(checked) => setValue('featured', checked)}
              />
              <Label htmlFor="featured">Produto em destaque</Label>
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
              {product ? 'Atualizar' : 'Criar'} Produto
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
