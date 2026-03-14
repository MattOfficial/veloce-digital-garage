import type { Metadata } from "next";
import "./globals.css";
import { InteractiveBackground } from "@/components/interactive-background";
import NextTopLoader from 'nextjs-toploader';

export const metadata: Metadata = {
  title: "Veloce Digital Garage",
  description: "Modern Fuel & Vehicle Tracking Application",
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body
        className="antialiased bg-background text-foreground min-h-screen"
      >
        <NextTopLoader
          color="hsl(var(--primary))"
          initialPosition={0.08}
          crawlSpeed={200}
          height={3}
          crawl={true}
          showSpinner={false}
          easing="ease"
          speed={200}
          shadow="0 0 10px hsl(var(--primary)),0 0 5px hsl(var(--primary))"
          zIndex={1600}
        />
        <InteractiveBackground />
        {children}
      </body>
    </html>
  );
}
