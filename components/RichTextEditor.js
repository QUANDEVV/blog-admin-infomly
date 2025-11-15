'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import Underline from '@tiptap/extension-underline';
import Placeholder from '@tiptap/extension-placeholder';
import { useEffect } from 'react';

/**
 * Rich Text Editor Component using Tiptap
 * Provides a professional WYSIWYG editor for content creation
 * Features: Headings, Bold, Italic, Underline, Lists, Links, Images
 */
export default function RichTextEditor({ value, onChange, placeholder = 'Start writing your content...' }) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3, 4],
        },
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

  return (
    <div className="border rounded-lg overflow-hidden">
      {/* Toolbar */}
      <div className="bg-gray-50 dark:bg-gray-800 border-b p-2 flex flex-wrap gap-1">
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
          className="px-2 py-1 rounded border text-sm"
        >
          <option value="0">Normal</option>
          <option value="2">Heading 2</option>
          <option value="3">Heading 3</option>
          <option value="4">Heading 4</option>
        </select>

        <div className="w-px bg-gray-300 dark:bg-gray-600 mx-1" />

        {/* Text Formatting */}
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`px-3 py-1 rounded font-bold ${
            editor.isActive('bold') ? 'bg-blue-500 text-white' : 'bg-white dark:bg-gray-700'
          }`}
          title="Bold (Ctrl+B)"
        >
          B
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`px-3 py-1 rounded italic ${
            editor.isActive('italic') ? 'bg-blue-500 text-white' : 'bg-white dark:bg-gray-700'
          }`}
          title="Italic (Ctrl+I)"
        >
          I
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          className={`px-3 py-1 rounded underline ${
            editor.isActive('underline') ? 'bg-blue-500 text-white' : 'bg-white dark:bg-gray-700'
          }`}
          title="Underline (Ctrl+U)"
        >
          U
        </button>

        <div className="w-px bg-gray-300 dark:bg-gray-600 mx-1" />

        {/* Lists */}
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`px-3 py-1 rounded ${
            editor.isActive('bulletList') ? 'bg-blue-500 text-white' : 'bg-white dark:bg-gray-700'
          }`}
          title="Bullet List"
        >
          • List
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={`px-3 py-1 rounded ${
            editor.isActive('orderedList') ? 'bg-blue-500 text-white' : 'bg-white dark:bg-gray-700'
          }`}
          title="Numbered List"
        >
          1. List
        </button>

        <div className="w-px bg-gray-300 dark:bg-gray-600 mx-1" />

        {/* Blockquote */}
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={`px-3 py-1 rounded ${
            editor.isActive('blockquote') ? 'bg-blue-500 text-white' : 'bg-white dark:bg-gray-700'
          }`}
          title="Quote"
        >
          "
        </button>

        {/* Link */}
        <button
          type="button"
          onClick={setLink}
          className={`px-3 py-1 rounded ${
            editor.isActive('link') ? 'bg-blue-500 text-white' : 'bg-white dark:bg-gray-700'
          }`}
          title="Add Link"
        >
          🔗
        </button>

        {/* Image */}
        <button
          type="button"
          onClick={addImage}
          className="px-3 py-1 rounded bg-white dark:bg-gray-700"
          title="Add Image"
        >
          🖼️
        </button>

        <div className="w-px bg-gray-300 dark:bg-gray-600 mx-1" />

        {/* Clear Formatting */}
        <button
          type="button"
          onClick={() => editor.chain().focus().unsetAllMarks().run()}
          className="px-3 py-1 rounded bg-white dark:bg-gray-700 text-sm"
          title="Clear Formatting"
        >
          Clear
        </button>
      </div>

      {/* Editor Content */}
      <EditorContent editor={editor} />
    </div>
  );
}
