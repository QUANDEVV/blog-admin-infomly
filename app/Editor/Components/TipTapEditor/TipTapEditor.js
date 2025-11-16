"use client"

import React, { useEffect } from 'react'
import { useEditor, EditorContent } from '@tiptap/react'
import { extensions, getEditorProps } from './extensions'
import EditorToolbar from './EditorToolbar'
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
    const editor = useEditor({
        extensions: extensions,
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

    return (
        <Card className="overflow-hidden border-2 shadow-lg">
            {editable && <EditorToolbar editor={editor} articleId={articleId} />}
            <div className="bg-background">
                <EditorContent editor={editor} />
            </div>
        </Card>
    )
}

export default TipTapEditor
