"use client"

import React, { useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import MediaLibrary from './Components/MediaLibrary'
import OrganizedView from './Components/OrganizedView'
import OrphanedMedia from './Components/OrphanedMedia'
import UploadMedia from './Components/UploadMedia'
import { Image, FolderOpen, Trash2, Upload } from 'lucide-react'

/**
 * ════════════════════════════════════════════════════════════════
 * MEDIA MANAGEMENT PAGE
 * ════════════════════════════════════════════════════════════════
 * 
 * Purpose: Comprehensive media management interface
 * 
 * Features:
 * ✅ Browse all media (filterable by type)
 * ✅ Upload new media
 * ✅ Organized view (by article)
 * ✅ Find orphaned media
 * ✅ Edit/Replace media
 * ✅ Delete media
 * 
 * Location: admin-infomly/app/Media/page.js
 */
export default function MediaPage() {
    const [activeTab, setActiveTab] = useState('library')

    return (
        <div className="min-h-screen bg-background p-4 md:p-6 lg:p-8">
            <div className="max-w-7xl mx-auto space-y-6">
                {/* Page Header */}
                <div>
                    <h1 className="text-3xl md:text-4xl font-bold tracking-tight">Media Management</h1>
                    <p className="text-muted-foreground mt-2">
                        Upload, organize, and manage all your media files
                    </p>
                </div>

                {/* Tabs Navigation */}
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                    <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 gap-2">
                        <TabsTrigger value="library" className="gap-2">
                            <Image className="h-4 w-4" />
                            <span className="hidden sm:inline">Media Library</span>
                            <span className="sm:hidden">Library</span>
                        </TabsTrigger>
                        <TabsTrigger value="upload" className="gap-2">
                            <Upload className="h-4 w-4" />
                            <span className="hidden sm:inline">Upload</span>
                            <span className="sm:hidden">Upload</span>
                        </TabsTrigger>
                        <TabsTrigger value="organized" className="gap-2">
                            <FolderOpen className="h-4 w-4" />
                            <span className="hidden sm:inline">By Article</span>
                            <span className="sm:hidden">Articles</span>
                        </TabsTrigger>
                        <TabsTrigger value="orphaned" className="gap-2">
                            <Trash2 className="h-4 w-4" />
                            <span className="hidden sm:inline">Orphaned</span>
                            <span className="sm:hidden">Unused</span>
                        </TabsTrigger>
                    </TabsList>

                    {/* Tab Content */}
                    <TabsContent value="library" className="mt-6">
                        <MediaLibrary />
                    </TabsContent>

                    <TabsContent value="upload" className="mt-6">
                        <UploadMedia onUploadSuccess={() => setActiveTab('library')} />
                    </TabsContent>

                    <TabsContent value="organized" className="mt-6">
                        <OrganizedView />
                    </TabsContent>

                    <TabsContent value="orphaned" className="mt-6">
                        <OrphanedMedia />
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    )
}
