import { cn } from "@/lib/utils"
import { Card, CardContent } from "@/components/ui/card"
import { formatDistanceToNow } from 'date-fns'
import Link from 'next/link'

interface ArticleCardProps {
  title: string
  description: string
  image: string
  date: Date
  category: string
  href: string
  large?: boolean
}

export function ArticleCard({
  title,
  description,
  image,
  date,
  category,
  href,
  large = false
}: ArticleCardProps) {
  return (
    <Link href={href}>
      <Card className="overflow-hidden group h-full">
        <div className={cn("relative", large ? "aspect-[16/9]" : "aspect-[16/10]")}>
          <img
            src={image}
            alt={title}
            className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
          />
        </div>
        <CardContent className="p-4">
          <h3 className={cn(
            "font-bold tracking-tight text-foreground/90 group-hover:text-foreground",
            large ? "text-2xl md:text-3xl" : "text-lg md:text-xl"
          )}>
            {title}
          </h3>
          <p className="mt-2 text-muted-foreground line-clamp-2">{description}</p>
          <div className="flex items-center gap-2 mt-3 text-sm text-muted-foreground">
            <span>{formatDistanceToNow(date, { addSuffix: true })}</span>
            <span>•</span>
            <span>{category}</span>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}

