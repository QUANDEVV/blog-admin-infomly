'use client'
import React, { useState } from 'react'
import { Button } from '@/components/ui/button'  // Shadcn Button (assumes installed in workspace)
import { Input } from '@/components/ui/input'  // Shadcn Input (assumes installed in workspace)
import { Textarea } from '@/components/ui/textarea'  // Shadcn Textarea (assumes installed in workspace)
import { Label } from '@/components/ui/label'  // Shadcn Label (assumes installed in workspace)
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'  // Shadcn Card (assumes installed in workspace)
import { Progress } from '@/components/ui/progress'  // Shadcn Progress (assumes installed in workspace)

const CreatePostForm = () => {
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    excerpt: '',
    meta_title: '',
    meta_description: '',
    keywords: '',
    canonical_url: '',
    featured_image: '',
    alt_text: '',
    og_title: '',
    og_description: '',
    og_image: '',
    twitter_card: 'summary_large_image',
    category_id: '',
    tags: '',
    author_id: '',
    media: [],  // Array for file uploads (images, videos, audio)
    audio_transcripts: [],  // Array for audio transcripts
    audio_captions: [],  // Array for audio captions
  })
  const [uploading, setUploading] = useState(false)  // State for upload progress (contributes to UX)
  const [progress, setProgress] = useState(0)  // Progress percentage for uploads

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })  // Update form state (standard React practice)
  }

  const handleFileChange = (e) => {
    setFormData({ ...formData, media: Array.from(e.target.files) })  // Handle multiple file uploads (references store validation)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setUploading(true)
    setProgress(0)

    const data = new FormData()
    Object.keys(formData).forEach(key => {
      if (key === 'media') {
        formData.media.forEach(file => data.append('media[]', file))  // Append files for S3 upload
      } else if (Array.isArray(formData[key])) {
        formData[key].forEach(item => data.append(`${key}[]`, item))  // Append arrays for transcripts/captions
      } else {
        data.append(key, formData[key])
      }
    })

    try {
      const response = await fetch('/api/admin/articles', {  // API call to store method (references backend route)
        method: 'POST',
        body: data,
      })
      if (response.ok) {
        alert('Article created successfully!')  // Success feedback (contributes to UX)
        setFormData({ ...formData, media: [], audio_transcripts: [], audio_captions: [] })  // Reset form
      } else {
        alert('Error creating article.')  // Error handling
      }
    } catch (error) {
      console.error('Upload error:', error)  // Log errors for debugging
    } finally {
      setUploading(false)
      setProgress(100)  // Complete progress
    }
  }

  return (
    <Card className="w-full max-w-4xl mx-auto">  {/* Modern card layout for form (Shadcn best practice) */}
      <CardHeader>
        <CardTitle>Create New Article</CardTitle>  {/* Title for clarity */}
      </CardHeader>
      <CardContent>
                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-4">  {/* Three-column layout for wider form (responsive) */}
          {/* Column 1: Core Content */}
          <div className="md:col-span-1">
            <Label htmlFor="title">Title</Label>
            <Input id="title" name="title" value={formData.title} onChange={handleChange} required />
          </div>
          <div className="md:col-span-1">
            <Label htmlFor="meta_title">Meta Title</Label>
            <Input id="meta_title" name="meta_title" value={formData.meta_title} onChange={handleChange} />
          </div>
          <div className="md:col-span-1">
            <Label htmlFor="category_id">Category ID</Label>
            <Input id="category_id" name="category_id" value={formData.category_id} onChange={handleChange} />
          </div>
          <div className="md:col-span-3">
            <Label htmlFor="content">Content</Label>
            <Textarea id="content" name="content" value={formData.content} onChange={handleChange} required />
          </div>
          <div className="md:col-span-3">
            <Label htmlFor="excerpt">Excerpt</Label>
            <Textarea id="excerpt" name="excerpt" value={formData.excerpt} onChange={handleChange} />
          </div>

          {/* Column 2: SEO */}
          <div className="md:col-span-1">
            <Label htmlFor="meta_description">Meta Description</Label>
            <Textarea id="meta_description" name="meta_description" value={formData.meta_description} onChange={handleChange} required />
          </div>
          <div className="md:col-span-1">
            <Label htmlFor="keywords">Keywords</Label>
            <Input id="keywords" name="keywords" value={formData.keywords} onChange={handleChange} />
          </div>
          <div className="md:col-span-1">
            <Label htmlFor="canonical_url">Canonical URL</Label>
            <Input id="canonical_url" name="canonical_url" value={formData.canonical_url} onChange={handleChange} />
          </div>
          <div className="md:col-span-1">
            <Label htmlFor="featured_image">Featured Image URL</Label>
            <Input id="featured_image" name="featured_image" value={formData.featured_image} onChange={handleChange} />
          </div>
          <div className="md:col-span-1">
            <Label htmlFor="alt_text">Alt Text</Label>
            <Input id="alt_text" name="alt_text" value={formData.alt_text} onChange={handleChange} />
          </div>
          <div className="md:col-span-1">
            <Label htmlFor="tags">Tags</Label>
            <Input id="tags" name="tags" value={formData.tags} onChange={handleChange} />
          </div>

          {/* Column 3: Social and Media */}
          <div className="md:col-span-1">
            <Label htmlFor="og_title">OG Title</Label>
            <Input id="og_title" name="og_title" value={formData.og_title} onChange={handleChange} />
          </div>
          <div className="md:col-span-1">
            <Label htmlFor="og_description">OG Description</Label>
            <Textarea id="og_description" name="og_description" value={formData.og_description} onChange={handleChange} />
          </div>
          <div className="md:col-span-1">
            <Label htmlFor="og_image">OG Image URL</Label>
            <Input id="og_image" name="og_image" value={formData.og_image} onChange={handleChange} />
          </div>
          <div className="md:col-span-1">
            <Label htmlFor="author_id">Author ID</Label>
            <Input id="author_id" name="author_id" value={formData.author_id} onChange={handleChange} />
          </div>
          <div className="md:col-span-2">
            <Label htmlFor="media">Media Files (Images, Videos, Audio)</Label>
            <Input id="media" name="media" type="file" multiple onChange={handleFileChange} accept="image/*,video/*,audio/*" />
          </div>
          <div className="md:col-span-1">
            <Label htmlFor="audio_transcripts">Audio Transcripts</Label>
            <Textarea id="audio_transcripts" name="audio_transcripts" value={formData.audio_transcripts.join('\n')} onChange={(e) => setFormData({ ...formData, audio_transcripts: e.target.value.split('\n') })} />
          </div>
          <div className="md:col-span-1">
            <Label htmlFor="audio_captions">Audio Captions</Label>
            <Textarea id="audio_captions" name="audio_captions" value={formData.audio_captions.join('\n')} onChange={(e) => setFormData({ ...formData, audio_captions: e.target.value.split('\n') })} />
          </div>

          {/* Progress and Submit - Full Width */}
          {uploading && <Progress value={progress} className="md:col-span-3 w-full" />}
          <Button type="submit" disabled={uploading} className="md:col-span-3">Create Article</Button>
        </form>
      </CardContent>
    </Card>
  )
}

export default CreatePostForm