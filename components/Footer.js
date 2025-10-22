import Link from "next/link"
import { Twitter, Facebook, Instagram, Linkedin, Youtube } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="w-full font-['Helvetica'] text-[13px] leading-[1.15385] mt-20  bg-white">

      <div className="container mx-auto px-4 sm:px-6 lg:px-8">

        {/* Main Navigation */}
        <nav className="bg-white py-3 flex flex-wrap justify-center gap-x-6 gap-y-2 border-b border-[#CCCCCC] text-center">
          {/* <Link href="/" className="font-bold">Home</Link>
          <Link href="/News">News</Link>
          <Link href="/Tech">Tech</Link>
          <Link href="/AI">AI</Link>
          <Link href="/Health">Health</Link> */}
          {/* <Link href="/culture">Culture</Link>
          <Link href="/arts">Arts</Link>
          <Link href="/travel">Travel</Link>
          <Link href="/earth">Earth</Link>
          <Link href="/video">Video</Link>
          <Link href="/live">Live</Link>
          <Link href="/audio">Audio</Link>
          <Link href="/weather">Weather</Link>
          <Link href="/shop">Our Shop</Link> */}
        </nav>

        {/* Social Links */}
        <div className="px-4 py-6 text-center">
          <div className="mb-3 text-sm">Follow  on:</div>
          <div className="flex justify-center gap-4">
            <Link href="#" aria-label="Twitter" className="text-black">
              <Twitter className="w-5 h-5" />
            </Link>
            <Link href="#" aria-label="Facebook" className="text-black">
              <Facebook className="w-5 h-5" />
            </Link>
            <Link href="#" aria-label="Instagram" className="text-black">
              <Instagram className="w-5 h-5" />
            </Link>
            <Link href="#" aria-label="LinkedIn" className="text-black">
              <Linkedin className="w-5 h-5" />
            </Link>
            <Link href="#" aria-label="YouTube" className="text-black">
              <Youtube className="w-5 h-5" />
            </Link>
          </div>
        </div>

        {/* Footer Links */}
        <div className="px-4 py-4 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 text-center text-[#404040]">
          <Link href="/Extras/Terms">Terms of Use</Link>
          <Link href="/Extras/About">About Us</Link>
          <Link href="/Extras/Privacy">Privacy Policy</Link>
          <Link href="/Extras/Cookies">Cookies</Link>
          <Link href="/Extras/Accessibility">Accessibility Help</Link>
          <Link href="/Extras/Contact">Contact Us </Link>
          <Link href="/Extras/Advertise">Advertise with us</Link>
          <Link href="/Extras/DoNotSellInfo">Do not share or sell my info</Link>
          <Link href="/Extras/TechSupport">Contact technical support</Link>
        </div>

        {/* Copyright */}
        <div className="px-4 py-4 text-center text-[#404040] text-sm">
          <p>
            Copyright © {new Date().getFullYear()} . All rights reserved. The  is{' '}
            <em>not responsible for the content of external sites.</em>{' '}
            <Link href="/external-linking" className="hover:underline">
              Read about our approach to external linking
            </Link>
            .
          </p>
        </div>

      </div>
    </footer>
  )
}
