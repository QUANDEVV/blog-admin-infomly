import { useState } from 'react'
import { apiFetch } from '@/lib/apiClient'
import { toast } from 'sonner'

/**
 * useMediaUpload Hook
 * 
 * Purpose: Handles file uploads to the backend
 * Returns: { uploadFile, isUploading }
 */
export const useMediaUpload = () => {
    const [isUploading, setIsUploading] = useState(false)

    const uploadFile = async (file, articleId) => {
        if (!file) return null
        if (!articleId) {
            toast.error('Article ID is required for upload')
            return null
        }

        // Validate file type
        if (!file.type.startsWith('image/')) {
            toast.error('Please upload an image file')
            return null
        }

        // Validate file size (10MB)
        if (file.size > 10 * 1024 * 1024) {
            toast.error('Image must be less than 10MB')
            return null
        }

        setIsUploading(true)
        const loadingToast = toast.loading('Uploading image...')

        try {
            const formData = new FormData()
            formData.append('file', file)
            formData.append('article_id', articleId)

            const data = await apiFetch('/admin/media/upload', {
                method: 'POST',
                body: formData,
            })

            if (data.url) {
                toast.success('Image uploaded successfully')
                return data.url
            }
        } catch (error) {
            console.error('Upload error:', error)
            toast.error('Failed to upload image')
        } finally {
            setIsUploading(false)
            toast.dismiss(loadingToast)
        }

        return null
    }

    return {
        uploadFile,
        isUploading
    }
}
