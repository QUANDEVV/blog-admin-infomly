"use client"

import React, { useState } from 'react'
import ContentStudioSidebar from './ContentStudioSidebar'
import LivePreviewPanel from './LivePreviewPanel'
import TipTapEditor from './TipTapEditor'
import { Button } from '@/components/ui/button'
import { Eye, Edit, Save, X, Menu, Maximize2, Minimize2 } from 'lucide-react'
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
    const [isSidebarOpen, setIsSidebarOpen] = useState(false) // Mobile sidebar toggle
    const [isFocusMode, setIsFocusMode] = useState(false) // Focus mode for distraction-free reading
    const { mutate } = useSWRConfig()

    const handleContentSelect = (content) => {
        setSelectedContent(content)
        setIsEditMode(false) // Reset to preview mode when selecting new content
        setEditedContent(content?.content?.content || '')
        setIsSidebarOpen(false) // Close sidebar on mobile after selection
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
            {!isFocusMode && (
                <div className="sticky top-0 z-50 border-b bg-background px-4 md:px-6 py-3 md:py-4 flex items-center justify-between shadow-sm">
                    <div className="flex items-center gap-3">
                        {/* Mobile Menu Toggle */}
                        <Button
                            variant="ghost"
                            size="icon"
                            className="md:hidden"
                            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                        >
                            <Menu className="h-5 w-5" />
                        </Button>

                        <div>
                            <h1 className="text-lg md:text-2xl font-bold">Content Studio</h1>
                            <p className="text-xs md:text-sm text-muted-foreground hidden sm:block">
                                {isEditMode ? 'Editing content with live preview' : 'Select content to preview how it will appear on your blog'}
                            </p>
                        </div>
                    </div>

                    {/* Controls */}
                    <div className="flex items-center gap-2">
                        {/* Focus Mode Toggle */}
                        {selectedContent && !isEditMode && (
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setIsFocusMode(!isFocusMode)}
                                className="gap-2 hidden md:flex"
                            >
                                <Maximize2 className="h-4 w-4" />
                                <span className="hidden lg:inline">Focus</span>
                            </Button>
                        )}

                        {/* Edit Mode Controls */}
                        {selectedContent && (
                            !isEditMode ? (
                                <Button onClick={handleEditMode} className="gap-2" size="sm">
                                    <Edit className="h-4 w-4" />
                                    <span className="hidden sm:inline">Edit Content</span>
                                </Button>
                            ) : (
                                <>
                                    <Button variant="outline" onClick={handleCancelEdit} className="gap-2" size="sm">
                                        <X className="h-4 w-4" />
                                        <span className="hidden sm:inline">Cancel</span>
                                    </Button>
                                    <Button onClick={handleSave} className="gap-2" data-save-button size="sm">
                                        <Save className="h-4 w-4" />
                                        <span className="hidden sm:inline">Save</span>
                                    </Button>
                                </>
                            )
                        )}
                    </div>
                </div>
            )}

            {/* Split Screen Layout */}
            <div className="flex-1 flex overflow-hidden relative">
                {/* Left Panel: Content Library - Hidden on mobile by default, shown as overlay when opened */}
                <div
                    className={`
                        ${isFocusMode ? 'hidden' : ''}
                        w-full md:w-[340px] lg:w-[380px] border-r bg-muted/30 overflow-y-auto
                        fixed md:static inset-0 z-40 md:z-auto
                        transition-transform duration-300 ease-in-out
                        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
                    `}
                >
                    {/* Mobile Sidebar Header */}
                    <div className="md:hidden sticky top-0 z-10 bg-background border-b px-4 py-3 flex items-center justify-between">
                        <h2 className="font-semibold">Select Content</h2>
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setIsSidebarOpen(false)}
                        >
                            <X className="h-5 w-5" />
                        </Button>
                    </div>

                    <ContentStudioSidebar
                        onContentSelect={handleContentSelect}
                        selectedContentId={selectedContent?.id}
                    />
                </div>

                {/* Overlay for mobile sidebar */}
                {isSidebarOpen && (
                    <div
                        className="fixed inset-0 bg-black/50 z-30 md:hidden"
                        onClick={() => setIsSidebarOpen(false)}
                    />
                )}

                {/* Right Panel: Preview OR Editor+Preview */}
                <div className="flex-1 flex overflow-hidden">
                    {!isEditMode ? (
                        /* Preview Only Mode */
                        <div className="flex-1 bg-background overflow-y-auto relative">
                            {/* Focus Mode Exit Button */}
                            {isFocusMode && (
                                <Button
                                    variant="outline"
                                    size="icon"
                                    className="fixed top-4 right-4 z-50 shadow-lg"
                                    onClick={() => setIsFocusMode(false)}
                                >
                                    <Minimize2 className="h-4 w-4" />
                                </Button>
                            )}
                            <LivePreviewPanel content={selectedContent} />
                        </div>
                    ) : (
                        /* Edit Mode: Split Editor + Preview (desktop only, mobile shows editor only) */
                        <>
                            {/* Editor */}
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
                                        articleId={selectedContent?.id}
                                    />
                                </div>
                            </div>

                            {/* Live Preview - Hidden on mobile in edit mode */}
                            <div className="hidden lg:flex flex-1 bg-muted/20 flex-col">
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
