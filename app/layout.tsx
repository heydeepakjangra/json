import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "JSON Formatter & Explorer - Format, Validate & Compare JSON Online",
  description: "Professional JSON formatter, validator, and explorer with tree view, real-time validation, JSON comparison, search functionality, and more. Free online tool for developers.",
  keywords: "JSON formatter, JSON validator, JSON explorer, JSON compare, JSON tree view, JSON tools, developer tools, online JSON editor, JSON diff, JSON parser",
  authors: [{ name: "Deepak Jangra", url: "https://x.com/heydeepakjangra" }],
  creator: "Deepak Jangra",
  publisher: "Deepak Jangra",
  applicationName: "JSON Formatter & Explorer",
  category: "Developer Tools",
  classification: "Web Application",
  referrer: "origin-when-cross-origin",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
  manifest: '/manifest.json',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://json.deepakjangra.com',
    title: 'JSON Formatter & Explorer - Professional JSON Tools',
    description: 'Professional JSON formatter, validator, and explorer with tree view, real-time validation, JSON comparison, search functionality, and more. Free online tool for developers.',
    siteName: 'JSON Formatter & Explorer',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'JSON Formatter & Explorer - Professional JSON Tools',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'JSON Formatter & Explorer - Professional JSON Tools',
    description: 'Professional JSON formatter, validator, and explorer with tree view, real-time validation, JSON comparison, and more.',
    creator: '@heydeepakjangra',
    images: ['/og-image.png'],
  },
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 5,
    userScalable: true,
  },
  other: {
    'theme-color': '#0F172A',
    'color-scheme': 'dark light',
    'mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-status-bar-style': 'default',
    'msapplication-TileColor': '#0F172A',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="canonical" href="https://json.deepakjangra.com" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="theme-color" content="#0F172A" />
        <meta name="color-scheme" content="dark light" />
        
        {/* Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebApplication",
              "name": "JSON Formatter & Explorer",
              "description": "Professional JSON formatter, validator, and explorer with tree view, real-time validation, JSON comparison, search functionality, and more.",
              "url": "https://json.deepakjangra.com",
              "applicationCategory": "DeveloperApplication",
              "operatingSystem": "Web Browser",
              "permissions": "browser",
              "offers": {
                "@type": "Offer",
                "price": "0",
                "priceCurrency": "USD"
              },
              "author": {
                "@type": "Person",
                "name": "Deepak Jangra",
                "url": "https://x.com/heydeepakjangra"
              },
              "creator": {
                "@type": "Person",
                "name": "Deepak Jangra",
                "url": "https://x.com/heydeepakjangra"
              },
              "dateCreated": "2024",
              "inLanguage": "en-US",
              "isAccessibleForFree": true,
              "features": [
                "JSON Formatting",
                "JSON Validation", 
                "JSON Comparison",
                "Tree View Explorer",
                "Search & Filter",
                "JSONPath Queries",
                "Dark/Light Theme"
              ]
            })
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
