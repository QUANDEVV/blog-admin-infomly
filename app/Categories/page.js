"use client"

import React, { useState } from 'react'
import CategoryList from './Components/CategoryList'
import CategoryForm from './Components/CategoryForm'
import { useCategories } from '@/hooks/Categories/useCategories'

const page = () => {
  const { mutate } = useCategories()
  const [editingCategory, setEditingCategory] = useState(null)

  const handleSuccess = () => {
    mutate() // Refresh categories
    setEditingCategory(null) // Reset editing state
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Category Management</h1>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <CategoryList onEdit={setEditingCategory} />
        </div>
        <div>
          <CategoryForm onSuccess={handleSuccess} category={editingCategory} />
        </div>
      </div>
    </div>
  )
}

export default page