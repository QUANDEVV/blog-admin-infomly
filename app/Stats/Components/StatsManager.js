"use client"

import React from 'react'
import useContentStats from '@/hooks/CreateContent/useContentStats'

/**
 * StatsManager - Display comprehensive content statistics
 * Shows content counts by category, subcategory, and display cards
 */
export default function StatsManager() {
  // Fetch content stats using the reusable hook
  const { stats, isLoading: loadingStats, error: statsError, refetch: refreshStats } = useContentStats()

  return (
    <div className="space-y-4">
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Content Statistics</h1>
          <p className="text-muted-foreground">Overview of content distribution across categories and subcategories</p>
        </div>
        <button
          onClick={refreshStats}
          className="px-4 py-2 border rounded hover:bg-gray-100"
        >
          Refresh
        </button>
      </div>

      {/* Stats Panel */}
      <div className="w-full">
        <div className="rounded-lg shadow p-6">
          <h3 className="text-lg font-medium mb-4">Content counts by category / subcategory / display cards</h3>
          <div className="mt-3">
            {loadingStats ? (
              <div className="flex items-center justify-center h-64">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                  <p className="text-muted-foreground">Loading statistics...</p>
                </div>
              </div>
            ) : statsError ? (
              <div className="text-red-600 p-4 bg-red-50 rounded">
                Error loading statistics: {statsError?.message || String(statsError)}
              </div>
            ) : stats && stats.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full table-auto text-sm border-collapse border">
                  <thead>
                    <tr className="text-left bg-muted">
                      <th className="py-3 px-4 border">Category</th>
                      <th className="py-3 px-4 border">Subcategory</th>
                      <th className="py-3 px-4 border"># Display Cards</th>
                      <th className="py-3 px-4 border"># Contents</th>
                      <th className="py-3 px-4 border">Display Cards (title — content id)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stats.map((cat) => (
                      // Render a header row for the category, then rows for each subcategory
                      <React.Fragment key={cat.category_id ?? `cat-${Math.random()}`}>
                        <tr className="bg-primary text-primary-foreground">
                          <td className="py-3 px-4 font-medium border" colSpan={5}>
                            {cat.category_name || 'Uncategorized'}
                          </td>
                        </tr>
                        {cat.subcategories && cat.subcategories.length > 0 ? (
                          cat.subcategories.map((s) => (
                            <tr key={s.subcategory_id ?? s.subcategory_name} className="border-b hover:bg-muted">
                              <td className="py-3 px-4 border"></td>
                              <td className="py-3 px-4 border">{s.subcategory_name || '—'}</td>
                              <td className="py-3 px-4 border text-center">
                                {(s.display_cards && s.display_cards.length) || 0}
                              </td>
                              <td className="py-3 px-4 border text-center">{s.content_count ?? 0}</td>
                              <td className="py-3 px-4 border">
                                {s.display_cards && s.display_cards.length > 0 ? (
                                  <div className="flex flex-wrap gap-2">
                                    {s.display_cards.map((card) => (
                                      <div key={card.id} className="bg-secondary text-secondary-foreground px-2 py-1 rounded text-xs">
                                        <span className="font-medium">{card.title || `Card ${card.id}`}</span>
                                        <span className="ml-2 bg-primary text-primary-foreground px-1 py-0.5 rounded text-xs">
                                          {card.content_id ? `C:${card.content_id}` : 'C:—'}
                                        </span>
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
                            <td className="py-3 px-4 border"></td>
                            <td className="py-3 px-4 border">—</td>
                            <td className="py-3 px-4 border text-center">0</td>
                            <td className="py-3 px-4 border text-center">0</td>
                            <td className="py-3 px-4 border">
                              <span className="text-muted-foreground">—</span>
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center p-8 text-muted-foreground">
                No statistics available. Create some content to see statistics.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
