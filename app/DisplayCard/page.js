import { Suspense } from 'react'
import DisplayCardManager from './Components/DisplayCardManager'

/**
 * Display Card Page - Unified interface for Display Card + Content management
 * 
 * This replaces the old separate Content and Display Card workflows.
 * Now everything is managed from one interface with vintage UI.
 * 
 * Wrapped in Suspense for useSearchParams support (URL filter persistence)
 */

function DisplayCardLoading() {
  return (
    <div className="flex items-center justify-center h-64">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-muted-foreground">Loading display cards...</p>
      </div>
    </div>
  )
}

const Page = () => {
  return (
    <Suspense fallback={<DisplayCardLoading />}>
      <DisplayCardManager />
    </Suspense>
  )
}

export default Page
