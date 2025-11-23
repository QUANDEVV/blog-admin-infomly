"use client"

import React, { useState, useRef } from 'react'
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
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { apiFetch, put } from '@/lib/apiClient'
import { toast } from 'sonner'
import { Upload, Image as ImageIcon, Video, Music, FileText, Star } from 'lucide-react'

/**
 * EditMediaDialog Component
 * 
 * Purpose: Edit media metadata and replace file
 * Features:
 * - Update alt text
 * - Update caption
 * - Replace file (upload new version)
 * - View metadata
 */
export default function EditMediaDialog({ media, isOpen, onClose, onSuccess, isFeaturedImage = false, articleId }) {
    const [altText, setAltText] = useState(media?.alt_text || '')
    const [caption, setCaption] = useState(media?.caption || '')
    const [isUpdating, setIsUpdating] = useState(false)
    const [isReplacing, setIsReplacing] = useState(false)
    const [selectedFile, setSelectedFile] = useState(null)
    const [previewUrl, setPreviewUrl] = useState(media?.url || '')
    const fileInputRef = useRef(null)

    // Update preview URL when media changes
    React.useEffect(() => {
        setPreviewUrl(media?.url || '')
    }, [media])

    const handleUpdate = async () => {
        setIsUpdating(true)
        try {
            // If there's a selected file, replace it first
            if (selectedFile) {
                const formData = new FormData()

                if (isFeaturedImage && articleId) {
                    // Replace featured image using dedicated endpoint
                    console.log('🎯 REPLACING FEATURED IMAGE:', {
                        articleId,
                        fileName: selectedFile.name,
                        fileSize: selectedFile.size,
                        altText
                    })

                    // Append file with key 'file' as expected by MediaController@updateFeaturedImage
                    formData.append('file', selectedFile)
                    formData.append('alt_text', altText || '')

                    // Use the dedicated endpoint defined in routes/api.php
                    const response = await apiFetch(`/admin/media/featured-image/${articleId}`, {
                        method: 'POST',
                        body: formData,
                    })

                    console.log('✅ FEATURED IMAGE REPLACED:', response)

                    // Update local preview immediately
                    if (response.url) {
                        setPreviewUrl(response.url)
                    }
                } else if (!isFeaturedImage && media.id) {
                    // Replace media file
                    formData.append('file', selectedFile)
                    formData.append('media_id', media.id)

                    await apiFetch('/admin/media/replace', {
                        method: 'POST',
                        body: formData,
                    })
                }

                toast.success(isFeaturedImage ? 'Featured image replaced successfully' : 'File replaced successfully')
            } else {
                // Just update metadata without replacing file
                if (isFeaturedImage) {
                    await put(`/admin/display-cards/${articleId}`, {
                        alt_text: altText,
                    })
                } else {
                    await put(`/admin/media/${media.id}`, {
                        alt_text: altText,
                        caption: caption,
                    })
                }

                toast.success('Media updated successfully')
            }

            onSuccess?.()
        } catch (error) {
            toast.error(error.message || 'Failed to update media')
        } finally {
            setIsUpdating(false)
            setSelectedFile(null)
        }
    }

    const handleFileSelect = (event) => {
        const file = event.target.files?.[0]
        if (!file) return

        // Validate file type
        const newType = file.type.split('/')[0]
        if (!isFeaturedImage && newType !== media.type) {
            toast.error(`Please upload a ${media.type} file to replace this ${media.type}`)
            if (fileInputRef.current) {
                fileInputRef.current.value = ''
            }
            return
        }

        setSelectedFile(file)
        toast.info('File selected. Click "Save Changes" to apply.')
    }

    const getIcon = () => {
        switch (media?.type) {
            case 'image':
                return <ImageIcon className="h-5 w-5" />
            case 'video':
                return <Video className="h-5 w-5" />
            case 'audio':
                return <Music className="h-5 w-5" />
            default:
                return <FileText className="h-5 w-5" />
        }
    }

    if (!media) return null

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        {getIcon()}
                        {isFeaturedImage ? 'Edit Featured Image' : 'Edit Media'}
                        {isFeaturedImage && (
                            <Badge className="ml-2 bg-yellow-500 text-black">
                                <Star className="h-3 w-3 mr-1 fill-current" />
                                Featured
                            </Badge>
                        )}
                    </DialogTitle>
                    <DialogDescription>
                        Update metadata or replace the file
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-6">
                    {/* Preview */}
                    <div className="space-y-2">
                        <Label>Preview</Label>
                        <div className="border rounded-lg overflow-hidden bg-muted">
                            {media.type === 'image' ? (
                                <img
                                    src={previewUrl}
                                    alt={media.alt_text || media.filename}
                                    className="w-full h-auto max-h-64 object-contain"
                                />
                            ) : media.type === 'video' ? (
                                <video
                                    src={media.url}
                                    controls
                                    className="w-full h-auto max-h-64"
                                />
                            ) : (
                                <div className="p-12 flex flex-col items-center justify-center gap-2">
                                    {getIcon()}
                                    <p className="text-sm text-muted-foreground">{media.filename}</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* File Info */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <Label className="text-xs text-muted-foreground">Filename</Label>
                            <p className="text-sm font-medium truncate">{media.filename}</p>
                        </div>
                        <div>
                            <Label className="text-xs text-muted-foreground">Type</Label>
                            <Badge variant="outline" className="gap-1">
                                {getIcon()}
                                {media.type}
                            </Badge>
                        </div>
                        <div>
                            <Label className="text-xs text-muted-foreground">Size</Label>
                            <p className="text-sm">{media.metadata?.size || 'N/A'}</p>
                        </div>
                        <div>
                            <Label className="text-xs text-muted-foreground">Dimensions</Label>
                            <p className="text-sm">
                                {media.metadata?.dimensions
                                    ? `${media.metadata.dimensions.width} × ${media.metadata.dimensions.height}`
                                    : 'N/A'}
                            </p>
                        </div>
                    </div>

                    {/* Alt Text */}
                    <div className="space-y-2">
                        <Label htmlFor="alt_text">
                            Alt Text
                            <span className="text-xs text-muted-foreground ml-2">(SEO & Accessibility)</span>
                        </Label>
                        <Input
                            id="alt_text"
                            value={altText}
                            onChange={(e) => setAltText(e.target.value)}
                            placeholder="Describe this media for screen readers and SEO"
                            maxLength={125}
                        />
                        <p className="text-xs text-muted-foreground">
                            {altText.length}/125 characters
                        </p>
                    </div>

                    {/* Caption */}
                    <div className="space-y-2">
                        <Label htmlFor="caption">
                            Caption
                            <span className="text-xs text-muted-foreground ml-2">(Optional)</span>
                        </Label>
                        <Textarea
                            id="caption"
                            value={caption}
                            onChange={(e) => setCaption(e.target.value)}
                            placeholder="Add a caption or description"
                            rows={3}
                        />
                    </div>

                    {/* Replace File */}
                    <div className="space-y-2">
                        <Label>Replace File</Label>
                        <div className="flex items-center gap-2">
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept={media.type === 'image' ? 'image/*' : media.type === 'video' ? 'video/*' : '*/*'}
                                onChange={handleFileSelect}
                                className="hidden"
                            />
                            <Button
                                variant="outline"
                                onClick={() => fileInputRef.current?.click()}
                                className="gap-2"
                            >
                                <Upload className="h-4 w-4" />
                                {selectedFile ? `Selected: ${selectedFile.name}` : 'Choose New File'}
                            </Button>
                            <p className="text-xs text-muted-foreground">
                                {selectedFile ? 'File ready to upload. Click "Save Changes" to apply.' : `Must be a ${media.type} file`}
                            </p>
                        </div>
                    </div>

                    {/* URL (Read-only) */}
                    <div className="space-y-2">
                        <Label htmlFor="url">URL</Label>
                        <Input
                            id="url"
                            value={media.url}
                            readOnly
                            className="font-mono text-xs"
                        />
                    </div>
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={onClose}>
                        Cancel
                    </Button>
                    <Button onClick={handleUpdate} disabled={isUpdating || isReplacing}>
                        {isUpdating ? 'Saving...' : 'Save Changes'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
