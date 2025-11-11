"use client"

import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { DollarSign, TrendingUp, TrendingDown, Eye, MousePointer } from 'lucide-react'

/**
 * Revenue Manager - Track earnings and monetization metrics
 */
const RevenueManager = () => {
  // Dummy revenue data
  const revenueData = {
    thisMonth: 1247.50,
    lastMonth: 980.25,
    today: 42.30,
    yesterday: 38.90,
    rpm: 0.36, // Revenue per 1000 views
    clickRate: 2.8, // Ad click rate %
    topEarners: [
      { title: "AI GEO Explanation + First Test", revenue: 127.30, views: 3420, rpm: 0.37 },
      { title: "ChatGPT Complete Guide", revenue: 98.50, views: 2890, rpm: 0.34 },
      { title: "SEO Best Practices 2025", revenue: 76.20, views: 2150, rpm: 0.35 },
      { title: "Tech Trends for Startups", revenue: 54.80, views: 1620, rpm: 0.34 },
      { title: "WordPress vs Next.js", revenue: 43.20, views: 1290, rpm: 0.33 },
    ],
    monthlyBreakdown: [
      { month: "Nov 2025", revenue: 1247.50, views: 34500 },
      { month: "Oct 2025", revenue: 980.25, views: 28900 },
      { month: "Sep 2025", revenue: 856.40, views: 24200 },
      { month: "Aug 2025", revenue: 723.60, views: 21100 },
    ]
  }

  const growthRate = ((revenueData.thisMonth - revenueData.lastMonth) / revenueData.lastMonth * 100).toFixed(1)
  const todayGrowth = ((revenueData.today - revenueData.yesterday) / revenueData.yesterday * 100).toFixed(1)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Revenue</h1>
        <p className="text-muted-foreground mt-1">Track your earnings and monetization performance</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-l-4 border-l-green-600">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">This Month</p>
                <p className="text-3xl font-bold mt-2">${revenueData.thisMonth}</p>
                <p className="text-xs text-green-600 mt-1">+{growthRate}% from last month</p>
              </div>
              <DollarSign className="h-10 w-10 text-green-600 opacity-20" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-blue-600">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Today</p>
                <p className="text-3xl font-bold mt-2">${revenueData.today}</p>
                <p className={`text-xs mt-1 ${todayGrowth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {todayGrowth >= 0 ? '+' : ''}{todayGrowth}% from yesterday
                </p>
              </div>
              <TrendingUp className="h-10 w-10 text-blue-600 opacity-20" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-600">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">RPM</p>
                <p className="text-3xl font-bold mt-2">${revenueData.rpm}</p>
                <p className="text-xs text-muted-foreground mt-1">Per 1000 views</p>
              </div>
              <Eye className="h-10 w-10 text-purple-600 opacity-20" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-orange-600">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Click Rate</p>
                <p className="text-3xl font-bold mt-2">{revenueData.clickRate}%</p>
                <p className="text-xs text-muted-foreground mt-1">Ad engagement</p>
              </div>
              <MousePointer className="h-10 w-10 text-orange-600 opacity-20" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top Earning Content */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Top Earning Content</CardTitle>
          <p className="text-sm text-muted-foreground">Articles generating the most revenue</p>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {revenueData.topEarners.map((article, index) => (
              <div 
                key={index}
                className="flex items-center gap-4 p-4 rounded-lg border hover:border-primary/50 transition-all"
              >
                <div className={`flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center font-bold text-lg ${
                  index === 0 ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-950 dark:text-yellow-400' :
                  index === 1 ? 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400' :
                  index === 2 ? 'bg-orange-100 text-orange-700 dark:bg-orange-950 dark:text-orange-400' :
                  'bg-muted text-muted-foreground'
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
                      RPM: ${article.rpm}
                    </span>
                  </div>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-lg font-bold text-green-600">${article.revenue}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Monthly Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Monthly Performance</CardTitle>
          <p className="text-sm text-muted-foreground">Revenue trend over time</p>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {revenueData.monthlyBreakdown.map((month, index) => {
              const prevRevenue = revenueData.monthlyBreakdown[index + 1]?.revenue || month.revenue
              const growth = ((month.revenue - prevRevenue) / prevRevenue * 100).toFixed(1)
              
              return (
                <div key={month.month} className="flex items-center justify-between p-4 rounded-lg border">
                  <div className="flex-1">
                    <p className="font-semibold">{month.month}</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      {month.views.toLocaleString()} views
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-bold text-green-600">${month.revenue}</p>
                    {index < revenueData.monthlyBreakdown.length - 1 && (
                      <p className={`text-xs mt-1 flex items-center justify-end gap-1 ${
                        parseFloat(growth) >= 0 ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {parseFloat(growth) >= 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                        {parseFloat(growth) >= 0 ? '+' : ''}{growth}%
                      </p>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default RevenueManager
