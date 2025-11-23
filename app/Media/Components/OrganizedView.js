"use client"

import React, { useState } from 'react'
import { useOrganizedMedia } from '@/hooks/Media/useMedia'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Star, Image as ImageIcon, ExternalLink, Search, ChevronLeft, ChevronRight } from 'lucide-react'
import MediaCard from './MediaCard'
import EditMediaDialog from './EditMediaDialog'

/**
 * OrganizedView Component
 * 
 * Purpose: Show articles in horizontal scrollable rows
 * Layout: Featured image first (starred) + content images in horizontal scroll
 * Features: Search, pagination, quick edit/delete
 */
export default function OrganizedView() {
    const [searchQuery, setSearchQuery] = useState('')
    const [currentPage, setCurrentPage] = useState(1)
    const [selectedMedia, setSelectedMedia] = useState(null)
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
    const [editingFeaturedImage, setEditingFeaturedImage] = useState(null) // Track if editing featured image
    
    const { articles, isLoading, pagination, refresh } = useOrganizedMedia({
        search: searchQuery,
        page: currentPage
    })

    const handleEdit = (mediaItem, isFeatured = false, articleId = null) => {
        if (isFeatured) {
            setEditingFeaturedImage({ articleId, currentUrl: mediaItem.url })
        }
        setSelectedMedia(mediaItem)
        setIsEditDialogOpen(true)
    }

    const handleEditSuccess = () => {
        refresh()
        setIsEditDialogOpen(false)
        setSelectedMedia(null)
        setEditingFeaturedImage(null)
    }

    const scrollRow = (articleId, direction) => {
        const container = document.getElementById(`media-row-${articleId}`)
        if (container) {
            container.scrollBy({
                left: direction === 'left' ? -400 : 400,
                behavior: 'smooth'
            })
        }
    }

    if (isLoading) {
        return (
            <Card>
                <CardContent className="p-12">
                    <div className="flex flex-col items-center justify-center gap-4">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                        <p className="text-muted-foreground">Loading articles...</p>
                    </div>
                </CardContent>
            </Card>
        )
    }

    return (
        <div className="space-y-6">
            {/* Search Header */}
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between gap-4">
                        <div className="flex-1">
                            <CardTitle>Media by Article</CardTitle>
                            <p className="text-sm text-muted-foreground mt-1">
                                Manage all media organized by article • Featured images shown first
                            </p>
                        </div>
                        <div className="relative w-64">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Search articles..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-10"
                            />
                        </div>
                    </div>
                </CardHeader>
            </Card>

            {/* Articles List */}
            {!articles || articles.length === 0 ? (
                <Card>
                    <CardContent className="p-12 text-center">
                        <p className="text-muted-foreground">
                            {searchQuery ? 'No articles found matching your search' : 'No articles with media found'}
                        </p>
                    </CardContent>
                </Card>
            ) : (
                <div className="space-y-4">
                    {articles.map((article) => {
                        const totalMedia = (article.featured_image ? 1 : 0) + (article.media?.length || 0)
                        
                        return (
                            <Card key={article.id} className="overflow-hidden">
                                {/* Article Header */}
                                <CardHeader className="pb-3">
                                    <div className="flex items-start justify-between gap-4">
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 mb-1">
                                                <h3 className="font-semibold text-lg truncate">{article.title}</h3>
                                                <Badge variant={article.status === 'published' ? 'default' : 'secondary'}>
                                                    {article.status}
                                                </Badge>
                                            </div>
                                            <div className="flex items-center gap-3 text-sm text-muted-foreground">
                                                <span>{article.slug}</span>
                                                <Badge variant="outline" className="gap-1">
                                                    <ImageIcon className="h-3 w-3" />
                                                    {totalMedia} {totalMedia === 1 ? 'file' : 'files'}
                                                </Badge>
                                            </div>
                                        </div>
                                        
                                        {/* Scroll Controls */}
                                        {totalMedia > 3 && (
                                            <div className="flex gap-1">
                                                <Button
                                                    variant="outline"
                                                    size="icon"
                                                    className="h-8 w-8"
                                                    onClick={() => scrollRow(article.id, 'left')}
                                                >
                                                    <ChevronLeft className="h-4 w-4" />
                                                </Button>
                                                <Button
                                                    variant="outline"
                                                    size="icon"
                                                    className="h-8 w-8"
                                                    onClick={() => scrollRow(article.id, 'right')}
                                                >
                                                    <ChevronRight className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        )}
                                    </div>
                                </CardHeader>

                                {/* Horizontal Scrolling Media Row */}
                                <CardContent className="pt-0">
                                    <div
                                        id={`media-row-${article.id}`}
                                        className="flex gap-3 overflow-x-auto pb-2 scroll-smooth"
                                        style={{ scrollbarWidth: 'thin' }}
                                    >
                                        {/* Featured Image First (with star badge) */}
                                        {article.featured_image && (
                                            <div className="flex-shrink-0 w-64 relative group">
                                                <Card className="overflow-hidden border-2 border-primary/50">
                                                    <div className="aspect-video relative overflow-hidden bg-muted">
                                                        <img
                                                            src={article.featured_image}
                                                            alt={article.title}
                                                            className="w-full h-full object-cover"
                                                        />
                                                        {/* Featured Badge */}
                                                        <Badge className="absolute top-2 left-2 gap-1 bg-yellow-500 text-black">
                                                            <Star className="h-3 w-3 fill-current" />
                                                            Featured
                                                        </Badge>
                                                        {/* Quick Actions Overlay */}
                                                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                                            <Button
                                                                size="sm"
                                                                variant="secondary"
                                                                onClick={() => handleEdit({ url: article.featured_image, type: 'image', filename: 'Featured Image' }, true, article.id)}
                                                            >
                                                                Edit
                                                            </Button>
                                                            <Button
                                                                size="sm"
                                                                variant="secondary"
                                                                onClick={() => window.open(article.featured_image, '_blank')}
                                                            >
                                                                <ExternalLink className="h-4 w-4 mr-1" />
                                                                View
                                                            </Button>
                                                        </div>
                                                    </div>
                                                    <div className="p-2">
                                                        <p className="text-xs font-medium truncate">Featured Image</p>
                                                        <p className="text-xs text-muted-foreground">Article thumbnail</p>
                                                    </div>
                                                </Card>
                                            </div>
                                        )}

                                        {/* Content Images (exclude featured image if it's in media array) */}
                                        {article.media && article.media.length > 0 ? (
                                            article.media
                                                .filter(media => media.url !== article.featured_image)
                                                .map((media, index) => (
                                                    <div key={media.id} className="flex-shrink-0 w-64">
                                                        <MediaCard
                                                            media={media}
                                                            viewMode="grid"
                                                            onEdit={handleEdit}
                                                            onDelete={refresh}
                                                        />
                                                    </div>
                                                ))
                                        ) : !article.featured_image && (
                                            <div className="flex-1 flex items-center justify-center p-8 text-muted-foreground">
                                                <p className="text-sm">No media files</p>
                                            </div>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        )
                    })}
                </div>
            )}

            {/* Pagination */}
            {pagination && pagination.last_page > 1 && (
                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <p className="text-sm text-muted-foreground">
                                Page {pagination.current_page} of {pagination.last_page} • {pagination.total} articles
                            </p>
                            <div className="flex gap-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    disabled={pagination.current_page === 1}
                                    onClick={() => setCurrentPage(prev => prev - 1)}
                                >
                                    <ChevronLeft className="h-4 w-4 mr-1" />
                                    Previous
                                </Button>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    disabled={pagination.current_page === pagination.last_page}
                                    onClick={() => setCurrentPage(prev => prev + 1)}
                                >
                                    Next
                                    <ChevronRight className="h-4 w-4 ml-1" />
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Edit Dialog */}
            {selectedMedia && (
                <EditMediaDialog
                    media={selectedMedia}
                    isOpen={isEditDialogOpen}
                    isFeaturedImage={!!editingFeaturedImage}
                    articleId={editingFeaturedImage?.articleId}
                    onClose={() => {
                        setIsEditDialogOpen(false)
                        setSelectedMedia(null)
                        setEditingFeaturedImage(null)
                    }}
                    onSuccess={handleEditSuccess}
                />
            )}
        </div>
    )
}
