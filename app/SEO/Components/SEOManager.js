"use client"

import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Search, TrendingUp, TrendingDown, AlertCircle, CheckCircle, XCircle } from 'lucide-react'

/**
 * SEO Manager - Track search performance and optimization status
 */
const SEOManager = () => {
  // Dummy SEO data
  const seoData = {
    overview: {
      avgPosition: 12.4,
      totalImpressions: 45200,
      totalClicks: 2340,
      ctr: 5.2, // Click-through rate %
    },
    topKeywords: [
      { keyword: "ai geo optimization", position: 3, clicks: 420, impressions: 5200, ctr: 8.1, trend: "up" },
      { keyword: "chatgpt guide", position: 5, clicks: 380, impressions: 4800, ctr: 7.9, trend: "up" },
      { keyword: "seo best practices", position: 8, clicks: 290, impressions: 3900, ctr: 7.4, trend: "stable" },
      { keyword: "content optimization", position: 12, clicks: 210, impressions: 3200, ctr: 6.6, trend: "down" },
      { keyword: "blog monetization", position: 15, clicks: 180, impressions: 2800, ctr: 6.4, trend: "up" },
    ],
    contentHealth: [
      { 
        title: "AI GEO Explanation + First Test", 
        status: "optimized", 
        score: 95,
        issues: [],
        opportunities: ["Add FAQ schema", "Improve internal linking"]
      },
      { 
        title: "ChatGPT Complete Guide", 
        status: "good", 
        score: 88,
        issues: ["Meta description too short"],
        opportunities: ["Add video embed", "Update statistics"]
      },
      { 
        title: "Tech Trends 2024", 
        status: "needs-work", 
        score: 62,
        issues: ["Missing alt tags", "Low word count", "No internal links"],
        opportunities: ["Add images", "Expand content to 1500+ words"]
      },
      { 
        title: "WordPress Basics", 
        status: "critical", 
        score: 45,
        issues: ["No meta description", "Missing H1", "Broken links", "Outdated info"],
        opportunities: ["Complete rewrite recommended"]
      },
    ],
    featuredSnippets: [
      { keyword: "what is ai geo", article: "AI GEO Explanation", status: "won" },
      { keyword: "chatgpt features", article: "ChatGPT Guide", status: "opportunity" },
      { keyword: "seo checklist", article: "SEO Best Practices", status: "opportunity" },
    ]
  }

  const getStatusColor = (status) => {
    switch(status) {
      case 'optimized': return 'border-l-green-600'
      case 'good': return 'border-l-blue-600'
      case 'needs-work': return 'border-l-yellow-600'
      case 'critical': return 'border-l-red-600'
      default: return 'border-l-gray-600'
    }
  }

  const getStatusBadge = (status) => {
    switch(status) {
      case 'optimized': return <Badge className="bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-400">Optimized</Badge>
      case 'good': return <Badge className="bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-400">Good</Badge>
      case 'needs-work': return <Badge className="bg-yellow-100 text-yellow-700 dark:bg-yellow-950 dark:text-yellow-400">Needs Work</Badge>
      case 'critical': return <Badge className="bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-400">Critical</Badge>
      default: return null
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">SEO Tools</h1>
        <p className="text-muted-foreground mt-1">Monitor search performance and optimize content</p>
      </div>

      {/* Overview Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-l-4 border-l-blue-600">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Avg Position</p>
                <p className="text-3xl font-bold mt-2">{seoData.overview.avgPosition}</p>
                <p className="text-xs text-muted-foreground mt-1">In Google results</p>
              </div>
              <Search className="h-10 w-10 text-blue-600 opacity-20" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-600">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Impressions</p>
                <p className="text-3xl font-bold mt-2">{(seoData.overview.totalImpressions / 1000).toFixed(1)}k</p>
                <p className="text-xs text-muted-foreground mt-1">Last 30 days</p>
              </div>
              <TrendingUp className="h-10 w-10 text-purple-600 opacity-20" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-600">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Clicks</p>
                <p className="text-3xl font-bold mt-2">{(seoData.overview.totalClicks / 1000).toFixed(1)}k</p>
                <p className="text-xs text-muted-foreground mt-1">From search</p>
              </div>
              <CheckCircle className="h-10 w-10 text-green-600 opacity-20" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-orange-600">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">CTR</p>
                <p className="text-3xl font-bold mt-2">{seoData.overview.ctr}%</p>
                <p className="text-xs text-muted-foreground mt-1">Click rate</p>
              </div>
              <TrendingUp className="h-10 w-10 text-orange-600 opacity-20" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top Ranking Keywords */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Top Ranking Keywords</CardTitle>
          <p className="text-sm text-muted-foreground">Your best performing search terms</p>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {seoData.topKeywords.map((keyword, index) => (
              <div 
                key={index}
                className="flex items-center gap-4 p-4 rounded-lg border hover:border-primary/50 transition-all"
              >
                <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                  <span className="text-2xl font-bold text-primary">#{keyword.position}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm">{keyword.keyword}</p>
                  <div className="flex items-center gap-4 mt-1">
                    <span className="text-xs text-muted-foreground">
                      {keyword.clicks} clicks
                    </span>
                    <span className="text-xs">•</span>
                    <span className="text-xs text-muted-foreground">
                      {keyword.impressions.toLocaleString()} impressions
                    </span>
                    <span className="text-xs">•</span>
                    <span className="text-xs text-muted-foreground">
                      {keyword.ctr}% CTR
                    </span>
                  </div>
                </div>
                <div className="flex-shrink-0">
                  {keyword.trend === 'up' && <TrendingUp className="h-5 w-5 text-green-600" />}
                  {keyword.trend === 'down' && <TrendingDown className="h-5 w-5 text-red-600" />}
                  {keyword.trend === 'stable' && <span className="text-muted-foreground">—</span>}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Content SEO Health */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Content SEO Health</CardTitle>
          <p className="text-sm text-muted-foreground">Optimization status for each article</p>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {seoData.contentHealth.map((content, index) => (
              <Card key={index} className={`border-l-4 ${getStatusColor(content.status)}`}>
                <CardContent className="pt-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold truncate">{content.title}</h4>
                      <div className="flex items-center gap-2 mt-1">
                        {getStatusBadge(content.status)}
                        <span className="text-sm text-muted-foreground">Score: {content.score}/100</span>
                      </div>
                    </div>
                  </div>

                  {content.issues.length > 0 && (
                    <div className="mb-3">
                      <p className="text-xs font-semibold text-red-600 mb-1 flex items-center gap-1">
                        <XCircle className="h-3 w-3" /> Issues to Fix:
                      </p>
                      <ul className="text-xs text-muted-foreground space-y-0.5 ml-4">
                        {content.issues.map((issue, i) => (
                          <li key={i}>• {issue}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {content.opportunities.length > 0 && (
                    <div>
                      <p className="text-xs font-semibold text-blue-600 mb-1 flex items-center gap-1">
                        <AlertCircle className="h-3 w-3" /> Opportunities:
                      </p>
                      <ul className="text-xs text-muted-foreground space-y-0.5 ml-4">
                        {content.opportunities.map((opp, i) => (
                          <li key={i}>• {opp}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Featured Snippets */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Featured Snippets</CardTitle>
          <p className="text-sm text-muted-foreground">Google position zero opportunities</p>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {seoData.featuredSnippets.map((snippet, index) => (
              <div 
                key={index}
                className="flex items-center justify-between p-4 rounded-lg border"
              >
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm">{snippet.keyword}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{snippet.article}</p>
                </div>
                <Badge className={snippet.status === 'won' 
                  ? 'bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-400'
                  : 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-400'
                }>
                  {snippet.status === 'won' ? '✓ Won' : 'Opportunity'}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default SEOManager
