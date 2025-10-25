"use client"

import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { CalendarDays, Filter, Plus, Search } from 'lucide-react'
import DisplayCardList from './DisplayCardList'
import DisplayCardForm from './DisplayCardForm'
import { useSubcategories } from '@/hooks/SubCategory/useSubcategories'
import { useCategories } from '@/hooks/Categories/useCategories'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetClose,
} from '@/components/ui/sheet'

const FeatureCard = () => {
  const { subcategories } = useSubcategories()
  const { categories } = useCategories()
  const [editingArticle, setEditingArticle] = useState<any>(null)
  const [sheetOpen, setSheetOpen] = useState(false)
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | undefined>(undefined)
  const [selectedSubcategoryId, setSelectedSubcategoryId] = useState<string>('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [sortBy, setSortBy] = useState('newest')

  const handleSuccess = () => {
    setEditingArticle(null)
    setSheetOpen(false)
    // Articles will refresh automatically via SWR
  }

  return (
    <div className="container mx-auto  space-y-6">
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Display Card Management</h1>
          <p className="text-muted-foreground">Manage your blog's featured articles with logistics precision</p>
        </div>
       
      </div>

      {/* (moved) Filters will now live in the Article Inventory header for a cleaner, table-first layout */}

      {/* Main Content Grid */}
      {/* Main Content - full width table. Article form opens in a Sheet for better focus and scalability. */}
      <div className="space-y-6">
        <Card>
          <CardHeader className="py-2 px-4">
        <CardTitle className="flex items-center justify-between gap-4 py-0">
              <span>Display Card Inventory</span>
              <div className="flex flex-col sm:flex-row sm:items-center sm:gap-3">
               
                {/* Compact toolbar: search + category + sort + buttons */}
                <div className="flex items-center gap-2">
                  <div className="hidden sm:block">
                    <div className="relative">
                      <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="search-inline"
                        placeholder="Search title..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-9 h-8 w-52"
                      />
                    </div>
                  </div>

                  <div className="hidden sm:block">
                      <Select value={selectedCategoryId} onValueChange={(v) => { setSelectedCategoryId(v); setSelectedSubcategoryId('all') }}>
                        <SelectTrigger className="h-8 w-40">
                          <SelectValue placeholder="All Categories" />
                        </SelectTrigger>
                        <SelectContent>
                          {categories?.map((c: any) => (
                            <SelectItem key={c.id} value={c.id?.toString()}>
                              {c.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="hidden sm:block">
                      <Select value={selectedSubcategoryId} onValueChange={setSelectedSubcategoryId}>
                        <SelectTrigger className="h-8 w-40">
                          <SelectValue placeholder="All Subcategories" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Subcategories</SelectItem>
                          {(selectedCategoryId
                            ? subcategories?.filter((sc: any) => String(sc.category?.id ?? sc.category_id) === selectedCategoryId)
                            : subcategories
                          )?.map((sc: any) => (
                            <SelectItem key={sc.id} value={sc.id.toString()}>
                              {sc.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                  <div className="hidden sm:block">
                    <Select value={sortBy} onValueChange={setSortBy}>
                      <SelectTrigger className="h-8 w-40">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="newest">Newest First</SelectItem>
                        <SelectItem value="oldest">Oldest First</SelectItem>
                        <SelectItem value="title">Title A-Z</SelectItem>
                        <SelectItem value="category">Category</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <Button variant="ghost" size="sm" onClick={() => { setSelectedCategoryId(undefined); setSelectedSubcategoryId('all'); setSearchTerm(''); setSortBy('newest') }}>
                    Clear
                  </Button>

                    <Button
                    onClick={() => {
                      setEditingArticle(null)
                      setSheetOpen(true)
                    }}
                    size="sm"
                  >
                    <Plus className="w-4 h-4 mr-2" /> New Display Card
                  </Button>
                </div>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <DisplayCardList
              onEdit={(displayCard) => {
                setEditingArticle(displayCard)
                setSheetOpen(true)
              }}
              filters={{ category: selectedCategoryId, subcategory: selectedSubcategoryId, search: searchTerm, sort: sortBy }}
            />
          </CardContent>
        </Card>
      </div>

      {/* Article Form Sheet (slide-over) - used for Create & Edit */}
      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        {/* Wider sheet for editing articles: 720px on small screens, 820px on large */}
        <SheetContent side="left" className="w-full sm:w-[920px] lg:w-[1100px]">
          <SheetHeader>
            <SheetTitle>{editingArticle ? 'Edit Display Card' : 'Add Display Card'}</SheetTitle>
          </SheetHeader>
          <div className="mt-4">
            <DisplayCardForm onSuccess={handleSuccess} displayCard={editingArticle} />
          </div>
          <SheetClose />
        </SheetContent>
      </Sheet>

    
    </div>
  )
}

export default FeatureCard