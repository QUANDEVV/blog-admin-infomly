"use client"

import React from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Edit, Trash2, Plus, Eye, ChevronDown, ChevronUp } from 'lucide-react'
import { useDisplayCards, useDeleteDisplayCard } from '@/hooks/FeatureCard/useDisplayCards'
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

export const displayCardSchema = z.object({
  id: z.number(),
  title: z.string(),
  excerpt: z.string(),
  subcategory: z.object({
    id: z.number(),
    name: z.string(),
  }).optional(),
  featured_image: z.string().optional(),
  created_at: z.string(),
  published_at: z.string().optional(),
  updated_at: z.string().optional(),
})

type DisplayCard = z.infer<typeof displayCardSchema>

const DisplayCardList: React.FC<{
  onEdit: (displayCard: DisplayCard | null) => void
  filters?: { category?: string; subcategory?: string; search?: string; sort?: string }
}> = ({ onEdit, filters }) => {
  const { display_cards, isLoading, isError, mutate } = useDisplayCards()
  const { deleteDisplayCard } = useDeleteDisplayCard()

  const transformed = React.useMemo(() => {
    if (!display_cards) return []
    return display_cards.map((d: any) => ({
      ...d,
      published_at: d.published_at || d.created_at,
      updated_at: d.updated_at || d.updated_at,
    }))
  }, [display_cards])

  const handleDelete = async (id: number) => {
    if (confirm('Are you sure you want to delete this display card?')) {
      try {
        await deleteDisplayCard(id)
        mutate()
      } catch (error) {
        console.error('Error deleting display card:', error)
      }
    }
  }

  if (isLoading) return <div className="p-6">Loading display cards...</div>
  if (isError) return <div className="p-6">Error loading display cards</div>

  return (
    <div className="space-y-4">
      <DisplayCardTable data={transformed} onEdit={onEdit} onDelete={handleDelete} filters={filters} />
    </div>
  )
}

export default DisplayCardList

const DisplayCardTable: React.FC<{
  data: DisplayCard[]
  onEdit: (displayCard: DisplayCard | null) => void
  onDelete: (id: number) => void
  filters?: { category?: string; subcategory?: string; search?: string; sort?: string }
}> = ({ data, onEdit, onDelete, filters }) => {
  const [selectedRows, setSelectedRows] = React.useState<number[]>([])
  const [sortConfig, setSortConfig] = React.useState<{
    key: keyof DisplayCard | 'subcategory.name'
    direction: 'asc' | 'desc'
  } | null>(null)
  const [currentPage, setCurrentPage] = React.useState(1)
  const [pageSize, setPageSize] = React.useState(10)

  const filteredData = React.useMemo(() => {
    if (!data) return []

    let filtered = data.filter((item) => {
      // Determine item's category id from nested relations if present
      const itemAny = item as any
      const itemCategoryId = itemAny.subcategory?.category?.id ?? itemAny.subcategory?.category_id

      // Category filter: if provided and not 'all', require match
      if (filters?.category && filters.category !== 'all') {
        if (!itemCategoryId || String(itemCategoryId) !== String(filters.category)) return false
      }

      // Subcategory filter: if provided and not 'all', require match
      if (filters?.subcategory && filters.subcategory !== 'all') {
        if (!item.subcategory || item.subcategory.id !== parseInt(filters.subcategory)) return false
      }

      if (filters?.search && !item.title.toLowerCase().includes(filters.search.toLowerCase())) return false
      return true
    })

    return filtered
  }, [data, filters])

  // Reset pagination when filters change
  React.useEffect(() => {
    setCurrentPage(1)
  }, [filters])

  const sortedData = React.useMemo(() => {
    if (!sortConfig) return filteredData
    return [...filteredData].sort((a, b) => {
      let aValue: any, bValue: any
      if (sortConfig.key === 'subcategory.name') {
        aValue = a.subcategory?.name || ''
        bValue = b.subcategory?.name || ''
      } else {
        aValue = (a as any)[sortConfig.key]
        bValue = (b as any)[sortConfig.key]
      }
      if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1
      if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1
      return 0
    })
  }, [filteredData, sortConfig])

  const paginatedData = React.useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize
    return sortedData.slice(startIndex, startIndex + pageSize)
  }, [sortedData, currentPage, pageSize])

  const totalPages = Math.ceil(sortedData.length / pageSize)

  const handleSort = (key: keyof DisplayCard | 'subcategory.name') => {
    setSortConfig(current => {
      if (current?.key === key) return { key, direction: current.direction === 'asc' ? 'desc' : 'asc' }
      return { key, direction: 'asc' }
    })
  }

  const handleSelectAll = (checked: boolean) => {
    if (checked) setSelectedRows(paginatedData.map(item => item.id))
    else setSelectedRows([])
  }

  const handleSelectRow = (id: number, checked: boolean) => {
    if (checked) setSelectedRows(prev => [...prev, id])
    else setSelectedRows(prev => prev.filter(rowId => rowId !== id))
  }

  const SortButton: React.FC<{ columnKey: keyof DisplayCard | 'subcategory.name'; children: React.ReactNode }> = ({ columnKey, children }) => (
    <Button variant="ghost" onClick={() => handleSort(columnKey)} className="h-auto p-0 font-medium hover:bg-transparent">
      {children}
      {sortConfig?.key === columnKey && (sortConfig.direction === 'asc' ? <ChevronUp className="ml-1 h-4 w-4" /> : <ChevronDown className="ml-1 h-4 w-4" />)}
    </Button>
  )

  return (
    <div className="space-y-4">
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
        <div className="text-sm text-muted-foreground">{selectedRows.length} of {sortedData.length} selected</div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">
                <Checkbox checked={paginatedData.length > 0 && selectedRows.length === paginatedData.length} onCheckedChange={handleSelectAll} />
              </TableHead>
              <TableHead className="w-20">Image</TableHead>
              <TableHead><SortButton columnKey="title">Title</SortButton></TableHead>
              <TableHead><SortButton columnKey="subcategory.name">Subcategory</SortButton></TableHead>
              <TableHead><SortButton columnKey="published_at">Published</SortButton></TableHead>
              <TableHead><SortButton columnKey="updated_at">Updated</SortButton></TableHead>
              <TableHead className="w-12">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedData.map((item) => (
              <TableRow key={item.id}>
                <TableCell>
                  <Checkbox checked={selectedRows.includes(item.id)} onCheckedChange={(checked) => handleSelectRow(item.id, !!checked)} />
                </TableCell>
                <TableCell className="w-20 pr-4">
                  <div className="flex items-center">
                    {item.featured_image ? <img src={item.featured_image} alt={item.title} className="w-16 h-10 object-cover rounded mr-3" /> : <div className="w-16 h-10 bg-muted rounded mr-3" />}
                  </div>
                </TableCell>
                <TableCell className="font-medium max-w-xs pl-0"><div className="truncate" title={item.title}>{item.title}</div></TableCell>
                <TableCell><Badge variant="outline" className="text-xs">{item.subcategory?.name || 'Uncategorized'}</Badge></TableCell>
                <TableCell className="text-sm text-muted-foreground">{item.published_at ? new Date(item.published_at).toLocaleString() : '-'}</TableCell>
                <TableCell className="text-sm text-muted-foreground">{item.updated_at ? new Date(item.updated_at).toLocaleString() : '-'}</TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8"><MoreVerticalIcon className="h-4 w-4" /></Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => onEdit(item)}><Edit className="mr-2 h-4 w-4" />Edit</DropdownMenuItem>
                      <DropdownMenuItem><Eye className="mr-2 h-4 w-4" />View</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onDelete(item.id)} className="text-red-600"><Trash2 className="mr-2 h-4 w-4" />Delete</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">Showing {((currentPage - 1) * pageSize) + 1} to {Math.min(currentPage * pageSize, sortedData.length)} of {sortedData.length} display cards</div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} disabled={currentPage === 1}>Previous</Button>
          <div className="flex items-center gap-1">
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              const pageNum = Math.max(1, Math.min(totalPages - 4, currentPage - 2)) + i
              return (
                <Button key={pageNum} variant={pageNum === currentPage ? "default" : "outline"} size="sm" onClick={() => setCurrentPage(pageNum)} className="w-8 h-8 p-0">{pageNum}</Button>
              )
            })}
          </div>
          <Button variant="outline" size="sm" onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} disabled={currentPage === totalPages}>Next</Button>
        </div>
      </div>
    </div>
  )
}
