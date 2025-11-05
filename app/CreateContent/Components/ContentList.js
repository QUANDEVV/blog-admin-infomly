"use client"

import React from 'react'
import { useContents } from '@/hooks/CreateContent/useCreateContent'

/**
 * ContentList
 * - Client component that fetches the admin contents list via the useContents hook
 * - Renders the raw JSON response so you can inspect returned data shape during development
 *
 * Note: kept intentionally simple (preformatted JSON). This is useful for debugging and
 * for validating the shape of the API response before building a full table UI.
 */
const ContentList = () => {
  // Hook uses SWR to fetch `/admin/contents` and returns { contents, isLoading, isError, mutate }
  // Note: the backend now returns { count, contents } so `contents` may be an object.
  const { contents, isLoading } = useContents()

  if (isLoading) {
    return <div>Loading contents...</div>
  }

  if (!contents) {
    return <div>No contents found.</div>
  }

  // Support both shapes: either the legacy array or the new { count, contents } object
  const total = typeof contents === 'object' && contents !== null && 'count' in contents
    ? contents.count
    : Array.isArray(contents)
      ? contents.length
      : 0

  // Choose what to render in the JSON area: the actual list of contents
  const payloadToShow = (typeof contents === 'object' && contents !== null && 'contents' in contents)
    ? contents.contents
    : contents

  return (
    <div>
      <h2 className="text-lg font-semibold mb-2">Contents (raw JSON)</h2>
      <p className="text-sm text-gray-600 mb-2">Total: <strong>{total}</strong></p>
      {/* Render pretty-printed JSON for easy inspection. Constrain height and make scrollable so it
          doesn't overflow into adjacent columns in split view. */}
      <div className="bg-gray-900/60 p-3 rounded max-h-[72vh] overflow-auto">
        <pre className="text-sm font-mono whitespace-pre break-words">{JSON.stringify(payloadToShow, null, 2)}</pre>
      </div>
    </div>
  )
}

export default ContentList