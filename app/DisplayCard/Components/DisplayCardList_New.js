"use client"

import React, { useState } from 'react'
import { useDisplayCards, useDeleteDisplayCard } from '@/hooks/FeatureCard/useDisplayCards'
import { useCategories } from '@/hooks/Categories/useCategories'
import { useSubcategories } from '@/hooks/SubCategory/useSubcategories'
import { useAnalytics } from '@/hooks/Analytics/useAnalytics'
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
  const [sortBy, setSortBy] = useState('oldest') // Default to oldest first
  const [currentPage, setCurrentPage] = useState(1) // Pagination state

  const { categories } = useCategories()
  const { subcategories } = useSubcategories()

  const { display_cards, isLoading, mutate, pagination } = useDisplayCards(currentPage)
  const { deleteDisplayCard } = useDeleteDisplayCard()

  // Use analytics hook with filters - recalculates stats when category/subcategory changes
  const { stats, isLoading: statsLoading, hasFilters } = useAnalytics(
    categoryFilter !== 'all' ? categoryFilter : null,
    subcategoryFilter !== 'all' ? subcategoryFilter : null
  )

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
    setSortBy('oldest') // Reset to default (oldest first)
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

  // Use pagination total for overall count, filtered length for current view
  const total = pagination?.total || filteredCards.length
  const currentPageCount = filteredCards.length
  const published = filteredCards.filter(c => c.status === 'published').length
  const drafts = filteredCards.filter(c => c.status === 'draft').length
  const scheduled = filteredCards.filter(c => c.status === 'scheduled').length

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
      {/* Stats Panel - Mobile Optimized with Filter-Aware Analytics */}
      {showStats && (
        <>
          {/* Filter Badge - Shows when category/subcategory is selected */}
          {hasFilters && stats?.filter_applied && (
            <Card className="border-blue-500 border-2">
              <CardContent className="py-2 px-4">
                <div className="flex items-center gap-2 text-sm">
                  <Filter className="h-4 w-4 text-blue-600" />
                  <span className="font-semibold text-blue-600">
                    Filtered by: {stats.filter_applied.type === 'subcategory'
                      ? `${stats.filter_applied.category_name} > ${stats.filter_applied.subcategory_name}`
                      : stats.filter_applied.category_name}
                  </span>
                </div>
              </CardContent>
            </Card>
          )}

          <div className="overflow-x-auto pb-2">
            <div className="flex gap-3 min-w-max md:grid md:grid-cols-5 md:min-w-0">
              <Card className="min-w-[140px] md:min-w-0">
                <CardHeader className="pb-2 px-4 pt-3">
                  <CardTitle className="text-xs font-medium text-muted-foreground">
                    {hasFilters ? 'Filtered Cards' : 'Total Cards'}
                  </CardTitle>
                </CardHeader>
                <CardContent className="px-4 pb-3">
                  <div className="text-2xl md:text-3xl font-bold">{total}</div>
                  {hasFilters && (
                    <div className="text-xs text-muted-foreground mt-1">
                      {stats?.article_counts?.total || 0} total articles
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card className="min-w-[140px] md:min-w-0">
                <CardHeader className="pb-2 px-4 pt-3">
                  <CardTitle className="text-xs font-medium text-muted-foreground">Total Words</CardTitle>
                </CardHeader>
                <CardContent className="px-4 pb-3">
                  <div className="text-2xl md:text-3xl font-bold">{stats?.word_counts?.total?.toLocaleString() || 0}</div>
                </CardContent>
              </Card>

              <Card className="min-w-[140px] md:min-w-0">
                <CardHeader className="pb-2 px-4 pt-3">
                  <CardTitle className="text-xs font-medium text-muted-foreground">Published Words</CardTitle>
                </CardHeader>
                <CardContent className="px-4 pb-3">
                  <div className="text-2xl md:text-3xl font-bold text-green-600">{stats?.word_counts?.published?.toLocaleString() || 0}</div>
                  {hasFilters && (
                    <div className="text-xs text-muted-foreground mt-1">
                      {stats?.article_counts?.published || 0} published
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card className="min-w-[140px] md:min-w-0">
                <CardHeader className="pb-2 px-4 pt-3">
                  <CardTitle className="text-xs font-medium text-muted-foreground">Scheduled</CardTitle>
                </CardHeader>
                <CardContent className="px-4 pb-3">
                  <div className="text-2xl md:text-3xl font-bold text-blue-600">{scheduled}</div>
                </CardContent>
              </Card>

              <Card className="min-w-[140px] md:min-w-0">
                <CardHeader className="pb-2 px-4 pt-3">
                  <CardTitle className="text-xs font-medium text-muted-foreground">Draft Words</CardTitle>
                </CardHeader>
                <CardContent className="px-4 pb-3">
                  <div className="text-2xl md:text-3xl font-bold text-amber-600">{stats?.word_counts?.draft?.toLocaleString() || 0}</div>
                  {hasFilters && (
                    <div className="text-xs text-muted-foreground mt-1">
                      {stats?.article_counts?.draft || 0} drafts
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card className="min-w-[140px] md:min-w-0">
                <CardHeader className="pb-2 px-4 pt-3">
                  <CardTitle className="text-xs font-medium text-muted-foreground">
                    {hasFilters ? 'Filtered Drafts' : 'Draft Cards'}
                  </CardTitle>
                </CardHeader>
                <CardContent className="px-4 pb-3">
                  <div className="text-2xl md:text-3xl font-bold text-yellow-600">{drafts}</div>
                </CardContent>
              </Card>
            </div>
          </div>
        </>
      )}

      {/* ========================================
          READING PROGRESS ANALYTICS - START
          ========================================
          
          Purpose: Convert total word count into book reading equivalents
          Type: BACKEND CALCULATION (from AnalyticsController)
          
          Metrics Used:
          - 300 words = 1 page
          - 90,000 words = 1 book
          
          Data Source:
          - stats.reading_equivalents (from backend /api/admin/analytics)
          - Automatically filters by category/subcategory when selected
          
          Features:
          - Shows overall stats when no filters
          - Shows category-specific stats when category selected
          - Shows subcategory-specific stats when subcategory selected
          - Real-time content authority tracking per niche
          
          ======================================== */}
      {showStats && (
        <Card className="border-dashed">
          <CardContent className="py-3 px-4">
            <div className="flex flex-col md:flex-row md:items-center gap-3 md:gap-6 text-xs text-muted-foreground">
              <span className="font-medium">📖 Reading Progress:</span>
              <span>
                300 words = 1 page
              </span>
              <span className="hidden md:inline">•</span>
              <span>
                You have written {(stats?.reading_equivalents?.pages || 0).toLocaleString()} pages
                {hasFilters && ` in ${stats?.filter_applied?.type === 'subcategory' ? stats?.filter_applied?.subcategory_name : stats?.filter_applied?.category_name}`}
              </span>
              <span className="hidden md:inline">•</span>
              <span className="font-semibold text-blue-600">
                {stats?.reading_equivalents?.books || '0.00'} books
                {hasFilters && ` (${stats?.filter_applied?.type === 'subcategory' ? 'Subcategory' : 'Category'} Authority)`}
              </span>
            </div>
          </CardContent>
        </Card>
      )}
      {/* ========================================
          READING PROGRESS ANALYTICS - END
          ======================================== */}

      {/* Filters - Collapsible on Mobile */}
      <Card>
        <CardContent className="pt-4 md:pt-6">
          <div className="flex flex-col md:flex-row md:items-center gap-3">
            <div className="flex items-center gap-2 text-sm font-semibold text-muted-foreground">
              <Filter className="h-4 w-4" />
              <span className="hidden md:inline">Filters:</span>
            </div>

            <div className="grid grid-cols-2 md:flex md:flex-row gap-2 md:gap-3 flex-1">
              <Select value={categoryFilter} onValueChange={(value) => {
                setCategoryFilter(value)
                if (value !== categoryFilter) {
                  setSubcategoryFilter('all')
                }
              }}>
                <SelectTrigger className="w-full md:w-[160px]">
                  <SelectValue placeholder="Category" />
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
                <SelectTrigger className="w-full md:w-[160px]">
                  <SelectValue placeholder="Subcategory" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Subcategories</SelectItem>
                  {filteredSubcategories?.map((sub) => (
                    <SelectItem key={sub.id} value={sub.id.toString()}>{sub.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full md:w-[120px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="published">Published</SelectItem>
                  <SelectItem value="scheduled">Scheduled</SelectItem>
                  <SelectItem value="draft">Drafts</SelectItem>
                </SelectContent>
              </Select>

              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-full md:w-[140px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Newest First</SelectItem>
                  <SelectItem value="oldest">Oldest First</SelectItem>
                  <SelectItem value="title">Title A-Z</SelectItem>
                </SelectContent>
              </Select>

              <Button variant="outline" size="sm" onClick={clearFilters} className="col-span-2 md:col-span-1 md:ml-auto">
                Clear
              </Button>
            </div>
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
                          variant={card.status === 'published' ? 'default' : card.status === 'scheduled' ? 'outline' : 'secondary'}
                          className="text-xs font-semibold"
                        >
                          {card.status === 'published' ? '✅ Published' : card.status === 'scheduled' ? '⏰ Scheduled' : '📝 Draft'}
                        </Badge>
                        {card.status === 'scheduled' && card.published_at && (
                          <div className="text-[10px] text-muted-foreground mt-1">
                            {new Date(card.published_at).toLocaleString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                          </div>
                        )}
                      </td>
                      <td className="px-4 py-4 text-xs font-medium">
                        {card.content ? (
                          <div className="flex items-center gap-3">
                            <span className="text-green-600 flex items-center gap-1">
                              <span className="h-2 w-2 bg-green-600 rounded-full"></span>
                              Linked
                            </span>
                            <div className="text-sm text-muted-foreground">{card.content?.word_count ? Number(card.content.word_count).toLocaleString() : '—'} words</div>
                          </div>
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

      {/* Pagination Controls */}
      {pagination && pagination.last_page > 1 && (
        <Card>
          <CardContent className="py-4">
            <div className="flex items-center justify-between">
              <div className="text-sm text-muted-foreground">
                Showing <span className="font-semibold">{((pagination.current_page - 1) * pagination.per_page) + 1}</span> to{' '}
                <span className="font-semibold">
                  {Math.min(pagination.current_page * pagination.per_page, pagination.total)}
                </span>{' '}
                of <span className="font-semibold">{pagination.total}</span> results
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(1)}
                  disabled={pagination.current_page === 1}
                >
                  First
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={pagination.current_page === 1}
                >
                  Previous
                </Button>
                <div className="flex items-center gap-1">
                  {[...Array(pagination.last_page)].map((_, idx) => {
                    const pageNum = idx + 1
                    // Show first 2, last 2, and current +/- 1 pages
                    if (
                      pageNum === 1 ||
                      pageNum === 2 ||
                      pageNum === pagination.last_page ||
                      pageNum === pagination.last_page - 1 ||
                      Math.abs(pageNum - pagination.current_page) <= 1
                    ) {
                      return (
                        <Button
                          key={pageNum}
                          variant={pagination.current_page === pageNum ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => setCurrentPage(pageNum)}
                          className="min-w-[40px]"
                        >
                          {pageNum}
                        </Button>
                      )
                    } else if (
                      pageNum === 3 && pagination.current_page > 4 ||
                      pageNum === pagination.last_page - 2 && pagination.current_page < pagination.last_page - 3
                    ) {
                      return <span key={pageNum} className="px-2">...</span>
                    }
                    return null
                  })}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(prev => Math.min(pagination.last_page, prev + 1))}
                  disabled={pagination.current_page === pagination.last_page}
                >
                  Next
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(pagination.last_page)}
                  disabled={pagination.current_page === pagination.last_page}
                >
                  Last
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

export default DisplayCardList_New
