"use client"

import React, { useState } from 'react'
import ContentStudioSidebar from './ContentStudioSidebar'
import LivePreviewPanel from './LivePreviewPanel'
import TipTapEditor from './TipTapEditor'
import { Button } from '@/components/ui/button'
import { Eye, Edit, Save, X } from 'lucide-react'
import { apiFetch, put } from '@/lib/apiClient'
import { useSWRConfig } from 'swr'

/**
 * EditorManager - Main Studio Container
 * 
 * Purpose: Manages the content studio with split-screen layout
 * - Left: Content library with filters and selection
 * - Right: Live preview OR Editor + Preview (edit mode)
 * 
 * State Management:
 * - selectedContent: Currently selected content for preview/editing
 * - isEditMode: Whether user is editing (false = preview only, true = editor + preview)
 * - editedContent: Current content being edited
 */
const EditorManager = () => {
    const [selectedContent, setSelectedContent] = useState(null)
    const [isEditMode, setIsEditMode] = useState(false)
    const [editedContent, setEditedContent] = useState('')
    const { mutate } = useSWRConfig()

    const handleContentSelect = (content) => {
        setSelectedContent(content)
        setIsEditMode(false) // Reset to preview mode when selecting new content
        setEditedContent(content?.content?.content || '')
    }

    const handleEditMode = () => {
        setIsEditMode(true)
        setEditedContent(selectedContent?.content?.content || '')
    }

    const handleCancelEdit = () => {
        setIsEditMode(false)
        setEditedContent(selectedContent?.content?.content || '')
    }

    const handleSave = async () => {
        if (!selectedContent?.content?.id) {
            alert('No content selected to save')
            return
        }

        try {
            // Show saving state
            const saveButton = document.querySelector('[data-save-button]')
            if (saveButton) {
                saveButton.disabled = true
                saveButton.textContent = 'Saving...'
            }

            const payload = {
                content: editedContent,
                // Keep existing data
                title: selectedContent.title,
                slug: selectedContent.content.slug,
                excerpt: selectedContent.excerpt,
                author_id: selectedContent.content.author_id,
                status: selectedContent.status,
            }

            const response = await put(`/admin/contents/${selectedContent.content.id}`, payload)

            // Update local state with saved content
            setSelectedContent({
                ...selectedContent,
                content: {
                    ...selectedContent.content,
                    content: editedContent
                }
            })

            // Refresh the sidebar list
            mutate('/admin/display-cards')

            alert('✅ Content saved successfully!')
            setIsEditMode(false)
        } catch (error) {
            console.error('Save error:', error)
            alert('❌ Failed to save content. Please try again.')
        } finally {
            // Reset button state
            const saveButton = document.querySelector('[data-save-button]')
            if (saveButton) {
                saveButton.disabled = false
                saveButton.textContent = 'Save Changes'
            }
        }
    }

    return (
        <div className="h-screen flex flex-col">
            {/* Studio Header - STICKY */}
            <div className="sticky top-0 z-50 border-b bg-background px-6 py-4 flex items-center justify-between shadow-sm">
                <div>
                    <h1 className="text-2xl font-bold">Content Studio</h1>
                    <p className="text-sm text-muted-foreground">
                        {isEditMode ? 'Editing content with live preview' : 'Select content to preview how it will appear on your blog'}
                    </p>
                </div>

                {/* Edit Mode Controls */}
                {selectedContent && (
                    <div className="flex items-center gap-2">
                        {!isEditMode ? (
                            <Button onClick={handleEditMode} className="gap-2">
                                <Edit className="h-4 w-4" />
                                Edit Content
                            </Button>
                        ) : (
                            <>
                                <Button variant="outline" onClick={handleCancelEdit} className="gap-2">
                                    <X className="h-4 w-4" />
                                    Cancel
                                </Button>
                                <Button onClick={handleSave} className="gap-2" data-save-button>
                                    <Save className="h-4 w-4" />
                                    Save Changes
                                </Button>
                            </>
                        )}
                    </div>
                )}
            </div>

            {/* Split Screen Layout */}
            <div className="flex-1 flex overflow-hidden">
                {/* Left Panel: Content Library (30%) */}
                <div className="w-[30%] border-r bg-muted/30 overflow-y-auto">
                    <ContentStudioSidebar
                        onContentSelect={handleContentSelect}
                        selectedContentId={selectedContent?.id}
                    />
                </div>

                {/* Right Panel: Preview OR Editor+Preview (70%) */}
                <div className="flex-1 flex overflow-hidden">
                    {!isEditMode ? (
                        /* Preview Only Mode */
                        <div className="flex-1 bg-background overflow-y-auto">
                            <LivePreviewPanel content={selectedContent} />
                        </div>
                    ) : (
                        /* Edit Mode: Split Editor + Preview */
                        <>
                            {/* Editor (50% of right panel) */}
                            <div className="flex-1 border-r bg-background flex flex-col">
                                <div className="sticky top-0 z-10 bg-background border-b px-4 py-3">
                                    <div className="flex items-center gap-2">
                                        <Edit className="h-4 w-4 text-muted-foreground" />
                                        <h3 className="font-semibold">Editor</h3>
                                    </div>
                                </div>
                                <div className="flex-1 overflow-y-auto p-4">
                                    <TipTapEditor
                                        value={editedContent}
                                        onChange={setEditedContent}
                                        placeholder="Start writing your content..."
                                        articleId={selectedContent?.content?.id}
                                    />
                                </div>
                            </div>

                            {/* Live Preview (50% of right panel) */}
                            <div className="flex-1 bg-muted/20 flex flex-col">
                                <div className="sticky top-0 z-10 bg-background border-b px-4 py-3">
                                    <div className="flex items-center gap-2">
                                        <Eye className="h-4 w-4 text-muted-foreground" />
                                        <h3 className="font-semibold">Live Preview</h3>
                                    </div>
                                </div>
                                <div className="flex-1 overflow-y-auto">
                                    <LivePreviewPanel
                                        content={{
                                            ...selectedContent,
                                            content: {
                                                ...selectedContent?.content,
                                                content: editedContent
                                            }
                                        }}
                                    />
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    )
}

export default EditorManager
