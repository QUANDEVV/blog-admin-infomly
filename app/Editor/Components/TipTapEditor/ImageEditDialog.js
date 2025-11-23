"use client"

import React, { useState } from 'react'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { apiFetch } from '@/lib/apiClient'
import { toast } from 'sonner'
import { Upload, Trash2, Save } from 'lucide-react'

/**
 * ImageEditDialog Component
 * 
 * Purpose: Edit images directly from the editor
 * Features:
 * - Update alt text
 * - Replace image file
 * - Delete image from content
 * - Preview current image
 */
export default function ImageEditDialog({ 
    isOpen, 
    onClose, 
    imageData, 
    onUpdate,
    onDelete,
    articleId 
}) {
    const [altText, setAltText] = useState(imageData?.alt || '')
    const [isReplacing, setIsReplacing] = useState(false)
    const [newFile, setNewFile] = useState(null)

    const handleUpdateAltText = () => {
        // Update alt text in the editor
        onUpdate({ 
            src: imageData.url, 
            alt: altText 
        })
        toast.success('Alt text updated')
        onClose()
    }

    const handleReplaceImage = async () => {
        if (!newFile) {
            toast.error('Please select a new image')
            return
        }

        setIsReplacing(true)
        try {
            // First, find the media ID by URL
            const mediaResponse = await apiFetch(`/admin/media?url=${encodeURIComponent(imageData.url)}`)
            
            if (!mediaResponse.data || mediaResponse.data.length === 0) {
                // Image not in media library, upload as new
                const formData = new FormData()
                formData.append('file', newFile)
                if (articleId) formData.append('article_id', articleId)
                if (altText) formData.append('alt_text', altText)

                const uploadResponse = await apiFetch('/admin/media/upload', {
                    method: 'POST',
                    body: formData,
                })

                // Update image in editor with new URL
                onUpdate({ 
                    src: uploadResponse.url, 
                    alt: altText 
                })
            } else {
                // Image exists in media library, use replace endpoint
                const mediaId = mediaResponse.data[0].id
                
                const formData = new FormData()
                formData.append('file', newFile)
                formData.append('alt_text', altText)

                const replaceResponse = await apiFetch(`/admin/media/${mediaId}/replace`, {
                    method: 'POST',
                    body: formData,
                })

                // Update image in editor with new URL (includes cache-busting)
                onUpdate({ 
                    src: replaceResponse.media.url, 
                    alt: altText 
                })
            }

            toast.success('Image replaced successfully')
            onClose()
        } catch (error) {
            console.error('Replace error:', error)
            toast.error(error.message || 'Failed to replace image')
        } finally {
            setIsReplacing(false)
        }
    }

    const handleDelete = () => {
        if (confirm('Remove this image from the content?')) {
            onDelete()
            toast.success('Image removed')
            onClose()
        }
    }

    if (!imageData) return null

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-2xl">
                <DialogHeader>
                    <DialogTitle>Edit Image</DialogTitle>
                    <DialogDescription>
                        Update alt text, replace the image, or remove it from content
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-6">
                    {/* Current Image Preview */}
                    <div className="space-y-2">
                        <Label>Current Image</Label>
                        <div className="rounded-lg border overflow-hidden bg-muted">
                            <img
                                src={imageData.url}
                                alt={imageData.alt || 'Preview'}
                                className="w-full h-auto max-h-96 object-contain"
                            />
                        </div>
                    </div>

                    {/* Alt Text Editor */}
                    <div className="space-y-2">
                        <Label htmlFor="alt_text">
                            Alt Text
                            <span className="text-xs text-muted-foreground ml-2">
                                (SEO & Accessibility)
                            </span>
                        </Label>
                        <Input
                            id="alt_text"
                            value={altText}
                            onChange={(e) => setAltText(e.target.value)}
                            placeholder="Describe the image..."
                            maxLength={125}
                        />
                        <p className="text-xs text-muted-foreground">
                            {altText.length}/125 characters
                        </p>
                    </div>

                    {/* Replace Image */}
                    <div className="space-y-2">
                        <Label htmlFor="replace_file">Replace Image</Label>
                        <Input
                            id="replace_file"
                            type="file"
                            accept="image/*"
                            onChange={(e) => setNewFile(e.target.files[0])}
                        />
                        {newFile && (
                            <p className="text-sm text-muted-foreground">
                                Selected: {newFile.name}
                            </p>
                        )}
                    </div>
                </div>

                <DialogFooter className="gap-2">
                    <Button
                        variant="destructive"
                        onClick={handleDelete}
                    >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Remove Image
                    </Button>
                    
                    <div className="flex-1" />
                    
                    <Button variant="outline" onClick={onClose}>
                        Cancel
                    </Button>
                    
                    {newFile ? (
                        <Button
                            onClick={handleReplaceImage}
                            disabled={isReplacing}
                        >
                            <Upload className="h-4 w-4 mr-2" />
                            {isReplacing ? 'Replacing...' : 'Replace Image'}
                        </Button>
                    ) : (
                        <Button onClick={handleUpdateAltText}>
                            <Save className="h-4 w-4 mr-2" />
                            Update Alt Text
                        </Button>
                    )}
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
