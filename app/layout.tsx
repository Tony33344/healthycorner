import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { ConfigWarning } from "@/components/ConfigWarning";
import { AuthProvider } from "@/lib/auth-context";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "Healthy Corner - Alpski Zdraviliški Kamp | Wellness Retreat Slovenia",
  description: "Transform your health at Healthy Corner wellness retreat in Camp Menina, Slovenia. Experience yoga, Wim Hof breathing, ice baths, and organic nutrition in the stunning Alps.",
  keywords: ["wellness retreat", "yoga Slovenia", "healthy food", "Wim Hof method", "ice bath therapy", "Alpine retreat", "Camp Menina", "wellness camp", "holistic health"],
  authors: [{ name: "Healthy Corner" }],
  creator: "Healthy Corner",
  publisher: "Healthy Corner",
  openGraph: {
    type: "website",
    locale: "en_US",
    alternateLocale: ["sl_SI"],
    url: "https://healthycornersonnet.netlify.app",
    siteName: "Healthy Corner",
    title: "Healthy Corner - Alpine Wellness Retreat in Slovenia",
    description: "Transform your health with yoga, Wim Hof method, ice baths, and organic nutrition in the breathtaking Slovenian Alps.",
    images: [
      {
        url: "https://healthycornersonnet.netlify.app/images/logo.png",
        width: 1200,
        height: 630,
        alt: "Healthy Corner - Wellness Retreat",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Healthy Corner - Alpine Wellness Retreat",
    description: "Experience wellness transformation in the Slovenian Alps with yoga, Wim Hof method, and organic nutrition.",
    images: ["https://healthycornersonnet.netlify.app/images/logo.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    // Add when available: google: "verification-code",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <body>
        <AuthProvider>
          <ConfigWarning />
          <a 
            href="#main-content" 
            className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-primary focus:text-white focus:rounded-lg"
          >
            Skip to main content
          </a>
          <Navigation />
          <main id="main-content">{children}</main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
