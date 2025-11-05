import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Analytics } from "@vercel/analytics/next";
import Script from "next/script";
import { Geist, Geist_Mono } from "next/font/google"; // ✅ Import Fonts
import { AppSidebar } from "@/components/app-sidebar";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { ThemeProvider } from "@/components/theme-provider";
import ThemeToggle from "@/components/theme-toggle";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});


export const metadata = {
  title: {
    default: "My Blog - A Place for Insightful Articles",
    template: "%s - My Blogs",
  },
  description: "",
  keywords: "blog, technology, lifestyle, insights, articles",
};


export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>

        {/* ✅ Google AdSense Verification Meta Tag */}
        {/* <meta name="google-adsense-account" content="ca-pub-4873423558942028" /> */}

        {/* ✅ Google AdSense Script */}
        {/* <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4873423558942028"
          crossorigin="anonymous"
        /> */}

        {/* ✅ Google Analytics Script */}
        {/* <Script async src="https://www.googletagmanager.com/gtag/js?id=G-9ZJPN4D85V" /> */}
        {/* <Script
          id="google-analytics"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-9ZJPN4D85V');
            `,
          }}
        /> */}
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <SidebarProvider
          style={{
            "--sidebar-width": "calc(var(--spacing) * 72)",
            "--header-height": "calc(var(--spacing) * 12)",
          }}
        >
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <AppSidebar variant="inset" />
            <SidebarInset>
              <Navbar />

              <div className="mx-4 sm:mx-8 md:mx-16 lg:mx-32 xl:mx-64 font-sans mt-10">
                {children}
              </div>
             
            </SidebarInset>
          </ThemeProvider>
        </SidebarProvider>
        <Analytics />
        {/* <Footer /> */}
      </body>
    </html>
  );
}
