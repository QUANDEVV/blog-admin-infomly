/**
 * Web App Manifest - PWA Configuration for Admin Panel
 * Makes admin panel installable on mobile devices
 */

import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Infomly Admin Panel - Content Management',
    short_name: 'Infomly Admin',
    description: 'Admin panel for managing Infomly blog content, articles, categories, and analytics.',
    start_url: '/dashboard',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#0f172a', // Dark theme for admin
    orientation: 'portrait-primary',
    icons: [
      {
        src: '/icon-192x192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'maskable',
      },
      {
        src: '/icon-512x512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
      },
      {
        src: '/icon-192x192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/icon-512x512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any',
      },
    ],
    categories: ['productivity', 'utilities'],
    lang: 'en-US',
    dir: 'ltr',
    prefer_related_applications: false,
  }
}
