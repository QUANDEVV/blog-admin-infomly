"use client"

import React from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Edit, Trash2, Plus } from 'lucide-react'
import { useCategories, useDeleteCategory } from '@/hooks/Categories/useCategories'

interface Category {
  id: number
  name: string
  slug: string
  created_at: string
}

interface CategoryListProps {
  onEdit: (category: Category | null) => void
}

const CategoryList: React.FC<CategoryListProps> = ({ onEdit }) => {
  const { categories, isLoading, isError, mutate } = useCategories()
  const { deleteCategory } = useDeleteCategory()

  const handleDelete = async (id: number) => {
    if (confirm('Are you sure you want to delete this category?')) {
      try {
        await deleteCategory(id)
        mutate() // Refresh the list after deletion
      } catch (error) {
        console.error('Error deleting category:', error)
      }
    }
  }

  if (isLoading) return <div>Loading...</div>
  if (isError) return <div>Error loading categories</div>

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Categories</h2>
        <Button onClick={() => onEdit(null)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Category
        </Button>
      </div>
      <div className="grid gap-4">
        {categories?.map((category: Category) => (
          <Card key={category.id}>
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                {category.name}
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => onEdit(category)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(category.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p>Slug: {category.slug}</p>
              <p>Created: {new Date(category.created_at).toLocaleDateString()}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

export default CategoryList