"use client"

import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Maximize, Minimize } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useCreateDisplayCard, useUpdateDisplayCard } from '@/hooks/FeatureCard/useDisplayCards'
import { useSubcategories } from '@/hooks/SubCategory/useSubcategories'
import { useCategories } from '@/hooks/Categories/useCategories'

interface DisplayCardFormProps {
  onSuccess: () => void
  displayCard?: any | null
}

const DisplayCardForm: React.FC<DisplayCardFormProps> = ({ onSuccess, displayCard }) => {
  const [title, setTitle] = useState(displayCard?.title || '')
  const [titleExpanded, setTitleExpanded] = useState(false)
  const [excerpt, setExcerpt] = useState(displayCard?.excerpt || '')
  const [subcategoryId, setSubcategoryId] = useState(displayCard?.subcategory?.id?.toString() || '')
  const [publishedAt, setPublishedAt] = useState('')
  const [altText, setAltText] = useState('')
  const [featuredImage, setFeaturedImage] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const { createDisplayCard } = useCreateDisplayCard()
  const { updateDisplayCard } = useUpdateDisplayCard()
  const { subcategories } = useSubcategories()
  const { categories } = useCategories()
  const [categoryId, setCategoryId] = useState<string | undefined>(displayCard?.subcategory?.category?.id?.toString() || undefined)

  // Compute filtered subcategories for the selected category to simplify JSX rendering
  const filteredSubcategories = categoryId
    ? subcategories?.filter((sc: any) => String(sc.category?.id ?? sc.category_id) === categoryId)
    : subcategories

  useEffect(() => {
    setTitle(displayCard?.title || '')
    setExcerpt(displayCard?.excerpt || '')
    setSubcategoryId(displayCard?.subcategory?.id?.toString() || '')
    setCategoryId(displayCard?.subcategory?.category?.id?.toString() || '')
    setPublishedAt(displayCard?.published_at || '')
    setAltText('')
    setFeaturedImage(null)
    setPreviewUrl(displayCard?.featured_image || null)
  }, [displayCard])

  React.useEffect(() => {
    return () => {
      if (previewUrl && previewUrl.startsWith('blob:')) {
        URL.revokeObjectURL(previewUrl)
      }
    }
  }, [previewUrl])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    const formData = new FormData()
    formData.append('title', title)
    formData.append('excerpt', excerpt)
  // Ensure subcategory_id is included; it should correspond to the selected category
  formData.append('subcategory_id', subcategoryId)
    if (publishedAt) {
      formData.append('published_at', publishedAt)
    } else {
      const now = new Date()
      const pad = (n: number) => String(n).padStart(2, '0')
      const formatted = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())} ${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`
      formData.append('published_at', formatted)
    }
    if (altText) formData.append('alt_text', altText)
    if (featuredImage) formData.append('featured_image', featuredImage)

    try {
      if (displayCard) {
        await updateDisplayCard(displayCard.id, formData)
      } else {
        await createDisplayCard(formData)
      }
      onSuccess()
      setTitle('')
      setExcerpt('')
      setSubcategoryId('')
      setPublishedAt('')
      setAltText('')
      setFeaturedImage(null)
    } catch (error) {
      console.error('Error saving display card:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{displayCard ? 'Edit Display Card' : 'Add Display Card'}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="title">Title</Label>
            <div className="flex items-start gap-2">
              {!titleExpanded ? (
                <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} required className="flex-1" />
              ) : (
                <Textarea id="title" value={title} onChange={(e) => setTitle(e.target.value)} rows={3} className="flex-1 resize-y" required />
              )}
              <Button type="button" variant="ghost" size="sm" onClick={() => setTitleExpanded((s) => !s)} aria-pressed={titleExpanded} aria-label={titleExpanded ? 'Collapse title field' : 'Expand title field'}>
                {titleExpanded ? <Minimize className="h-4 w-4" /> : <Maximize className="h-4 w-4" />}
              </Button>
            </div>
          </div>
          <div>
            <Label htmlFor="excerpt">Excerpt</Label>
            <Textarea id="excerpt" value={excerpt} onChange={(e) => setExcerpt(e.target.value)} required />
          </div>
          <div>
            <Label htmlFor="categoryId">Category</Label>
            <Select value={categoryId} onValueChange={(v) => { setCategoryId(v); setSubcategoryId('') }}>
              <SelectTrigger>
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {categories?.map((c: any) => (
                  <SelectItem key={c.id} value={c.id.toString()}>
                    {c.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="subcategoryId">Subcategory</Label>
            <Select value={subcategoryId} onValueChange={setSubcategoryId}>
              <SelectTrigger>
                <SelectValue placeholder={categoryId ? 'Select a subcategory' : 'Select a category first'} />
              </SelectTrigger>
              <SelectContent>
                {filteredSubcategories?.map((sc: any) => (
                  <SelectItem key={sc.id} value={sc.id.toString()}>
                    {sc.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="altText">Alt Text</Label>
            <Input id="altText" value={altText} onChange={(e) => setAltText(e.target.value)} />
          </div>
          <div>
            <Label htmlFor="featuredImage">Featured Image</Label>
            {previewUrl ? (
              <div className="mb-2">
                <img src={previewUrl} alt={title || 'Featured image'} className="w-40 h-24 object-cover rounded" />
              </div>
            ) : null}
            <Input id="featuredImage" type="file" accept="image/*" onChange={(e) => {
              const file = e.target.files?.[0] || null
              
              // File size validation (50MB limit)
              if (file && file.size > 50 * 1024 * 1024) {
                alert('File size too large! Please select an image smaller than 50MB.')
                e.target.value = '' // Clear the input
                return
              }
              
              // File type validation
              if (file && !['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml'].includes(file.type)) {
                alert('Invalid file type! Please select a JPEG, PNG, GIF, WebP, or SVG image.')
                e.target.value = '' // Clear the input
                return
              }
              
              setFeaturedImage(file)
              if (previewUrl && previewUrl.startsWith('blob:')) URL.revokeObjectURL(previewUrl)
              if (file) setPreviewUrl(URL.createObjectURL(file))
              else setPreviewUrl(displayCard?.featured_image || null)
            }} />
          </div>
          <Button type="submit" disabled={loading}>{loading ? 'Saving...' : displayCard ? 'Update' : 'Create'}</Button>
        </form>
      </CardContent>
    </Card>
  )
}

export default DisplayCardForm
