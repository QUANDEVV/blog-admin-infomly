"use client"

import React, { useState } from 'react'
import ContentList from './ContentList'
import ContentForm from './ContentForm'
import useContentStats from '@/hooks/CreateContent/useContentStats'

/**
 * ContentManager
 * - Provides two display modes to inspect contents and create new content:
 *   1) Split view: JSON on the left, form on the right (side-by-side)
 *   2) Tab view: switch between Raw JSON and Form
 *
 * Simple, client-only component so you can quickly inspect and create content.
 */
export default function ContentManager() {
  // mode: either 'split' (default) or 'stats' (full stats view)
  const [mode, setMode] = useState('split')
  // Use a hook to fetch content stats. This keeps the component focused on UI only
  // and moves data-fetching into the reusable hook `useContentStats`.
  const { stats, isLoading: loadingStats, error: statsError, refetch: refreshStats } = useContentStats()

  // Reusable stats panel: render a clear table listing subcategories and counts.
  // Columns: Category | Subcategory | # Display Cards | # Contents | Display Cards
  const statsPanel = (
    <div>
      <h3 className="text-sm font-medium">Content counts by category / subcategory / display cards</h3>
      <div className="mt-3">
        {loadingStats ? (
          <div className="text-xs text-muted-foreground">Loading...</div>
        ) : statsError ? (
          <div className="text-xs text-red-600">{statsError}</div>
        ) : stats && stats.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full table-auto text-xs border-collapse">
              <thead>
                <tr className="text-left">
                  <th className="py-2 pr-4">Category</th>
                  <th className="py-2 pr-4">Subcategory</th>
                  <th className="py-2 pr-4"># Display Cards</th>
                  <th className="py-2 pr-4"># Contents</th>
                  <th className="py-2 pr-4">Display Cards (title — content id)</th>
                </tr>
              </thead>
              <tbody>
                {stats.map((cat) => (
                  // render a header row for the category, then rows for each subcategory
                  <React.Fragment key={cat.category_id ?? `cat-${Math.random()}`}>
                    <tr className="bg-gray-900">
                      <td className="py-2 font-medium" colSpan={5}>{cat.category_name || 'Uncategorized'}</td>
                    </tr>
                    {cat.subcategories && cat.subcategories.length > 0 ? (
                      cat.subcategories.map((s) => (
                        <tr key={s.subcategory_id ?? s.subcategory_name} className="border-b">
                          <td></td>
                          <td className="py-2 pr-4">{s.subcategory_name || '—'}</td>
                          <td className="py-2 pr-4">{(s.display_cards && s.display_cards.length) || 0}</td>
                          <td className="py-2 pr-4">{s.content_count ?? 0}</td>
                          <td className="py-2 pr-4">
                            {s.display_cards && s.display_cards.length > 0 ? (
                              <div className="flex flex-wrap gap-2">
                                {s.display_cards.map((card) => (
                                  <div key={card.id} className="bg-gray-800 text-white px-2 py-1 rounded text-xs">
                                    <span className="font-medium">{card.title || `Card ${card.id}`}</span>
                                    <span className="ml-2 bg-white text-gray-900 px-1 py-0.5 rounded text-xs">{card.content_id ? `C:${card.content_id}` : 'C:—'}</span>
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <span className="text-muted-foreground">—</span>
                            )}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr className="border-b">
                        <td></td>
                        <td className="py-2 pr-4">—</td>
                        <td className="py-2 pr-4">0</td>
                        <td className="py-2 pr-4">0</td>
                        <td className="py-2 pr-4"><span className="text-muted-foreground">—</span></td>
                      </tr>
                    )}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-xs text-muted-foreground">No stats available</div>
        )}
      </div>
    </div>
  )

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex gap-2">
          <button
            onClick={() => setMode('split')}
            className={`px-3 py-1 rounded ${mode === 'split' ? 'bg-blue-600 text-white' : 'border'}`}
          >
            Split view
          </button>
          <button
            onClick={() => setMode('stats')}
            className={`px-3 py-1 rounded ${mode === 'stats' ? 'bg-blue-600 text-white' : 'border'}`}
          >
            Stats
          </button>
        </div>

        {/* Removed tab-header controls: mode buttons above replace tab functionality */}
      </div>
  {/* Analytics summary moved to dedicated Stats mode only (removed from Split view per request) */}

  {mode === 'split' ? (
        // Use min-w-0 on children so long content can overflow and be scrollable instead of
        // causing the grid to expand or overlap the sibling column.
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="col-span-1 min-w-0">
            <ContentList />
          </div>
          <div className="col-span-1 min-w-0">
            <div className="p-2 bg-transparent">
              <ContentForm onSuccess={() => { /* optional: could trigger a mutate via SWR */ }} />
            </div>
          </div>
        </div>
      ) : (
        // stats mode: show full-width stats panel
        <div className="mb-3">{statsPanel}</div>
      )}
    </div>
  )
}
