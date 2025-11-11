"use client"

import React, { useState } from 'react'
import { useContents, useDeleteContent } from '@/hooks/CreateContent/useCreateContent'
import { useCategories } from '@/hooks/Categories/useCategories'
import { useSubcategories } from '@/hooks/SubCategory/useSubcategories'
import { useAuthors } from '@/hooks/Authors/useAuthors'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Pencil, Trash2, Eye, Filter } from 'lucide-react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

/**
 * ContentList - Display and manage all contents with edit/delete capabilities
 * Note: This component only displays the list. Editing happens in the parent's ContentForm.
 */
const ContentList = ({ onEdit, showStats = true, onToggleStats }) => {
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [subcategoryFilter, setSubcategoryFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [authorFilter, setAuthorFilter] = useState('all')
  const [sortBy, setSortBy] = useState('newest')

  const { categories } = useCategories()
  const { subcategories } = useSubcategories()
  const { authors } = useAuthors()
  
  // Build query params (skip 'all' values)
  const params = new URLSearchParams()
  if (categoryFilter && categoryFilter !== 'all') params.append('category_id', categoryFilter)
  if (subcategoryFilter && subcategoryFilter !== 'all') params.append('subcategory_id', subcategoryFilter)
  if (statusFilter && statusFilter !== 'all') params.append('status', statusFilter)
  if (authorFilter && authorFilter !== 'all') params.append('author_id', authorFilter)
  if (sortBy) params.append('sort_by', sortBy)
  
  const { contents, isLoading, mutate } = useContents(params.toString())
  const { deleteContent } = useDeleteContent()

  const handleDelete = async (id, title) => {
    if (!confirm(`Are you sure you want to delete "${title}"?`)) return
    
    try {
      await deleteContent(id)
      mutate()
      alert('Content deleted successfully')
    } catch (error) {
      alert(`Error deleting content: ${error.message}`)
    }
  }

  const clearFilters = () => {
    setCategoryFilter('all')
    setSubcategoryFilter('all')
    setStatusFilter('all')
    setAuthorFilter('all')
    setSortBy('newest')
  }

  const filteredSubcategories = categoryFilter && categoryFilter !== 'all'
    ? subcategories?.filter(sc => String(sc.category?.id ?? sc.category_id) === categoryFilter)
    : subcategories

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading contents...</p>
        </div>
      </div>
    )
  }

  if (!contents) {
    return (
      <Card>
        <CardContent className="py-10 text-center">
          <p className="text-muted-foreground">No contents found.</p>
        </CardContent>
      </Card>
    )
  }

  const contentsList = (typeof contents === 'object' && contents !== null && 'contents' in contents)
    ? contents.contents
    : contents

  const total = Array.isArray(contentsList) ? contentsList.length : 0

  return (
    <div className="space-y-6">
      {/* Stats Panel */}
      {showStats && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{total}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Published</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600">
                {Array.isArray(contentsList) ? contentsList.filter(c => c.status === 'published').length : 0}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Drafts</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-yellow-600">
                {Array.isArray(contentsList) ? contentsList.filter(c => c.status === 'draft').length : 0}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Filters - Single Row */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-3 flex-wrap">
            <div className="flex items-center gap-2 text-sm font-semibold text-muted-foreground">
              <Filter className="h-4 w-4" />
              <span>Filters:</span>
            </div>
            
            <Select value={categoryFilter} onValueChange={(value) => {
              setCategoryFilter(value)
              if (value !== categoryFilter) {
                setSubcategoryFilter('all')
              }
            }}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories?.map(cat => (
                  <SelectItem key={cat.id} value={cat.id.toString()}>
                    {cat.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Select value={subcategoryFilter} onValueChange={setSubcategoryFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="All Subcategories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Subcategories</SelectItem>
                {filteredSubcategories?.map((sub) => (
                  <SelectItem key={sub.id} value={sub.id.toString()}>{sub.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="published">Published</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
              </SelectContent>
            </Select>

            <Select value={authorFilter} onValueChange={setAuthorFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="All Authors" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Authors</SelectItem>
                {authors?.map((author) => (
                  <SelectItem key={author.id} value={author.id.toString()}>{author.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-[160px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest First</SelectItem>
                <SelectItem value="oldest">Oldest First</SelectItem>
                <SelectItem value="title">Title A-Z</SelectItem>
                <SelectItem value="author">Author A-Z</SelectItem>
              </SelectContent>
            </Select>

            <Button variant="outline" size="sm" onClick={clearFilters} className="ml-auto">
              Clear
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Contents Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted/50 border-b-2">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider">Title</th>
                  <th className="px-4 py-4 text-left text-xs font-semibold uppercase tracking-wider">Slug</th>
                  <th className="px-4 py-4 text-left text-xs font-semibold uppercase tracking-wider">Author</th>
                  <th className="px-4 py-4 text-left text-xs font-semibold uppercase tracking-wider">Status</th>
                  <th className="px-4 py-4 text-left text-xs font-semibold uppercase tracking-wider">Card</th>
                  <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {Array.isArray(contentsList) && contentsList.length > 0 ? (
                  contentsList.map((content) => (
                    <tr key={content.id} className="hover:bg-muted/30 transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-semibold text-sm">{content.title}</div>
                        {content.excerpt && (
                          <div className="text-xs text-muted-foreground truncate max-w-xs mt-1">
                            {content.excerpt.substring(0, 60)}...
                          </div>
                        )}
                      </td>
                      <td className="px-4 py-4">
                        <code className="text-xs bg-muted/70 px-2 py-1 rounded font-mono" title={content.slug}>
                          {content.slug.substring(0, 20)}{content.slug.length > 20 ? '...' : ''}
                        </code>
                      </td>
                      <td className="px-4 py-4 text-sm font-medium">
                        {content.author?.name || 'N/A'}
                      </td>
                      <td className="px-4 py-4">
                        <Badge 
                          variant={content.status === 'published' ? 'default' : 'secondary'} 
                          className="text-xs font-semibold"
                        >
                          {content.status === 'published' ? '✅ Published' : '📝 Draft'}
                        </Badge>
                      </td>
                      <td className="px-4 py-4 text-xs font-medium">
                        {content.display_card ? (
                          <span className="text-green-600 flex items-center gap-1">
                            <span className="h-2 w-2 bg-green-600 rounded-full"></span>
                            Linked
                          </span>
                        ) : (
                          <span className="text-muted-foreground">—</span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => onEdit(content)}
                            className="gap-1.5"
                          >
                            <Pencil className="h-3.5 w-3.5" />
                            Edit
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleDelete(content.id, content.title)}
                            className="gap-1.5"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                            Delete
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="px-6 py-16 text-center">
                      <div className="flex flex-col items-center gap-3">
                        <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center">
                          <Eye className="h-6 w-6 text-muted-foreground" />
                        </div>
                        <p className="text-muted-foreground font-medium">No contents available</p>
                        <p className="text-sm text-muted-foreground">Create your first content to get started!</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default ContentList