"use client"

import { MailIcon, PlusCircleIcon, type LucideIcon } from "lucide-react"
import { useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

export function NavMain({
  items,
  className,
}: {
  items: {
    title: string
    url: string
    icon?: LucideIcon
  }[]
  className?: string
}) {
  const router = useRouter()

  return (
    <SidebarGroup className={className}>
      <SidebarGroupContent className="flex flex-col gap-2">
      
        <SidebarMenu>
          {items.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton tooltip={item.title} onClick={() => router.push(item.url)}>
                {item.icon && <item.icon />}
                <span>{item.title}</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
          <SidebarMenu>
          <SidebarMenuItem className="flex items-center gap-2">
            {/* <SidebarMenuButton
              tooltip="Quick Create"
              className="min-w-8 bg-primary text-primary-foreground duration-200 ease-linear hover:bg-primary/90 hover:text-primary-foreground active:bg-primary/90 active:text-primary-foreground"
              onClick={() => router.push("/CreatePosts")}
            >
              <PlusCircleIcon />
              <span>Post Blogs</span>
            </SidebarMenuButton> */}
            <span
           
              className="h-9 w-9 "
              
            >
             
            </span>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  )
}
