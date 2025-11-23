"use client"

import React, { useRef, useState } from 'react'
import { Button } from '@/components/ui/button'
import {
    Bold, Italic, Underline, List, ListOrdered,
    Quote, Link as LinkIcon, Image as ImageIcon,
    Heading2, Heading3, Heading4, Type, Eraser,
    Youtube, Table as TableIcon, Copy, Upload, FileText,
    Plus, Minus, Highlighter, Palette, TableProperties,
    Columns3, Rows3
} from 'lucide-react'
import { Separator } from '@/components/ui/separator'
import { useMediaUpload } from '@/hooks/useMediaUpload'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

/**
 * EditorToolbar - Formatting Toolbar for TipTap Editor
 * Features: Two-row layout, sticky positioning, active state highlighting, text colors
 */
const EditorToolbar = ({ editor, articleId }) => {
    const fileInputRef = useRef(null)
    const { uploadFile, isUploading } = useMediaUpload()
    const [showColorPicker, setShowColorPicker] = useState(false)

    // Highlight colors palette
    const highlightColors = [
        { name: 'Yellow', value: '#fef08a' },
        { name: 'Lime', value: '#d9f99d' },
        { name: 'Green', value: '#bbf7d0' },
        { name: 'Cyan', value: '#a5f3fc' },
        { name: 'Blue', value: '#bfdbfe' },
        { name: 'Indigo', value: '#c7d2fe' },
        { name: 'Purple', value: '#e9d5ff' },
        { name: 'Pink', value: '#fbcfe8' },
        { name: 'Rose', value: '#fecdd3' },
        { name: 'Orange', value: '#fed7aa' },
        { name: 'Amber', value: '#fde68a' },
        { name: 'Red', value: '#fecaca' },
        { name: 'Gray', value: '#e5e7eb' },
        { name: 'Slate', value: '#cbd5e1' },
        { name: 'Zinc', value: '#d4d4d8' },
        { name: 'Stone', value: '#d6d3d1' },
    ]

    if (!editor) {
        return null
    }

    const handleImageUpload = async (event) => {
        const file = event.target.files?.[0]
        if (!file) return

        const result = await uploadFile(file, articleId)

        if (result) {
            // Use the URL to insert image (backward compatible)
            const url = typeof result === 'string' ? result : result.url
            editor.chain().focus().setImage({ src: url }).run()
            
            // Optional: Store media_id in image node for future tracking
            // editor.chain().focus().setImage({ 
            //     src: url, 
            //     'data-media-id': result.mediaId 
            // }).run()
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

    // Table manipulation functions
    const addRowBefore = () => editor.chain().focus().addRowBefore().run()
    const addRowAfter = () => editor.chain().focus().addRowAfter().run()
    const deleteRow = () => editor.chain().focus().deleteRow().run()
    const addColumnBefore = () => editor.chain().focus().addColumnBefore().run()
    const addColumnAfter = () => editor.chain().focus().addColumnAfter().run()
    const deleteColumn = () => editor.chain().focus().deleteColumn().run()
    const deleteTable = () => editor.chain().focus().deleteTable().run()
    const toggleHeaderRow = () => editor.chain().focus().toggleHeaderRow().run()

    const setHighlight = (color) => {
        editor.chain().focus().setHighlight({ color }).run()
        setShowColorPicker(false)
    }

    const removeHighlight = () => {
        editor.chain().focus().unsetHighlight().run()
        setShowColorPicker(false)
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
        <div className="border-b bg-background sticky top-0 z-50 shadow-sm">
            <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept="image/*"
                onChange={handleImageUpload}
            />

            {/* Row 1: Primary Formatting */}
            <div className="p-2 flex flex-wrap items-center gap-2 border-b">
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

                    {/* Highlight Color Picker */}
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button
                                type="button"
                                variant={editor.isActive('highlight') ? "default" : "ghost"}
                                size="sm"
                                className="h-8 w-8 p-0"
                                title="Highlight Text"
                            >
                                <Highlighter className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="start" className="w-48">
                            <div className="grid grid-cols-4 gap-1 p-2">
                                {highlightColors.map((color) => (
                                    <button
                                        key={color.value}
                                        onClick={() => setHighlight(color.value)}
                                        className="w-8 h-8 rounded border-2 border-gray-300 hover:border-gray-900 transition-colors"
                                        style={{ backgroundColor: color.value }}
                                        title={color.name}
                                    />
                                ))}
                            </div>
                            <DropdownMenuItem onClick={removeHighlight} className="text-sm">
                                <Eraser className="h-4 w-4 mr-2" />
                                Remove Highlight
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
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
                </div>
            </div>

            {/* Row 2: Advanced Tools */}
            <div className="p-2 flex flex-wrap items-center gap-2">
                {/* Table Tools */}
                <div className="flex items-center gap-1 pr-2">
                    <ToolbarButton
                        onClick={addTable}
                        isActive={editor.isActive('table')}
                        icon={TableIcon}
                        title="Insert Table (3x3)"
                    />
                    
                    {/* Table Manipulation - Only show when inside a table */}
                    {editor.isActive('table') && (
                        <>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        className="h-8 w-8 p-0"
                                        title="Row Actions"
                                    >
                                        <Rows3 className="h-4 w-4" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="start">
                                    <DropdownMenuItem onClick={addRowBefore}>
                                        <Plus className="h-4 w-4 mr-2" />
                                        Add Row Above
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={addRowAfter}>
                                        <Plus className="h-4 w-4 mr-2" />
                                        Add Row Below
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={deleteRow} className="text-destructive">
                                        <Minus className="h-4 w-4 mr-2" />
                                        Delete Row
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>

                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        className="h-8 w-8 p-0"
                                        title="Column Actions"
                                    >
                                        <Columns3 className="h-4 w-4" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="start">
                                    <DropdownMenuItem onClick={addColumnBefore}>
                                        <Plus className="h-4 w-4 mr-2" />
                                        Add Column Left
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={addColumnAfter}>
                                        <Plus className="h-4 w-4 mr-2" />
                                        Add Column Right
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={deleteColumn} className="text-destructive">
                                        <Minus className="h-4 w-4 mr-2" />
                                        Delete Column
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>

                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        className="h-8 px-2"
                                        title="Table Options"
                                    >
                                        <TableProperties className="h-4 w-4 mr-1" />
                                        <span className="text-xs">Table</span>
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="start">
                                    <DropdownMenuItem onClick={toggleHeaderRow}>
                                        <TableIcon className="h-4 w-4 mr-2" />
                                        Toggle Header Row
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={deleteTable} className="text-destructive">
                                        <Minus className="h-4 w-4 mr-2" />
                                        Delete Table
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </>
                    )}
                </div>

                <Separator orientation="vertical" className="h-8" />

                {/* Media Extended */}
                <div className="flex items-center gap-1 pr-2">
                    <ToolbarButton
                        onClick={addYoutubeVideo}
                        isActive={editor.isActive('youtube')}
                        icon={Youtube}
                        title="Add YouTube Video"
                    />
                </div>

                <Separator orientation="vertical" className="h-8" />

                {/* Copy Tools */}
                <div className="flex items-center gap-1">
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
        </div>
    )
}

export default EditorToolbar
