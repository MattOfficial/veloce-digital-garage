"use client";

import { Car } from "lucide-react";
import { brand } from "@/content/en/brand";

export function AppFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="shrink-0 border-t bg-background/40 backdrop-blur-md">
      <div className="flex h-12 items-center justify-center gap-2 px-4 md:px-6">
        <Car className="h-3.5 w-3.5 text-primary" />
        <span className="font-semibold italic">{brand.app.compactName}</span>
        <span>•</span>
        <span>&copy; {currentYear}</span>
      </div>
    </footer>
  );
}
