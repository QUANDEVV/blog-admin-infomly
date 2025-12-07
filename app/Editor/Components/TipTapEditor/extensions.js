/**
 * TipTap Extensions Configuration
 * 
 * Purpose: Centralized configuration for all TipTap extensions
 * Benefits:
 * - Easy to add/remove features
 * - Consistent styling across editors
 * - Reusable configuration
 * - Single source of truth
 */

import StarterKit from '@tiptap/starter-kit'
import Underline from '@tiptap/extension-underline'
import Link from '@tiptap/extension-link'
import Highlight from '@tiptap/extension-highlight'
import Youtube from '@tiptap/extension-youtube'
import { Table } from '@tiptap/extension-table'
import { TableCell } from '@tiptap/extension-table-cell'
import { TableHeader } from '@tiptap/extension-table-header'
import { TableRow } from '@tiptap/extension-table-row'
import Placeholder from '@tiptap/extension-placeholder'
import { EditableImage } from './ImageExtension'

export const getExtensions = (onImageClick) => [
    StarterKit.configure({
        heading: {
            levels: [1, 2, 3, 4],
        },
        bulletList: {
            keepMarks: true,
            keepAttributes: false,
        },
        orderedList: {
            keepMarks: true,
            keepAttributes: false,
        },
        // Disable table-related nodes in StarterKit to avoid conflicts
        table: false,
        tableRow: false,
        tableCell: false,
        tableHeader: false,
    }),
    Underline,
    Highlight.configure({
        multicolor: true, // Allow multiple colors
    }),
    Link.configure({
        openOnClick: false,
        HTMLAttributes: {
            class: 'text-primary underline underline-offset-4',
        },
    }),
    EditableImage.configure({
        HTMLAttributes: {
            class: 'rounded-lg border border-border cursor-pointer hover:shadow-lg transition-shadow',
        },
        allowBase64: false, // Force upload
        onImageClick, // Pass the callback
    }),
    Youtube.configure({
        controls: false,
        nocookie: true,
        width: 640,
        height: 480,
    }),
    /**
     * Table Extension Configuration
     * ─────────────────────────────────────────────────────────────
     * IMPORTANT: Use default TipTap renderHTML to properly handle
     * table structure with both thead and tbody sections.
     * Custom renderHTML was causing tables to lose content on save/reload
     * because it only outputted tbody, ignoring thead for header rows.
     */
    Table.configure({
        resizable: true,
        HTMLAttributes: {
            class: 'tiptap-table',
        },
        // Let TipTap handle the HTML rendering natively for proper table structure
    }),
    TableRow.configure({
        HTMLAttributes: {
            class: 'tiptap-table-row',
        },
        // Let TipTap handle the HTML rendering natively
    }),
    TableHeader.configure({
        HTMLAttributes: {
            class: 'tiptap-table-header',
        },
        // Let TipTap handle the HTML rendering natively
    }),
    TableCell.configure({
        HTMLAttributes: {
            class: 'tiptap-table-cell',
        },
        // Let TipTap handle the HTML rendering natively
    }),
    Placeholder.configure({
        placeholder: 'Start writing your masterpiece...',
        emptyEditorClass: 'is-editor-empty',
    }),
]

/**
 * Editor Props Configuration
 * Consistent styling and behavior across all editors
 */
export const getEditorProps = () => ({
    attributes: {
        class: `
      prose prose-base dark:prose-invert max-w-none 
      focus:outline-none min-h-[500px] p-8
      prose-headings:font-bold prose-headings:tracking-tight prose-headings:mb-4
      prose-h1:text-4xl prose-h2:text-3xl prose-h3:text-2xl prose-h4:text-xl
      prose-p:leading-relaxed prose-p:mb-4 prose-p:text-foreground/90
      prose-a:text-primary prose-a:underline hover:prose-a:text-primary/80
      prose-strong:text-foreground prose-strong:font-semibold
      prose-code:text-primary prose-code:bg-muted prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-sm
      prose-pre:bg-muted prose-pre:border prose-pre:p-4 prose-pre:rounded-lg
      prose-img:rounded-lg prose-img:shadow-md prose-img:my-6
      prose-blockquote:border-l-4 prose-blockquote:border-primary prose-blockquote:bg-muted/50 prose-blockquote:py-2 prose-blockquote:px-4 prose-blockquote:italic
      prose-ul:list-disc prose-ul:ml-6 prose-ul:my-4
      prose-ol:list-decimal prose-ol:ml-6 prose-ol:my-4
      prose-li:text-foreground/90 prose-li:my-1
    `.replace(/\s+/g, ' ').trim(),
    },
})
