"use client"

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Plus, Edit, Trash2 } from 'lucide-react'
import { TestimonialForm } from '@/components/admin/testimonial-form'
import { DeleteConfirmDialog } from '@/components/admin/delete-confirm-dialog'
import type { Testimonial } from '@prisma/client'

export default function AdminTestimonialsPage() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingTestimonial, setEditingTestimonial] = useState<Testimonial | null>(null)
  const [deleteTestimonial, setDeleteTestimonial] = useState<Testimonial | null>(null)

  const fetchTestimonials = async () => {
    try {
      const response = await fetch('/api/admin/testimonials')
      if (response.ok) {
        const data = await response.json()
        setTestimonials(data)
      }
    } catch (error) {
      console.error('Error fetching testimonials:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTestimonials()
  }, [])

  const handleDelete = async () => {
    if (!deleteTestimonial) return

    try {
      const response = await fetch(`/api/admin/testimonials/${deleteTestimonial.id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        setTestimonials(testimonials.filter(t => t.id !== deleteTestimonial.id))
        setDeleteTestimonial(null)
      }
    } catch (error) {
      console.error('Error deleting testimonial:', error)
    }
  }

  const handleFormSuccess = () => {
    setShowForm(false)
    setEditingTestimonial(null)
    fetchTestimonials()
  }

  if (showForm) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900">
            {editingTestimonial ? 'Editar Depoimento' : 'Novo Depoimento'}
          </h1>
          <Button variant="outline" onClick={() => setShowForm(false)}>
            Voltar
          </Button>
        </div>
        <TestimonialForm
          testimonial={editingTestimonial}
          onSuccess={handleFormSuccess}
        />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Depoimentos</h1>
        <Button onClick={() => setShowForm(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Novo Depoimento
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Gerenciar Depoimentos</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">Carregando...</div>
          ) : testimonials.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              Nenhum depoimento encontrado.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Empresa</TableHead>
                  <TableHead>Depoimento</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {testimonials.map((testimonial) => (
                  <TableRow key={testimonial.id}>
                    <TableCell className="font-medium">{testimonial.name}</TableCell>
                    <TableCell>{testimonial.company || '-'}</TableCell>
                    <TableCell className="max-w-xs truncate">
                      {testimonial.content}
                    </TableCell>
                    <TableCell>
                      <Badge variant={testimonial.isActive ? "default" : "secondary"}>
                        {testimonial.isActive ? 'Ativo' : 'Inativo'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setEditingTestimonial(testimonial)
                            setShowForm(true)
                          }}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setDeleteTestimonial(testimonial)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <DeleteConfirmDialog
        open={!!deleteTestimonial}
        onOpenChange={() => setDeleteTestimonial(null)}
        onConfirm={handleDelete}
        title="Excluir Depoimento"
        description={`Tem certeza que deseja excluir o depoimento de "${deleteTestimonial?.name}"? Esta ação não pode ser desfeita.`}
      />
    </div>
  )
}