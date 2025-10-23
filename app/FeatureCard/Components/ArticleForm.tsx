"use client"

import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Maximize, Minimize } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useCreateArticle, useUpdateArticle } from '@/hooks/Articles/useArticles'
import { useCategories } from '@/hooks/Categories/useCategories'

interface ArticleFormProps {
  onSuccess: () => void
  article?: Article | null
}

interface Article {
  id: number
  title: string
  excerpt: string
  category: { id: number; name: string }
  featured_image?: string
  created_at: string
}

const ArticleForm: React.FC<ArticleFormProps> = ({ onSuccess, article }) => {
  const [title, setTitle] = useState(article?.title || '')
  const [titleExpanded, setTitleExpanded] = useState(false)
  const [excerpt, setExcerpt] = useState(article?.excerpt || '')
  const [categoryId, setCategoryId] = useState(article?.category?.id?.toString() || '')
  const [publishedAt, setPublishedAt] = useState('')
  const [altText, setAltText] = useState('')
  const [featuredImage, setFeaturedImage] = useState<File | null>(null)
  // previewUrl holds either the article's existing image URL or an object URL for a newly selected file
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const { createArticle } = useCreateArticle()
  const { updateArticle } = useUpdateArticle()
  const { categories } = useCategories()

  useEffect(() => {
    setTitle(article?.title || '')
    setExcerpt(article?.excerpt || '')
    setCategoryId(article?.category?.id?.toString() || '')
    setPublishedAt('')
    setAltText('')
    setFeaturedImage(null)
    // When editing an article, show its existing featured image in the preview
    setPreviewUrl(article?.featured_image || null)
  }, [article])

  // Clean up object URL when component unmounts or when previewUrl changes to avoid memory leaks
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
    formData.append('category_id', categoryId)
    if (publishedAt) formData.append('published_at', publishedAt)
    if (altText) formData.append('alt_text', altText)
    if (featuredImage) formData.append('featured_image', featuredImage)

    try {
      if (article) {
        await updateArticle(article.id, formData)
      } else {
        await createArticle(formData)
      }
      onSuccess()
      setTitle('')
      setExcerpt('')
      setCategoryId('')
      setPublishedAt('')
      setAltText('')
      setFeaturedImage(null)
    } catch (error) {
      console.error('Error saving article:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{article ? 'Edit Article' : 'Add Article'}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="title">Title</Label>
            {/*
              Title can be a single-line Input or an expandable multi-line Textarea.
              The toggle button lets the user expand/collapse the field for easier editing of long titles.
            */}
            <div className="flex items-start gap-2">
              {!titleExpanded ? (
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  className="flex-1"
                />
              ) : (
                <Textarea
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  rows={3}
                  className="flex-1 resize-y"
                  required
                />
              )}
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setTitleExpanded((s) => !s)}
                aria-pressed={titleExpanded}
                aria-label={titleExpanded ? 'Collapse title field' : 'Expand title field'}
              >
                {titleExpanded ? <Minimize className="h-4 w-4" /> : <Maximize className="h-4 w-4" />}
              </Button>
            </div>
          </div>
          <div>
            <Label htmlFor="excerpt">Excerpt</Label>
            <Textarea
              id="excerpt"
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              required
            />
          </div>
          <div>
            <Label htmlFor="categoryId">Category</Label>
            <Select value={categoryId} onValueChange={setCategoryId}>
              <SelectTrigger>
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {categories?.map((category: { id: number; name: string }) => (
                  <SelectItem key={category.id} value={category.id.toString()}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            {/* <Label htmlFor="publishedAt">Published At</Label>
            <Input
              id="publishedAt"
              type="datetime-local"
              value={publishedAt}
              onChange={(e) => setPublishedAt(e.target.value)}
            /> */}
          </div>
          <div>
            <Label htmlFor="altText">Alt Text</Label>
            <Input
              id="altText"
              value={altText}
              onChange={(e) => setAltText(e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="featuredImage">Featured Image</Label>
            {/*
              Show preview in this order of precedence:
              1. If user just selected a file -> show the object URL preview
              2. Else if editing an article that already has a featured_image -> show that image URL
            */}
            {previewUrl ? (
              <div className="mb-2">
                <img
                  src={previewUrl}
                  alt={title || 'Featured image'}
                  className="w-40 h-24 object-cover rounded"
                />
              </div>
            ) : null}
            <Input
              id="featuredImage"
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0] || null
                setFeaturedImage(file)

                // Revoke previous object URL if any, then create a new one for preview
                if (previewUrl && previewUrl.startsWith('blob:')) {
                  URL.revokeObjectURL(previewUrl)
                }

                if (file) {
                  const objUrl = URL.createObjectURL(file)
                  setPreviewUrl(objUrl)
                } else {
                  // If file cleared, fallback to existing article image or null
                  setPreviewUrl(article?.featured_image || null)
                }
              }}
            />
          </div>
          <Button type="submit" disabled={loading}>
            {loading ? 'Saving...' : article ? 'Update' : 'Create'}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}

export default ArticleForm