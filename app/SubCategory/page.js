"use client"

import React, { useState } from 'react'
import SubcategoryList from './Components/SubcategoryList'
import SubcategoryForm from './Components/SubcategoryForm'
import { useSubcategories } from '@/hooks/SubCategory/useSubcategories'

export default function Page() {
  const { mutate } = useSubcategories()
  const [editingSubcategory, setEditingSubcategory] = useState(null)

  const handleSuccess = async () => {
    await mutate()
    setEditingSubcategory(null)
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Subcategory Management</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <SubcategoryList onEdit={setEditingSubcategory} />
        </div>

        <div>
          <SubcategoryForm onSuccess={handleSuccess} category={editingSubcategory} />
        </div>
      </div>
    </div>
  )
}