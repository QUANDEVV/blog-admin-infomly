"use client"

import React, { useState } from 'react'
import { useDisplayCards } from '@/hooks/FeatureCard/useDisplayCards'
import { useCategories } from '@/hooks/Categories/useCategories'
import { useSubcategories } from '@/hooks/SubCategory/useSubcategories'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Filter, FileText } from 'lucide-react'

/**
 * ContentStudioSidebar - Left Panel Content Library
 * 
 * Features:
 * - Word count stats (Total, Published, Draft)
 * - Filters (Category, Subcategory, Status)
 * - Clickable content list
 * - Visual indication of selected content
 */
const ContentStudioSidebar = ({ onContentSelect, selectedContentId }) => {
    const [categoryFilter, setCategoryFilter] = useState('all')
    const [subcategoryFilter, setSubcategoryFilter] = useState('all')
    const [statusFilter, setStatusFilter] = useState('all')
    const [sortFilter, setSortFilter] = useState('oldest') // Default: Oldest First

    const { categories } = useCategories()
    const { subcategories } = useSubcategories()
    // Fetch all cards without pagination (pass a large number like 1000)
    const { display_cards, isLoading, stats = {}, pagination } = useDisplayCards(1, 1000)

    // Filter subcategories based on selected category
    const filteredSubcategories = categoryFilter && categoryFilter !== 'all'
        ? subcategories?.filter(sc => String(sc.category?.id ?? sc.category_id) === categoryFilter)
        : subcategories

    // Apply filters to content
    let filteredContent = Array.isArray(display_cards) ? display_cards : []

    if (categoryFilter && categoryFilter !== 'all') {
        filteredContent = filteredContent.filter(card =>
            String(card.subcategory?.category_id) === categoryFilter
        )
    }

    if (subcategoryFilter && subcategoryFilter !== 'all') {
        filteredContent = filteredContent.filter(card =>
            String(card.subcategory_id) === subcategoryFilter
        )
    }

    if (statusFilter && statusFilter !== 'all') {
        filteredContent = filteredContent.filter(card => card.status === statusFilter)
    }

    // Apply sorting
    filteredContent = [...filteredContent].sort((a, b) => {
        const dateA = new Date(a.published_at || a.created_at)
        const dateB = new Date(b.published_at || b.created_at)

        switch (sortFilter) {
            case 'oldest':
                return dateA - dateB // Oldest first
            case 'newest':
                return dateB - dateA // Newest first
            case 'title-az':
                return a.title.localeCompare(b.title) // A-Z
            case 'title-za':
                return b.title.localeCompare(a.title) // Z-A
            default:
                return dateA - dateB // Default: Oldest first
        }
    })

    const clearFilters = () => {
        setCategoryFilter('all')
        setSubcategoryFilter('all')
        setStatusFilter('all')
        setSortFilter('oldest')
    }

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-full">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
                    <p className="text-sm text-muted-foreground">Loading content...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="p-4 space-y-4">
            {/* Stats Cards */}
            <div className="grid grid-cols-3 gap-2">
                <Card className="border-dashed">
                    <CardContent className="p-3">
                        <div className="text-xs text-muted-foreground mb-1">Total</div>
                        <div className="text-lg font-bold">{stats?.word_counts?.total?.toLocaleString() || 0}</div>
                        <div className="text-[10px] text-muted-foreground">words</div>
                    </CardContent>
                </Card>
                <Card className="border-dashed">
                    <CardContent className="p-3">
                        <div className="text-xs text-muted-foreground mb-1">Published</div>
                        <div className="text-lg font-bold text-green-600">{stats?.word_counts?.published?.toLocaleString() || 0}</div>
                        <div className="text-[10px] text-muted-foreground">words</div>
                    </CardContent>
                </Card>
                <Card className="border-dashed">
                    <CardContent className="p-3">
                        <div className="text-xs text-muted-foreground mb-1">Draft</div>
                        <div className="text-lg font-bold text-amber-600">{stats?.word_counts?.draft?.toLocaleString() || 0}</div>
                        <div className="text-[10px] text-muted-foreground">words</div>
                    </CardContent>
                </Card>
            </div>

            {/* Filters */}
            <Card>
                <CardHeader className="pb-3">
                    <CardTitle className="text-sm flex items-center gap-2">
                        <Filter className="h-4 w-4" />
                        Filters
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                    {/* Category & Subcategory Row */}
                    <div className="grid grid-cols-2 gap-2">
                        <Select value={categoryFilter} onValueChange={(value) => {
                            setCategoryFilter(value)
                            if (value !== categoryFilter) {
                                setSubcategoryFilter('all')
                            }
                        }}>
                            <SelectTrigger className="w-full h-9">
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
                            <SelectTrigger className="w-full h-9">
                                <SelectValue placeholder="Subcategory" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Subcategories</SelectItem>
                                {filteredSubcategories?.map((sub) => (
                                    <SelectItem key={sub.id} value={sub.id.toString()}>{sub.name}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Status & Sort Row */}
                    <div className="grid grid-cols-2 gap-2">
                        <Select value={statusFilter} onValueChange={setStatusFilter}>
                            <SelectTrigger className="w-full h-9">
                                <SelectValue placeholder="Status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Status</SelectItem>
                                <SelectItem value="published">Published</SelectItem>
                                <SelectItem value="scheduled">Scheduled</SelectItem>
                                <SelectItem value="draft">Drafts</SelectItem>
                            </SelectContent>
                        </Select>

                        <Select value={sortFilter} onValueChange={setSortFilter}>
                            <SelectTrigger className="w-full h-9">
                                <SelectValue placeholder="Sort By" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="oldest">Oldest First</SelectItem>
                                <SelectItem value="newest">Newest First</SelectItem>
                                <SelectItem value="title-az">Title A-Z</SelectItem>
                                <SelectItem value="title-za">Title Z-A</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <Button variant="outline" size="sm" onClick={clearFilters} className="w-full h-8">
                        Clear Filters
                    </Button>
                </CardContent>
            </Card>

            {/* Content List */}
            <div className="space-y-2">
                <div className="text-xs font-medium text-muted-foreground px-1">
                    {pagination?.total || filteredContent.length} {(pagination?.total || filteredContent.length) === 1 ? 'Article' : 'Articles'}
                </div>
                {filteredContent.length > 0 ? (
                    filteredContent.map((card) => (
                        <Card
                            key={card.id}
                            className={`cursor-pointer transition-all hover:border-primary/50 ${selectedContentId === card.id ? 'border-primary bg-primary/5' : ''
                                }`}
                            onClick={() => onContentSelect(card)}
                        >
                            <CardContent className="p-3">
                                <div className="flex items-start justify-between gap-2">
                                    <div className="flex-1 min-w-0">
                                        <div className="font-semibold text-sm truncate">{card.title}</div>
                                        <div className="text-xs text-muted-foreground mt-1">
                                            {card.subcategory?.name}
                                        </div>
                                    </div>
                                    <Badge
                                        variant={card.status === 'published' ? 'default' : card.status === 'scheduled' ? 'outline' : 'secondary'}
                                        className="text-[10px] shrink-0"
                                    >
                                        {card.status === 'published' ? '✅' : card.status === 'scheduled' ? '⏰' : '📝'}
                                    </Badge>
                                </div>
                                {card.content && (
                                    <div className="flex items-center gap-1 mt-2 text-xs text-muted-foreground">
                                        <FileText className="h-3 w-3" />
                                        <span>{card.content.word_count?.toLocaleString() || 0} words</span>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    ))
                ) : (
                    <Card className="border-dashed">
                        <CardContent className="p-6 text-center">
                            <p className="text-sm text-muted-foreground">No content found</p>
                            <p className="text-xs text-muted-foreground mt-1">Try adjusting your filters</p>
                        </CardContent>
                    </Card>
                )}
            </div>
        </div>
    )
}

export default ContentStudioSidebar
