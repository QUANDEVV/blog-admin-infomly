"use client"

import React, { useRef } from 'react'
import { Button } from '@/components/ui/button'
import {
    Bold, Italic, Underline, List, ListOrdered,
    Quote, Link as LinkIcon, Image as ImageIcon,
    Heading2, Heading3, Heading4, Type, Eraser,
    Youtube, Table as TableIcon, Copy, Upload, FileText
} from 'lucide-react'
import { Separator } from '@/components/ui/separator'
import { useMediaUpload } from '@/hooks/useMediaUpload'

/**
 * EditorToolbar - Formatting Toolbar for TipTap Editor
 */
const EditorToolbar = ({ editor, articleId }) => {
    const fileInputRef = useRef(null)
    const { uploadFile, isUploading } = useMediaUpload()

    if (!editor) {
        return null
    }

    const handleImageUpload = async (event) => {
        const file = event.target.files?.[0]
        if (!file) return

        const url = await uploadFile(file, articleId)

        if (url) {
            editor.chain().focus().setImage({ src: url }).run()
        }

        // Reset input
        if (fileInputRef.current) {
            fileInputRef.current.value = ''
        }
    }

    const triggerImageUpload = () => {
        fileInputRef.current?.click()
    }

    const addYoutubeVideo = () => {
        const url = window.prompt('Enter YouTube URL:')
        if (url) {
            editor.commands.setYoutubeVideo({
                src: url,
            })
        }
    }

    const addTable = () => {
        editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()
    }

    const copyToClipboard = (format = 'html') => {
        const content = format === 'html' ? editor.getHTML() : editor.getText()
        navigator.clipboard.writeText(content).then(() => {
            toast.success(format === 'html' ? 'HTML copied to clipboard!' : 'Plain text copied to clipboard!')
        })
    }

    const setLink = () => {
        const previousUrl = editor.getAttributes('link').href
        const url = window.prompt('Enter URL:', previousUrl)

        // cancelled
        if (url === null) {
            return
        }

        // empty
        if (url === '') {
            editor.chain().focus().extendMarkRange('link').unsetLink().run()
            return
        }

        // update
        editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run()
    }

    const ToolbarButton = ({ onClick, isActive, icon: Icon, title }) => (
        <Button
            type="button"
            variant={isActive ? "default" : "ghost"}
            size="sm"
            onClick={onClick}
            title={title}
            className="h-8 w-8 p-0"
        >
            <Icon className="h-4 w-4" />
        </Button>
    )

    return (
        <div className="border-b bg-background p-3 flex flex-wrap items-center gap-2 sticky top-0 z-10 shadow-sm">
            <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept="image/*"
                onChange={handleImageUpload}
            />

            {/* Headings Group */}
            <div className="flex items-center gap-1 pr-2">
                <ToolbarButton
                    onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                    isActive={editor.isActive('heading', { level: 2 })}
                    icon={Heading2}
                    title="Heading 2"
                />
                <ToolbarButton
                    onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
                    isActive={editor.isActive('heading', { level: 3 })}
                    icon={Heading3}
                    title="Heading 3"
                />
                <ToolbarButton
                    onClick={() => editor.chain().focus().setParagraph().run()}
                    isActive={editor.isActive('paragraph')}
                    icon={Type}
                    title="Normal Text"
                />
            </div>

            <Separator orientation="vertical" className="h-8" />

            {/* Text Formatting Group */}
            <div className="flex items-center gap-1 pr-2">
                <ToolbarButton
                    onClick={() => editor.chain().focus().toggleBold().run()}
                    isActive={editor.isActive('bold')}
                    icon={Bold}
                    title="Bold (Ctrl+B)"
                />
                <ToolbarButton
                    onClick={() => editor.chain().focus().toggleItalic().run()}
                    isActive={editor.isActive('italic')}
                    icon={Italic}
                    title="Italic (Ctrl+I)"
                />
                <ToolbarButton
                    onClick={() => editor.chain().focus().toggleUnderline().run()}
                    isActive={editor.isActive('underline')}
                    icon={Underline}
                    title="Underline (Ctrl+U)"
                />
            </div>

            <Separator orientation="vertical" className="h-8" />

            {/* Lists Group */}
            <div className="flex items-center gap-1 pr-2">
                <ToolbarButton
                    onClick={() => editor.chain().focus().toggleBulletList().run()}
                    isActive={editor.isActive('bulletList')}
                    icon={List}
                    title="Bullet List"
                />
                <ToolbarButton
                    onClick={() => editor.chain().focus().toggleOrderedList().run()}
                    isActive={editor.isActive('orderedList')}
                    icon={ListOrdered}
                    title="Numbered List"
                />
                <ToolbarButton
                    onClick={() => editor.chain().focus().toggleBlockquote().run()}
                    isActive={editor.isActive('blockquote')}
                    icon={Quote}
                    title="Quote"
                />
            </div>

            <Separator orientation="vertical" className="h-8" />

            {/* Media Group */}
            <div className="flex items-center gap-1 pr-2">
                <ToolbarButton
                    onClick={setLink}
                    isActive={editor.isActive('link')}
                    icon={LinkIcon}
                    title="Add Link"
                />
                <ToolbarButton
                    onClick={triggerImageUpload}
                    isActive={false}
                    icon={ImageIcon}
                    title="Upload Image"
                />
                <ToolbarButton
                    onClick={addYoutubeVideo}
                    isActive={editor.isActive('youtube')}
                    icon={Youtube}
                    title="Add YouTube Video"
                />
                <ToolbarButton
                    onClick={addTable}
                    isActive={editor.isActive('table')}
                    icon={TableIcon}
                    title="Insert Table"
                />
            </div>

            <Separator orientation="vertical" className="h-8" />

            {/* Utilities Group */}
            <div className="flex items-center gap-1">
                <ToolbarButton
                    onClick={() => editor.chain().focus().unsetAllMarks().run()}
                    isActive={false}
                    icon={Eraser}
                    title="Clear Formatting"
                />
                <ToolbarButton
                    onClick={() => copyToClipboard('text')}
                    isActive={false}
                    icon={Copy}
                    title="Copy Plain Text"
                />
                <ToolbarButton
                    onClick={() => copyToClipboard('html')}
                    isActive={false}
                    icon={FileText}
                    title="Copy HTML"
                />
            </div>
        </div>
    )
}

export default EditorToolbar
