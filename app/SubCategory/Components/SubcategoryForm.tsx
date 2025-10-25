"use client"

import React, { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useCreateSubcategory, useUpdateSubcategory } from '@/hooks/SubCategory/useSubcategories'
import { useCategories } from '@/hooks/Categories/useCategories'

interface Props {
  onSuccess: () => void
  category?: { id: number; name: string; slug: string; category_id?: number } | null
}

const SubcategoryForm: React.FC<Props> = ({ onSuccess, category }) => {
  const [name, setName] = useState(category?.name || '')
  const [categoryId, setCategoryId] = useState<number | ''>(category?.category_id ?? '')
  const [loading, setLoading] = useState(false)

  const { createSubcategory } = useCreateSubcategory()
  const { updateSubcategory } = useUpdateSubcategory()

  // Use existing categories hook for parent select (single source of truth)
  const { categories, isLoading: catsLoading } = useCategories()

  useEffect(() => {
    setName(category?.name || '')
    setCategoryId(category?.category_id ?? '')
  }, [category])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim() || !categoryId) {
      alert('Please provide a name and select a parent category.')
      return
    }

    setLoading(true)
    try {
      if (category) {
        await updateSubcategory(category.id, { name: name.trim(), category_id: categoryId })
      } else {
        await createSubcategory({ name: name.trim(), category_id: categoryId })
      }
      onSuccess()
      setName('')
      setCategoryId('')
    } catch (err) {
      console.error('Failed to save subcategory:', err)
      alert('Failed to save subcategory. See console for details.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{category ? 'Edit Subcategory' : 'Add Subcategory'}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Subcategory Name</Label>
            <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required />
          </div>

          <div>
            <Label htmlFor="category">Parent Category</Label>
            <select
              id="category"
              value={categoryId}
              onChange={(e) => setCategoryId(Number(e.target.value))}
              className="w-full rounded-md border px-3 py-2"
              required
            >
              <option value="">Select category</option>
              {catsLoading && <option>Loading...</option>}
              {categories?.map((c: any) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex gap-2">
            <Button type="submit" disabled={loading}>
              {loading ? 'Saving...' : category ? 'Update' : 'Create'}
            </Button>
            {category && (
              <Button
                type="button"
                variant="ghost"
                onClick={() => {
                  setName('')
                  setCategoryId('')
                  onSuccess()
                }}
              >
                Cancel
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  )
}

export default SubcategoryForm
