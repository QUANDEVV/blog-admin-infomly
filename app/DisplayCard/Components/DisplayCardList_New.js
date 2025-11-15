"use client"

import React, { useState } from 'react'
import { useDisplayCards, useDeleteDisplayCard } from '@/hooks/FeatureCard/useDisplayCards'
import { useCategories } from '@/hooks/Categories/useCategories'
import { useSubcategories } from '@/hooks/SubCategory/useSubcategories'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Pencil, Trash2, Eye, Filter } from 'lucide-react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

/**
 * DisplayCardList_New - Beautiful list UI inspired by CreateContent
 * Shows Display Cards with filters, stats, and clean table layout
 */
const DisplayCardList_New = ({ onEdit, showStats = true, onToggleStats }) => {
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [subcategoryFilter, setSubcategoryFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [sortBy, setSortBy] = useState('newest')

  const { categories } = useCategories()
  const { subcategories } = useSubcategories()
  
  const { display_cards, isLoading, mutate } = useDisplayCards()
  const { deleteDisplayCard } = useDeleteDisplayCard()

  const handleDelete = async (id, title) => {
    if (!confirm(`Are you sure you want to delete "${title}"?`)) return
    
    try {
      await deleteDisplayCard(id)
      mutate()
      alert('Display card deleted successfully')
    } catch (error) {
      alert(`Error deleting display card: ${error.message}`)
    }
  }

  const clearFilters = () => {
    setCategoryFilter('all')
    setSubcategoryFilter('all')
    setStatusFilter('all')
    setSortBy('newest')
  }

  const filteredSubcategories = categoryFilter && categoryFilter !== 'all'
    ? subcategories?.filter(sc => String(sc.category?.id ?? sc.category_id) === categoryFilter)
    : subcategories

  // Apply filters and sorting
  let filteredCards = Array.isArray(display_cards) ? display_cards : []
  
  if (categoryFilter && categoryFilter !== 'all') {
    filteredCards = filteredCards.filter(card => 
      String(card.subcategory?.category_id) === categoryFilter
    )
  }
  
  if (subcategoryFilter && subcategoryFilter !== 'all') {
    filteredCards = filteredCards.filter(card => 
      String(card.subcategory_id) === subcategoryFilter
    )
  }

  if (statusFilter && statusFilter !== 'all') {
    filteredCards = filteredCards.filter(card => card.status === statusFilter)
  }

  // Sort
  if (sortBy === 'newest') {
    filteredCards.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
  } else if (sortBy === 'oldest') {
    filteredCards.sort((a, b) => new Date(a.created_at) - new Date(b.created_at))
  } else if (sortBy === 'title') {
    filteredCards.sort((a, b) => a.title.localeCompare(b.title))
  }

  const total = filteredCards.length
  const published = filteredCards.filter(c => c.status === 'published').length
  const drafts = filteredCards.filter(c => c.status === 'draft').length

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading display cards...</p>
        </div>
      </div>
    )
  }

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
              <div className="text-3xl font-bold text-green-600">{published}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Drafts</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-yellow-600">{drafts}</div>
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
                <SelectItem value="draft">Drafts</SelectItem>
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
              </SelectContent>
            </Select>

            <Button variant="outline" size="sm" onClick={clearFilters} className="ml-auto">
              Clear
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Display Cards Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted/50 border-b-2">
                <tr>
                  <th className="px-4 py-4 text-left text-xs font-semibold uppercase tracking-wider">Image</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider">Title</th>
                  <th className="px-4 py-4 text-left text-xs font-semibold uppercase tracking-wider">Category</th>
                  <th className="px-4 py-4 text-left text-xs font-semibold uppercase tracking-wider">Status</th>
                  <th className="px-4 py-4 text-left text-xs font-semibold uppercase tracking-wider">Content</th>
                  <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredCards.length > 0 ? (
                  filteredCards.map((card) => (
                    <tr key={card.id} className="hover:bg-muted/30 transition-colors">
                      <td className="px-4 py-4">
                        {card.featured_image ? (
                          <img
                            src={card.featured_image}
                            alt={card.title || 'Featured image'}
                            className="h-12 w-12 object-cover rounded-md border"
                            loading="lazy"
                          />
                        ) : (
                          <div className="h-12 w-12 rounded-md bg-muted flex items-center justify-center text-xs text-muted-foreground">No image</div>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-semibold text-sm">{card.title}</div>
                        {card.excerpt && (
                          <div className="text-xs text-muted-foreground truncate max-w-xs mt-1">
                            {card.excerpt.substring(0, 60)}...
                          </div>
                        )}
                      </td>
                      <td className="px-4 py-4 text-sm font-medium">
                        <div>{card.subcategory?.category?.name || 'N/A'}</div>
                        <div className="text-xs text-muted-foreground">{card.subcategory?.name}</div>
                      </td>
                      <td className="px-4 py-4">
                        <Badge 
                          variant={card.status === 'published' ? 'default' : 'secondary'} 
                          className="text-xs font-semibold"
                        >
                          {card.status === 'published' ? '✅ Published' : '📝 Draft'}
                        </Badge>
                      </td>
                      <td className="px-4 py-4 text-xs font-medium">
                        {card.content_id ? (
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
                            onClick={() => onEdit(card)}
                            className="gap-1.5"
                          >
                            <Pencil className="h-3.5 w-3.5" />
                            Edit
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleDelete(card.id, card.title)}
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
                        <p className="text-muted-foreground font-medium">No display cards available</p>
                        <p className="text-sm text-muted-foreground">Create your first display card to get started!</p>
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

export default DisplayCardList_New
