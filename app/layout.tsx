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
  keywords: [
    "JSON formatter", "JSON validator", "JSON explorer", "JSON compare", "JSON tree view",
    "JSON tools", "developer tools", "online JSON editor", "JSON diff", "JSON parser",
    "pretty print JSON", "minify JSON", "JSON syntax checker", "JSON beautifier",
    "JSON to CSV", "JSONPath query", "free JSON tools", "client-side JSON",
    "JSON visualization", "JSON inspector", "JSON analyser", "format JSON online",
    "validate JSON online", "compare JSON files", "JSON structure viewer"
  ].join(", "),
  authors: [{ name: "Deepak Jangra", url: "https://x.com/heydeepakjangra" }],
  creator: "Deepak Jangra",
  publisher: "Deepak Jangra",
  applicationName: "JSON Formatter & Explorer",
  category: "Developer Tools",
  classification: "Web Application",
  referrer: "origin-when-cross-origin",
  alternates: {
    canonical: "https://json.deepakjangra.com",
  },
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
        
        {/* Structured Data - WebApplication */}
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
              "browserRequirements": "Requires JavaScript. Requires HTML5.",
              "softwareVersion": "1.0",
              "releaseNotes": "Enhanced JSON tools with comparison, validation, and tree explorer features.",
              "aggregateRating": {
                "@type": "AggregateRating",
                "ratingValue": "4.8",
                "bestRating": "5",
                "worstRating": "1",
                "ratingCount": "150"
              },
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
              "dateModified": "2024-12",
              "inLanguage": "en-US",
              "isAccessibleForFree": true,
              "featureList": [
                "JSON Formatting & Pretty Print",
                "Real-time JSON Validation", 
                "Side-by-side JSON Comparison",
                "Interactive Tree View Explorer",
                "Advanced Search & Highlighting",
                "JSONPath Query Support",
                "CSV Export Functionality",
                "Dark/Light Theme Toggle",
                "Offline PWA Support"
              ],
              "screenshot": "https://json.deepakjangra.com/og-image.png",
              "softwareHelp": {
                "@type": "CreativeWork",
                "name": "JSON Formatter Help",
                "url": "https://json.deepakjangra.com#help"
              }
            })
          }}
        />
        
        {/* Structured Data - SoftwareApplication */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "SoftwareApplication",
              "name": "JSON Formatter & Explorer",
              "operatingSystem": "Web Browser",
              "applicationCategory": "WebApplication",
              "downloadUrl": "https://json.deepakjangra.com",
              "installUrl": "https://json.deepakjangra.com",
              "screenshot": "https://json.deepakjangra.com/og-image.png",
              "softwareVersion": "1.0",
              "datePublished": "2024",
              "author": {
                "@type": "Person",
                "name": "Deepak Jangra"
              },
              "offers": {
                "@type": "Offer",
                "price": "0",
                "priceCurrency": "USD"
              }
            })
          }}
        />
        
        {/* Structured Data - FAQ */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "FAQPage",
              "mainEntity": [
                {
                  "@type": "Question",
                  "name": "How do I format JSON online?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Paste your JSON into the editor and click the 'Format' button. The tool will automatically indent and pretty-print your JSON with proper spacing and line breaks."
                  }
                },
                {
                  "@type": "Question", 
                  "name": "How do I validate JSON syntax?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "The tool automatically validates JSON syntax as you type. Invalid JSON will show error messages with specific line and column information to help you fix syntax issues."
                  }
                },
                {
                  "@type": "Question",
                  "name": "Can I compare two JSON files?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Yes! Use the Compare tab to paste two JSON documents side-by-side. The tool will highlight differences with color-coded changes: green for additions, red for deletions, and yellow for modifications."
                  }
                },
                {
                  "@type": "Question",
                  "name": "Is this JSON formatter free to use?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Yes, this JSON formatter and explorer is completely free to use. All processing happens in your browser - no data is sent to servers, ensuring privacy and security."
                  }
                },
                {
                  "@type": "Question",
                  "name": "Does the tool work offline?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Yes! This is a Progressive Web App (PWA) that can be installed and used offline once loaded. All features work without an internet connection."
                  }
                }
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
