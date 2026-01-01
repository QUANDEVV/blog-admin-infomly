"use client"

import React, { useState, useEffect } from 'react'
import { Calendar, Clock, TrendingUp, CalendarDays, Eye } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { format, parseISO, isSameDay, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isToday } from 'date-fns'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://backend.infomly.com/api'

export default function ScheduledPage() {
    const [scheduledPosts, setScheduledPosts] = useState([])
    const [groupedPosts, setGroupedPosts] = useState({})
    const [stats, setStats] = useState({})
    const [loading, setLoading] = useState(true)
    const [selectedDate, setSelectedDate] = useState(new Date())
    const [currentMonth, setCurrentMonth] = useState(new Date())

    useEffect(() => {
        fetchScheduledPosts()
    }, [])

    const fetchScheduledPosts = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/admin/scheduled`)
            const data = await response.json()

            setScheduledPosts(data.scheduled_posts || [])
            setGroupedPosts(data.grouped_by_date || {})
            setStats(data.stats || {})
        } catch (error) {
            console.error('Error fetching scheduled posts:', error)
        } finally {
            setLoading(false)
        }
    }

    const getDaysInMonth = () => {
        const start = startOfMonth(currentMonth)
        const end = endOfMonth(currentMonth)
        return eachDayOfInterval({ start, end })
    }

    const getPostsForDate = (date) => {
        const dateKey = format(date, 'yyyy-MM-dd')
        return groupedPosts[dateKey] || []
    }

    const hasPostsOnDate = (date) => {
        return getPostsForDate(date).length > 0
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        )
    }

    const daysInMonth = getDaysInMonth()
    const postsForSelectedDate = getPostsForDate(selectedDate)

    return (
        <div className="p-6 space-y-6 max-w-7xl mx-auto">
            {/* Header */}
            <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
                    <CalendarDays className="h-8 w-8 text-primary" />
                    Scheduled Posts
                </h1>
                <p className="text-muted-foreground">
                    Manage and monitor your scheduled content calendar
                </p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card className="border-l-4 border-l-primary">
                    <CardHeader className="pb-3">
                        <CardDescription>Total Scheduled</CardDescription>
                        <CardTitle className="text-3xl">{stats.total_scheduled || 0}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <Calendar className="h-4 w-4" />
                            <span>Across all dates</span>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-l-4 border-l-blue-500">
                    <CardHeader className="pb-3">
                        <CardDescription>Today</CardDescription>
                        <CardTitle className="text-3xl">{stats.today || 0}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <Clock className="h-4 w-4" />
                            <span>Publishing today</span>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-l-4 border-l-green-500">
                    <CardHeader className="pb-3">
                        <CardDescription>This Week</CardDescription>
                        <CardTitle className="text-3xl">{stats.this_week || 0}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <TrendingUp className="h-4 w-4" />
                            <span>Next 7 days</span>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-l-4 border-l-purple-500">
                    <CardHeader className="pb-3">
                        <CardDescription>This Month</CardDescription>
                        <CardTitle className="text-3xl">{stats.this_month || 0}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <CalendarDays className="h-4 w-4" />
                            <span>In {format(currentMonth, 'MMMM')}</span>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Calendar and Details Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Calendar */}
                <Card className="lg:col-span-2">
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <CardTitle className="text-xl">
                                {format(currentMonth, 'MMMM yyyy')}
                            </CardTitle>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => setCurrentMonth(new Date(currentMonth.setMonth(currentMonth.getMonth() - 1)))}
                                    className="px-3 py-1 text-sm border rounded-md hover:bg-accent"
                                >
                                    Previous
                                </button>
                                <button
                                    onClick={() => setCurrentMonth(new Date())}
                                    className="px-3 py-1 text-sm border rounded-md hover:bg-accent"
                                >
                                    Today
                                </button>
                                <button
                                    onClick={() => setCurrentMonth(new Date(currentMonth.setMonth(currentMonth.getMonth() + 1)))}
                                    className="px-3 py-1 text-sm border rounded-md hover:bg-accent"
                                >
                                    Next
                                </button>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        {/* Calendar Grid */}
                        <div className="grid grid-cols-7 gap-2">
                            {/* Day Headers */}
                            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                                <div key={day} className="text-center text-sm font-semibold text-muted-foreground py-2">
                                    {day}
                                </div>
                            ))}

                            {/* Calendar Days */}
                            {daysInMonth.map((day, index) => {
                                const hasPosts = hasPostsOnDate(day)
                                const isSelected = isSameDay(day, selectedDate)
                                const isCurrentDay = isToday(day)
                                const postsCount = getPostsForDate(day).length

                                return (
                                    <button
                                        key={index}
                                        onClick={() => setSelectedDate(day)}
                                        className={`
                      relative aspect-square p-2 rounded-lg border transition-all
                      ${isSelected ? 'bg-primary text-primary-foreground border-primary' : 'hover:bg-accent'}
                      ${isCurrentDay && !isSelected ? 'border-primary border-2' : ''}
                      ${!isSameMonth(day, currentMonth) ? 'opacity-50' : ''}
                    `}
                                    >
                                        <div className="text-sm font-medium">{format(day, 'd')}</div>
                                        {hasPosts && (
                                            <div className={`
                        absolute bottom-1 left-1/2 -translate-x-1/2 
                        w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold
                        ${isSelected ? 'bg-primary-foreground text-primary' : 'bg-primary text-primary-foreground'}
                      `}>
                                                {postsCount}
                                            </div>
                                        )}
                                    </button>
                                )
                            })}
                        </div>
                    </CardContent>
                </Card>

                {/* Selected Date Details */}
                <Card className="lg:col-span-1">
                    <CardHeader>
                        <CardTitle className="text-lg">
                            {format(selectedDate, 'MMMM d, yyyy')}
                        </CardTitle>
                        <CardDescription>
                            {postsForSelectedDate.length} post{postsForSelectedDate.length !== 1 ? 's' : ''} scheduled
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        {postsForSelectedDate.length === 0 ? (
                            <div className="text-center py-8 text-muted-foreground">
                                <Calendar className="h-12 w-12 mx-auto mb-2 opacity-50" />
                                <p className="text-sm">No posts scheduled for this date</p>
                            </div>
                        ) : (
                            postsForSelectedDate.map((post) => (
                                <div
                                    key={post.id}
                                    className="p-3 rounded-lg border bg-card hover:bg-accent transition-colors cursor-pointer"
                                >
                                    <div className="flex items-start gap-3">
                                        {post.featured_image && (
                                            <img
                                                src={post.featured_image}
                                                alt={post.title}
                                                className="w-16 h-16 rounded object-cover flex-shrink-0"
                                            />
                                        )}
                                        <div className="flex-1 min-w-0">
                                            <h4 className="font-medium text-sm line-clamp-2 mb-1">
                                                {post.title}
                                            </h4>
                                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                                <Clock className="h-3 w-3" />
                                                <span>{format(parseISO(post.published_at), 'h:mm a')}</span>
                                            </div>
                                            <Badge variant="outline" className="mt-2 text-xs">
                                                {post.subcategory?.name || 'Uncategorized'}
                                            </Badge>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* Upcoming Posts List */}
            <Card>
                <CardHeader>
                    <CardTitle>Upcoming Posts</CardTitle>
                    <CardDescription>All scheduled posts in chronological order</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-3">
                        {scheduledPosts.length === 0 ? (
                            <div className="text-center py-12 text-muted-foreground">
                                <CalendarDays className="h-16 w-16 mx-auto mb-4 opacity-50" />
                                <p>No scheduled posts yet</p>
                                <p className="text-sm mt-2">Create a post and set it to "Scheduled" to see it here</p>
                            </div>
                        ) : (
                            scheduledPosts.map((post) => (
                                <div
                                    key={post.id}
                                    className="flex items-center gap-4 p-4 rounded-lg border bg-card hover:bg-accent transition-colors"
                                >
                                    {post.featured_image && (
                                        <img
                                            src={post.featured_image}
                                            alt={post.title}
                                            className="w-20 h-20 rounded-lg object-cover flex-shrink-0"
                                        />
                                    )}
                                    <div className="flex-1 min-w-0">
                                        <h3 className="font-semibold text-lg line-clamp-1">{post.title}</h3>
                                        <p className="text-sm text-muted-foreground line-clamp-1 mt-1">
                                            {post.excerpt}
                                        </p>
                                        <div className="flex items-center gap-4 mt-2">
                                            <Badge variant="outline">
                                                {post.subcategory?.category?.name} / {post.subcategory?.name}
                                            </Badge>
                                            {post.content?.author && (
                                                <span className="text-xs text-muted-foreground">
                                                    by {post.content.author.name}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                    <div className="text-right flex-shrink-0">
                                        <div className="text-sm font-medium">
                                            {format(parseISO(post.published_at), 'MMM d, yyyy')}
                                        </div>
                                        <div className="text-xs text-muted-foreground flex items-center gap-1 justify-end mt-1">
                                            <Clock className="h-3 w-3" />
                                            {format(parseISO(post.published_at), 'h:mm a')}
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
