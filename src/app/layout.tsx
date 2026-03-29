import type { Metadata } from "next";
import "./globals.css";
import { InteractiveBackground } from "@/components/interactive-background";
import { ThemeProvider } from "@/components/theme-provider";
import NextTopLoader from 'nextjs-toploader';
import { brand } from "@/content/en/brand";

export const metadata: Metadata = {
  title: brand.app.fullName,
  description: brand.app.metadataDescription,
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
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var theme = localStorage.getItem('veloce-theme');
                  theme = theme ? JSON.parse(theme).state.theme : 'dark';
                  document.documentElement.classList.add(theme);
                } catch (e) {
                  document.documentElement.classList.add('dark');
                }
              })();
            `,
          }}
        />
      </head>
      <body
        className="antialiased bg-background text-foreground min-h-screen"
      >
        <ThemeProvider>
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
        </ThemeProvider>
      </body>
    </html>
  );
}
