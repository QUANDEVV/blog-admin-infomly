'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import Underline from '@tiptap/extension-underline';
import Placeholder from '@tiptap/extension-placeholder';
import { Table } from '@tiptap/extension-table';
import { TableCell } from '@tiptap/extension-table-cell';
import { TableHeader } from '@tiptap/extension-table-header';
import { TableRow } from '@tiptap/extension-table-row';
import { useEffect } from 'react';
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  List,
  ListOrdered,
  Quote,
  Link as LinkIcon,
  Image as ImageIcon,
  Eraser,
  Table as TableIcon,
  Plus,
  Trash2,
  Rows,
  Columns,
  ArrowDown,
  ArrowRight,
  ArrowUp,
  ArrowLeft
} from 'lucide-react';

/**
 * Rich Text Editor Component using Tiptap
 * Provides a professional WYSIWYG editor for content creation
 * Features: Headings, Bold, Italic, Underline, Lists, Links, Images, Tables
 */
export default function RichTextEditor({ value, onChange, placeholder = 'Start writing your content...' }) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3, 4],
        },
        // Disable table-related nodes in StarterKit to avoid conflicts
        table: false,
        tableRow: false,
        tableCell: false,
        tableHeader: false,
      }),
      Image.configure({
        HTMLAttributes: {
          class: 'rounded-lg max-w-full h-auto my-4',
        },
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-blue-600 underline hover:text-blue-800',
        },
      }),
      Underline,
      Placeholder.configure({
        placeholder,
      }),
      /**
       * Table Extension Configuration
       * ─────────────────────────────────────────────────────────────
       * IMPORTANT: Use default TipTap renderHTML to properly handle
       * table structure with both thead and tbody sections.
       */
      Table.configure({
        resizable: true,
        HTMLAttributes: {
          class: 'tiptap-table',
        },
      }),
      TableRow.configure({
        HTMLAttributes: {
          class: 'tiptap-table-row',
        },
      }),
      TableHeader.configure({
        HTMLAttributes: {
          class: 'tiptap-table-header',
        },
      }),
      TableCell.configure({
        HTMLAttributes: {
          class: 'tiptap-table-cell',
        },
      }),
    ],
    content: value || '',
    immediatelyRender: false, // Fix SSR hydration mismatch
    editorProps: {
      attributes: {
        class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-xl max-w-none focus:outline-none min-h-[300px] p-4 border rounded-md',
      },
    },
    onUpdate: ({ editor }) => {
      // Get HTML content and pass to parent
      const html = editor.getHTML();
      onChange(html);
    },
  });

  // Update editor content when value prop changes externally
  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value || '');
    }
  }, [value, editor]);

  if (!editor) {
    return null;
  }

  const addImage = () => {
    const url = window.prompt('Enter image URL:');
    if (url) {
      editor.chain().focus().setImage({ src: url }).run();
    }
  };

  const setLink = () => {
    const url = window.prompt('Enter URL:');
    if (url) {
      editor.chain().focus().setLink({ href: url }).run();
    }
  };

  const insertTable = () => {
    editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run();
  };

  return (
    <div className="border rounded-lg overflow-hidden flex flex-col h-[600px] w-full bg-background relative border-border shadow-sm">
      {/* Main Toolbar - Sticky */}
      <div className="bg-muted/40 border-b p-2 flex flex-wrap gap-1 sticky top-0 z-50 backdrop-blur-sm">
        {/* Headings */}
        <select
          onChange={(e) => {
            const level = parseInt(e.target.value);
            if (level === 0) {
              editor.chain().focus().setParagraph().run();
            } else {
              editor.chain().focus().toggleHeading({ level }).run();
            }
            e.target.value = '0'; // Reset select
          }}
          className="px-2 py-1 rounded border text-sm h-8 bg-background focus:ring-2 focus:ring-ring"
        >
          <option value="0">Normal</option>
          <option value="2">Heading 2</option>
          <option value="3">Heading 3</option>
          <option value="4">Heading 4</option>
        </select>

        <div className="w-px bg-border mx-1 h-6 self-center" />

        {/* Text Formatting */}
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`p-1.5 rounded hover:bg-muted ${editor.isActive('bold') ? 'bg-primary/10 text-primary' : ''
            }`}
          title="Bold (Ctrl+B)"
        >
          <Bold className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`p-1.5 rounded hover:bg-muted ${editor.isActive('italic') ? 'bg-primary/10 text-primary' : ''
            }`}
          title="Italic (Ctrl+I)"
        >
          <Italic className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          className={`p-1.5 rounded hover:bg-muted ${editor.isActive('underline') ? 'bg-primary/10 text-primary' : ''
            }`}
          title="Underline (Ctrl+U)"
        >
          <UnderlineIcon className="w-4 h-4" />
        </button>

        <div className="w-px bg-border mx-1 h-6 self-center" />

        {/* Lists */}
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`p-1.5 rounded hover:bg-muted ${editor.isActive('bulletList') ? 'bg-primary/10 text-primary' : ''
            }`}
          title="Bullet List"
        >
          <List className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={`p-1.5 rounded hover:bg-muted ${editor.isActive('orderedList') ? 'bg-primary/10 text-primary' : ''
            }`}
          title="Numbered List"
        >
          <ListOrdered className="w-4 h-4" />
        </button>

        <div className="w-px bg-border mx-1 h-6 self-center" />

        {/* Blockquote */}
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={`p-1.5 rounded hover:bg-muted ${editor.isActive('blockquote') ? 'bg-primary/10 text-primary' : ''
            }`}
          title="Quote"
        >
          <Quote className="w-4 h-4" />
        </button>

        {/* Link */}
        <button
          type="button"
          onClick={setLink}
          className={`p-1.5 rounded hover:bg-muted ${editor.isActive('link') ? 'bg-primary/10 text-primary' : ''
            }`}
          title="Add Link"
        >
          <LinkIcon className="w-4 h-4" />
        </button>

        {/* Image */}
        <button
          type="button"
          onClick={addImage}
          className="p-1.5 rounded hover:bg-muted"
          title="Add Image"
        >
          <ImageIcon className="w-4 h-4" />
        </button>

        <div className="w-px bg-border mx-1 h-6 self-center" />

        {/* Table Insert Button */}
        <button
          type="button"
          onClick={insertTable}
          className="p-1.5 rounded hover:bg-muted"
          title="Insert Table"
        >
          <TableIcon className="w-4 h-4" />
        </button>

        {/* Clear Formatting */}
        <button
          type="button"
          onClick={() => editor.chain().focus().unsetAllMarks().run()}
          className="p-1.5 rounded hover:bg-muted ml-auto"
          title="Clear Formatting"
        >
          <Eraser className="w-4 h-4" />
        </button>
      </div>

      {/* Secondary Toolbar for Table Operations - Also Sticky just below main toolbar */}
      {editor.isActive('table') && (
        <div className="bg-blue-50/90 dark:bg-blue-900/40 border-b border-blue-100 dark:border-blue-800 p-1 flex flex-wrap gap-1 overflow-x-auto items-center animate-in slide-in-from-top-2 sticky top-[53px] z-40 backdrop-blur-sm">
          <span className="text-xs font-semibold text-blue-600 dark:text-blue-400 px-2 mr-2 border-r border-blue-200 dark:border-blue-800">
            Table Tools
          </span>

          <button
            type="button"
            onClick={() => editor.chain().focus().addColumnBefore().run()}
            className="p-1 rounded hover:bg-blue-100 dark:hover:bg-blue-800 flex items-center gap-1 text-xs"
            title="Add Column Before"
          >
            <Columns className="w-3 h-3" /> <ArrowLeft className="w-3 h-3" />
          </button>

          <button
            type="button"
            onClick={() => editor.chain().focus().addColumnAfter().run()}
            className="p-1 rounded hover:bg-blue-100 dark:hover:bg-blue-800 flex items-center gap-1 text-xs"
            title="Add Column After"
          >
            <Columns className="w-3 h-3" /> <ArrowRight className="w-3 h-3" />
          </button>

          <div className="w-px bg-blue-200 dark:bg-blue-800 h-4 mx-1" />

          <button
            type="button"
            onClick={() => editor.chain().focus().addRowBefore().run()}
            className="p-1 rounded hover:bg-blue-100 dark:hover:bg-blue-800 flex items-center gap-1 text-xs"
            title="Add Row Before"
          >
            <Rows className="w-3 h-3" /> <ArrowUp className="w-3 h-3" />
          </button>

          <button
            type="button"
            onClick={() => editor.chain().focus().addRowAfter().run()}
            className="p-1 rounded hover:bg-blue-100 dark:hover:bg-blue-800 flex items-center gap-1 text-xs"
            title="Add Row After"
          >
            <Rows className="w-3 h-3" /> <ArrowDown className="w-3 h-3" />
          </button>

          <div className="w-px bg-blue-200 dark:bg-blue-800 h-4 mx-1" />

          <button
            type="button"
            onClick={() => editor.chain().focus().deleteColumn().run()}
            className="p-1 rounded hover:bg-red-100 dark:hover:bg-red-900/50 text-red-600 dark:text-red-400 flex items-center gap-1 text-xs"
            title="Delete Direct Column"
          >
            <Trash2 className="w-3 h-3" /> Col
          </button>

          <button
            type="button"
            onClick={() => editor.chain().focus().deleteRow().run()}
            className="p-1 rounded hover:bg-red-100 dark:hover:bg-red-900/50 text-red-600 dark:text-red-400 flex items-center gap-1 text-xs"
            title="Delete Direct Row"
          >
            <Trash2 className="w-3 h-3" /> Row
          </button>

          <div className="w-px bg-blue-200 dark:bg-blue-800 h-4 mx-1" />

          <button
            type="button"
            onClick={() => editor.chain().focus().deleteTable().run()}
            className="p-1 rounded hover:bg-red-100 dark:hover:bg-red-900/50 text-red-600 dark:text-red-400 flex items-center gap-1 text-xs font-semibold"
            title="Delete Entire Table"
          >
            <Trash2 className="w-3 h-3" /> Table
          </button>

        </div>
      )}

      {/* Editor Content Area - Scrollable */}
      <div className="flex-1 overflow-y-auto bg-background">
        <EditorContent editor={editor} className="min-h-full" />
      </div>
    </div>
  );
}
