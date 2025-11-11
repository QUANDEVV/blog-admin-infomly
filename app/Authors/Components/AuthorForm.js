"use client"

import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { useCreateAuthor, useUpdateAuthor } from '@/hooks/Authors/useAuthors'
import { User, Mail, FileText, Image, Globe, CheckCircle } from 'lucide-react'

const AuthorForm = ({ onSuccess, author }) => {
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    email: '',
    bio: '',
    avatar: '',
    social_links: '',
    is_active: true,
  })
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const { createAuthor } = useCreateAuthor()
  const { updateAuthor } = useUpdateAuthor()

  useEffect(() => {
    if (author) {
      setFormData({
        name: author.name || '',
        slug: author.slug || '',
        email: author.email || '',
        bio: author.bio || '',
        avatar: author.avatar || '',
        social_links: author.social_links || '',
        is_active: author.is_active ?? true,
      })
    } else {
      setFormData({
        name: '',
        slug: '',
        email: '',
        bio: '',
        avatar: '',
        social_links: '',
        is_active: true,
      })
    }
  }, [author])

    const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

    const handleSwitchChange = (checked) => {
    setFormData(prev => ({
      ...prev,
      is_active: checked
    }))
  }

    const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')

    try {
      // Prepare data for submission
      const submitData = {
        ...formData,
        social_links: formData.social_links ? JSON.stringify({
          twitter: '',
          linkedin: '',
          website: formData.social_links
        }) : null,
      }

      if (author) {
        await updateAuthor(author.id, submitData)
        setMessage('Author updated successfully!')
      } else {
        await createAuthor(submitData)
        setMessage('Author created successfully!')
      }

      onSuccess()

      if (!author) {
        // Reset form for new author
        setFormData({
          name: '',
          slug: '',
          email: '',
          bio: '',
          avatar: '',
          social_links: '',
          is_active: true,
        })
      }
    } catch (error) {
      console.error('Error saving author:', error)
      setMessage(`Error: ${error.message || 'Something went wrong'}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center">
          <User className="mr-2 h-5 w-5" />
          {author ? 'Edit Author' : 'Add New Author'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {message && (
          <div className={`mb-4 p-3 rounded-md ${message.includes('Error') ? 'bg-red-50 text-red-700 border border-red-200' : 'bg-green-50 text-green-700 border border-green-200'}`}>
            <div className="flex items-center">
              {message.includes('Error') ? (
                <span className="text-red-500">❌</span>
              ) : (
                <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
              )}
              {message}
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name */}
          <div className="space-y-2">
            <Label htmlFor="name" className="flex items-center">
              <User className="mr-2 h-4 w-4" />
              Full Name *
            </Label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="Enter author's full name"
              className="w-full"
            />
          </div>

          {/* Slug */}
          <div className="space-y-2">
            <Label htmlFor="slug" className="flex items-center">
              <Globe className="mr-2 h-4 w-4" />
              Slug *
            </Label>
            <Input
              id="slug"
              name="slug"
              value={formData.slug}
              onChange={handleChange}
              required
              placeholder="author-url-slug"
              className="w-full"
            />
            <p className="text-xs text-muted-foreground">
              URL-friendly version (e.g., john-doe)
            </p>
          </div>

          {/* Email */}
          <div className="space-y-2">
            <Label htmlFor="email" className="flex items-center">
              <Mail className="mr-2 h-4 w-4" />
              Email Address *
            </Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="author@example.com"
              className="w-full"
            />
          </div>

          {/* Bio */}
          <div className="space-y-2">
            <Label htmlFor="bio" className="flex items-center">
              <FileText className="mr-2 h-4 w-4" />
              Biography
            </Label>
            <Textarea
              id="bio"
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              placeholder="Tell us about this author..."
              rows={4}
              className="w-full resize-none"
            />
          </div>

          {/* Avatar URL */}
          <div className="space-y-2">
            <Label htmlFor="avatar" className="flex items-center">
              <Image className="mr-2 h-4 w-4" />
              Avatar URL
            </Label>
            <Input
              id="avatar"
              name="avatar"
              type="url"
              value={formData.avatar}
              onChange={handleChange}
              placeholder="https://example.com/avatar.jpg"
              className="w-full"
            />
          </div>

          {/* Social Links */}
          <div className="space-y-2">
            <Label htmlFor="social_links" className="flex items-center">
              <Globe className="mr-2 h-4 w-4" />
              Website/Social Links
            </Label>
            <Input
              id="social_links"
              name="social_links"
              value={formData.social_links}
              onChange={handleChange}
              placeholder="https://website.com or social profile URL"
              className="w-full"
            />
          </div>

          {/* Active Status */}
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div className="space-y-0.5">
              <Label className="text-base">Active Status</Label>
              <div className="text-sm text-muted-foreground">
                Enable this author to appear in content creation
              </div>
            </div>
            <Checkbox
              checked={formData.is_active}
              onCheckedChange={handleSwitchChange}
            />
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700"
            size="lg"
          >
            {loading ? (
              <div className="flex items-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                {author ? 'Updating...' : 'Creating...'}
              </div>
            ) : (
              <div className="flex items-center">
                <User className="mr-2 h-4 w-4" />
                {author ? 'Update Author' : 'Create Author'}
              </div>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}

export default AuthorForm