"use client"

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Edit, Trash2, Plus, ChevronDown, ChevronRight, FolderOpen, Folder } from 'lucide-react'
import { useCategories, useCreateCategory, useUpdateCategory, useDeleteCategory } from '@/hooks/Categories/useCategories'
import { useSubcategories, useCreateSubcategory, useUpdateSubcategory, useDeleteSubcategory } from '@/hooks/SubCategory/useSubcategories'

const Page = () => {
  const { categories, isLoading, mutate } = useCategories()
  const { subcategories, mutate: mutateSubcategories } = useSubcategories()
  const { createCategory } = useCreateCategory()
  const { updateCategory } = useUpdateCategory()
  const { deleteCategory } = useDeleteCategory()
  const { createSubcategory } = useCreateSubcategory()
  const { updateSubcategory } = useUpdateSubcategory()
  const { deleteSubcategory } = useDeleteSubcategory()

  // State for expanded categories (show/hide subcategories)
  const [expandedCategories, setExpandedCategories] = useState({})
  
  // State for editing (null = not editing, {type, id, data} = editing)
  const [editing, setEditing] = useState(null)
  
  // State for adding new subcategory under a category
  const [addingSubcategoryTo, setAddingSubcategoryTo] = useState(null)
  
  // Form state
  const [formName, setFormName] = useState('')
  const [loading, setLoading] = useState(false)

  // Toggle category expansion
  const toggleCategory = (categoryId) => {
    setExpandedCategories(prev => ({
      ...prev,
      [categoryId]: !prev[categoryId]
    }))
  }

  // Handle create/update category
  const handleSaveCategory = async (e) => {
    e.preventDefault()
    if (!formName.trim()) return

    setLoading(true)
    try {
      if (editing?.type === 'category') {
        await updateCategory(editing.id, { name: formName.trim() })
      } else {
        await createCategory({ name: formName.trim() })
      }
      await mutate()
      setFormName('')
      setEditing(null)
    } catch (error) {
      console.error('Error saving category:', error)
      alert('Failed to save category')
    } finally {
      setLoading(false)
    }
  }

  // Handle create/update subcategory
  const handleSaveSubcategory = async (e, categoryId) => {
    e.preventDefault()
    if (!formName.trim()) return

    setLoading(true)
    try {
      if (editing?.type === 'subcategory') {
        await updateSubcategory(editing.id, { name: formName.trim(), category_id: categoryId })
      } else {
        await createSubcategory({ name: formName.trim(), category_id: categoryId })
      }
      await mutateSubcategories()
      setFormName('')
      setEditing(null)
      setAddingSubcategoryTo(null)
      // Expand the category to show the new subcategory
      setExpandedCategories(prev => ({ ...prev, [categoryId]: true }))
    } catch (error) {
      console.error('Error saving subcategory:', error)
      alert('Failed to save subcategory')
    } finally {
      setLoading(false)
    }
  }

  // Handle delete category
  const handleDeleteCategory = async (id) => {
    if (!confirm('Delete this category? All its subcategories will also be deleted.')) return
    
    try {
      await deleteCategory(id)
      await mutate()
    } catch (error) {
      console.error('Error deleting category:', error)
      alert('Failed to delete category')
    }
  }

  // Handle delete subcategory
  const handleDeleteSubcategory = async (id) => {
    if (!confirm('Delete this subcategory?')) return
    
    try {
      await deleteSubcategory(id)
      await mutateSubcategories()
    } catch (error) {
      console.error('Error deleting subcategory:', error)
      alert('Failed to delete subcategory')
    }
  }

  // Get subcategories for a specific category
  const getSubcategoriesForCategory = (categoryId) => {
    return subcategories.filter(sub => sub.category_id === categoryId)
  }

  if (isLoading) return <div className="p-6">Loading categories...</div>

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Category Management</h1>
          <p className="text-muted-foreground mt-1">Manage categories and their subcategories in one place</p>
        </div>
        <Button 
          onClick={() => {
            setEditing(null)
            setAddingSubcategoryTo(null)
            setFormName('')
          }}
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Category
        </Button>
      </div>

      {/* Add/Edit Category Form */}
      {(editing === null || editing?.type === 'category') && addingSubcategoryTo === null && (
        <Card>
          <CardHeader>
            <CardTitle>{editing?.type === 'category' ? 'Edit Category' : 'Add New Category'}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSaveCategory} className="flex gap-4">
              <div className="flex-1">
                <Input
                  placeholder="Category name..."
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  required
                />
              </div>
              <Button type="submit" disabled={loading}>
                {loading ? 'Saving...' : editing?.type === 'category' ? 'Update' : 'Create'}
              </Button>
              {editing?.type === 'category' && (
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => {
                    setEditing(null)
                    setFormName('')
                  }}
                >
                  Cancel
                </Button>
              )}
            </form>
          </CardContent>
        </Card>
      )}

      {/* Categories List with Nested Subcategories */}
      <div className="space-y-4">
        {categories?.map((category) => {
          const categorySubcategories = getSubcategoriesForCategory(category.id)
          const isExpanded = expandedCategories[category.id]
          const isAddingSubcategory = addingSubcategoryTo === category.id

          return (
            <Card key={category.id}>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 flex-1">
                    {/* Expand/Collapse Button */}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleCategory(category.id)}
                      className="h-8 w-8 p-0"
                    >
                      {isExpanded ? (
                        <ChevronDown className="h-4 w-4" />
                      ) : (
                        <ChevronRight className="h-4 w-4" />
                      )}
                    </Button>

                    {/* Category Icon */}
                    {isExpanded ? (
                      <FolderOpen className="h-5 w-5 text-primary" />
                    ) : (
                      <Folder className="h-5 w-5 text-muted-foreground" />
                    )}

                    {/* Category Name */}
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold">{category.name}</h3>
                      <p className="text-xs text-muted-foreground">
                        {categorySubcategories.length} subcategory{categorySubcategories.length !== 1 ? 's' : ''}
                      </p>
                    </div>

                    <Badge variant="outline">{category.slug}</Badge>
                  </div>

                  {/* Category Actions */}
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setAddingSubcategoryTo(category.id)
                        setEditing(null)
                        setFormName('')
                      }}
                    >
                      <Plus className="h-4 w-4 mr-1" />
                      Add Subcategory
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setEditing({ type: 'category', id: category.id, data: category })
                        setFormName(category.name)
                        setAddingSubcategoryTo(null)
                      }}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteCategory(category.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>

              {/* Add Subcategory Form (appears when "Add Subcategory" is clicked) */}
              {isAddingSubcategory && (
                <CardContent className="pt-0 pb-4 border-t">
                  <form onSubmit={(e) => handleSaveSubcategory(e, category.id)} className="flex gap-4 mt-4">
                    <div className="flex-1">
                      <Input
                        placeholder="New subcategory name..."
                        value={formName}
                        onChange={(e) => setFormName(e.target.value)}
                        required
                        autoFocus
                      />
                    </div>
                    <Button type="submit" disabled={loading} size="sm">
                      {loading ? 'Saving...' : 'Create'}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setAddingSubcategoryTo(null)
                        setFormName('')
                      }}
                    >
                      Cancel
                    </Button>
                  </form>
                </CardContent>
              )}

              {/* Subcategories List (collapsible) */}
              {isExpanded && categorySubcategories.length > 0 && (
                <CardContent className="pt-0">
                  <div className="space-y-2 ml-11">
                    {categorySubcategories.map((subcategory) => (
                      <div
                        key={subcategory.id}
                        className="flex items-center justify-between p-3 rounded-lg border bg-muted/50 hover:bg-muted transition-colors"
                      >
                        {/* Edit Mode */}
                        {editing?.type === 'subcategory' && editing?.id === subcategory.id ? (
                          <form 
                            onSubmit={(e) => handleSaveSubcategory(e, category.id)} 
                            className="flex gap-2 flex-1"
                          >
                            <Input
                              value={formName}
                              onChange={(e) => setFormName(e.target.value)}
                              required
                              autoFocus
                              className="flex-1"
                            />
                            <Button type="submit" size="sm" disabled={loading}>
                              {loading ? 'Saving...' : 'Update'}
                            </Button>
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setEditing(null)
                                setFormName('')
                              }}
                            >
                              Cancel
                            </Button>
                          </form>
                        ) : (
                          <>
                            {/* View Mode */}
                            <div className="flex-1">
                              <p className="font-medium">{subcategory.name}</p>
                              <p className="text-xs text-muted-foreground">{subcategory.slug}</p>
                            </div>
                            <div className="flex gap-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                  setEditing({ type: 'subcategory', id: subcategory.id, data: subcategory })
                                  setFormName(subcategory.name)
                                  setAddingSubcategoryTo(null)
                                }}
                              >
                                <Edit className="h-3 w-3" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDeleteSubcategory(subcategory.id)}
                              >
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            </div>
                          </>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              )}

              {/* Empty state when expanded but no subcategories */}
              {isExpanded && categorySubcategories.length === 0 && !isAddingSubcategory && (
                <CardContent className="pt-0">
                  <div className="ml-11 p-4 text-center text-sm text-muted-foreground border rounded-lg border-dashed">
                    No subcategories yet. Click "Add Subcategory" to create one.
                  </div>
                </CardContent>
              )}
            </Card>
          )
        })}
      </div>

      {/* Empty state */}
      {categories?.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <Folder className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-semibold mb-2">No categories yet</h3>
            <p className="text-muted-foreground mb-4">Create your first category to get started</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

export default Page