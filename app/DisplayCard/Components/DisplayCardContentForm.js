"use client"

import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Maximize, Minimize, Image as ImageIcon, FileText, User, Hash } from 'lucide-react'
import { useCreateDisplayCard, useUpdateDisplayCard } from '@/hooks/FeatureCard/useDisplayCards'
import { compressImage } from '@/utils/imageCompression'
import RichTextEditor from '@/components/RichTextEditor'

/**
 * DisplayCardContentForm - Unified form for creating/editing Display Card + Content
 * 
 * Props:
 * - card: Display Card object to edit (null for create mode)
 * - categories: Array of all categories (passed from parent)
 * - subcategories: Array of all subcategories (passed from parent)
 * - authors: Array of all authors (passed from parent)
 * - onSuccess: Callback when form is successfully submitted
 * 
 * This form handles both Display Card fields (presentation layer) and Content fields (data layer)
 * in a single interface, while maintaining separate backend tables for scalability.
 * 
 * Display Card Section:
 * - title: Main display title
 * - excerpt: Short preview text
 * - featured_image: Image for card display
 * - category_id: Primary category
 * - subcategory_id: Subcategory within category
 * - status: draft/published
 * 
 * Content Section:
 * - content (body): Full article content
 * - author_id: Content author
 * - slug: URL-friendly identifier
 * 
 * Backend Integration:
 * - Auto-creates Content record when saving Display Card
 * - Links via content_id foreign key
 * - Both tables have status field for draft handling
 * - Content can be empty for draft Display Cards
 */
const DisplayCardContentForm = ({ card, categories = [], subcategories = [], authors = [], onSuccess }) => {
  const isEditMode = !!card

  // Log form props for debugging
  useEffect(() => {
    // Debug logging removed for performance
  }, [categories, subcategories, authors])  // ===== DISPLAY CARD FIELDS =====
  const [title, setTitle] = useState('')
  const [titleExpanded, setTitleExpanded] = useState(false)
  const [excerpt, setExcerpt] = useState('')
  const [categoryId, setCategoryId] = useState('')
  const [subcategoryId, setSubcategoryId] = useState('')
  const [status, setStatus] = useState('draft')
  const [featuredImage, setFeaturedImage] = useState(null)
  const [previewUrl, setPreviewUrl] = useState(null)
  const [altText, setAltText] = useState('')

  // ===== CONTENT FIELDS =====
  const [contentBody, setContentBody] = useState('')
  const [authorId, setAuthorId] = useState('')
  const [slug, setSlug] = useState('')

  // ===== FORM STATE =====
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [loadingMessage, setLoadingMessage] = useState('') // Track what's happening during save
  const [error, setError] = useState(null)
  const [successMessage, setSuccessMessage] = useState(null)

  // ===== API HOOKS =====
  const { createDisplayCard } = useCreateDisplayCard()
  const { updateDisplayCard } = useUpdateDisplayCard()

  // Filter subcategories based on selected category
  const filteredSubcategories = categoryId
    ? subcategories?.filter((sc) => String(sc.category?.id ?? sc.category_id) === categoryId)
    : subcategories

    /**
   * Load existing data when editing
   * Display Card data comes from card prop
   * Categories, subcategories, and authors are passed as props from parent
   * (loaded from backend in a single API call)
   */
  useEffect(() => {
    if (card) {
      // Extract data from card for editing (debug logging removed for performance)
      
      // Load Display Card fields
      setTitle(card.title || '')
      setExcerpt(card.excerpt || '')
      
      // Extract category from subcategory.category structure
      const extractedCategoryId = card.subcategory?.category?.id?.toString() || ''
      setCategoryId(extractedCategoryId)
      
      // Extract subcategory ID
      const extractedSubcategoryId = card.subcategory?.id?.toString() || card.subcategory_id?.toString() || ''
      setSubcategoryId(extractedSubcategoryId)
      
      setStatus(card.status || 'draft')
      setPreviewUrl(card.featured_image || null)
      setAltText(card.alt_text || '')
      setFeaturedImage(null)

      // Load Content fields if linked
      if (card.content) {
        setContentBody(card.content.content || card.content.body || '')
        
        // Extract author ID from content.author or content.author_id
        const extractedAuthorId = card.content.author?.id?.toString() || card.content.author_id?.toString() || ''
        setAuthorId(extractedAuthorId)
        
        setSlug(card.content.slug || '')
      } else {
        // No content linked yet (draft Display Card)
        setContentBody('')
        setAuthorId('')
        setSlug('')
      }
    } else {
      // Reset all fields for create mode
      setTitle('')
      setExcerpt('')
      setCategoryId('')
      setSubcategoryId('')
      setStatus('draft')
      setFeaturedImage(null)
      setPreviewUrl(null)
      setAltText('')
      setContentBody('')
      setAuthorId('')
      setSlug('')
    }
  }, [card])

  /**
   * Clean up blob URLs when component unmounts
   */
  useEffect(() => {
    return () => {
      if (previewUrl && previewUrl.startsWith('blob:')) {
        URL.revokeObjectURL(previewUrl)
      }
    }
  }, [previewUrl])

  /**
   * Handle image selection and compression
   * Optimized for speed - lower quality, smaller size
   */
  const handleImageChange = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    try {
      // Compress image before preview (optimized for speed)
      const compressed = await compressImage(file, {
        maxSizeMB: 0.5, // Reduced from 1MB for faster upload
        maxWidthOrHeight: 1920,
      })
      setFeaturedImage(compressed)
      
      // Create preview URL
      const url = URL.createObjectURL(compressed)
      if (previewUrl && previewUrl.startsWith('blob:')) {
        URL.revokeObjectURL(previewUrl)
      }
      setPreviewUrl(url)
    } catch (err) {
      console.error('Error compressing image:', err)
      setError('Failed to process image')
    }
  }

  /**
   * Generate URL-friendly slug from title
   */
  const generateSlug = (value) =>
    value
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim()

  /**
   * Handle form submission
   * Creates/updates both Display Card and Content in a unified workflow
   */
  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    setSuccessMessage(null)

    // Validate Display Card required fields
    if (!title.trim()) {
      setError('Title is required')
      return
    }

    if (!categoryId) {
      setError('Category is required')
      return
    }

    if (!subcategoryId) {
      setError('Subcategory is required')
      return
    }

    // Validate Content fields if publishing
    if (status === 'published') {
      if (!contentBody.trim()) {
        setError('Content body is required for published cards')
        return
      }
      if (!authorId) {
        setError('Author is required for published cards')
        return
      }
    }

    setIsSubmitting(true)
    setLoadingMessage('Preparing data...')

    try {
      // Build FormData for Display Card (supports file upload)
      const formData = new FormData()
      
      // Display Card fields
      formData.append('title', title.trim())
      formData.append('excerpt', excerpt.trim() || '')
      formData.append('category_id', categoryId)
      formData.append('subcategory_id', subcategoryId)
      formData.append('status', status)
      
      if (featuredImage) {
        setLoadingMessage('Uploading image...')
        formData.append('featured_image', featuredImage)
      }
      if (altText) {
        formData.append('alt_text', altText)
      }

      // Content fields (passed as form data for unified API)
      if (contentBody.trim()) {
        formData.append('content_body', contentBody.trim())
      }
      
      // Always append author_id (even if empty) to avoid "Undefined array key" error
      // Backend validation will handle whether it's required based on status
      formData.append('author_id', authorId || '')
      
      if (slug.trim()) {
        formData.append('slug', slug.trim())
      } else if (title) {
        // Auto-generate slug from title
        formData.append('slug', generateSlug(title))
      }

      // Call unified API endpoint
      setLoadingMessage(isEditMode ? 'Updating card...' : 'Creating card...')
      if (isEditMode) {
        await updateDisplayCard(card.id, formData)
      } else {
        await createDisplayCard(formData)
      }

      setLoadingMessage('')
      setSuccessMessage(isEditMode ? 'Display Card updated successfully!' : 'Display Card created successfully!')
      
      // Reset form if creating new
      if (!isEditMode) {
        setTitle('')
        setExcerpt('')
        setCategoryId('')
        setSubcategoryId('')
        setStatus('draft')
        setFeaturedImage(null)
        setPreviewUrl(null)
        setAltText('')
        setContentBody('')
        setAuthorId('')
        setSlug('')
      }

      // Call success callback
      if (typeof onSuccess === 'function') {
        setTimeout(() => onSuccess(), 1000)
      }
    } catch (err) {
      console.error(`Error ${isEditMode ? 'updating' : 'creating'} display card:`, err)
      setLoadingMessage('')
      setError(err?.message || `Failed to ${isEditMode ? 'update' : 'create'} display card`)
    } finally {
      setIsSubmitting(false)
      setLoadingMessage('')
    }
  }

  return (
    <div className="w-full h-full overflow-y-auto">
      <form onSubmit={handleSubmit} className="space-y-8 p-6">
        {/* Header */}
        <div className="space-y-1">
          <h2 className="text-2xl font-bold tracking-tight">
            {isEditMode ? 'Edit Display Card' : 'New Display Card'}
          </h2>
          <p className="text-sm text-muted-foreground">
            Create compelling display cards with rich content for your blog
          </p>
        </div>

        {/* Error/Success Messages */}
        {error && (
          <div className="rounded-lg border border-destructive bg-destructive/10 p-4">
            <p className="text-sm font-medium text-destructive">{error}</p>
          </div>
        )}
        {successMessage && (
          <div className="rounded-lg border border-green-600 bg-green-50 dark:bg-green-950 p-4">
            <p className="text-sm font-medium text-green-600 dark:text-green-400">{successMessage}</p>
          </div>
        )}

        {/* ==================== DISPLAY CARD SECTION ==================== */}
        <div className="space-y-6">
          <div className="flex items-center gap-2">
            <ImageIcon className="h-5 w-5 text-primary" />
            <h3 className="text-lg font-semibold">Display Card Information</h3>
            <Badge variant="outline" className="ml-auto">Presentation Layer</Badge>
          </div>

          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title" className="flex items-center gap-2">
              <span className="text-red-500">*</span> Title
            </Label>
            <div className="flex items-start gap-2">
              {!titleExpanded ? (
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter display card title..."
                  required
                  className="flex-1"
                />
              ) : (
                <Textarea
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter display card title..."
                  rows={3}
                  className="flex-1 resize-y"
                  required
                />
              )}
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setTitleExpanded(!titleExpanded)}
                title={titleExpanded ? 'Collapse' : 'Expand'}
              >
                {titleExpanded ? <Minimize className="h-4 w-4" /> : <Maximize className="h-4 w-4" />}
              </Button>
            </div>
          </div>

          {/* Excerpt */}
          <div className="space-y-2">
            <Label htmlFor="excerpt">Excerpt</Label>
            <Textarea
              id="excerpt"
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              placeholder="Brief preview text for the card..."
              rows={4}
              className="resize-none"
            />
            <p className="text-xs text-muted-foreground">
              Short description shown on the display card
            </p>
          </div>

          {/* Category & Subcategory Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Category */}
            <div className="space-y-2">
              <Label htmlFor="category" className="flex items-center gap-2">
                <span className="text-red-500">*</span> Category
              </Label>
              <Select 
                key={`category-${card?.id || 'new'}-${categoryId}`}
                value={categoryId} 
                onValueChange={(value) => {
                  setCategoryId(value)
                  setSubcategoryId('') // Reset subcategory when category changes
                }}
              >
                <SelectTrigger id="category">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {Array.isArray(categories) && categories.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id.toString()}>
                      {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Subcategory */}
            <div className="space-y-2">
              <Label htmlFor="subcategory" className="flex items-center gap-2">
                <span className="text-red-500">*</span> Subcategory
              </Label>
              <Select 
                key={`subcategory-${card?.id || 'new'}-${subcategoryId}`}
                value={subcategoryId} 
                onValueChange={(value) => {
                  setSubcategoryId(value)
                }}
                disabled={!categoryId}
              >
                <SelectTrigger id="subcategory">
                  <SelectValue placeholder={categoryId ? "Select subcategory" : "Select category first"} />
                </SelectTrigger>
                <SelectContent>
                  {Array.isArray(filteredSubcategories) && filteredSubcategories.map((subcat) => (
                    <SelectItem key={subcat.id} value={subcat.id.toString()}>
                      {subcat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Featured Image */}
          <div className="space-y-2">
            <Label htmlFor="featured_image">Featured Image</Label>
            <Input
              id="featured_image"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="cursor-pointer"
            />
            {previewUrl && (
              <div className="mt-2 rounded-lg border overflow-hidden">
                <img
                  src={previewUrl}
                  alt="Preview"
                  className="w-full h-48 object-cover"
                />
              </div>
            )}
            <p className="text-xs text-muted-foreground">
              Images are automatically compressed for optimal performance
            </p>
          </div>

          {/* Alt Text */}
          <div className="space-y-2">
            <Label htmlFor="alt_text">Image Alt Text</Label>
            <Input
              id="alt_text"
              value={altText}
              onChange={(e) => setAltText(e.target.value)}
              placeholder="Descriptive text for accessibility..."
            />
          </div>

          {/* Status */}
          <div className="space-y-2">
            <Label htmlFor="status" className="flex items-center gap-2">
              <span className="text-red-500">*</span> Status
            </Label>
            <Select 
              key={`status-${card?.id || 'new'}-${status}`}
              value={status} 
              onValueChange={(value) => {
                setStatus(value)
              }}
            >
              <SelectTrigger id="status">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="published">Published</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">
              {status === 'draft' 
                ? 'Draft cards can be saved without complete content' 
                : 'Published cards require all content fields to be filled'}
            </p>
          </div>
        </div>

        <Separator className="my-8" />

        {/* ==================== CONTENT SECTION ==================== */}
        <div className="space-y-6">
          <div className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" />
            <h3 className="text-lg font-semibold">Content Details</h3>
            <Badge variant="outline" className="ml-auto">Data Layer</Badge>
          </div>

          {/* Content Body */}
          <div className="space-y-2">
            <Label htmlFor="content_body" className="flex items-center gap-2">
              {status === 'published' && <span className="text-red-500">*</span>}
              Content Body
            </Label>
            <RichTextEditor
              value={contentBody}
              onChange={setContentBody}
              placeholder="Write your article with full formatting - headings, bold, lists, images, and more..."
            />
            <p className="text-xs text-muted-foreground">
              Use the toolbar to format your content professionally - can be left empty for draft cards
            </p>
          </div>

          {/* Author & Slug Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Author */}
            <div className="space-y-2">
              <Label htmlFor="author" className="flex items-center gap-2">
                {status === 'published' && <span className="text-red-500">*</span>}
                <User className="h-4 w-4" />
                Author
              </Label>
              <Select 
                key={`author-${card?.id || 'new'}-${authorId}`}
                value={authorId} 
                onValueChange={(value) => {
                  setAuthorId(value)
                }}
              >
                <SelectTrigger id="author">
                  <SelectValue placeholder="Select author" />
                </SelectTrigger>
                <SelectContent>
                  {Array.isArray(authors) && authors.map((author) => (
                    <SelectItem key={author.id} value={author.id.toString()}>
                      {author.name || author.display_name || `${author.first_name || ''} ${author.last_name || ''}`.trim()}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Slug */}
            <div className="space-y-2">
              <Label htmlFor="slug" className="flex items-center gap-2">
                <Hash className="h-4 w-4" />
                Slug
              </Label>
              <Input
                id="slug"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder="auto-generated-from-title"
              />
              <p className="text-xs text-muted-foreground">
                Leave empty to auto-generate from title
              </p>
            </div>
          </div>
        </div>

        <Separator className="my-8" />

        {/* Form Actions */}
        <div className="flex items-center justify-end gap-3 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => onSuccess && onSuccess()}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={isSubmitting}
            className="min-w-[120px]"
          >
            {isSubmitting 
              ? (loadingMessage || 'Saving...') 
              : isEditMode ? 'Update Card' : 'Create Card'
            }
          </Button>
        </div>
      </form>
    </div>
  )
}

export default DisplayCardContentForm
