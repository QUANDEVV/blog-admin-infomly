"use client"

import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useCreateCategory, useUpdateCategory } from '@/hooks/Categories/useCategories'

interface CategoryFormProps {
  onSuccess: () => void
  category?: { id: number; name: string; slug: string } | null
}

const CategoryForm: React.FC<CategoryFormProps> = ({ onSuccess, category }) => {
  const [name, setName] = useState(category?.name || '')
  const [loading, setLoading] = useState(false)
  const { createCategory } = useCreateCategory()
  const { updateCategory } = useUpdateCategory()

  useEffect(() => {
    setName(category?.name || '')
  }, [category])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      if (category) {
        await updateCategory(category.id, { name })
      } else {
        await createCategory({ name })
      }
      onSuccess()
      setName('')
    } catch (error) {
      console.error('Error saving category:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{category ? 'Edit Category' : 'Add Category'}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Category Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <Button type="submit" disabled={loading}>
            {loading ? 'Saving...' : category ? 'Update' : 'Create'}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}

export default CategoryForm