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
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { InfoIcon, AlertCircleIcon, CheckCircle2Icon } from "lucide-react"
import { toast } from "sonner"
import { usePwa } from "@/hooks/Pwa/usePwa"

export default function PwaManager() {
    const { stats, isLoading, broadcastPush, mutate } = usePwa()
    const [sending, setSending] = useState(false)
    const [isAutoFilling, setIsAutoFilling] = useState(false)
    const [form, setForm] = useState({
        title: 'New Update in Infomly Lab!',
        body: 'Check out the latest insights we just published.',
        url: '/',
        image: ''
    })

    const fetchArticleDetails = async (url) => {
        if (!url || url.length < 10) return;

        // More robust slug extraction: handle infomly.com/2025/12/01/slug
        const slugPattern = /(\d{4})\/(\d{2})\/(\d{2})\/([A-Za-z0-9\-_]+)/;
        const match = url.match(slugPattern);

        if (match) {
            const [_, year, month, day, slug] = match;
            try {
                setIsAutoFilling(true);
                toast.loading("Magic Sync: Fetching blog details...", { id: 'autofill' });

                const data = await fetch(`https://backend.infomly.com/api/blog/${year}/${month}/${day}/${slug}`).then(res => res.json());

                if (data && data.content) {
                    const article = data.content;
                    const card = article.display_card; // API uses snake_case
                    setForm({
                        title: card?.title || article.title || "New Update",
                        body: card?.excerpt || article.summary || "Tap to read more.",
                        url: `/${year}/${month}/${day}/${slug}`,
                        image: card?.featured_image || null
                    });
                    toast.success("Ready! Title and Image synced.", { id: 'autofill' });
                } else {
                    toast.error("Blog not found. Please check the link.", { id: 'autofill' });
                }
            } catch (err) {
                console.error("Failed to auto-fill:", err);
                toast.error("Sync Error: Try a different link.", { id: 'autofill' });
            } finally {
                setIsAutoFilling(false);
            }
        }
    }

    const isDefaultContent = form.title === 'New Update in Infomly Lab!' || form.body === 'Check out the latest insights we just published.';
    const canSend = !isAutoFilling && !sending && stats?.total_subscriptions > 0 && (!isDefaultContent || form.url === '/');

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
                                    <div className="flex flex-1 gap-2">
                                        <span className="inline-flex items-center px-3 rounded-md border border-input bg-muted text-muted-foreground text-sm">
                                            /
                                        </span>
                                        <Input
                                            id="url"
                                            placeholder="2025/12/article-slug"
                                            className="flex-1"
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
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="icon"
                                        onClick={() => fetchArticleDetails(form.url)}
                                        disabled={isAutoFilling}
                                        title="Power Fill from URL"
                                    >
                                        <RefreshCwIcon className={`h-4 w-4 ${isAutoFilling ? 'animate-spin' : ''}`} />
                                    </Button>
                                </div>
                                <p className="text-[10px] text-muted-foreground">Pasting a link will automatically pull the blog photo and title!</p>
                            </div>

                            {form.url !== '/' && isDefaultContent && !isAutoFilling && (
                                <Alert className="bg-orange-500/10 border-orange-500/20 py-2">
                                    <AlertCircleIcon className="h-4 w-4 text-orange-500" />
                                    <AlertTitle className="text-xs text-orange-500 font-bold">Stale Text Alert</AlertTitle>
                                    <AlertDescription className="text-[10px] text-orange-400">
                                        You are still using default text. Click the 🔄 icon next to the URL to sync the blog details first!
                                    </AlertDescription>
                                </Alert>
                            )}

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
                            </div>

                            {/* Live Phone Preview */}
                            <div className="mt-6 pt-4 border-t">
                                <Label className="text-[10px] text-muted-foreground uppercase font-bold flex items-center gap-2 mb-3">
                                    <SmartphoneIcon className="h-3 w-3" />
                                    Expanded Notification Preview (Phone View)
                                </Label>
                                <div className="bg-[#121212] rounded-2xl p-4 border border-white/5 shadow-2xl overflow-hidden max-w-[320px] mx-auto scale-95 origin-top transition-all">
                                    <div className="flex items-start gap-3">
                                        <div className="h-10 w-10 rounded-xl bg-white/5 flex items-center justify-center flex-shrink-0">
                                            <img src="/logo.png" alt="" className="h-6 w-6 opacity-80" onError={(e) => e.target.src = '/icon-192x192.png'} />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center justify-between mb-0.5">
                                                <span className="text-[10px] font-medium text-white/40">Infomly • infomly.com</span>
                                                <span className="text-[10px] text-white/20">Now</span>
                                            </div>
                                            <h4 className="text-sm font-bold text-white truncate">{form.title}</h4>
                                            <p className="text-xs text-white/70 line-clamp-2 leading-tight">{form.body}</p>
                                        </div>
                                    </div>

                                    {form.image && (
                                        <div className="mt-3 aspect-[2/1] rounded-lg overflow-hidden border border-white/5 shadow-inner">
                                            <img src={form.image} alt="Blog Graphic" className="object-cover w-full h-full" />
                                        </div>
                                    )}

                                    <div className="mt-3 flex gap-2">
                                        <div className="flex-1 py-1.5 rounded-md bg-white/5 text-[10px] font-bold text-white text-center">View Story</div>
                                        <div className="flex-1 py-1.5 rounded-md bg-white/5 text-[10px] font-bold text-white/30 text-center">Dismiss</div>
                                    </div>
                                </div>
                            </div>

                            <Button type="submit" className="w-full mt-4" disabled={!canSend}>
                                {sending ? (
                                    <>
                                        <RefreshCwIcon className="mr-2 h-4 w-4 animate-spin" />
                                        Blasting to users...
                                    </>
                                ) : isAutoFilling ? (
                                    <>
                                        <RefreshCwIcon className="mr-2 h-4 w-4 animate-spin" />
                                        Syncing Blog Details...
                                    </>
                                ) : stats?.total_subscriptions === 0 ? (
                                    <>
                                        <BellIcon className="mr-2 h-4 w-4 opacity-50" />
                                        No Subscribers Yet
                                    </>
                                ) : isDefaultContent && form.url !== '/' ? (
                                    <>
                                        <AlertCircleIcon className="mr-2 h-4 w-4 text-orange-400" />
                                        Fetch Content First
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
