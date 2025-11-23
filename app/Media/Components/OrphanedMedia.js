"use client"

import React, { useState } from 'react'
import { useOrphanedMedia } from '@/hooks/Media/useMedia'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import MediaCard from './MediaCard'
import { Trash2, AlertTriangle, Info } from 'lucide-react'
import { del } from '@/lib/apiClient'
import { toast } from 'sonner'

/**
 * OrphanedMedia Component
 * 
 * Purpose: Show media files not used in any articles
 * Features: Bulk delete, cleanup warnings
 */
export default function OrphanedMedia() {
    const { media, totalOrphaned, isLoading, refresh } = useOrphanedMedia()
    const [isDeletingAll, setIsDeletingAll] = useState(false)

    const handleBulkDelete = async () => {
        if (!confirm(
            `Delete all ${totalOrphaned} orphaned files?\n\n` +
            `This will permanently remove these files from S3 and the database.\n\n` +
            `This action cannot be undone!`
        )) {
            return
        }

        setIsDeletingAll(true)
        let successCount = 0
        let failCount = 0

        for (const mediaItem of media) {
            try {
                await del(`/admin/media/${mediaItem.id}`)
                successCount++
            } catch (error) {
                console.error(`Failed to delete ${mediaItem.filename}:`, error)
                failCount++
            }
        }

        setIsDeletingAll(false)

        if (successCount > 0) {
            toast.success(`${successCount} orphaned files deleted`)
            refresh()
        }

        if (failCount > 0) {
            toast.error(`${failCount} files failed to delete`)
        }
    }

    if (isLoading) {
        return (
            <Card>
                <CardContent className="p-12">
                    <div className="flex flex-col items-center justify-center gap-4">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                        <p className="text-muted-foreground">Loading orphaned media...</p>
                    </div>
                </CardContent>
            </Card>
        )
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle className="flex items-center gap-2">
                                <Trash2 className="h-5 w-5" />
                                Orphaned Media
                            </CardTitle>
                            <p className="text-sm text-muted-foreground mt-1">
                                Files not used in any articles
                            </p>
                        </div>
                        {totalOrphaned > 0 && (
                            <Button
                                variant="destructive"
                                onClick={handleBulkDelete}
                                disabled={isDeletingAll}
                                className="gap-2"
                            >
                                <Trash2 className="h-4 w-4" />
                                {isDeletingAll ? 'Deleting...' : `Delete All (${totalOrphaned})`}
                            </Button>
                        )}
                    </div>
                </CardHeader>
            </Card>

            {/* Info Alert */}
            <Alert>
                <Info className="h-4 w-4" />
                <AlertDescription>
                    Orphaned media are files that were uploaded but are not currently used in any article.
                    These files can be safely deleted to save storage space.
                </AlertDescription>
            </Alert>

            {/* Orphaned Media Grid */}
            {totalOrphaned === 0 ? (
                <Card>
                    <CardContent className="p-12 text-center">
                        <div className="flex flex-col items-center gap-4">
                            <div className="rounded-full bg-green-100 dark:bg-green-900/20 p-4">
                                <Info className="h-8 w-8 text-green-600 dark:text-green-400" />
                            </div>
                            <div>
                                <p className="font-semibold text-lg">No Orphaned Media</p>
                                <p className="text-sm text-muted-foreground mt-1">
                                    All uploaded files are currently in use
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            ) : (
                <>
                    {/* Warning */}
                    <Alert variant="destructive">
                        <AlertTriangle className="h-4 w-4" />
                        <AlertDescription>
                            <strong>Warning:</strong> Deleting orphaned media is permanent and cannot be undone.
                            Make sure you don't need these files before deleting.
                        </AlertDescription>
                    </Alert>

                    {/* Stats */}
                    <div className="flex gap-2">
                        <Badge variant="destructive" className="text-base px-4 py-2">
                            {totalOrphaned} orphaned {totalOrphaned === 1 ? 'file' : 'files'}
                        </Badge>
                    </div>

                    {/* Media Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {media.map((mediaItem) => (
                            <MediaCard
                                key={mediaItem.id}
                                media={mediaItem}
                                viewMode="grid"
                                onEdit={null} // Disable edit for orphaned media
                                onDelete={refresh}
                            />
                        ))}
                    </div>
                </>
            )}
        </div>
    )
}
