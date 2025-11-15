// Image compression utility - Optimized for speed
import imageCompression from 'browser-image-compression'

export const compressImage = async (file: File, options?: { maxSizeMB?: number; maxWidthOrHeight?: number }): Promise<File> => {
  const compressionOptions = {
    maxSizeMB: options?.maxSizeMB || 0.5, // Default 500KB for fast upload
    maxWidthOrHeight: options?.maxWidthOrHeight || 1920,
    useWebWorker: true, // Use web worker for better performance
    fileType: 'image/jpeg' as const,
    initialQuality: 0.7, // Reduced from 0.8 for faster compression
    alwaysKeepResolution: false, // Allow resolution reduction for speed
  }
  
  try {
    const compressedFile = await imageCompression(file, compressionOptions)
    return compressedFile
  } catch (error) {
    console.warn('Image compression failed, using original file:', error)
    return file
  }
}