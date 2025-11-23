"use client"

import React, { useEffect, useState } from 'react'
import { useEditor, EditorContent } from '@tiptap/react'
import { getExtensions, getEditorProps } from './extensions'
import EditorToolbar from './EditorToolbar'
import ImageEditDialog from './ImageEditDialog'
import { Card } from '@/components/ui/card'

/**
 * TipTapEditor - Main Editor Component
 * 
 * Purpose: Reusable, scalable rich text editor
 * Features:
 * - Full TipTap functionality
 * - Modular toolbar
 * - Auto-sync with parent state
 * - Clean separation of concerns
 * 
 * Props:
 * @param {string} value - HTML content
 * @param {function} onChange - Callback when content changes
 * @param {string} placeholder - Placeholder text
 * @param {boolean} editable - Whether editor is editable (default: true)
 */
const TipTapEditor = ({
    value,
    onChange,
    placeholder = 'Start writing your content...',
    editable = true,
    articleId,
}) => {
    const [selectedImage, setSelectedImage] = useState(null)
    const [imageEditPos, setImageEditPos] = useState(null)
    const [isImageDialogOpen, setIsImageDialogOpen] = useState(false)

    // Handle image click
    const handleImageClick = ({ url, alt, pos, node }) => {
        setSelectedImage({ url, alt, node })
        setImageEditPos(pos)
        setIsImageDialogOpen(true)
    }

    const editor = useEditor({
        extensions: getExtensions(handleImageClick),
        content: value || '',
        immediatelyRender: false, // Fix SSR hydration
        editable,
        editorProps: getEditorProps(),
        onUpdate: ({ editor }) => {
            const html = editor.getHTML()
            onChange?.(html)
        },
    })

    // Sync external value changes
    useEffect(() => {
        if (editor && value !== editor.getHTML()) {
            editor.commands.setContent(value || '')
        }
    }, [value, editor])

    // Update editable state
    useEffect(() => {
        if (editor) {
            editor.setEditable(editable)
        }
    }, [editable, editor])

    if (!editor) {
        return (
            <Card className="p-6">
                <div className="animate-pulse">
                    <div className="h-4 bg-muted rounded w-3/4 mb-4"></div>
                    <div className="h-4 bg-muted rounded w-1/2"></div>
                </div>
            </Card>
        )
    }

    // Handle image update
    const handleImageUpdate = (attrs) => {
        if (editor && imageEditPos !== null) {
            editor.chain()
                .focus()
                .setNodeSelection(imageEditPos)
                .updateAttributes('image', attrs)
                .run()
        }
    }

    // Handle image delete
    const handleImageDelete = () => {
        if (editor && imageEditPos !== null) {
            editor.chain()
                .focus()
                .setNodeSelection(imageEditPos)
                .deleteSelection()
                .run()
        }
    }

    return (
        <>
            <div className="flex flex-col h-full">
                {editable && <EditorToolbar editor={editor} articleId={articleId} />}
                <Card className="overflow-auto flex-1 border-2 shadow-lg">
                    <div className="bg-background min-h-full">
                        <EditorContent editor={editor} />
                    </div>
                </Card>
            </div>

            {/* Image Edit Dialog */}
            <ImageEditDialog
                isOpen={isImageDialogOpen}
                onClose={() => {
                    setIsImageDialogOpen(false)
                    setSelectedImage(null)
                    setImageEditPos(null)
                }}
                imageData={selectedImage}
                onUpdate={handleImageUpdate}
                onDelete={handleImageDelete}
                articleId={articleId}
            />
        </>
    )
}

export default TipTapEditor
