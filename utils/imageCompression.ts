// Image compression utility
import imageCompression from 'browser-image-compression'

export const compressImage = async (file: File, maxSizeMB = 5): Promise<File> => {
  const options = {
    maxSizeMB,
    maxWidthOrHeight: 1920,
    useWebWorker: true,
    fileType: 'image/jpeg' as const,
    initialQuality: 0.8
  }
  
  try {
    const compressedFile = await imageCompression(file, options)
    return compressedFile
  } catch (error) {
    console.warn('Image compression failed, using original file:', error)
    return file
  }
}

// Usage in your form:
// const compressedFile = await compressImage(file)
// setFeaturedImage(compressedFile)