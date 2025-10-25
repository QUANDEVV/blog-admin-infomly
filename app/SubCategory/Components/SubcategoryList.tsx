"use client"

import React from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Edit, Trash2, Plus } from 'lucide-react'
import { useSubcategories, useDeleteSubcategory } from '@/hooks/SubCategory/useSubcategories'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useCategories } from '@/hooks/Categories/useCategories'

interface Subcategory {
  id: number
  name: string
  slug: string
  category_id: number
  category?: { id: number; name: string } | null
  created_at: string
}

interface Props {
  onEdit: (subcategory: Subcategory | null) => void
}

const SubcategoryList: React.FC<Props> = ({ onEdit }) => {
  const { subcategories, isLoading, isError, mutate } = useSubcategories()
  const { deleteSubcategory } = useDeleteSubcategory()
  const { categories } = useCategories()
  const [selectedCategory, setSelectedCategory] = React.useState<string>('all')

  const filtered = React.useMemo(() => {
    if (!subcategories) return []
    if (!selectedCategory || selectedCategory === 'all') return subcategories
    return subcategories.filter((s: any) => String(s.category_id ?? s.category?.id) === String(selectedCategory))
  }, [subcategories, selectedCategory])

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this subcategory?')) return
    try {
      await deleteSubcategory(id)
      // refresh list after delete
      await mutate()
    } catch (err) {
      console.error('Failed to delete subcategory:', err)
    }
  }

  if (isLoading) return <div>Loading...</div>
  if (isError) return <div>Error loading subcategories</div>

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Subcategories</h2>
        <div className="flex items-center gap-3">
          <Select value={selectedCategory} onValueChange={(v) => setSelectedCategory(v)}>
            <SelectTrigger className="h-8 w-56">
              <SelectValue placeholder="Filter by category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories?.map((c: any) => (
                <SelectItem key={c.id} value={c.id.toString()}>
                  {c.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button onClick={() => onEdit(null)}>
            <Plus className="mr-2 h-4 w-4" />
            Add Subcategory
          </Button>
        </div>
      </div>

      <div className="grid gap-4">
  {filtered?.length === 0 && <div>No subcategories found.</div>}

  {filtered?.map((sc: Subcategory) => (
          <Card key={sc.id}>
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                <div>
                  <div className="font-semibold">{sc.name}</div>
                  <div className="text-sm text-muted-foreground">Parent: {sc.category?.name || '—'}</div>
                </div>

                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => onEdit(sc)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => handleDelete(sc.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm">Slug: {sc.slug}</p>
              <p className="text-sm text-muted-foreground">Created: {new Date(sc.created_at).toLocaleDateString()}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

export default SubcategoryList
