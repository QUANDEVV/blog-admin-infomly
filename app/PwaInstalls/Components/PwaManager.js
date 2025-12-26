"use client"

import React, { useState } from 'react'
import {
    SmartphoneIcon,
    SendIcon,
    UsersIcon,
    BellIcon,
    PieChartIcon,
    RefreshCwIcon,
    GlobeIcon,
    LaptopIcon
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"
import { usePwa } from "@/hooks/Pwa/usePwa"

export default function PwaManager() {
    const { stats, isLoading, broadcastPush, mutate } = usePwa()
    const [sending, setSending] = useState(false)
    const [form, setForm] = useState({
        title: 'New Update in Infomly Lab!',
        body: 'Check out the latest insights we just published.',
        url: '/',
        image: ''
    })

    const fetchArticleDetails = async (url) => {
        // Regex to extract year/month/day/slug from /2025/12/07/slug
        const match = url.match(/\/(\d{4})\/(\d{2})\/(\d{2})\/([A-Za-z0-9\-_]+)/);
        if (match) {
            const [_, year, month, day, slug] = match;
            try {
                // We use the public blog API to fetch article details
                const data = await fetch(`https://backend.infomly.com/api/blog/${year}/${month}/${day}/${slug}`).then(res => res.json());
                if (data && data.content) {
                    const article = data.content;
                    setForm(prev => ({
                        ...prev,
                        title: article.displayCard?.title || article.title || prev.title,
                        body: article.displayCard?.description || article.summary || prev.body,
                        image: article.displayCard?.image_url || prev.image
                    }));
                    toast.success("Magic! Article details auto-filled.");
                }
            } catch (err) {
                console.error("Failed to auto-fill article details:", err);
            }
        }
    }

    const handleSendPush = async (e) => {
        e.preventDefault()
        if (!form.title || !form.body) {
            toast.error("Please fill in both title and message")
            return
        }

        setSending(true)
        try {
            const data = await broadcastPush(form)
            toast.success(data.message || "Notification sent successfully!")
            // Keep URL and image for potential correction, but clear message/title if desired
            // Or just leave them for the user to see what was sent.
            mutate()
        } catch (error) {
            console.error('Error sending push:', error)
            toast.error(error.message || "Failed to send notification")
        } finally {
            setSending(false)
        }
    }

    if (isLoading && !stats) {
        return <div className="flex items-center justify-center min-h-[400px]">
            <RefreshCwIcon className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
    }

    return (
        <div className="space-y-6">
            {/* Header - Matching Standard Admin Style */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">PWA Management</h1>
                    <p className="text-muted-foreground mt-1">Monitor installations and send push notifications to your users.</p>
                </div>
                <Button variant="outline" onClick={() => mutate()} disabled={isLoading} className="gap-2">
                    <RefreshCwIcon className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
                    Refresh Stats
                </Button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Installs</CardTitle>
                        <SmartphoneIcon className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats?.total_installs || 0}</div>
                        <p className="text-xs text-muted-foreground">{stats?.today_installs || 0} installs today</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Push Subscribers</CardTitle>
                        <BellIcon className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats?.total_subscriptions || 0}</div>
                        <p className="text-xs text-muted-foreground">
                            {((stats?.total_subscriptions / stats?.total_installs) * 100 || 0).toFixed(1)}% conversion
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Retention Rate</CardTitle>
                        <PieChartIcon className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats?.retention_rate || 0}%</div>
                        <p className="text-xs text-muted-foreground">Active in last 30 days</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Top Platform</CardTitle>
                        <UsersIcon className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {stats?.platform_distribution ? Object.keys(stats.platform_distribution)[0] : 'None'}
                        </div>
                        <p className="text-xs text-muted-foreground">Most used device type</p>
                    </CardContent>
                </Card>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
                {/* Manual Push Form */}
                <Card className="col-span-1">
                    <CardHeader>
                        <CardTitle>Send Custom Notification</CardTitle>
                        <CardDescription>
                            This will send a native push notification to all {stats?.total_subscriptions || 0} subscribers.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSendPush} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="url">Action URL (slug)</Label>
                                <div className="flex gap-2">
                                    <span className="inline-flex items-center px-3 rounded-md border border-input bg-muted text-muted-foreground text-sm">
                                        /
                                    </span>
                                    <Input
                                        id="url"
                                        placeholder="2025/12/article-slug"
                                        value={form.url === '/' ? '' : form.url.replace(/^\//, '')}
                                        onChange={(e) => {
                                            let val = e.target.value;
                                            // If they paste a full URL, strip the domain
                                            if (val.includes('infomly.com/')) {
                                                val = val.split('infomly.com/')[1];
                                            }
                                            const newUrl = '/' + val.replace(/^\//, '');
                                            setForm({ ...form, url: newUrl });
                                            // Trigger magic auto-fill
                                            if (newUrl.length > 10) fetchArticleDetails(newUrl);
                                        }}
                                    />
                                </div>
                                <p className="text-[10px] text-muted-foreground">Where the user lands when they click the notification. Pasting an article link will auto-fill the form!</p>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="title">Notification Title</Label>
                                <Input
                                    id="title"
                                    placeholder="Enter title..."
                                    value={form.title}
                                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="message">Message Body</Label>
                                <Textarea
                                    id="message"
                                    placeholder="Enter your message here..."
                                    className="min-h-[80px]"
                                    value={form.body}
                                    onChange={(e) => setForm({ ...form, body: e.target.value })}
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="image">Banner Image URL (Google Discover Style)</Label>
                                <Input
                                    id="image"
                                    placeholder="https://.../featured-image.jpg (Optional)"
                                    value={form.image}
                                    onChange={(e) => setForm({ ...form, image: e.target.value })}
                                />
                                {form.image && (
                                    <div className="mt-2 relative aspect-video rounded-md overflow-hidden bg-muted border">
                                        <img src={form.image} alt="Preview" className="object-cover w-full h-full" />
                                    </div>
                                )}
                            </div>

                            <Button type="submit" className="w-full" disabled={sending || stats?.total_subscriptions === 0}>
                                {sending ? (
                                    <>
                                        <RefreshCwIcon className="mr-2 h-4 w-4 animate-spin" />
                                        Sending...
                                    </>
                                ) : stats?.total_subscriptions === 0 ? (
                                    <>
                                        <BellIcon className="mr-2 h-4 w-4 opacity-50" />
                                        Waiting for Subscribers...
                                    </>
                                ) : (
                                    <>
                                        <SendIcon className="mr-2 h-4 w-4" />
                                        Blast to {stats?.total_subscriptions} Devices
                                    </>
                                )}
                            </Button>
                        </form>
                    </CardContent>
                </Card>

                {/* Platform Breakdown */}
                <Card className="col-span-1">
                    <CardHeader>
                        <CardTitle>Platform Breakdown</CardTitle>
                        <CardDescription>Device types used to install the PWA.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {stats?.platform_distribution && Object.entries(stats.platform_distribution).map(([platform, count]) => (
                                <div key={platform} className="flex items-center gap-4">
                                    <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
                                        {platform === 'iOS' ? <SmartphoneIcon className="h-5 w-5" /> :
                                            platform === 'Android' ? <SmartphoneIcon className="h-5 w-5 text-green-500" /> :
                                                platform === 'Desktop' ? <LaptopIcon className="h-5 w-5" /> :
                                                    <GlobeIcon className="h-5 w-5" />}
                                    </div>
                                    <div className="flex-1 space-y-1">
                                        <div className="flex items-center justify-between">
                                            <p className="text-sm font-medium leading-none">{platform}</p>
                                            <p className="text-sm text-muted-foreground">{count} installs</p>
                                        </div>
                                        <div className="h-2 w-full rounded-full bg-secondary">
                                            <div
                                                className="h-full rounded-full bg-primary"
                                                style={{ width: `${(count / stats.total_installs) * 100}%` }}
                                            />
                                        </div>
                                    </div>
                                </div>
                            ))}
                            {(!stats?.platform_distribution || Object.keys(stats.platform_distribution).length === 0) && (
                                <div className="text-center py-8 text-muted-foreground">
                                    No data available yet.
                                </div>
                            )}
                        </div>
                    </CardContent>
                    <CardFooter className="pt-0">
                        <p className="text-xs text-muted-foreground">
                            Note: Push notifications are only supported on modern mobile browsers and desktop Chrome/Edge/Firefox.
                        </p>
                    </CardFooter>
                </Card>
            </div>
        </div>
    )
}
