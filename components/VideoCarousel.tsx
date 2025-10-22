'use client'

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, Play } from 'lucide-react'
import { useRef, useState } from "react"
import { cn } from "@/lib/utils"

interface Video {
  id: string
  title: string
  description: string
  thumbnail: string
  date: Date
  category: string
}

interface VideoCarouselProps {
  videos: Video[]
}

export function VideoCarousel({ videos }: VideoCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [scrollPosition, setScrollPosition] = useState(0)

  const scroll = (direction: 'left' | 'right') => {
    const container = scrollRef.current
    if (!container) return

    const scrollAmount = direction === 'left' ? -400 : 400
    container.scrollBy({ left: scrollAmount, behavior: 'smooth' })
    setScrollPosition(container.scrollLeft + scrollAmount)
  }

  return (
    <div className="relative bg-black text-white ">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-bold mb-6">Watch</h2>
        <div className="relative">
          <div
            ref={scrollRef}
            className="flex gap-4 overflow-x-auto scrollbar-hide snap-x snap-mandatory"
          >
            {videos.map((video) => (
              <Card
                key={video.id}
                className="flex-none w-[300px] snap-start bg-transparent text-white border-0 "
              >
                <div className="relative aspect-video">
                  <img
                    src={video.thumbnail}
                    alt={video.title}
                    className="object-cover w-full h-full rounded-lg"
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Button
                      size="icon"
                      variant="ghost"
                      className="w-12 h-12 rounded-full bg-black/50 hover:bg-black/70"
                    >
                      <Play className="h-6 w-6" />
                    </Button>
                  </div>
                </div>
                <CardContent className="px-0 pt-4">
                  <h3 className="font-bold text-lg line-clamp-2">{video.title}</h3>
                  <p className="text-sm text-gray-400 mt-1 line-clamp-2">{video.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="absolute left-0 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70"
            onClick={() => scroll('left')}
            disabled={scrollPosition <= 0}
          >
            <ChevronLeft className="h-6 w-6" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-0 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70"
            onClick={() => scroll('right')}
          >
            <ChevronRight className="h-6 w-6" />
          </Button>
        </div>
      </div>
    </div>
  )
}

