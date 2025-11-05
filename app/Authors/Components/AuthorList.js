"use client"

import React from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Edit, Trash2, Plus, User, Mail, Globe } from 'lucide-react'
import { useAuthors, useDeleteAuthor } from '@/hooks/Authors/useAuthors'

const AuthorList = ({ onEdit }) => {
  const { authors, isLoading, isError, mutate } = useAuthors()
  const { deleteAuthor } = useDeleteAuthor()

  const handleDelete = async (id) => {
    if (confirm('Are you sure you want to delete this author?')) {
      try {
        await deleteAuthor(id)
        mutate() // Refresh the list after deletion
      } catch (error) {
        console.error('Error deleting author:', error)
      }
    }
  }

  if (isLoading) return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-2">Loading authors...</span>
        </div>
      </CardContent>
    </Card>
  )

  if (isError) return (
    <Card>
      <CardContent className="p-6">
        <div className="text-red-600 flex items-center">
          <span>❌ Error loading authors</span>
        </div>
      </CardContent>
    </Card>
  )

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold flex items-center">
          <User className="mr-2 h-6 w-6" />
          Authors ({authors?.length || 0})
        </h2>
        <Button onClick={() => onEdit(null)} className="bg-blue-600 hover:bg-blue-700">
          <Plus className="mr-2 h-4 w-4" />
          Add Author
        </Button>
      </div>

      {!authors || authors.length === 0 ? (
        <Card>
          <CardContent className="p-6 text-center">
            <User className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <p className="text-gray-600">No authors found. Create your first author!</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {authors.map((author) => (
            <Card key={author.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <CardTitle className="flex justify-between items-start">
                  <div className="flex items-center space-x-3">
                    {author.avatar ? (
                      <img
                        src={author.avatar}
                        alt={author.name}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                        <User className="h-5 w-5 text-blue-600" />
                      </div>
                    )}
                    <div>
                      <h3 className="text-lg font-semibold">{author.name}</h3>
                      <Badge variant={author.is_active ? "default" : "secondary"}>
                        {author.is_active ? "Active" : "Inactive"}
                      </Badge>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => onEdit(author)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(author.id)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex items-center text-sm text-gray-600">
                  <Mail className="mr-2 h-4 w-4" />
                  {author.email}
                </div>
                {author.bio && (
                  <p className="text-sm text-gray-700 line-clamp-2">{author.bio}</p>
                )}
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>Slug: {author.slug}</span>
                  <span>Created: {new Date(author.created_at).toLocaleDateString()}</span>
                </div>
                {author.social_links && (
                  <div className="flex items-center text-sm text-blue-600">
                    <Globe className="mr-2 h-4 w-4" />
                    Social links configured
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

export default AuthorList