"use client"

import React, { useState } from 'react'
import ContentList from './ContentList'
import ContentForm from './ContentForm'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetClose,
} from '@/components/ui/sheet'

/**
 * ContentManager
 * - Displays full-width content list with create/edit capabilities
 * - Uses a side panel (Sheet) for creating/editing content
 */
export default function ContentManager() {
  // State to handle which content is being edited (null = creating new)
  const [editingContent, setEditingContent] = useState(null)
  // State to control stats visibility in the list
  const [showStats, setShowStats] = useState(true)
  // State to control sheet visibility
  const [sheetOpen, setSheetOpen] = useState(false)

  // Handle when user clicks edit on a content
  const handleEdit = (content) => {
    setEditingContent(content)
    setSheetOpen(true)
  }

  // Handle when user clicks create new content
  const handleCreateNew = () => {
    setEditingContent(null)
    setSheetOpen(true)
  }

  // Handle successful create/update - reset editing state and close sheet
  const handleFormSuccess = () => {
    setEditingContent(null)
    setSheetOpen(false)
  }

  return (
    <div className="space-y-6">
      {/* Header with New Content Button */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Content Management</h1>
          <p className="text-muted-foreground mt-1">Create and manage your blog content</p>
        </div>
        <Button onClick={handleCreateNew} size="default" className="gap-2">
          <Plus className="w-4 h-4" /> New Content
        </Button>
      </div>

      {/* Content list */}
      <ContentList 
        onEdit={handleEdit} 
        showStats={showStats}
        onToggleStats={() => setShowStats(!showStats)}
      />

      {/* Content Form Sheet (slide-over) - used for Create & Edit */}
      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetContent side="right" className="w-full sm:w-[720px] lg:w-[900px] overflow-y-auto">
          <SheetHeader>
            <SheetTitle>{editingContent ? 'Edit Content' : 'Create Content'}</SheetTitle>
          </SheetHeader>
          <div className="mt-4">
            <ContentForm 
              content={editingContent}
              onSuccess={handleFormSuccess}
            />
          </div>
          <SheetClose />
        </SheetContent>
      </Sheet>
    </div>
  )
}
