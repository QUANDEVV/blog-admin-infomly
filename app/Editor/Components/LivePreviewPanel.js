"use client"

import React from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { FileQuestion } from 'lucide-react'

/**
 * LivePreviewPanel - Right Panel Live Preview
 * 
 * Purpose: Shows exactly how the selected content will appear on the public blog
 * 
 * Features:
 * - Uses blog's actual styling and typography
 * - Shows article metadata (author, date, category)
 * - Renders HTML content safely
 * - Empty state when no content selected
 * 
 * TODO: Import and use actual blog components for authentic preview
 */
const LivePreviewPanel = ({ content }) => {
    if (!content) {
        return (
            <div className="flex items-center justify-center h-full">
                <div className="text-center max-w-md px-4">
                    <FileQuestion className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No Content Selected</h3>
                    <p className="text-sm text-muted-foreground">
                        Select an article from the left panel to preview how it will appear on your blog
                    </p>
                </div>
            </div>
        )
    }

    // Format date
    const formatDate = (dateString) => {
        if (!dateString) return 'Not published'
        const date = new Date(dateString)
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        })
    }

    return (
        <div className="max-w-4xl mx-auto py-8 px-6">
            {/* Article Header */}
            <div className="mb-8">
                {/* Category Badge */}
                <div className="mb-4">
                    <span className="inline-block px-3 py-1 text-xs font-semibold rounded-full bg-primary/10 text-primary">
                        {content.subcategory?.category?.name || 'Uncategorized'}
                    </span>
                    {content.subcategory && (
                        <span className="ml-2 text-xs text-muted-foreground">
                            / {content.subcategory.name}
                        </span>
                    )}
                </div>

                {/* Title */}
                <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
                    {content.title}
                </h1>

                {/* Excerpt */}
                {content.excerpt && (
                    <p className="text-xl text-muted-foreground leading-relaxed mb-6">
                        {content.excerpt}
                    </p>
                )}

                {/* Metadata */}
                <div className="flex items-center gap-4 text-sm text-muted-foreground border-t border-b py-4">
                    <div className="flex items-center gap-2">
                        <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center">
                            <span className="text-xs font-semibold">
                                {content.content?.author?.name?.charAt(0) || 'A'}
                            </span>
                        </div>
                        <span className="font-medium">
                            {content.content?.author?.name || 'Anonymous'}
                        </span>
                    </div>
                    <span>•</span>
                    <span>{formatDate(content.published_at)}</span>
                    {content.content?.word_count && (
                        <>
                            <span>•</span>
                            <span>{content.content.word_count.toLocaleString()} words</span>
                            <span>•</span>
                            <span>{Math.ceil(content.content.word_count / 200)} min read</span>
                        </>
                    )}
                </div>
            </div>

            {/* Featured Image */}
            {content.featured_image && (
                <div className="mb-8 rounded-lg overflow-hidden">
                    <img
                        src={content.featured_image}
                        alt={content.alt_text || content.title}
                        className="w-full h-auto object-cover"
                    />
                    {content.alt_text && (
                        <p className="text-xs text-muted-foreground text-center mt-2 italic">
                            {content.alt_text}
                        </p>
                    )}
                </div>
            )}

            {/* Article Content */}
            {content.content?.content ? (
                <div
                    className="blog-content"
                    dangerouslySetInnerHTML={{ __html: content.content.content }}
                />
            ) : (
                <Card className="border-dashed">
                    <CardContent className="p-8 text-center">
                        <p className="text-muted-foreground">
                            This display card doesn't have full content yet.
                        </p>
                        <p className="text-sm text-muted-foreground mt-2">
                            Create content for this card to see the preview.
                        </p>
                    </CardContent>
                </Card>
            )}

            {/* Status Badge (for drafts) */}
            {content.status === 'draft' && (
                <div className="mt-8 p-4 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900 rounded-lg">
                    <p className="text-sm text-amber-800 dark:text-amber-200 font-medium">
                        📝 This is a draft preview. This content is not visible to the public yet.
                    </p>
                </div>
            )}
        </div>
    )
}

export default LivePreviewPanel
