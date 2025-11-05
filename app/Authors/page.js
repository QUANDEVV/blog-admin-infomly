"use client"

import React, { useState } from 'react'
import AuthorList from './Components/AuthorList'
import AuthorForm from './Components/AuthorForm'
import { useAuthors } from '@/hooks/Authors/useAuthors'

const page = () => {
  const { mutate } = useAuthors()
  const [editingAuthor, setEditingAuthor] = useState(null)

  const handleSuccess = () => {
    mutate() // Refresh authors
    setEditingAuthor(null) // Reset editing state
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Author Management</h1>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <AuthorList onEdit={setEditingAuthor} />
        </div>
        <div>
          <AuthorForm onSuccess={handleSuccess} author={editingAuthor} />
        </div>
      </div>
    </div>
  )
}

export default page