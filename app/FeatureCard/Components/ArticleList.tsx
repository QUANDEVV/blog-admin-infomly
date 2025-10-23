"use client"

import React from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Edit, Trash2, Plus, Eye, ChevronDown, ChevronUp } from 'lucide-react'
import { useArticles, useDeleteArticle } from '@/hooks/Articles/useArticles'
import { z } from 'zod'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { MoreVerticalIcon } from 'lucide-react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

// Define the article schema for the data table
export const articleSchema = z.object({
  id: z.number(),
  title: z.string(),
  excerpt: z.string(),
  category: z.object({
    id: z.number(),
    name: z.string(),
  }),
  featured_image: z.string().optional(),
  created_at: z.string(),
  status: z.string().optional(), // Assuming status is available
})

// Type for the article
type Article = z.infer<typeof articleSchema>

const ArticleList: React.FC<{
  onEdit: (article: Article | null) => void
  filters?: { category: string; search: string; sort: string }
}> = ({ onEdit, filters }) => {
  const { articles, isLoading, isError, mutate } = useArticles()
  const { deleteArticle } = useDeleteArticle()

  // Transform articles data to match schema
  const transformedArticles = React.useMemo(() => {
    if (!articles) return []
    return articles.map((article: any) => ({
      ...article,
      status: article.status || 'published', // Default status if not available
    }))
  }, [articles])

  const handleDelete = async (id: number) => {
    if (confirm('Are you sure you want to delete this article?')) {
      try {
        await deleteArticle(id)
        mutate() // Refresh the list after deletion
      } catch (error) {
        console.error('Error deleting article:', error)
      }
    }
  }

  if (isLoading) return <div className="p-6">Loading articles...</div>
  if (isError) return <div className="p-6">Error loading articles</div>

  return (
    <div className="space-y-4">
      <ArticleTable
        data={transformedArticles}
        onEdit={onEdit}
        onDelete={handleDelete}
        filters={filters}
      />
    </div>
  )
}

export default ArticleList

// ArticleTable component with advanced features
const ArticleTable: React.FC<{
  data: Article[]
  onEdit: (article: Article | null) => void
  onDelete: (id: number) => void
  filters?: { category: string; search: string; sort: string }
}> = ({ data, onEdit, onDelete, filters }) => {
  const [selectedRows, setSelectedRows] = React.useState<number[]>([])
  const [sortConfig, setSortConfig] = React.useState<{
    key: keyof Article | 'category.name'
    direction: 'asc' | 'desc'
  } | null>(null)
  const [currentPage, setCurrentPage] = React.useState(1)
  const [pageSize, setPageSize] = React.useState(10)

  // Filter data based on props
  const filteredData = React.useMemo(() => {
    if (!data) return []

    let filtered = data.filter((article) => {
      // Category filter
      if (filters?.category && filters.category !== 'all' && article.category?.id !== parseInt(filters.category)) {
        return false
      }

      // Search filter
      if (filters?.search && !article.title.toLowerCase().includes(filters.search.toLowerCase())) {
        return false
      }

      return true
    })

    return filtered
  }, [data, filters])

  // Sort data
  const sortedData = React.useMemo(() => {
    if (!sortConfig) return filteredData

    return [...filteredData].sort((a, b) => {
      let aValue: any, bValue: any

      if (sortConfig.key === 'category.name') {
        aValue = a.category?.name || ''
        bValue = b.category?.name || ''
      } else {
        aValue = a[sortConfig.key]
        bValue = b[sortConfig.key]
      }

      if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1
      if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1
      return 0
    })
  }, [filteredData, sortConfig])

  // Paginate data
  const paginatedData = React.useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize
    return sortedData.slice(startIndex, startIndex + pageSize)
  }, [sortedData, currentPage, pageSize])

  const totalPages = Math.ceil(sortedData.length / pageSize)

  const handleSort = (key: keyof Article | 'category.name') => {
    setSortConfig(current => {
      if (current?.key === key) {
        return {
          key,
          direction: current.direction === 'asc' ? 'desc' : 'asc'
        }
      }
      return { key, direction: 'asc' }
    })
  }

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedRows(paginatedData.map(article => article.id))
    } else {
      setSelectedRows([])
    }
  }

  const handleSelectRow = (id: number, checked: boolean) => {
    if (checked) {
      setSelectedRows(prev => [...prev, id])
    } else {
      setSelectedRows(prev => prev.filter(rowId => rowId !== id))
    }
  }

  const SortButton: React.FC<{ columnKey: keyof Article | 'category.name'; children: React.ReactNode }> = ({ columnKey, children }) => (
    <Button
      variant="ghost"
      onClick={() => handleSort(columnKey)}
      className="h-auto p-0 font-medium hover:bg-transparent"
    >
      {children}
      {sortConfig?.key === columnKey && (
        sortConfig.direction === 'asc' ? <ChevronUp className="ml-1 h-4 w-4" /> : <ChevronDown className="ml-1 h-4 w-4" />
      )}
    </Button>
  )

  return (
    <div className="space-y-4">
      {/* Table Controls */}
      <div className="flex items-center justify-between py-2 px-3">
        <div className="flex items-center gap-2">
          <Select value={pageSize.toString()} onValueChange={(value) => setPageSize(Number(value))}>
            <SelectTrigger className="h-8 w-16 text-sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="5">5</SelectItem>
              <SelectItem value="10">10</SelectItem>
              <SelectItem value="20">20</SelectItem>
              <SelectItem value="50">50</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="text-sm text-muted-foreground">
          {selectedRows.length} of {sortedData.length} selected
        </div>
      </div>

      {/* Table */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">
                <Checkbox
                  checked={paginatedData.length > 0 && selectedRows.length === paginatedData.length}
                  onCheckedChange={handleSelectAll}
                />
              </TableHead>
              <TableHead className="w-20">Image</TableHead>
              <TableHead>
                <SortButton columnKey="title">Title</SortButton>
              </TableHead>
              <TableHead>
                <SortButton columnKey="category.name">Category</SortButton>
              </TableHead>
              <TableHead>
                <SortButton columnKey="status">Status</SortButton>
              </TableHead>
              <TableHead>
                <SortButton columnKey="created_at">Created</SortButton>
              </TableHead>
              <TableHead className="w-12">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedData.map((article) => (
              <TableRow key={article.id}>
                <TableCell>
                  <Checkbox
                    checked={selectedRows.includes(article.id)}
                    onCheckedChange={(checked) => handleSelectRow(article.id, !!checked)}
                  />
                </TableCell>
                <TableCell className="w-20 pr-4">
                  <div className="flex items-center">
                    {article.featured_image ? (
                      <img
                        src={article.featured_image}
                        alt={article.title}
                        className="w-16 h-10 object-cover rounded mr-3"
                      />
                    ) : (
                      <div className="w-16 h-10 bg-muted rounded mr-3" />
                    )}
                  </div>
                </TableCell>
                <TableCell className="font-medium max-w-xs pl-0">
                  <div className="truncate" title={article.title}>
                    {article.title}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className="text-xs">
                    {article.category?.name || 'Uncategorized'}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge
                    variant={article.status === 'published' ? 'default' : 'secondary'}
                    className="text-xs"
                  >
                    {article.status || 'Published'}
                  </Badge>
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {new Date(article.created_at).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreVerticalIcon className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => onEdit(article)}>
                        <Edit className="mr-2 h-4 w-4" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Eye className="mr-2 h-4 w-4" />
                        View
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => onDelete(article.id)}
                        className="text-red-600"
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          Showing {((currentPage - 1) * pageSize) + 1} to {Math.min(currentPage * pageSize, sortedData.length)} of {sortedData.length} articles
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            Previous
          </Button>
          <div className="flex items-center gap-1">
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              const pageNum = Math.max(1, Math.min(totalPages - 4, currentPage - 2)) + i
              return (
                <Button
                  key={pageNum}
                  variant={pageNum === currentPage ? "default" : "outline"}
                  size="sm"
                  onClick={() => setCurrentPage(pageNum)}
                  className="w-8 h-8 p-0"
                >
                  {pageNum}
                </Button>
              )
            })}
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  )
}