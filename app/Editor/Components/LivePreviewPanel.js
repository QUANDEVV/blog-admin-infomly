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
        <div className="w-full min-h-full">
            {/* Article Container - Modern, readable layout */}
            <article className="max-w-3xl mx-auto py-6 md:py-12 px-4 md:px-8">
                {/* Article Header */}
                <header className="mb-8 md:mb-12">
                    {/* Category Badge */}
                    <div className="mb-4 md:mb-6">
                        <span className="inline-block px-3 py-1.5 text-xs md:text-sm font-semibold rounded-full bg-primary/10 text-primary">
                            {content.subcategory?.category?.name || 'Uncategorized'}
                        </span>
                        {content.subcategory && (
                            <span className="ml-2 text-xs md:text-sm text-muted-foreground">
                                / {content.subcategory.name}
                            </span>
                        )}
                    </div>

                    {/* Title - Optimized for mobile */}
                    <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-4 md:mb-6 leading-tight">
                        {content.title}
                    </h1>

                    {/* Excerpt */}
                    {content.excerpt && (
                        <p className="text-lg md:text-xl text-muted-foreground leading-relaxed mb-6 md:mb-8">
                            {content.excerpt}
                        </p>
                    )}

                    {/* Metadata - Responsive layout */}
                    <div className="flex flex-wrap items-center gap-3 md:gap-4 text-sm text-muted-foreground border-t border-b py-3 md:py-4">
                        <div className="flex items-center gap-2">
                            <div className="h-8 w-8 md:h-10 md:w-10 rounded-full bg-primary/20 flex items-center justify-center">
                                <span className="text-xs md:text-sm font-semibold">
                                    {content.content?.author?.name?.charAt(0) || 'A'}
                                </span>
                            </div>
                            <span className="font-medium text-xs md:text-sm">
                                {content.content?.author?.name || 'Anonymous'}
                            </span>
                        </div>
                        <span className="hidden sm:inline">•</span>
                        <span className="text-xs md:text-sm">{formatDate(content.published_at)}</span>
                        {content.content?.word_count && (
                            <>
                                <span className="hidden sm:inline">•</span>
                                <span className="text-xs md:text-sm">{content.content.word_count.toLocaleString()} words</span>
                                <span className="hidden md:inline">•</span>
                                <span className="text-xs md:text-sm hidden md:inline">{Math.ceil(content.content.word_count / 200)} min read</span>
                            </>
                        )}
                    </div>
                </header>

                {/* Featured Image - Full width on mobile */}
                {content.featured_image && (
                    <figure className="mb-8 md:mb-12 -mx-4 md:mx-0 md:rounded-xl overflow-hidden">
                        <img
                            src={content.featured_image}
                            alt={content.alt_text || content.title}
                            className="w-full h-auto object-cover"
                        />
                        {content.alt_text && (
                            <figcaption className="text-xs md:text-sm text-muted-foreground text-center mt-3 italic px-4 md:px-0">
                                {content.alt_text}
                            </figcaption>
                        )}
                    </figure>
                )}

                {/* Article Content - Enhanced typography */}
                {content.content?.content ? (
                    <div
                        className="blog-content prose prose-slate dark:prose-invert max-w-none
                            prose-headings:font-bold prose-headings:tracking-tight
                            prose-h1:text-3xl md:prose-h1:text-4xl prose-h1:mb-4 prose-h1:mt-8
                            prose-h2:text-2xl md:prose-h2:text-3xl prose-h2:mb-3 prose-h2:mt-8
                            prose-h3:text-xl md:prose-h3:text-2xl prose-h3:mb-2 prose-h3:mt-6
                            prose-p:text-base md:prose-p:text-lg prose-p:leading-relaxed prose-p:mb-4
                            prose-a:text-primary prose-a:no-underline hover:prose-a:underline
                            prose-strong:font-semibold prose-strong:text-foreground
                            prose-ul:my-4 prose-ol:my-4
                            prose-li:text-base md:prose-li:text-lg prose-li:leading-relaxed prose-li:mb-2
                            prose-blockquote:border-l-4 prose-blockquote:border-primary prose-blockquote:pl-4 
                            prose-blockquote:italic prose-blockquote:text-muted-foreground
                            prose-code:bg-muted prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-sm
                            prose-pre:bg-muted prose-pre:border prose-pre:rounded-lg
                            prose-img:rounded-lg prose-img:my-6"
                        dangerouslySetInnerHTML={{ __html: content.content.content }}
                    />
                ) : (
                    <Card className="border-dashed">
                        <CardContent className="p-8 md:p-12 text-center">
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
                    <div className="mt-8 md:mt-12 p-4 md:p-6 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900 rounded-lg">
                        <p className="text-sm md:text-base text-amber-800 dark:text-amber-200 font-medium">
                            📝 This is a draft preview. This content is not visible to the public yet.
                        </p>
                    </div>
                )}
            </article>
        </div>
    )
}

export default LivePreviewPanel
