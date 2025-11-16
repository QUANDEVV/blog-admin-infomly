import { useState, useEffect } from 'react'
import { apiFetch } from '@/lib/apiClient'
import useSWR from 'swr'

/**
 * useAnalytics Hook
 * 
 * Purpose: Fetch content authority analytics with category/subcategory filtering
 * 
 * Features:
 * - Overall stats (all content)
 * - Category-level stats (word counts per category)
 * - Subcategory-level stats (word counts per subcategory)
 * - Content gap analysis
 * - Filtered stats based on user selection
 * 
 * Returns:
 * - stats: Overall or filtered stats based on categoryId/subcategoryId
 * - categoryStats: Array of stats per category
 * - subcategoryStats: Array of stats per subcategory
 * - contentGaps: Categories/subcategories with low content
 * - isLoading, error
 */
export const useAnalytics = (categoryId = null, subcategoryId = null) => {
    const [filteredStats, setFilteredStats] = useState(null)

    // Fetch overall analytics
    const { data: overviewData, error: overviewError, isLoading: overviewLoading } = useSWR(
        '/admin/analytics/overview',
        apiFetch
    )

    // Fetch category stats
    const { data: categoryData, error: categoryError, isLoading: categoryLoading } = useSWR(
        '/admin/analytics/categories',
        apiFetch
    )

    // Fetch subcategory stats (optionally filtered by category)
    const subcategoryUrl = categoryId && categoryId !== 'all' 
        ? `/admin/analytics/subcategories?category_id=${categoryId}`
        : '/admin/analytics/subcategories'
    
    const { data: subcategoryData, error: subcategoryError, isLoading: subcategoryLoading } = useSWR(
        subcategoryUrl,
        apiFetch
    )

    // Fetch content gaps
    const { data: gapsData, error: gapsError, isLoading: gapsLoading } = useSWR(
        '/admin/analytics/content-gaps',
        apiFetch
    )

    // Calculate filtered stats based on selected category/subcategory
    useEffect(() => {
        if (!categoryData || !subcategoryData) return

        // If no filters, use overall stats
        if ((!categoryId || categoryId === 'all') && (!subcategoryId || subcategoryId === 'all')) {
            setFilteredStats(overviewData)
            return
        }

        // If subcategory is selected, show subcategory stats
        if (subcategoryId && subcategoryId !== 'all') {
            const subcategory = subcategoryData.subcategories?.find(
                sub => String(sub.subcategory_id) === String(subcategoryId)
            )
            
            if (subcategory) {
                setFilteredStats({
                    word_counts: subcategory.word_counts,
                    article_counts: subcategory.article_counts,
                    reading_equivalents: subcategory.reading_equivalents,
                    averages: {
                        words_per_article: subcategory.article_counts.published > 0
                            ? Math.round(subcategory.word_counts.published / subcategory.article_counts.published)
                            : 0
                    },
                    filter_applied: {
                        type: 'subcategory',
                        subcategory_name: subcategory.subcategory_name,
                        category_name: subcategory.category.name,
                    }
                })
            }
            return
        }

        // If only category is selected, show category stats
        if (categoryId && categoryId !== 'all') {
            const category = categoryData.categories?.find(
                cat => String(cat.category_id) === String(categoryId)
            )
            
            if (category) {
                setFilteredStats({
                    word_counts: category.word_counts,
                    article_counts: category.article_counts,
                    reading_equivalents: category.reading_equivalents,
                    averages: {
                        words_per_article: category.article_counts.published > 0
                            ? Math.round(category.word_counts.published / category.article_counts.published)
                            : 0
                    },
                    filter_applied: {
                        type: 'category',
                        category_name: category.category_name,
                    }
                })
            }
        }
    }, [categoryId, subcategoryId, categoryData, subcategoryData, overviewData])

    const isLoading = overviewLoading || categoryLoading || subcategoryLoading
    const error = overviewError || categoryError || subcategoryError || gapsError

    return {
        // Current stats (overall or filtered)
        stats: filteredStats || overviewData,
        
        // All category stats
        categoryStats: categoryData?.categories || [],
        
        // All subcategory stats (filtered by category if categoryId is set)
        subcategoryStats: subcategoryData?.subcategories || [],
        
        // Content gaps
        contentGaps: gapsData?.content_gaps || null,
        
        // Loading and error states
        isLoading,
        error,
        
        // Helper to check if filters are applied
        hasFilters: (categoryId && categoryId !== 'all') || (subcategoryId && subcategoryId !== 'all'),
    }
}

/**
 * useOverviewAnalytics Hook
 * 
 * Purpose: Fetch only overall analytics (no filters)
 * Use this when you don't need category/subcategory breakdown
 */
export const useOverviewAnalytics = () => {
    const { data, error, isLoading } = useSWR('/admin/analytics/overview', apiFetch)

    return {
        stats: data,
        isLoading,
        error,
    }
}

/**
 * useCategoryAnalytics Hook
 * 
 * Purpose: Fetch category-level analytics
 */
export const useCategoryAnalytics = () => {
    const { data, error, isLoading, mutate } = useSWR('/admin/analytics/categories', apiFetch)

    return {
        categories: data?.categories || [],
        isLoading,
        error,
        mutate,
    }
}

/**
 * useSubcategoryAnalytics Hook
 * 
 * Purpose: Fetch subcategory-level analytics (optionally filtered by category)
 */
export const useSubcategoryAnalytics = (categoryId = null) => {
    const url = categoryId && categoryId !== 'all'
        ? `/admin/analytics/subcategories?category_id=${categoryId}`
        : '/admin/analytics/subcategories'

    const { data, error, isLoading, mutate } = useSWR(url, apiFetch)

    return {
        subcategories: data?.subcategories || [],
        isLoading,
        error,
        mutate,
    }
}

/**
 * useContentGaps Hook
 * 
 * Purpose: Fetch content gap analysis
 */
export const useContentGaps = () => {
    const { data, error, isLoading } = useSWR('/admin/analytics/content-gaps', apiFetch)

    return {
        contentGaps: data?.content_gaps || null,
        thresholds: data?.thresholds || null,
        recommendations: data?.recommendations || null,
        isLoading,
        error,
    }
}
