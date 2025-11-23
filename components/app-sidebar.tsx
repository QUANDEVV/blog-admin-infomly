"use client"

import {
  ArrowUpCircleIcon,
  BarChartIcon,
  CameraIcon,
  ClipboardListIcon,
  DatabaseIcon,
  FileCodeIcon,
  FileIcon,
  FileTextIcon,
  FolderIcon,
  HelpCircleIcon,
  LayoutDashboardIcon,
  ListIcon,
  SearchIcon,
  SettingsIcon,
  UsersIcon,
  Trophy,
  GlobeIcon,
  HeartIcon,
  BeakerIcon,
  BriefcaseIcon,
  PaletteIcon,
  RocketIcon,
  MoreHorizontalIcon,
  DollarSignIcon,
  LandmarkIcon,
  BrainIcon,
  CookingPotIcon,
  PlaneIcon,
  PlusCircleIcon,
  PenToolIcon,
} from "lucide-react"

import { NavMain } from "@/components/nav-main"
import { NavSecondary } from "@/components/nav-secondary"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

const data = {
  user: {
    name: "Admin User",
    email: "admin@infomly.com",
    avatar: "/avatar.png",
  },
  navMain: [
    {
      title: "Dashboard",
      url: "/",
      icon: LayoutDashboardIcon,
    },
    {
      title: "Display Cards",
      url: "/DisplayCard",
      icon: FileIcon,
    },
    {
      title: "Editor",
      url: "/Editor",
      icon: PenToolIcon,
    },
    {
      title: "Media",
      url: "/Media",
      icon: CameraIcon,
    },
    {
      title: "Categories",
      url: "/Categories",
      icon: FolderIcon,
    },
    {
      title: "Authors",
      url: "/Authors",
      icon: UsersIcon,
    },
    {
      title: "Analytics",
      url: "/Stats",
      icon: BarChartIcon,
    },
    {
      title: "Revenue",
      url: "/Revenue",
      icon: DollarSignIcon,
    },
    {
      title: "SEO Tools",
      url: "/SEO",
      icon: SearchIcon,
    },
  ],
  navSecondary: [
    {
      title: "Settings",
      url: "/settings",
      icon: SettingsIcon,
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <a href="#">
                <ArrowUpCircleIcon className="h-5 w-5" />
                <span className="text-base font-semibold">infomly</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} className="mt-4" />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  )
}
