"use client"

import React, { useState, useCallback } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useDisplayCards } from '@/hooks/FeatureCard/useDisplayCards'
import { apiFetch } from '@/lib/apiClient'
import { toast } from 'sonner'
import { Upload, X, FileImage, FileVideo, FileAudio, File } from 'lucide-react'

/**
 * UploadMedia Component
 * 
 * Purpose: Upload new media files
 * Features:
 * - Drag and drop
 * - Multiple file upload
 * - Associate with article (optional)
 * - Alt text for SEO
 */
export default function UploadMedia({ onUploadSuccess }) {
    const [files, setFiles] = useState([])
    const [articleId, setArticleId] = useState('')
    const [altText, setAltText] = useState('')
    const [isUploading, setIsUploading] = useState(false)
    const [isDragging, setIsDragging] = useState(false)

    const { display_cards } = useDisplayCards(1, 1000) // Get all articles for dropdown

    const handleDragOver = useCallback((e) => {
        e.preventDefault()
        setIsDragging(true)
    }, [])

    const handleDragLeave = useCallback((e) => {
        e.preventDefault()
        setIsDragging(false)
    }, [])

    const handleDrop = useCallback((e) => {
        e.preventDefault()
        setIsDragging(false)
        
        const droppedFiles = Array.from(e.dataTransfer.files)
        setFiles(prev => [...prev, ...droppedFiles])
    }, [])

    const handleFileSelect = (e) => {
        const selectedFiles = Array.from(e.target.files)
        setFiles(prev => [...prev, ...selectedFiles])
    }

    const removeFile = (index) => {
        setFiles(prev => prev.filter((_, i) => i !== index))
    }

    const handleUpload = async () => {
        if (files.length === 0) {
            toast.error('Please select at least one file')
            return
        }

        setIsUploading(true)
        let successCount = 0
        let failCount = 0

        for (const file of files) {
            try {
                const formData = new FormData()
                formData.append('file', file)
                if (articleId) formData.append('article_id', articleId)
                if (altText) formData.append('alt_text', altText)

                await apiFetch('/admin/media/upload', {
                    method: 'POST',
                    body: formData,
                })

                successCount++
            } catch (error) {
                console.error(`Failed to upload ${file.name}:`, error)
                failCount++
            }
        }

        setIsUploading(false)

        if (successCount > 0) {
            toast.success(`${successCount} ${successCount === 1 ? 'file' : 'files'} uploaded successfully`)
            setFiles([])
            setAltText('')
            onUploadSuccess?.()
        }

        if (failCount > 0) {
            toast.error(`${failCount} ${failCount === 1 ? 'file' : 'files'} failed to upload`)
        }
    }

    const getFileIcon = (file) => {
        const type = file.type.split('/')[0]
        switch (type) {
            case 'image':
                return <FileImage className="h-8 w-8 text-blue-500" />
            case 'video':
                return <FileVideo className="h-8 w-8 text-purple-500" />
            case 'audio':
                return <FileAudio className="h-8 w-8 text-green-500" />
            default:
                return <File className="h-8 w-8 text-gray-500" />
        }
    }

    const formatFileSize = (bytes) => {
        if (bytes === 0) return '0 Bytes'
        const k = 1024
        const sizes = ['Bytes', 'KB', 'MB', 'GB']
        const i = Math.floor(Math.log(bytes) / Math.log(k))
        return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i]
    }

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>Upload Media</CardTitle>
                    <CardDescription>
                        Upload images, videos, audio files, or documents
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    {/* Drop Zone */}
                    <div
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                        className={`
                            border-2 border-dashed rounded-lg p-12
                            transition-colors cursor-pointer
                            ${isDragging
                                ? 'border-primary bg-primary/10'
                                : 'border-muted-foreground/25 hover:border-primary/50'
                            }
                        `}
                        onClick={() => document.getElementById('file-input').click()}
                    >
                        <div className="flex flex-col items-center justify-center gap-4">
                            <Upload className={`h-12 w-12 ${isDragging ? 'text-primary' : 'text-muted-foreground'}`} />
                            <div className="text-center">
                                <p className="text-lg font-semibold">
                                    {isDragging ? 'Drop files here' : 'Click or drag files here'}
                                </p>
                                <p className="text-sm text-muted-foreground mt-1">
                                    Supports: Images, Videos, Audio, PDF (Max 50MB per file)
                                </p>
                            </div>
                        </div>
                        <input
                            id="file-input"
                            type="file"
                            multiple
                            accept="image/*,video/*,audio/*,.pdf"
                            onChange={handleFileSelect}
                            className="hidden"
                        />
                    </div>

                    {/* Selected Files */}
                    {files.length > 0 && (
                        <div className="space-y-2">
                            <Label>Selected Files ({files.length})</Label>
                            <div className="space-y-2 max-h-64 overflow-y-auto">
                                {files.map((file, index) => (
                                    <Card key={index}>
                                        <CardContent className="p-3 flex items-center gap-3">
                                            {getFileIcon(file)}
                                            <div className="flex-1 min-w-0">
                                                <p className="font-medium truncate">{file.name}</p>
                                                <p className="text-xs text-muted-foreground">
                                                    {formatFileSize(file.size)}
                                                </p>
                                            </div>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={(e) => {
                                                    e.stopPropagation()
                                                    removeFile(index)
                                                }}
                                            >
                                                <X className="h-4 w-4" />
                                            </Button>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Associate with Article */}
                    <div className="space-y-2">
                        <Label htmlFor="article">
                            Associate with Article
                            <span className="text-xs text-muted-foreground ml-2">(Optional)</span>
                        </Label>
                        <Select value={articleId || 'none'} onValueChange={(value) => setArticleId(value === 'none' ? '' : value)}>
                            <SelectTrigger id="article">
                                <SelectValue placeholder="Select an article (optional)" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="none">None (Standalone upload)</SelectItem>
                                {display_cards?.map((card) => (
                                    <SelectItem key={card.id} value={card.id.toString()}>
                                        {card.title}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Alt Text */}
                    <div className="space-y-2">
                        <Label htmlFor="alt_text">
                            Alt Text (for images)
                            <span className="text-xs text-muted-foreground ml-2">(SEO & Accessibility)</span>
                        </Label>
                        <Input
                            id="alt_text"
                            value={altText}
                            onChange={(e) => setAltText(e.target.value)}
                            placeholder="Describe the image for screen readers"
                            maxLength={125}
                        />
                        <p className="text-xs text-muted-foreground">
                            {altText.length}/125 characters
                        </p>
                    </div>

                    {/* Upload Button */}
                    <Button
                        onClick={handleUpload}
                        disabled={files.length === 0 || isUploading}
                        className="w-full gap-2"
                        size="lg"
                    >
                        <Upload className="h-5 w-5" />
                        {isUploading ? 'Uploading...' : `Upload ${files.length} ${files.length === 1 ? 'File' : 'Files'}`}
                    </Button>
                </CardContent>
            </Card>
        </div>
    )
}
