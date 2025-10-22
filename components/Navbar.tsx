"use client"

import React from "react"
import Link from "next/link"
import { Menu } from "lucide-react"
import { cn } from "@/lib/utils"
import { useSidebar } from "@/components/ui/sidebar"

const Navbar = () => {
  const { toggleSidebar } = useSidebar()

  return (
    <>
  <nav className="sticky top-0 z-10 bg-white bg-opacity-100  shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Mobile Menu Button (left-aligned) */}
            <div className="md:hidden">
              <button
                onClick={toggleSidebar}
                className="inline-flex items-center justify-center p-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-accent focus:outline-none focus:ring-2 focus:ring-inset focus:ring-ring transition-colors"
              >
                <span className="sr-only">Toggle sidebar</span>
                <Menu className="block h-6 w-6" aria-hidden="true" />
              </button>
            </div>

            {/* Centered Navigation Links */}
            <div className="hidden md:flex flex-grow justify-center space-x-4">
              {[
                { href: "/", label: "" },
                // { href: "/", label: "Updates" },

                // { href: "/News", label: "Top News" },
                // { href: "/Tech", label: "Tech" },
                // { href: "/Health", label: "Health" },
                // { href: "/Future", label: "Future of AI" },
              ].map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "px-3 py-2 rounded-md text-sm font-medium",
                    "text-foreground hover:bg-accent hover:text-accent-foreground",
                    "transition-colors"
                  )}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile menu removed: sidebar toggled from the button above */}
    </>
  )
}

export default Navbar
