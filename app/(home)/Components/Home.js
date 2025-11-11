import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { TrendingUp, DollarSign, FileText, AlertTriangle, CheckCircle, Clock } from 'lucide-react'

/**
 * Dashboard Home - Quality Metrics for Content Performance
 * Focus: Actionable insights that drive revenue and content quality
 */
const Home = () => {
  // Dummy data - hardcoded quality metrics
  const qualityMetrics = {
    contentHealth: {
      needsUpdate: 3, // Articles older than 6 months
      missingImages: 2, // Articles without featured images
      lowWordCount: 1, // Articles under 800 words
      readyToPublish: 5, // Optimized drafts ready to go
    },
    revenue: {
      thisMonth: 1247.50,
      lastMonth: 980.25,
      topEarner: {
        title: "AI GEO Explanation + First Test",
        earnings: 127.30,
        views: 3420
      }
    },
    contentPerformance: {
      avgReadTime: "4.2 min",
      completionRate: "68%", // How many finish reading
      returnReaders: "34%", // Loyalty metric
    },
    seoQuality: {
      optimized: 8, // Green light articles
      needsWork: 4, // Yellow - needs optimization
      critical: 1, // Red - urgent SEO fixes
    }
  }

  const recentIssues = [
    { id: 1, title: "What Is AI GEO? My 5-Minute Explanation", issue: "Missing meta description", priority: "high" },
    { id: 2, title: "ChatGPT Guide for Beginners", issue: "Low word count (650 words)", priority: "medium" },
    { id: 3, title: "Tech Trends 2024", issue: "Last updated 8 months ago", priority: "medium" },
  ]

  const topPerformers = [
    { id: 1, title: "AI GEO Explanation", views: 3420, revenue: "$127.30", quality: 95 },
    { id: 2, title: "ChatGPT Complete Guide", views: 2890, revenue: "$98.50", quality: 88 },
    { id: 3, title: "SEO Best Practices 2025", views: 2150, revenue: "$76.20", quality: 92 },
  ]

  const growthChange = ((qualityMetrics.revenue.thisMonth - qualityMetrics.revenue.lastMonth) / qualityMetrics.revenue.lastMonth * 100).toFixed(1)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground mt-1">Content quality and revenue overview</p>
      </div>

      {/* Key Revenue Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <DollarSign className="h-4 w-4" />
              Revenue This Month
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">${qualityMetrics.revenue.thisMonth}</div>
            <p className="text-xs text-green-600 mt-1">
              +{growthChange}% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Top Earner
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${qualityMetrics.revenue.topEarner.earnings}</div>
            <p className="text-xs text-muted-foreground mt-1 truncate">
              {qualityMetrics.revenue.topEarner.title}
            </p>
            <p className="text-xs text-muted-foreground">{qualityMetrics.revenue.topEarner.views.toLocaleString()} views</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Avg. Read Time
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{qualityMetrics.contentPerformance.avgReadTime}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {qualityMetrics.contentPerformance.completionRate} completion rate
            </p>
          </CardContent>
        </Card>
      </div>





      {/* Revenue Leaders */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Revenue Leaders</CardTitle>
          <p className="text-sm text-muted-foreground">Your top earning content</p>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {topPerformers.map((article, index) => (
              <div 
                key={article.id} 
                className="flex items-center gap-4 p-4 rounded-lg border hover:border-primary/50 transition-all"
              >
                <div className={`flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center font-bold text-lg ${
                  index === 0 ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-950 dark:text-yellow-400' :
                  index === 1 ? 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400' :
                  'bg-orange-100 text-orange-700 dark:bg-orange-950 dark:text-orange-400'
                }`}>
                  {index + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm truncate">{article.title}</p>
                  <div className="flex items-center gap-4 mt-1">
                    <span className="text-xs text-muted-foreground">
                      {article.views.toLocaleString()} views
                    </span>
                    <span className="text-xs">•</span>
                    <span className="text-xs text-muted-foreground">
                      Quality: {article.quality}%
                    </span>
                  </div>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-lg font-bold text-green-600">{article.revenue}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      
    </div>
  )
}

export default Home