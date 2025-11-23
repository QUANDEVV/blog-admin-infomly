"use client"

import React, { useState } from 'react'
import { useMedia } from '@/hooks/Media/useMedia'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import MediaCard from './MediaCard'
import EditMediaDialog from './EditMediaDialog'
import { Search, Filter, Grid3x3, List } from 'lucide-react'

/**
 * MediaLibrary Component
 * 
 * Purpose: Browse and filter all uploaded media
 * Features: Grid/list view, filters, search, edit, delete
 */
export default function MediaLibrary() {
    const [filters, setFilters] = useState({ type: '', limit: 50 })
    const [searchQuery, setSearchQuery] = useState('')
    const [viewMode, setViewMode] = useState('grid') // 'grid' or 'list'
    const [selectedMedia, setSelectedMedia] = useState(null)
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)

    const { media, isLoading, pagination, refresh } = useMedia(filters)

    // Filter media by search query (client-side)
    const filteredMedia = media.filter(item =>
        item.filename.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.alt_text?.toLowerCase().includes(searchQuery.toLowerCase())
    )

    const handleEdit = (mediaItem) => {
        setSelectedMedia(mediaItem)
        setIsEditDialogOpen(true)
    }

    const handleEditSuccess = () => {
        refresh()
        setIsEditDialogOpen(false)
        setSelectedMedia(null)
    }

    if (isLoading) {
        return (
            <Card>
                <CardContent className="p-12">
                    <div className="flex flex-col items-center justify-center gap-4">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                        <p className="text-muted-foreground">Loading media library...</p>
                    </div>
                </CardContent>
            </Card>
        )
    }

    return (
        <div className="space-y-6">
            {/* Filters and Search */}
            <Card>
                <CardHeader>
                    <CardTitle>Media Library</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        {/* Search */}
                        <div className="md:col-span-2 relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Search by filename or alt text..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-10"
                            />
                        </div>

                        {/* Type Filter */}
                        <Select
                            value={filters.type || 'all'}
                            onValueChange={(value) => setFilters({ ...filters, type: value === 'all' ? '' : value })}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="All Types" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Types</SelectItem>
                                <SelectItem value="image">Images</SelectItem>
                                <SelectItem value="video">Videos</SelectItem>
                                <SelectItem value="audio">Audio</SelectItem>
                                <SelectItem value="document">Documents</SelectItem>
                            </SelectContent>
                        </Select>

                        {/* View Toggle */}
                        <div className="flex gap-2">
                            <Button
                                variant={viewMode === 'grid' ? 'default' : 'outline'}
                                size="icon"
                                onClick={() => setViewMode('grid')}
                            >
                                <Grid3x3 className="h-4 w-4" />
                            </Button>
                            <Button
                                variant={viewMode === 'list' ? 'default' : 'outline'}
                                size="icon"
                                onClick={() => setViewMode('list')}
                            >
                                <List className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>

                    {/* Stats */}
                    <div className="flex flex-wrap gap-2">
                        <Badge variant="secondary">
                            Total: {filteredMedia.length} {filteredMedia.length === 1 ? 'file' : 'files'}
                        </Badge>
                        {pagination && (
                            <Badge variant="outline">
                                Page {pagination.current_page} of {pagination.last_page}
                            </Badge>
                        )}
                    </div>
                </CardContent>
            </Card>

            {/* Media Grid/List */}
            {filteredMedia.length === 0 ? (
                <Card>
                    <CardContent className="p-12 text-center">
                        <p className="text-muted-foreground">No media files found</p>
                        <p className="text-sm text-muted-foreground mt-2">
                            Try adjusting your filters or upload new media
                        </p>
                    </CardContent>
                </Card>
            ) : (
                <div className={
                    viewMode === 'grid'
                        ? 'grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4'
                        : 'space-y-2'
                }>
                    {filteredMedia.map((mediaItem) => (
                        <MediaCard
                            key={mediaItem.id}
                            media={mediaItem}
                            viewMode={viewMode}
                            onEdit={handleEdit}
                            onDelete={refresh}
                        />
                    ))}
                </div>
            )}

            {/* Edit Dialog */}
            {selectedMedia && (
                <EditMediaDialog
                    media={selectedMedia}
                    isOpen={isEditDialogOpen}
                    onClose={() => {
                        setIsEditDialogOpen(false)
                        setSelectedMedia(null)
                    }}
                    onSuccess={handleEditSuccess}
                />
            )}
        </div>
    )
}
