"use client"

import React, { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Image, Video, Music, FileText, MoreVertical, Edit, Trash2, Copy, ExternalLink } from 'lucide-react'
import { apiFetch, del } from '@/lib/apiClient'
import { toast } from 'sonner'

/**
 * MediaCard Component
 * 
 * Purpose: Display individual media item with actions
 * Supports: Images, videos, audio, documents
 */
export default function MediaCard({ media, viewMode = 'grid', onEdit, onDelete }) {
    const [isDeleting, setIsDeleting] = useState(false)

    const handleDelete = async () => {
        if (!confirm(`Delete "${media.filename}"? This action cannot be undone.`)) {
            return
        }

        setIsDeleting(true)
        try {
            await del(`/admin/media/${media.id}`)
            toast.success('Media deleted successfully')
            onDelete?.()
        } catch (error) {
            toast.error(error.message || 'Failed to delete media')
        } finally {
            setIsDeleting(false)
        }
    }

    const handleCopyUrl = () => {
        navigator.clipboard.writeText(media.url)
        toast.success('URL copied to clipboard')
    }

    const getIcon = () => {
        switch (media.type) {
            case 'image':
                return <Image className="h-4 w-4" />
            case 'video':
                return <Video className="h-4 w-4" />
            case 'audio':
                return <Music className="h-4 w-4" />
            default:
                return <FileText className="h-4 w-4" />
        }
    }

    const getThumbnail = () => {
        if (media.type === 'image') {
            return (
                <img
                    src={media.url}
                    alt={media.alt_text || media.filename}
                    className="w-full h-full object-cover"
                />
            )
        } else if (media.type === 'video') {
            return (
                <div className="w-full h-full flex items-center justify-center bg-muted">
                    <Video className="h-12 w-12 text-muted-foreground" />
                </div>
            )
        } else {
            return (
                <div className="w-full h-full flex items-center justify-center bg-muted">
                    {getIcon()}
                </div>
            )
        }
    }

    // Grid View
    if (viewMode === 'grid') {
        return (
            <Card className="overflow-hidden hover:shadow-lg transition-shadow">
                {/* Thumbnail */}
                <div className="aspect-square relative overflow-hidden bg-muted">
                    {getThumbnail()}

                    {/* Type Badge */}
                    <Badge className="absolute top-2 left-2 gap-1">
                        {getIcon()}
                        {media.type}
                    </Badge>
                </div>

                {/* Info */}
                <CardContent className="p-3">
                    <p className="font-medium text-sm truncate" title={media.filename}>
                        {media.filename}
                    </p>
                    {media.alt_text && (
                        <p className="text-xs text-muted-foreground mt-1 truncate" title={media.alt_text}>
                            {media.alt_text}
                        </p>
                    )}
                    
                    {/* Action Buttons - Always Visible */}
                    <div className="flex items-center gap-1 mt-3">
                        <Button
                            size="sm"
                            variant="outline"
                            className="flex-1 h-8"
                            onClick={() => onEdit?.(media)}
                        >
                            <Edit className="h-3 w-3 mr-1" />
                            Edit
                        </Button>
                        <Button
                            size="sm"
                            variant="outline"
                            className="flex-1 h-8"
                            onClick={handleDelete}
                            disabled={isDeleting}
                        >
                            <Trash2 className="h-3 w-3 mr-1" />
                            {isDeleting ? '...' : 'Delete'}
                        </Button>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline" size="icon" className="h-8 w-8">
                                    <MoreVertical className="h-3 w-3" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={handleCopyUrl}>
                                    <Copy className="h-4 w-4 mr-2" />
                                    Copy URL
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => window.open(media.url, '_blank')}>
                                    <ExternalLink className="h-4 w-4 mr-2" />
                                    Open in New Tab
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                    
                    <div className="text-xs text-muted-foreground mt-2">
                        {media.metadata?.size || 'N/A'}
                    </div>
                </CardContent>
            </Card>
        )
    }

    // List View
    return (
        <Card className="hover:bg-muted/50 transition-colors">
            <CardContent className="p-4">
                <div className="flex items-center gap-4">
                    {/* Thumbnail */}
                    <div className="w-16 h-16 rounded overflow-hidden bg-muted flex-shrink-0">
                        {getThumbnail()}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                            <Badge variant="outline" className="gap-1">
                                {getIcon()}
                                {media.type}
                            </Badge>
                            <p className="font-medium truncate">{media.filename}</p>
                        </div>
                        {media.alt_text && (
                            <p className="text-sm text-muted-foreground mt-1 truncate">
                                {media.alt_text}
                            </p>
                        )}
                        <p className="text-xs text-muted-foreground mt-1">
                            {media.metadata?.size || 'N/A'} • Uploaded {media.created_at || 'recently'}
                        </p>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2">
                        <Button
                            size="sm"
                            variant="outline"
                            onClick={() => onEdit?.(media)}
                        >
                            <Edit className="h-4 w-4 mr-1" />
                            Edit
                        </Button>
                        <Button
                            size="sm"
                            variant="ghost"
                            onClick={handleCopyUrl}
                        >
                            <Copy className="h-4 w-4" />
                        </Button>
                        <Button
                            size="sm"
                            variant="ghost"
                            onClick={handleDelete}
                            disabled={isDeleting}
                        >
                            <Trash2 className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
