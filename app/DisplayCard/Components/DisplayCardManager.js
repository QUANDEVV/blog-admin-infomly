"use client"

import React, { useState, useRef, useEffect } from 'react'
import DisplayCardList from './DisplayCardList_New'
import DisplayCardContentForm from './DisplayCardContentForm'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetClose,
} from '@/components/ui/sheet'
import { useDisplayCards } from '@/hooks/FeatureCard/useDisplayCards'

/**
 * DisplayCardManager - Unified interface for Display Card + Content creation
 * Combines the vintage UI from CreateContent with Display Card functionality
 * Features: Resizable sheet width with drag handle
 * Data: Categories, subcategories, and authors loaded from backend in one call
 */
export default function DisplayCardManager() {
  const [editingCard, setEditingCard] = useState(null)
  const [showStats, setShowStats] = useState(true)
  const [sheetOpen, setSheetOpen] = useState(false)
  const [sheetWidth, setSheetWidth] = useState(920) // Default width in pixels
  const [isResizing, setIsResizing] = useState(false)
  const sheetRef = useRef(null)

  // Get categories, subcategories, and authors from the display cards hook
  const { categories, subcategories, authors } = useDisplayCards()

  // Debug: Log the data to verify it's being received
  useEffect(() => {
    console.log('=== MANAGER DATA ===')
    console.log('Categories:', categories)
    console.log('Subcategories:', subcategories)
    console.log('Authors:', authors)
    console.log('====================')
  }, [categories, subcategories, authors])

  const handleEdit = (card) => {
    setEditingCard(card)
    setSheetOpen(true)
  }

  const handleCreateNew = () => {
    setEditingCard(null)
    setSheetOpen(true)
  }

  const handleFormSuccess = () => {
    setEditingCard(null)
    setSheetOpen(false)
  }

  // Handle mouse down on resize handle
  const handleMouseDown = (e) => {
    e.preventDefault()
    setIsResizing(true)
  }

  // Handle mouse move for resizing
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!isResizing) return

      // Calculate new width based on distance from right edge
      const newWidth = window.innerWidth - e.clientX

      // Set minimum and maximum widths
      const minWidth = 400
      const maxWidth = window.innerWidth - 100

      if (newWidth >= minWidth && newWidth <= maxWidth) {
        setSheetWidth(newWidth)
      }
    }

    const handleMouseUp = () => {
      setIsResizing(false)
    }

    if (isResizing) {
      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleMouseUp)
      document.body.style.cursor = 'ew-resize'
      document.body.style.userSelect = 'none'
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
      document.body.style.cursor = ''
      document.body.style.userSelect = ''
    }
  }, [isResizing])

  return (
    <div className="flex flex-col h-[calc(100vh-80px)] overflow-hidden">
      {/* Sticky Header */}
      <div className="flex-shrink-0 flex items-center justify-between pb-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Display Card Management</h1>
          <p className="text-muted-foreground mt-1">Create and manage your blog content</p>
        </div>
        <Button onClick={handleCreateNew} size="default" className="gap-2">
          <Plus className="w-4 h-4" /> New Display Card
        </Button>
      </div>

      {/* Display Card List with Stats and Filters - Scrollable */}
      <div className="flex-1 overflow-hidden">
        <DisplayCardList
          onEdit={handleEdit}
          showStats={showStats}
          onToggleStats={() => setShowStats(!showStats)}
        />
      </div>

      {/* Display Card + Content Form Sheet with Resizable Width */}
      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetContent
          ref={sheetRef}
          side="right"
          className="overflow-y-auto p-0"
          style={{ width: `${sheetWidth}px`, maxWidth: '95vw' }}
        >
          {/* Resize Handle */}
          <div
            onMouseDown={handleMouseDown}
            className={`absolute left-0 top-0 bottom-0 w-1 cursor-ew-resize hover:bg-blue-500 transition-colors ${isResizing ? 'bg-blue-500' : 'bg-transparent'
              }`}
            style={{ zIndex: 50 }}
          >
            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-12 bg-gray-300 dark:bg-gray-600 rounded-r" />
          </div>

          <SheetHeader className="px-6 pt-6">
            <SheetTitle>{editingCard ? 'Edit Display Card & Content' : 'Create Display Card & Content'}</SheetTitle>
            <p className="text-xs text-muted-foreground mt-1">Drag the left edge to resize</p>
          </SheetHeader>
          <div className="mt-0">
            <DisplayCardContentForm
              card={editingCard}
              categories={categories}
              subcategories={subcategories}
              authors={authors}
              onSuccess={handleFormSuccess}
            />
          </div>
          <SheetClose />
        </SheetContent>
      </Sheet>
    </div>
  )
}
